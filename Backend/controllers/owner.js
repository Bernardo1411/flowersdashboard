const Owner = require('../models/owner');
const {
  validateEmail, validateCNPJ, validateName, validateAddress, validatePhone, validateCEP,
} = require('../util/validate');

// Controller related to the owner signup
// save the data on the database related to owners
exports.signupOwner = (req, res) => {
  const {
    email,
    phone,
    address,
    CEP,
    CNPJ,
    name,
    city,
    openBRState,
    neighborhood,
  } = req.body;

  if (!validateAddress(address)) return res.status(400).json({ error: 'Endereço inválido' });
  if (!validateCEP(CEP)) return res.status(400).json({ error: 'CEP inválido' });
  if (!validateCNPJ(CNPJ)) return res.status(400).json({ error: 'CNPJ inválido' });
  if (!validatePhone(phone)) return res.status(400).json({ error: 'Número de telefone inválido' });
  if (!validateEmail(email)) return res.status(400).json({ error: 'Email inválido' });
  if (!validateName(name)) return res.status(400).json({ error: 'Nome inválido' });
  if (!validateName(city)) return res.status(400).json({ error: 'Cidade inválida' });
  if (!validateName(openBRState)) return res.status(400).json({ error: 'Estado inválido' });
  if (!validateName(neighborhood)) return res.status(400).json({ error: 'Bairro inválido' });

  return Owner.findOne({ email }).exec((err, user) => {
    if (!user) {
      const OwnerInstanc = new Owner({
        email,
        phone,
        address,
        CEP,
        CNPJ,
        name,
        city,
        openBRState,
        neighborhood,
      });

      return OwnerInstanc.save().then((response) => {
        const {
          email: ownerEmail,
        } = response;

        return res.status(201).json({
          status: 'success',
          data: {
            email,
            phone,
            address,
            name,
            CEP,
            CNPJ,
            city,
            openBRState,
            neighborhood,
            ownerEmail,
          },
        });
      }).catch((error) => res.status(400).json({ error }));
    }
    return res.status(400).send({ error: 'Usuário já existe!' });
  });
};

// get an owner with an specific email
exports.getOwner = (req, res) => {
  const { email } = req.query;

  if (!validateEmail(email)) return res.status(400).json({ error: 'Email inválido' });

  return Owner.findOne({ email }).exec((err, user) => {
    if (user) {
      const {
        phone,
        address,
        name,
        CEP,
        CNPJ,
        city,
        openBRState,
        neighborhood,
        email: ownerEmail,
      } = user;

      return res.status(201).json({
        email,
        phone,
        address,
        name,
        CEP,
        CNPJ,
        city,
        openBRState,
        neighborhood,
        ownerEmail,
      });
    }

    return res.status(400).json({ error: 'Tutor não cadastrado.' });
  });
};

// Controller related to the owner edition
// update the data on the database
exports.editOwnerData = (req, res) => {
  const {
    email,
    phone,
    address,
    CEP,
    CNPJ,
    name,
    city,
    openBRState,
    neighborhood,
    oldEmail,
  } = req.body;

  if (!validateAddress(address)) return res.status(400).json({ error: 'Endereço inválido' });
  if (!validateCEP(CEP)) return res.status(400).json({ error: 'CEP inválido' });
  if (!validateCNPJ(CNPJ)) return res.status(400).json({ error: 'CNPJ inválido' });
  if (!validatePhone(phone)) return res.status(400).json({ error: 'Número de telefone inválido' });
  if (!validateEmail(email)) return res.status(400).json({ error: 'Email inválido' });
  if (!validateName(name)) return res.status(400).json({ error: 'Nome inválido' });
  if (!validateName(city)) return res.status(400).json({ error: 'Cidade inválida' });

  if (name === '') return res.status(400).json({ error: 'Nome inválido' });

  return Owner.findOne({ email }).exec((err1, validUser) => {
    if (validUser && email !== oldEmail) return res.status(400).json({ error: 'Email já cadastrado' });

    return Owner.findOneAndUpdate({ email: oldEmail }, {
      email,
      phone,
      address,
      CEP,
      CNPJ,
      name,
      city,
      openBRState,
      neighborhood,
    }).exec((err, user) => {
      if (!user) return res.status(400).json({ error: 'Usuário não existente!' });

      return res.status(201).json({
        status: 'success',
        data: {
          email,
          phone,
          address,
          CEP,
          CNPJ,
          name,
          city,
          openBRState,
          neighborhood,
        },
      });
    });
  });
};
