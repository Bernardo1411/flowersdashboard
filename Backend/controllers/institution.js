const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const Institution = require('../models/institution');
const Vet = require('../models/vet');
const {
  validateAddress,
  validateCEP,
  validateCNPJ,
  validateEmail,
  validatePassword,
  validatePhone,
  validateCPF,
  validateCRMV,
  validateName,
} = require('../util/validate');

const { EMAIL_EQUIBEA } = process.env;
const { EMAIL_PASSWORD_EQUIBEA } = process.env;

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: EMAIL_EQUIBEA,
    pass: EMAIL_PASSWORD_EQUIBEA,
  },
});

// Guard route for institutions
exports.protect = (req, res, next) => {
  let userToken;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    const [...token] = req.headers.authorization.split(' ')[1];
    userToken = token.toString().replaceAll(',', '');
    return jwt.verify(userToken, process.env.JWT_SECRET, (err, decoded) => {
      if (!decoded) return res.status(400).json({ isAuth: false, error: decoded });

      return Institution.findById(decoded.id).then((userExists) => {
        if (!userExists) return res.status(400).json({ error: 'Usuário não existente.' });

        req.body.user = { userExists };

        return next();
      });
    });
  }
  return res.status(400).json({ error: 'Requisição inválida' });
};

// Controller that access the institution collection
// return an institution
exports.getInstitution = (req, res) => {
  const {
    address, email, name, phone, CEP, CNPJ, role: userRole, _id,
  } = req.body.user.userExists;

  res.status(200).json({
    institution: {
      address, email, name, phone, CEP, CNPJ, userRole, id: _id,
    },
  });
};

// Controller related to the vet signup
// its on the insitution controller becouse the isntitution
// is the only one which has the permission to sing a vet
exports.signupVet = (req, res) => {
  const {
    email,
    phone,
    password,
    confirmPassword,
    name,
    surname,
    CRMV,
    CPF,
  } = req.body;

  const instId = req.body.user.userExists._id;

  if (!validateCRMV(CRMV)) return res.status(400).json({ error: 'CRMV inválido' });
  if (!validateCPF(CPF)) return res.status(400).json({ error: 'CPF inválido' });
  if (!validateName(name)) return res.status(400).json({ error: 'Nome inválido' });
  if (!validateName(surname)) return res.status(400).json({ error: 'Sobrenome inválido' });
  if (!validatePhone(phone)) return res.status(400).json({ error: 'Número de telefone inválido' });
  if (!validateEmail(email)) return res.status(400).json({ error: 'Email inválido' });
  if (!validatePassword(password)) return res.status(400).json({ error: 'Senha inválida' });
  if (name === '') return res.status(400).json({ error: 'Nome inválido' });

  if (password !== confirmPassword) return res.status(400).json({ error: 'As senhas são diferentes' });

  return Institution
    .findOne({ email }).exec((errInst, inst) => {
      if (!inst) {
        return Vet.findOne({ email }).exec((err, vet) => {
          if (!vet) {
            const VetInstanc = new Vet({
              email,
              phone,
              password,
              confirmPassword,
              name,
              surname,
              CRMV,
              CPF,
              instId,
              vetStatus: true,
            });
            return bcrypt.genSalt(
              10,
              (errorSalt, salt) => bcrypt.hash(VetInstanc.password, salt, (errHash, hash) => {
                if (errHash) return res.status(400).json({ error: 'Senha incorreta!' });

                VetInstanc.password = hash;

                return VetInstanc.save().then((response) => res.status(201).json({
                  status: 'success',
                  data: {
                    user: response,
                  },
                })).catch((error) => res.status(400).json({ error }));
              }),
            );
          }
          return res.status(400).json({ error: 'Veterinário já existe!' });
        });
      }
      return res.status(400).json({ error: 'Email já utilizado!' });
    });
};

// Controller related to the institution signup
// save the data on the database
exports.signupInstitution = (req, res) => {
  const {
    email,
    phone,
    CNPJ,
    address,
    CEP,
    password,
    confirmPassword,
    name,
  } = req.body;

  if (!validateAddress(address)) return res.status(400).json({ error: 'Endereço inválido' });
  if (!validateCEP(CEP)) return res.status(400).json({ error: 'CEP inválido' });
  if (!validateCNPJ(CNPJ)) return res.status(400).json({ error: 'CNPJ inválido' });
  if (!validatePhone(phone)) return res.status(400).json({ error: 'Número de telefone inválido' });
  if (!validateEmail(email)) return res.status(400).json({ error: 'Email inválido' });
  if (!validatePassword(password)) return res.status(400).json({ error: 'Senha inválida' });
  if (name === '') return res.status(400).json({ error: 'Nome inválido' });

  if (password !== confirmPassword) return res.status(400).json({ error: 'As senhas são diferentes' });

  return Institution.findOne({ email }).exec((err, user) => {
    if (!user) {
      // Gera o código de confirmação
      const confirmationCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Envia o código de confirmação por email
      const mailOptions = {
        from: EMAIL_EQUIBEA,
        to: email,
        subject: 'Verificação do Email',
        text: `Olá, ${name}! ${'\n'}Seu código de confirmação é: ${confirmationCode}.${'\n'}Este email é automático e não deve ser respondido.`,
      };
      return transporter.sendMail(mailOptions).then(() => {
        const InstitutionInstanc = new Institution({
          email,
          phone,
          CNPJ,
          address,
          CEP,
          password,
          name,
          confirmationCode,
          emailValidated: false,
        });
        return bcrypt.genSalt(10, (errorSalt, salt) => {
          bcrypt.hash(InstitutionInstanc.password, salt, (errHash, hash) => {
            if (errHash) return res.status(400).json({ error: 'Senha incorreta!' });

            InstitutionInstanc.password = hash;

            return InstitutionInstanc.save().then((response) => res.status(201).json({
              status: 'success',
              data: {
                user: {
                  email,
                  emailValidated: response.emailValidated,
                },
              },
            })).catch((error) => res.status(400).json({ msg: error }));
          });
        });
      })
        .catch(() => {
          res.status(400).json({ error: 'Erro ao enviar código de confirmação.' });
        });
    }
    return res.status(400).json({ error: 'Usuário já existe!' });
  });
};

