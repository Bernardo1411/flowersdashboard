const express = require('express');

const institutionController = require('../controllers/institution');
const vetController = require('../controllers/vet');

const router = express.Router();

// routes for the institution actions
// In most of those routes, only the institution has access
router.post('/institution/signup', institutionController.signupInstitution);
router.post('/institution/signup/emailverification', institutionController.verifyInstitutionEmail);
router.post('/institution/signup/sendverificationcode', institutionController.sendVerificationcodeToEmail);
router.post('/institution/signin', institutionController.signinInstitution);
router.post('/institution/vetsignup', institutionController.protect, institutionController.signupVet);
router.post('/institution/edit', institutionController.protect, institutionController.editInstitution);
router.get('/institution', institutionController.protect, institutionController.getInstitution);
router.get('/institution/getvets', institutionController.protect, institutionController.getVets);
router.post('/vet/vetedit', institutionController.protect, vetController.editVet);
router.delete('/vet/deletevet', institutionController.protect, vetController.deleteVet);

module.exports = router;
