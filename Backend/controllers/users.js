const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const Flowers = require('../models/flowers');
const {
  validateEmail,
  validatePassword,
} = require('../util/validate');

// Guard route for users
exports.protect = (req, res, next) => {
  let userToken;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    const [...token] = req.headers.authorization.split(' ')[1];
    userToken = token.toString().replaceAll(',', '');
    return jwt.verify(userToken, process.env.JWT_SECRET, (err, decoded) => {
      if (!decoded) return res.status(400).json({ isAuth: false, error: decoded });

      return User.findById(decoded.id).then((userExists) => {
        if (!userExists) return res.status(400).json({ error: 'Usuário não existente.' });

        req.body.user = { userExists };

        return next();
      });
    });
  }
  return res.status(400).json({ error: 'Requisição inválida' });
};

// Controller that access the user collection
// return an user
exports.getUser = (req, res) => {
  const {
    address, email, name, _id,
  } = req.body.user.userExists;

  res.status(200).json({
    user: {
      address, email, name, id: _id,
    },
  });
};

// Controller related to the flower signup
exports.signupFlower = (req, res) => {
  const {
    lote,
    validity,
    description,
    price,
    quantity,
  } = req.body;

  const numberPrice = typeof price === 'number' ? price : Number(price);
  const numberQuantity = typeof quantity === 'number' ? quantity : Number(quantity);

  const userId = req.body.user.userExists._id;

  if (lote === '') return res.status(400).json({ error: 'Lote inválido!' });
  if (validity === '') return res.status(400).json({ error: 'Categoria inválida!' });
  if (description === '') return res.status(400).json({ error: 'Descrição inválida!' });
  if (numberPrice <= 0) return res.status(400).json({ error: 'Preço inválido' });
  if (numberQuantity <= 0) return res.status(400).json({ error: 'quantidade inválida!' });

  return Flowers.findOne({
    $and: [
      { lote },
      { description },
    ],
  }).exec((err, flower) => {
    if (!flower) {
      const FlowerInstanc = new Flowers({
        lote,
        validity,
        description,
        price: numberPrice,
        quantity: numberQuantity,
        userId,
      });

      return FlowerInstanc.save().then(() => Flowers.find({ userId }).exec((findErr, flowers) => {
        if (findErr) {
          return res.status(500).json({ error: 'Error fetching the updated list of flowers.' });
        }
        return res.status(201).json({
          status: 'success',
          data: { flowers },
        });
      })).catch((error) => res.status(400).json({ error }));
    }

    return res.status(400).json({ error: 'Flor já cadastrada!' });
  });
};

// Controller related to the user signup
// save the data on the database
exports.signupUser = (req, res) => {
  const {
    email,
    password,
    confirmPassword,
    name,
  } = req.body;

  if (!validateEmail(email)) return res.status(400).json({ error: 'Email inválido' });
  if (!validatePassword(password)) return res.status(400).json({ error: 'Senha inválida' });
  if (name === '') return res.status(400).json({ error: 'Nome inválido' });

  if (password !== confirmPassword) return res.status(400).json({ error: 'As senhas são diferentes' });

  return User.findOne({ email }).exec((err, user) => {
    if (!user) {
      const UserInstanc = new User({
        email,
        password,
        name,
      });
      return bcrypt.genSalt(10, (errorSalt, salt) => {
        bcrypt.hash(UserInstanc.password, salt, (errHash, hash) => {
          if (errHash) return res.status(400).json({ error: 'Senha incorreta!' });

          UserInstanc.password = hash;
          return UserInstanc.save().then(() => res.status(201).json({
            status: 'success',
            data: {},
          })).catch((error) => res.status(400).json({ msg: error }));
        });
      });
    }
    return res.status(400).json({ error: 'Usuário já existe!' });
  });
};

// Controller related to the user signin
exports.signinUser = (req, res) => {
  const {
    email,
    password,
  } = req.body;

  if (!validateEmail(email)) return res.status(400).json({ error: 'Email inválido' });
  if (!validatePassword(password)) return res.status(400).json({ error: 'Senha inválida' });

  return User.findOne({ email }).exec((err, user) => {
    if (user) {
      return bcrypt.compare(password, user.password).then((result) => {
        if (!result) return res.status(400).json({ error: 'Senha inválida.' });

        /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });

        return res.status(201).json({
          status: 'success',
          token,
          data: {
            isAuth: true,
            data: { ...user },
          },
        });
      });
    }
    return res.status(400).json({ error: 'Usuário não existe!' });
  });
};