exports.verifyInstitutionEmail = (req, res) => {
  const { email, confirmationCode } = req.body;

  if (!validateEmail(email)) return res.status(400).json({ error: 'Email inválido' });

  return Institution.findOneAndUpdate({ email, confirmationCode }, {
    emailValidated: true,
  }, (err, user) => {
    if (!user) return res.status(400).json({ error: 'Código inválido ou Usuário não existente!' });

    /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return res.status(201).json({
      status: 'success',
      isAuth: true,
      token,
      data: {
        email: user.email,
        phone: user.phone,
        CNPJ: user.CNPJ,
        address: user.address,
        CEP: user.CEP,
        name: user.name,
        role: user.role,
        emailValidated: true,
      },
    });
  });
};

exports.sendVerificationcodeToEmail = (req, res) => {
  const {
    email,
  } = req.body;

  if (!validateEmail(email)) return res.status(400).json({ error: 'Email inválido' });

  // Gera o código de confirmação
  const confirmationCode = Math.floor(100000 + Math.random() * 900000).toString();

  return Institution.findOneAndUpdate({ email }, {
    confirmationCode,
  }, (err, user) => {
    if (!user) return res.status(400).json({ msg: 'Crie um usuário antes de solicitar o código de confirmação' });

    if (user.emailValidated) return res.status(400).json({ msg: 'Email validado.' });

    // Envia o código de confirmação por email
    const mailOptions = {
      from: EMAIL_EQUIBEA,
      to: email,
      subject: 'Verificação do Email',
      text: `Olá, ${user.name}! ${'\n'}Seu código de confirmação é: ${confirmationCode}.${'\n'}Este email é automático e não deve ser respondido.`,
    };
    return transporter.sendMail(mailOptions).then(() => res.status(201).json({
      status: 'success',
      message: 'Código enviado com sucesso.',
    })).catch((error) => res.status(400).json({ msg: error }))
      .catch(() => {
        res.status(400).json({ message: 'Erro ao enviar código de confirmação.' });
      });
  });
};

// Controller related to the institution data edition
// update the data on the database
exports.editInstitution = (req, res) => {
  const {
    email,
    phone,
    CNPJ,
    address,
    CEP,
    name,
  } = req.body;

  const oldEmail = req.body.user.userExists.email;

  if (!validateAddress(address)) return res.status(400).json({ error: 'Endereço inválido' });
  if (!validateCEP(CEP)) return res.status(400).json({ error: 'CEP inválido' });
  if (!validateCNPJ(CNPJ)) return res.status(400).json({ error: 'CNPJ inválido' });
  if (!validatePhone(phone)) return res.status(400).json({ error: 'Número de telefone inválido' });
  if (!validateEmail(email)) return res.status(400).json({ error: 'Email inválido' });
  if (name === '') return res.status(400).json({ error: 'Nome inválido' });
  return Institution.findOneAndUpdate({ email: oldEmail }, {
    email,
    phone,
    CNPJ,
    address,
    CEP,
    name,
  }, (err, user) => {
    if (!user) return res.status(400).json({ msg: 'Usuário não existente!' });

    return res.status(201).json({
      status: 'success',
      data: {
        email,
        phone,
        CNPJ,
        address,
        CEP,
        name,
        userRole: user.role,
      },
    });
  });
};

// Controller related to the institution signin
exports.signinInstitution = (req, res) => {
  const {
    email,
    password,
  } = req.body;

  if (!validateEmail(email)) return res.status(400).json({ error: 'Email inválido' });
  if (!validatePassword(password)) return res.status(400).json({ error: 'Senha inválida' });

  return Institution.findOne({ email }).exec((err, user) => {
    if (user) {
      if (!user.emailValidated) return res.status(400).json({ error: 'Email não validado.' });

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

// Controller related that access the database and
// return a list of vets
// !!! for future development allow only access to the vets associated with the institution
exports.getVets = (req, res) => {
  const { vetParam } = req.query;

  let VetCRMV = null;
  let objectId = null;

  if (mongoose.Types.ObjectId.isValid(vetParam)) objectId = vetParam;
  else if (validateCRMV(vetParam)) VetCRMV = vetParam;
  else return res.status(400).json({ error: 'Requisição Inválida!' });

  return Vet.find({ $or: [{ CRMV: VetCRMV }, { instId: objectId }] }).exec((err, user) => {
    const vetArray = user.map((vet) => {
      const { _doc } = vet;
      return {
        ..._doc,
      };
    });

    if (vetArray.length === 0) {
      return res.status(400).json({ error: 'Nenhum veterinário encontrado.' });
    }

    if (user) {
      return res.status(200).json(vetArray);
    }

    return res.status(400).json({ error: 'Veterinário não cadastrado.' });
  });
};
