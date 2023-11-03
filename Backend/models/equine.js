const mongoose = require('mongoose');

const { Schema } = mongoose;

const equineSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  numReg: {
    type: Number,
    required: true,
  },
  classification: {
    type: String,
    required: true,
  },
  specie: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  race: {
    type: String,
    required: true,
  },
  animalAddress: {
    type: String,
    required: true,
  },
  local: {
    type: String,
    required: true,
  },
  BRState: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  neighborhood: {
    type: String,
    required: true,
  },
  CEP: {
    type: String,
    required: true,
  },
  EC: {
    type: Number,
    default: null,
  },
  FC: {
    type: Number,
    default: null,
  },
  VG: {
    type: Number,
    default: null,
  },
  PT: {
    type: Number,
    default: null,
  },
  fibri: {
    type: Number,
    default: null,
  },
  CK: {
    type: Number,
    default: null,
  },
  injury: {
    type: Boolean,
    default: null,
  },
  pain: {
    type: Boolean,
    default: null,
  },
  steriotype: {
    type: Boolean,
    default: null,
  },
  ownerEmail: {
    type: String,
    required: true,
  },
  instId: {
    type: mongoose.ObjectId,
    required: true,
  },
  vetId: {
    type: mongoose.ObjectId,
    required: true,
  },
  score: {
    type: Number,
    default: null,
  },
  scoreClassification: {
    type: String,
    default: null,
  },
  EquineData: [
    {
      date: {
        type: Date,
        default: Date.now,
      },
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
      name: {
        type: String,
      },
      weight: {
        type: Number,
      },
      age: {
        type: Number,
      },
      numReg: {
        type: Number,
      },
      classification: {
        type: String,
      },
      specie: {
        type: String,
      },
      gender: {
        type: String,
      },
      race: {
        type: String,
      },
      animalAddress: {
        type: String,
      },
      local: {
        type: String,
      },
      BRState: {
        type: String,
      },
      city: {
        type: String,
      },
      EC: {
        type: Number,
      },
      FC: {
        type: Number,
      },
      VG: {
        type: Number,
      },
      PT: {
        type: Number,
      },
      fibri: {
        type: Number,
      },
      CK: {
        type: Number,
      },
      injury: {
        type: Boolean,
      },
      pain: {
        type: Boolean,
      },
      steriotype: {
        type: Boolean,
      },
      ownerEmail: {
        type: String,
      },
      instId: {
        type: mongoose.ObjectId,
      },
      vetId: {
        type: mongoose.ObjectId,
      },
      score: {
        type: Number,
        default: null,
      },
      scoreClassification: {
        type: String,
      },
    },
  ],
});

equineSchema.methods.addEquine = (equine) => {
  const {
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
    EC,
    FC,
    VG,
    PT,
    fibri,
    CK,
    injury,
    pain,
    steriotype,
    ownerEmail,
    score,
  } = equine;
  this.weight = weight;
  this.age = age;
  this.name = name;
  this.numReg = numReg;
  this.classification = classification;
  this.city = city;
  this.specie = specie;
  this.gender = gender;
  this.race = race;
  this.animalAddress = animalAddress;
  this.local = local;
  this.BRState = BRState;
  this.EC = EC;
  this.FC = FC;
  this.VG = VG;
  this.PT = PT;
  this.fibri = fibri;
  this.CK = CK;
  this.injury = injury;
  this.pain = pain;
  this.steriotype = steriotype;
  this.ownerEmail = ownerEmail;
  this.score = score;

  return this.save();
};

module.exports = mongoose.model('Equine', equineSchema);
