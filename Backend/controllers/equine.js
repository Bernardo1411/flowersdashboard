const mongoose = require('mongoose');
const axios = require('axios');
const Equine = require('../models/equine');
const { scoreCalculator } = require('../util/scoreCalculator');

const {
  validateWeight,
  validateAge,
  validateEC,
  validateFC,
  validateVG,
  validatePT,
  validateFibri,
  validateCK,
  validateAddress,
  validateNumReg,
  validateName,
  validateCEP,
} = require('../util/validate');

// Controller related to the equine signup
// calculate the equine score and save the data on the data base
exports.signupEquine = (req, res) => {
  const {
    EC,
    FC,
    VG,
    PT,
    fibri,
    CK,
    injury,
    pain,
    steriotype,
    id,
  } = req.body;

  /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
  const vetId = req.body.user.userExists._id;
  const { instId } = req.body.user.userExists;

  const newDate = new Date();

  // Check if any of the required fields are missing
  if (
    !EC
    || !FC
    || !VG
    || !PT
    || !fibri
    || !CK
    // || typeof injury === 'string'
    // || typeof pain === 'string'
    // || typeof steriotype === 'string'
  ) {
    return Equine.findOneAndUpdate(
      { _id: id },
      {
        lastUpdated: newDate,
        EC,
        FC,
        VG,
        PT,
        fibri,
        CK,
        injury,
        pain,
        steriotype,
        vetId,
        instId,
        score: null,
        scoreClassification: 'Pendente',
      },
    ).then(({
      _id,
      date,
      classification,
      specie,
      gender,
      race,
      name,
      weight,
      age,
      numReg,
      local,
      BRState,
      city,
      animalAddress,
      ownerEmail,
    }) => res.status(201).json({
      status: 'success',
      data: {
        classification,
        specie,
        gender,
        race,
        name,
        weight,
        age,
        numReg,
        local,
        BRState,
        city,
        animalAddress,
        ownerEmail,
        EC,
        FC,
        VG,
        PT,
        fibri,
        CK,
        date,
        lastUpdated: newDate,
        score: null,
        scoreClassification: 'Pendente',
        _id,
      },
    }))
      .catch((error) => res.status(400).json({ error }));
  }

  const VGdecimal = VG / 100;
  let scoreClassification;

  const score = scoreCalculator(
    EC,
    FC,
    VGdecimal,
    PT,
    fibri,
    CK,
    injury,
    pain,
    steriotype,
  );

  if (score >= 0 && score <= 3) scoreClassification = 'Apto';
  if (score > 3 && score <= 6) scoreClassification = 'Reavaliação';
  if (score > 6 && score <= 9) scoreClassification = 'Inapto';

  const url = `https://iabea-c0s4898c.b4a.run/dia/${[
    EC,
    FC,
    VGdecimal,
    PT,
    fibri,
    CK,
    JSON.parse(injury) ? 1 : 0,
    JSON.parse(pain) ? 1 : 0,
    JSON.parse(steriotype) ? 1 : 0,
  ]}`;

  return axios.get(url)
    .then((response) => {
    // A resposta está no formato JSON
      const { diagnostico } = response.data;

      // Search for equine based on register number and institution id
      return Equine.findOneAndUpdate(
        { _id: id },
        {
          lastUpdated: newDate,
          EC,
          FC,
          VG,
          PT,
          fibri,
          CK,
          injury,
          pain,
          steriotype,
          score,
          scoreClassification,
          diagnostico,
        },
      ).then(({
        _id,
        date,
        classification,
        specie,
        gender,
        race,
        name,
        weight,
        age,
        numReg,
        local,
        BRState,
        city,
        animalAddress,
        ownerEmail,
      }) => res.status(201).json({
        status: 'success',
        data: {
          date,
          lastUpdated: newDate,
          classification,
          specie,
          gender,
          race,
          name,
          weight,
          age,
          numReg,
          local,
          BRState,
          city,
          animalAddress,
          ownerEmail,
          EC,
          FC,
          VG,
          PT,
          fibri,
          CK,
          injury,
          pain,
          steriotype,
          vetId,
          instId,
          score,
          scoreClassification,
          _id,
          diagnostico,
        },
      }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch(() => {
      res.status(400).json({ error: 'Erro na requisição.' });
    });
};

// Controller related to the equine data signup
// This data is not associated with the equine classification
exports.signupEquineData = (req, res) => {
  const {
    classification,
    specie,
    gender,
    race,
    name,
    weight,
    age,
    numReg,
    local,
    BRState,
    city,
    CEP,
    neighborhood,
    animalAddress,
    ownerEmail,
  } = req.body;

  /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
  const vetId = req.body.user.userExists._id;
  const { instId } = req.body.user.userExists;

  if (!validateWeight(weight)) return res.status(400).json({ error: 'Peso inválido' });
  if (!validateAge(age)) return res.status(400).json({ error: 'Idade inválido' });
  if (!validateNumReg(numReg)) return res.status(400).json({ error: 'Número de registro inválido' });
  if (!validateAddress(neighborhood)) return res.status(400).json({ error: 'Bairro inválido' });
  if (!validateAddress(animalAddress)) return res.status(400).json({ error: 'Rua inválida' });
  if (!validateCEP(CEP)) return res.status(400).json({ error: 'CEP inválido' });
  if (!city) return res.status(400).json({ error: 'Cidade inválida' });
  if (!BRState) return res.status(400).json({ error: 'Estado inválido' });
  if (!local) return res.status(400).json({ error: 'Tipo de local inválido' });
  if (!classification) return res.status(400).json({ error: 'Classificação inválida' });
  if (!specie) return res.status(400).json({ error: 'Espécie inválida' });
  if (!gender) return res.status(400).json({ error: 'Sexo do aninal inválido' });
  if (!race) return res.status(400).json({ error: 'Raça inválida' });
  if (!name) return res.status(400).json({ error: 'Nome Inválido' });

  const date = new Date();

  // Search for equine based on register number and institution id
  return Equine.findOne({
    $and: [
      { numReg: { $ne: 0 } }, // Exclude documents where numReg is equal to 0
      { numReg },
      { instId },
    ],
  }).exec((err, user) => {
    if (!user) {
      const EquineInstanc = new Equine({
        date,
        lastUpdated: date,
        classification,
        specie,
        gender,
        race,
        name,
        weight,
        age,
        numReg,
        local,
        BRState,
        city,
        CEP,
        neighborhood,
        animalAddress,
        ownerEmail,
        vetId,
        instId,
        score: null,
        scoreClassification: 'Pendente',
        EquineData: [],
      });

      return EquineInstanc.save().then(({ _id }) => res.status(201).json({
        status: 'success',
        data: {
          date,
          lastUpdated: date,
          classification,
          specie,
          gender,
          race,
          name,
          weight,
          age,
          numReg,
          local,
          BRState,
          city,
          CEP,
          neighborhood,
          animalAddress,
          ownerEmail,
          score: null,
          scoreClassification: 'Pendente',
          _id,
        },
      })).catch((error) => res.status(400).json({ error }));
    }
    return res.status(400).send({ error: 'Animal já cadastrado!' });
  });
};

// Controller related to the new evaluation of the equine
exports.newreview = (req, res) => {
  const {
    EC,
    FC,
    VG,
    PT,
    fibri,
    CK,
    injury,
    pain,
    steriotype,
    id,
    date: eqSavedDate,
  } = req.body;

  /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
  const vetId = req.body.user.userExists._id;
  const { instId } = req.body.user.userExists;

  // if (!validateDate(eqSavedDate)) return res.status(400).json({ error: 'Data Inválida' });

  const date = new Date();

  if (
    !EC
    || !FC
    || !VG
    || !PT
    || !fibri
    || !CK
    || typeof injury === 'string'
    || typeof pain === 'string'
    || typeof steriotype === 'string'
  ) {
    return Equine.findById(id).exec((err, equine) => {
      if (err) {
        return res.status(400).json({ error: 'Erro ao buscar o animal' });
      }

      if (!equine) {
        return res.status(400).json({ error: 'Animal não encontrado' });
      }

      const equineDate = new Date(eqSavedDate);
      const deadlineDate = new Date(equineDate.getTime() + 30 * 24 * 60 * 60 * 1000);

      if (date < deadlineDate) return res.status(400).json({ error: 'Cadastro dentro do prazo.' });

      // Update the fields with the new values
      const updatedEquine = {
        ...equine.toObject(),
        lastUpdated: date,
        EC,
        FC,
        VG,
        PT,
        fibri,
        CK,
        injury,
        pain,
        steriotype,
        vetId,
        instId,
        score: null,
        scoreClassification: 'Pendente',
      };

      return equine.updateOne(updatedEquine).then(({
        _id,
        classification,
        specie,
        gender,
        race,
        name,
        weight,
        age,
        numReg,
        local,
        BRState,
        city,
        animalAddress,
        ownerEmail,
      }) => res.status(201).json({
        status: 'success',
        data: {
          classification,
          specie,
          gender,
          race,
          name,
          weight,
          age,
          numReg,
          local,
          BRState,
          city,
          animalAddress,
          ownerEmail,
          EC,
          FC,
          VG,
          PT,
          fibri,
          CK,
          date,
          lastUpdated: date,
          score: null,
          scoreClassification: 'Pendente',
          _id,
        },
      })).catch((error) => res.status(400).json({ error }));
    });
  }

  const VGdecimal = VG / 100;
  let scoreClassification;

  const score = scoreCalculator(
    EC,
    FC,
    VGdecimal,
    PT,
    fibri,
    CK,
    injury,
    pain,
    steriotype,
  );

  if (score >= 0 && score <= 3) scoreClassification = 'Apto';
  if (score > 3 && score <= 6) scoreClassification = 'Reavaliação';
  if (score > 6 && score <= 9) scoreClassification = 'Inapto';

  // Search for equine based on register number and institution id
  return Equine.findById(id).exec((err, equine) => {
    if (err) {
      return res.status(400).json({ error: 'Erro ao buscar o animal' });
    }

    if (!equine) {
      return res.status(400).json({ error: 'Animal não encontrado' });
    }

    const equineDate = new Date('2023-06-23T19:46:19.564Z');
    const deadlineDate = new Date(equineDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    if (date < deadlineDate) return res.status(400).json({ error: 'Cadastro dentro do prazo.' });

    const url = `https://iabea-c0s4898c.b4a.run/dia/${[
      EC,
      FC,
      VGdecimal,
      PT,
      fibri,
      CK,
      JSON.parse(injury) ? 1 : 0,
      JSON.parse(pain) ? 1 : 0,
      JSON.parse(steriotype) ? 1 : 0,
    ]}`;

    return axios.get(url)
      .then((response) => {
        // A resposta está no formato JSON
        const { diagnostico } = response.data;

        // Update the fields with the new values
        const updatedEquine = {
          ...equine.toObject(),
          date,
          lastUpdated: date,
          EC,
          FC,
          VG,
          PT,
          fibri,
          CK,
          injury,
          pain,
          steriotype,
          vetId,
          instId,
          score,
          scoreClassification,
          diagnostico,
        };

        return equine.updateOne(updatedEquine).then(({
          _id,
          classification,
          specie,
          gender,
          race,
          name,
          weight,
          age,
          numReg,
          local,
          BRState,
          city,
          animalAddress,
          ownerEmail,
        }) => res.status(201).json({
          status: 'success',
          data: {
            date,
            lastUpdated: date,
            classification,
            specie,
            gender,
            race,
            name,
            weight,
            age,
            numReg,
            local,
            BRState,
            city,
            animalAddress,
            ownerEmail,
            EC,
            FC,
            VG,
            PT,
            fibri,
            CK,
            injury,
            pain,
            steriotype,
            vetId,
            instId,
            score,
            scoreClassification,
            _id,
            diagnostico,
          },
        })).catch((error) => res.status(400).json({ error }));
      })
      .catch(() => {
        res.status(400).json({ error: 'Erro na requisição.' });
      });
  });
};

// Controller related to the new evaluation of the equine
exports.newreviewData = (req, res) => {
  const {
    classification,
    specie,
    gender,
    race,
    name,
    weight,
    age,
    numReg,
    local,
    BRState,
    city,
    CEP,
    neighborhood,
    animalAddress,
    ownerEmail,
    id,
    date: eqSavedDate,
  } = req.body;

  /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
  const vetId = req.body.user.userExists._id;
  const { instId } = req.body.user.userExists;

  if (!validateWeight(weight)) return res.status(400).json({ error: 'Peso inválido' });
  if (!validateAge(age)) return res.status(400).json({ error: 'Idade inválido' });
  if (!validateNumReg(numReg)) return res.status(400).json({ error: 'Número de registro inválido' });
  if (!validateAddress(neighborhood)) return res.status(400).json({ error: 'Bairro inválido' });
  if (!validateAddress(animalAddress)) return res.status(400).json({ error: 'Rua inválida' });
  if (!validateCEP(CEP)) return res.status(400).json({ error: 'CEP inválido' });
  if (!city) return res.status(400).json({ error: 'Cidade inválida' });
  if (!BRState) return res.status(400).json({ error: 'Estado inválido' });
  if (!local) return res.status(400).json({ error: 'Tipo de local inválido' });
  if (!classification) return res.status(400).json({ error: 'Classificação inválida' });
  if (!specie) return res.status(400).json({ error: 'Espécie inválida' });
  if (!gender) return res.status(400).json({ error: 'Sexo do aninal inválido' });
  if (!race) return res.status(400).json({ error: 'Raça inválida' });
  if (!name) return res.status(400).json({ error: 'Nome Inválido' });
  // if (!validateDate(eqSavedDate)) return res.status(400).json({ error: 'Data Inválida' });

  const date = new Date();

  return Equine.findById(id).exec((err, equine) => {
    if (err) {
      return res.status(400).json({ error: 'Erro ao buscar o animal' });
    }

    if (!equine) {
      return res.status(400).json({ error: 'Animal não encontrado' });
    }

    const equineDate = new Date(eqSavedDate);
    const deadlineDate = new Date(equineDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    if (date < deadlineDate) return res.status(400).json({ error: 'Cadastro dentro do prazo.' });

    // Create a new EquineData object with the existing equine's data
    const equineData = {
      date: equine.date,
      lastUpdated: equine.lastUpdated,
      name: equine.name,
      weight: equine.weight,
      age: equine.age,
      numReg: equine.numReg,
      classification: equine.classification,
      specie: equine.specie,
      gender: equine.gender,
      race: equine.race,
      animalAddress: equine.animalAddress,
      local: equine.local,
      BRState: equine.BRState,
      city: equine.city,
      EC: equine.EC,
      FC: equine.FC,
      VG: equine.VG,
      PT: equine.PT,
      fibri: equine.fibri,
      CK: equine.CK,
      injury: equine.injury,
      pain: equine.pain,
      steriotype: equine.steriotype,
      ownerEmail: equine.ownerEmail,
      instId: equine.instId,
      vetId: equine.vetId,
      score: equine.score,
      scoreClassification: equine.scoreClassification,
    };

    // Push the existing equine's data into EquineData array
    equine.EquineData.push(equineData);

    // Update the fields with the new values
    const updatedEquine = {
      ...equine.toObject(),
      date,
      lastUpdated: date,
      name,
      weight,
      age,
      numReg,
      classification,
      specie,
      gender,
      race,
      animalAddress,
      local,
      BRState,
      city,
      ownerEmail,
      vetId,
      instId,
      score: null,
      scoreClassification: 'Pendente',
    };

    return equine.updateOne(updatedEquine).then(({ _id }) => res.status(201).json({
      status: 'success',
      data: {
        classification,
        specie,
        gender,
        race,
        name,
        weight,
        age,
        numReg,
        local,
        BRState,
        city,
        animalAddress,
        ownerEmail,
        score: null,
        scoreClassification: 'Pendente',
        _id,
      },
    })).catch((error) => res.status(400).json({ error }));
  });
};

// Controller that access the equine collection
// return an array of equines
exports.getEquine = (req, res) => {
  const { eqParam } = req.query;
  let numRegSearch = null;
  let nameSearch = '';
  let objectId = null;

  if (mongoose.Types.ObjectId.isValid(eqParam)) objectId = eqParam;
  else if (validateNumReg(eqParam)) numRegSearch = eqParam;
  else if (validateName(eqParam)) nameSearch = eqParam;
  else return res.status(400).json({ error: 'Requisição Inválida!' });

  return Equine.find({
    $or:
    [{ numReg: numRegSearch }, { name: nameSearch }, { instId: objectId }],
  }).exec((err, user) => {
    if (err) return res.status(400).json({ error: err });
    const equineArray = user.map((eq) => {
      const {
        date,
        lastUpdated,
        EC,
        FC,
        VG,
        PT,
        fibri,
        CK,
        classification,
        specie,
        gender,
        race,
        name,
        weight,
        age,
        local,
        BRState,
        city,
        CEP,
        neighborhood,
        animalAddress,
        ownerEmail,
        score,
        scoreClassification,
        injury,
        pain,
        steriotype,
        numReg,
        _id,
        EquineData,
        instId,
        vetId,
        diagnostico,
      } = eq;

      return {
        date,
        lastUpdated,
        EC,
        FC,
        VG,
        PT,
        fibri,
        CK,
        classification,
        specie,
        gender,
        race,
        name,
        weight,
        age,
        local,
        BRState,
        city,
        CEP,
        neighborhood,
        numReg: numReg.toString(),
        animalAddress,
        ownerEmail,
        score,
        scoreClassification,
        injury,
        pain,
        steriotype,
        _id,
        EquineData,
        instId,
        vetId,
        diagnostico,
      };
    });

    if (equineArray.length === 0) {
      return res.status(400).json({ error: 'Nenhum animal encontrado.' });
    }

    if (user) {
      return res.status(201).json(equineArray);
    }

    return res.status(400).json({ error: 'Animal não cadastrado.' });
  });
};

// Controller that delete an equine based on the Register number and the institution
exports.deleteEquine = (req, res) => {
  const { _id, eqParam } = req.query;
  const { instId } = req.body.user.userExists;
  let numRegSearch = null;
  let nameSearch = '';

  if (validateNumReg(eqParam)) numRegSearch = eqParam;
  if (validateName(eqParam) && !validateNumReg(eqParam)) nameSearch = eqParam;

  // if (!validateEmail(email)) return res.status(400).json({ error: 'Email inválido' });
  return Equine.deleteOne({
    $and: [
      { _id },
      { instId },
    ],
  }).exec((errUser, validUser) => {
    if (validUser.deletedCount === 0) return res.status(400).json({ error: 'Permissão negada!' });

    return Equine.find({
      $or:
    [{ numReg: numRegSearch }, { name: nameSearch }, { instId }],
    }).exec((err, user) => {
      const equineArray = user.map((eq) => {
        const {
          date,
          lastUpdated,
          EC,
          FC,
          VG,
          PT,
          fibri,
          CK,
          classification,
          specie,
          gender,
          race,
          name,
          weight,
          age,
          local,
          BRState,
          city,
          animalAddress,
          ownerEmail,
          score,
          numReg,
          scoreClassification,
          EquineData,
          diagnostico,
        } = eq;

        return {
          date,
          lastUpdated,
          EC,
          FC,
          VG,
          PT,
          fibri,
          CK,
          classification,
          specie,
          gender,
          race,
          name,
          weight,
          age,
          local,
          BRState,
          city,
          numReg: numReg.toString(),
          animalAddress,
          ownerEmail,
          score,
          scoreClassification,
          _id,
          EquineData,
          diagnostico,
        };
      });

      if (!user) {
        return res.status(400).json({ error: 'Animal não cadastrado.' });
      }

      return res.status(201).json(equineArray);
    });
  });
};

// Controller that edit an equine data based on the Register number and the institution
exports.editEqData = (req, res) => {
  const {
    classification,
    specie,
    gender,
    race,
    name,
    weight,
    age,
    animalAddress,
    numReg,
    local,
    BRState,
    city,
    CEP,
    neighborhood,
    _id,
  } = req.body;

  const { instId } = req.body.user.userExists;

  if (!validateAddress(animalAddress)) return res.status(400).json({ error: 'Endereço inválido' });
  if (!validateWeight(weight)) return res.status(400).json({ error: 'Peso inválido' });
  if (!validateAge(age)) return res.status(400).json({ error: 'Idade inválida' });

  if (name === '') return res.status(400).json({ error: 'Nome inválido' });

  const date = new Date();
  // Calculate the date two days ago
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(date.getDate() - 30);

  return Equine.findOneAndUpdate(
    { _id, instId, date: { $gt: twoDaysAgo } },
    {
      lastUpdated: date,
      classification,
      specie,
      gender,
      race,
      name,
      weight,
      age,
      animalAddress,
      numReg,
      local,
      BRState,
      city,
      CEP,
      neighborhood,
    },
  ).exec((err, user) => {
    if (!user) return res.status(400).json({ error: 'Avaliação vencida!' });

    return res.status(201).json({
      status: 'success',
      data: {
        classification,
        specie,
        gender,
        race,
        name,
        weight,
        age,
        animalAddress,
        numReg: numReg.toString(),
        local,
        BRState,
        city,
        CEP,
        neighborhood,
        _id,
      },
    });
  });
};

// Controller that edit an equine health data based on the Register number and the institution
exports.editEqHealth = (req, res) => {
  const {
    injury,
    pain,
    steriotype,
    EC,
    FC,
    VG,
    PT,
    fibri,
    CK,
    _id,
  } = req.body;

  const { instId } = req.body.user.userExists;

  if (!validateEC(EC)) return res.status(400).json({ error: 'EC inválido' });
  if (!validateFC(FC)) return res.status(400).json({ error: 'FC inválido' });
  if (!validateVG(VG)) return res.status(400).json({ error: 'VG inválido' });
  if (!validatePT(PT)) return res.status(400).json({ error: 'PT inválido' });
  if (!validateFibri(fibri)) return res.status(400).json({ error: 'Fibrinogênio inválido' });
  if (!validateCK(CK)) return res.status(400).json({ error: 'CK inválido' });

  const date = new Date();
  // Calculate the date two days ago
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(date.getDate() - 30);

  const VGdecimal = VG / 100;
  let scoreClassification;

  const score = scoreCalculator(
    EC,
    FC,
    VGdecimal,
    PT,
    fibri,
    CK,
    injury,
    pain,
    steriotype,
  );

  if (score >= 0 && score <= 3) scoreClassification = 'Apto';
  if (score > 3 && score <= 6) scoreClassification = 'Reavaliação';
  if (score > 6 && score <= 9) scoreClassification = 'Inapto';

  const url = `https://iabea-c0s4898c.b4a.run/dia/${[
    EC,
    FC,
    VGdecimal,
    PT,
    fibri,
    CK,
    JSON.parse(injury) ? 1 : 0,
    JSON.parse(pain) ? 1 : 0,
    JSON.parse(steriotype) ? 1 : 0,
  ]}`;

  return axios.get(url)
    .then((response) => {
    // A resposta está no formato JSON
      const { diagnostico } = response.data;

      return Equine.findOneAndUpdate({ _id, instId, date: { $gt: twoDaysAgo } }, {
        lastUpdated: date,
        injury,
        pain,
        steriotype,
        EC,
        FC,
        VG,
        PT,
        fibri,
        CK,
        score,
        scoreClassification,
        diagnostico,
      }).exec((err, user) => {
        if (!user) return res.status(400).json({ error: 'Usuário não existente!' });

        const {
          date: firstDate,
          lastUpdated,
          classification,
          specie,
          gender,
          race,
          name,
          weight,
          age,
          numReg,
          local,
          BRState,
          city,
          animalAddress,
          ownerEmail,
          vetId,
        } = user;

        return res.status(201).json({
          status: 'success',
          data: {
            date: firstDate,
            lastUpdated,
            classification,
            specie,
            gender,
            race,
            name,
            weight,
            age,
            numReg,
            local,
            BRState,
            city,
            animalAddress,
            ownerEmail,
            vetId,
            instId,
            injury,
            pain,
            steriotype,
            EC,
            FC,
            VG,
            PT,
            fibri,
            CK,
            score,
            scoreClassification,
            _id,
            diagnostico,
          },
        });
      });
    })
    .catch(() => {
      res.status(400).json({ error: 'Erro na requisição.' });
    });
};
