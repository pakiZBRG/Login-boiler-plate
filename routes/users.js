const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { errorHandler } = require('../helpers/ErrorHandler');
const { validationResult } = require('express-validator');
const { validLogin, validRegister, forgotPasswordValidator, resetPasswordValidator } = require('../helpers/Validation');
const router = express.Router();

//Create an account
router.post('/register', validRegister, (req, res) => {
    const { username, email, password } = req.body;
    const errors = validationResult(req);

    try{
        if(!errors.isEmpty()){
            const firstError = errors.array().map(error => error.msg)[0]
            return res.status(422).json({error: firstError})
        }
        else {
            User.findOne({email})
                .exec((err, user) => {
                    if(user){
                        return res.status(400).json({
                            error: "Email is taken"
                        })
                    }
                })
            
            //Configuring token
            const token = jwt.sign(
                { username, email, password },
                process.env.JWT_ACCOUNT_ACTIVATION,
                { expiresIn: 900 }
            )
    
            //Send activation link to user email
            const emailData = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: "Account activation link",
                html: `
                    <h3>Please Click on Link to Activate:</h3>
                    <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
                    <hr/>
                `
            }
    
            const transport = {
                host: 'smtp.gmail.com',
                auth: {
                    user: process.env.EMAIL_FROM,
                    pass: 'Nikola-990'
                }
            };
            const transporter = nodemailer.createTransport(transport);
    
            transporter.verify((err, success) => {
                if(err) {
                    console.log(err);
                } else {
                    console.log("Server is ready to take messages");
                }
            });
    
            transporter.sendMail(emailData, function(err, info){
                if(err) {
                    console.log(err);
                } else {
                    console.log(`Email send to ${info.response}`);
                    return res.json({
                        message: `Email has been sent to ${email}`
                    });
                }
            });
        }
    } catch(err){
        res.status(500).json({err: err.message})
    }
    
});

//Activate the acount
router.post('/activation',  (req, res) => {
    const {token} = req.body;
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, async (err, decoded) => {
        if(err) {
            return res.status(401).json({
                error: 'Token has expired (15min). Login again'
            })
        } else {
            //if valid save to database
            const {username, email, password} = jwt.decode(token);
    
            const hashPassword = await bcrypt.hash(password, 10);
            const user = new User({
                username,
                email,
                password: hashPassword
            })
    
            //Put in mongoDB
            user.save()
                .then(() => {
                    res.json({
                        success: true,
                        message: 'Signup success'
                    })
                })
                .catch(err => res.status(401).json({error: errorHandler(err)}));
        }
    });
});

//Login to your account
router.post('/login', validLogin, async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({
            error: firstError
        })
    }
    else {
        //if user exists
        const user = await User.findOne({email: req.body.email});
        if(!user) return res.status(400).json({error: 'No user with given email. Please sign up'});

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword) return res.status(400).json({error: "Wrong Password"});

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {expiresIn: '10d'})

        const { _id, username, email } = user;
        return res.json({
            success: true,
            token,
            user: {
                id: _id,
                username,
                email
            }
        })
    }
});

//Get user data via userId
router.get('/:id', (req, res) => {
    User.findById(req.params.id)
        .exec()
        .then(result => {
            res.status(200).json({
                _id: result.id,
                username: result.username,
                email: result.email
            })
        })
        .catch(err => res.status(500).json({error: err}))
})

module.exports = router;