const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Vet = require('../models/vet');
const {
  validateEmail, validatePassword, validateName, validateCPF, validateCRMV, validatePhone,
} = require('../util/validate');

// Guard route for institutions
exports.protect = (req, res, next) => {
  let userToken;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    const [...token] = req.headers.authorization.split(' ')[1];
    userToken = token.toString().replaceAll(',', '');
    return jwt.verify(userToken, process.env.JWT_SECRET, (err, decoded) => {
      if (!decoded) return res.status(400).json({ isAuth: false, error: decoded });

      return Vet.findById(decoded.id).then((userExists) => {
        if (!userExists) return res.status(400).json({ error: 'Usuário não existente.' });

        req.body.user = { userExists };

        return next();
      });
    });
  }
  return res.status(400).json({ error: 'Requisição inválida' });
};

// Controller that access the vet collection
// return a vet
exports.getVet = (req, res) => {
  const {
    email,
    phone,
    password,
    confirmPassword,
    name,
    surname,
    CRMV,
    CPF,
    role: userRole,
    instId,
    _id: id,
    vetStatus,
  } = req.body.user.userExists;

  res.status(200).json({
    email,
    phone,
    password,
    confirmPassword,
    name,
    surname,
    CRMV,
    CPF,
    userRole,
    id,
    instId,
    vetStatus,
  });
};

// Controller related to the vet signin
exports.signinVet = (req, res) => {
  const {
    email,
    password,
  } = req.body;

  if (!validateEmail(email)) return res.status(400).json({ error: 'Email inválido' });
  if (!validatePassword(password)) return res.status(400).json({ error: 'Senha inválida' });

  return Vet.findOne({ email }).exec((err, user) => {
    if (user) {
      return bcrypt.compare(password, user.password).then((result) => {
        if (!result) return res.status(400).json({ error: 'Senha inválida' });

        /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });

        const {
          role: userRole,
        } = user;

        return res.status(201).json({
          status: 'success',
          token,
          data: {
            isAuth: true,
            userRole,
          },
        });
      });
    }
    return res.status(400).json({ error: 'Usuário não existe!' });
  });
};

// Controller related to the vet edition
// update the data on the database
exports.editVet = (req, res) => {
  const {
    email,
    phone,
    name,
    surname,
    CRMV,
    CPF,
    oldEmail,
    vetStatus,
  } = req.body;

  if (!validateName(name)) return res.status(400).json({ error: 'Nome inválido' });
  if (!validateCPF(CPF)) return res.status(400).json({ error: 'CPF inválido' });
  if (!validateCRMV(CRMV)) return res.status(400).json({ error: 'CRMV inválido' });
  if (!validatePhone(phone)) return res.status(400).json({ error: 'Número de telefone inválido' });
  if (!validateEmail(email)) return res.status(400).json({ error: 'Email inválido' });
  if (name === '') return res.status(400).json({ error: 'Nome inválido' });
  return Vet.findOneAndUpdate({ email: oldEmail }, {
    email,
    phone,
    name,
    surname,
    CRMV,
    CPF,
    vetStatus,
  }, (err, user) => {
    if (!user) return res.status(400).json({ msg: 'Usuário não existente!' });

    return res.status(201).json({
      status: 'success',
      data: {
        email,
        phone,
        name,
        surname,
        CRMV,
        CPF,
        vetStatus,
      },
    });
  });
};

// Controller that delete a vet based on the CRMV, name and the institution
exports.deleteVet = (req, res) => {
  const { CRMV, name } = req.query;
  const { _id: instId } = req.body.user.userExists;

  return Vet.deleteOne({
    $and: [
      { CRMV },
      { name },
      { instId },
    ],
  }).exec((errUser, validUser) => {
    if (validUser.deletedCount === 0) return res.status(400).json({ error: 'Permissão negada!' });

    return Vet.find({ instId }).exec((err, user) => {
      if (!user) {
        return res.status(400).json({ error: 'Veterinário não cadastrado.' });
      }

      const vetArray = user.map((eq) => {
        const {
          email,
          phone,
          surname,
          CPF,
          CRMV: CRMVdatabase,
          vetStatus,
        } = eq;

        return {
          email,
          phone,
          name,
          surname,
          CRMV: CRMVdatabase,
          CPF,
          vetStatus,
        };
      });

      return res.status(201).json(vetArray);
    });
  });
};