// Controller related that access the database and
// return a list of flowers
exports.getFlowers = (req, res) => {
  const userId = req.body.user.userExists._id;

  return Flowers.find({ userId }).exec((err, user) => {
    const flowersArray = user.map((flower) => {
      const { _doc } = flower;
      return {
        ..._doc,
      };
    });

    if (flowersArray.length === 0) {
      return res.status(400).json({ error: 'Nenhuma flor encontrado.' });
    }

    if (user) {
      return res.status(200).json(flowersArray);
    }

    return res.status(400).json({ error: 'Usuário não cadastrado.' });
  });
};

// Controller related to selling flowers
exports.sellFlowers = (req, res) => {
  const { flowerId, quantityToSell } = req.body;

  const userId = req.body.user.userExists._id;

  if (quantityToSell <= 0) {
    return res.status(400).json({ error: 'Não é possível vender zero flores.' });
  }

  // Find the flower by its ID
  return Flowers.findById(flowerId, (err, flower) => {
    if (err) {
      return res.status(500).json({ error: 'Erro no servidor.' });
    }

    // Check if the flower exists
    if (!flower) {
      return res.status(404).json({ error: 'Flor não encontrada' });
    }

    // Check if the flower's quantity is greater than zero
    if (flower.quantity > 0) {
      const newQuantity = flower.quantity - quantityToSell;

      // Ensure the new quantity is not less than zero
      if (newQuantity < 0) {
        return res.status(400).json({ error: 'Quantidade não pode ser menor que zero.' });
      }

      // Create a new object with the updated quantity
      const { _doc } = flower;
      const updatedFlower = {
        ..._doc,
        quantity: newQuantity,
      };

      // If the new quantity is zero, delete the flower
      if (newQuantity === 0) {
        return flower.remove((removeErr) => {
          if (removeErr) {
            return res.status(500).json({ error: 'Falha ao deletar flor.' });
          }
          // Fetch the updated list of flowers and return it with a message
          return Flowers.find({ userId }).exec((findErr, flowers) => {
            if (findErr) {
              return res.status(500).json({ error: 'Error fetching the updated list of flowers.' });
            }
            return res.status(200).json({ message: 'Flor vendida e deletada.', flowers });
          });
        });
      }
      // Save the updated flower with the new quantity
      return Flowers.findByIdAndUpdate(flowerId, updatedFlower, (saveErr) => {
        if (saveErr) {
          return res.status(500).json({ error: 'Falha ao salvar flor.' });
        }
        // Fetch the updated list of flowers and return it with a message
        return Flowers.find({ userId }).exec((findErr, flowers) => {
          if (findErr) {
            return res.status(500).json({ error: 'Error fetching the updated list of flowers.' });
          }
          return res.status(200).json({ message: 'Flor vendida.', flowers });
        });
      });
    }
    return res.status(400).json({ error: 'Quantidade de flores igual a zero.' });
  });
};

// Controller related to editing flowers
exports.editFlower = (req, res) => {
  const {
    flowerId,
    lote,
    validity,
    description,
    price,
    quantity,
  } = req.body;

  const userId = req.body.user.userExists._id;

  Flowers.findById(flowerId, (err, flower) => {
    if (err) {
      return res.status(500).json({ error: 'Server error.' });
    }

    if (!flower) {
      return res.status(404).json({ error: 'Flower not found' });
    }

    const updatedFlower = {
      lote,
      validity,
      description,
      price,
      quantity,
    };

    flower.set(updatedFlower);

    return flower.save((saveErr) => {
      if (saveErr) {
        return res.status(500).json({ error: 'Failed to update flower.' });
      }

      return Flowers.find({ userId }).exec((findErr, flowers) => {
        if (findErr) {
          return res.status(500).json({ error: 'Error fetching the updated list of flowers.' });
        }

        return res.status(200).json({ message: 'Flower updated successfully', flowers });
      });
    });
  });
};

// Controller related to deleting flowers
exports.deleteFlower = (req, res) => {
  const { flowerId } = req.body;

  const userId = req.body.user.userExists._id;

  return Flowers.findById(flowerId, (err, flower) => {
    if (err) {
      return res.status(500).json({ error: 'Erro no servidor.' });
    }

    if (!flower) {
      return res.status(404).json({ error: 'Flor não encontrada' });
    }

    return flower.remove((removeErr) => {
      if (removeErr) {
        return res.status(500).json({ error: 'Falha ao deletar flor.' });
      }

      return Flowers.find({ userId }).exec((findErr, flowers) => {
        if (findErr) {
          return res.status(500).json({ error: 'Error fetching the updated list of flowers.' });
        }

        return res.status(200).json({ message: 'Flor deletada.', flowers });
      });
    });
  });
};
