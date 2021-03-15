const express = require('express');
const { validLogin, validRegister, forgotPasswordValidator, resetPasswordValidator } = require('../helpers/Validation');
const { registerUser, activateUser, loginUser, forgotPassword, resetPassword, googleLogin, facebookLogin, getUserData } = require('../controllers/users');
const router = express.Router();

//Create an account
router.post('/register', validRegister, registerUser);

//Activate the acount
router.post('/activation', activateUser);

//Login to your account
router.post('/login', validLogin, loginUser);

//Get user data via userId
router.get('/:id', getUserData);

//Forgotten password
router.post('/forgotpassword', forgotPasswordValidator, forgotPassword);

//Reset password
router.put('/resetpassword', resetPasswordValidator, resetPassword)

//Google Login
router.post('/googlelogin', googleLogin);

//Facebook Login
router.post('/facebooklogin', facebookLogin);

module.exports = router;