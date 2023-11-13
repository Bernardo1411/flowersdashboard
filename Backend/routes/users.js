const express = require('express');

const userController = require('../controllers/users');

const router = express.Router();

// routes for the user actions
// In most of those routes, only the user has access
router.post('/user/signup', userController.signupUser);
router.post('/user/signin', userController.signinUser);
router.post('/user/addflower', userController.protect, userController.signupFlower);
router.get('/user', userController.protect, userController.getUser);
router.get('/user/getflowers', userController.protect, userController.getFlowers);
router.post('/user/sellflower', userController.protect, userController.sellFlowers);
router.put('/user/editflower', userController.protect, userController.editFlower);
router.delete('/user/deleteflower', userController.protect, userController.deleteFlower);

module.exports = router;
