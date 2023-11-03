exports.validateEmail = (email) => {
  // eslint-disable-next-line
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

exports.validatePassword = (password) => {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_])[A-Za-z\d@$!%*?&#_]{8,}$/;
  return re.test(String(password));
};

exports.validatePhone = (phone) => {
  const re = /^\+[0-9]{2} \([0-9]{2}\) [0-9]{5}-[0-9]{4}$/;
  return re.test(String(phone));
};

exports.validateCNPJ = (cnpj) => {
  // eslint-disable-next-line
  const re = /^[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2}$/;
  return re.test(String(cnpj));
};

exports.validateCEP = (cep) => {
  const re = /^[0-9]{5}-?[0-9]{3}$/;
  return re.test(String(cep));
};

exports.validateAddress = (address) => {
  const re = /^[a-zA-Z0-9]{3,}/;
  return re.test(String(address));
};

exports.validateName = (name) => {
  const re = /^[a-zA-Z0-9]{1,}/;
  return re.test(String(name));
};

exports.validateCPF = (cpf) => {
  // eslint-disable-next-line
  const re = /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}$/;
  return re.test(String(cpf));
};

exports.validateCRMV = (crmv) => {
  // eslint-disable-next-line
  const re = /^[0-9]{4,5}$/;
  return re.test(String(crmv));
};

// Regex to validate numReg. Between 3 and 9 numbers.
exports.validateNumReg = (numReg) => {
  // eslint-disable-next-line
  const re = /^(0|[0-9]{3,9})$/;
  return re.test(String(numReg));
};

exports.validateWeight = (weight) => {
  // eslint-disable-next-line
  const re = /^[0-9]{1,4}$/;
  return re.test(weight);
};

exports.validateAge = (age) => {
  // eslint-disable-next-line
  const re = /^[0-9]{1,2}$/;
  return re.test(age);
};

exports.validateEC = (EC) => {
  // eslint-disable-next-line
  const re = /^[0-9]{1}$/;
  return re.test(EC);
};

exports.validateFC = (FC) => {
  // eslint-disable-next-line
  const re = /^[0-9]{1,2}$/;

  return re.test(FC) && FC >= 0;
};

exports.validateVG = (VG) => {
  // eslint-disable-next-line
  const re = /^[0-9]{1,2}$/;

  return re.test(VG) && VG >= 0 && VG < 100;
};

exports.validatePT = (PT) => {
  // eslint-disable-next-line
  // const re = /^[0-9]{1,2}(\.[0-9]{1})?$/;
  const re = /^[0-9]{1,2}(\.[0-9]{1})?$/;

  return re.test(PT);
};

exports.validateFibri = (Fibri) => {
  // eslint-disable-next-line
  const re = /^[0-9]{1,3}$/;

  return re.test(Fibri);
};

exports.validateCK = (CK) => {
  // eslint-disable-next-line
  const re = /^[0-9]{1,3}$/;

  return re.test(CK);
};

exports.validateDate = (date) => {
  // eslint-disable-next-line
  const re = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}\+\d{2}:\d{2}$/;

  return re.test(date);
};
