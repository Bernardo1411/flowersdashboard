const express = require('express');

const vetController = require('../controllers/vet');
const ownerController = require('../controllers/owner');
const equineController = require('../controllers/equine');
const ibgeAPI = require('../controllers/api');

const router = express.Router();

// routes for the vet actions
// In most of those routes, only the vet has access
router.get('/ibge/states', ibgeAPI.ibgeapistate);
router.get('/ibge/cities', ibgeAPI.ibgeapicities);
router.post('/vet/signin', vetController.signinVet);
router.post('/vet/ownersignup', vetController.protect, ownerController.signupOwner);
router.post('/vet/equinesignup', vetController.protect, equineController.signupEquine);
router.post('/vet/equinesignupdata', vetController.protect, equineController.signupEquineData);
router.post('/vet/eqedit', vetController.protect, equineController.editEqData);
router.post('/vet/eqedithealth', vetController.protect, equineController.editEqHealth);
router.post('/vet/owneredit', vetController.protect, ownerController.editOwnerData);
router.post('/vet/newreview', vetController.protect, equineController.newreview);
router.post('/vet/newreviewdata', vetController.protect, equineController.newreviewData);
router.get('/vet/getowner', vetController.protect, ownerController.getOwner);
router.get('/vet/getequine', equineController.getEquine);
router.delete('/vet/deleteequine', vetController.protect, equineController.deleteEquine);
router.get('/vet', vetController.protect, vetController.getVet);

module.exports = router;
