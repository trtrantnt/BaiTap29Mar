var express = require('express');
var router = express.Router();
var userController = require('../controllers/users')
let { CreateSuccessResponse, CreateErrorResponse } = require('../utils/responseHandler')
let jwt = require('jsonwebtoken')
let constants = require('../utils/constants')
let { check_authentication } = require('../utils/check_auth')
let crypto = require('crypto')
let mailer = require('../utils/mailer')

const { body, validationResult } = require('express-validator');

// Helper function to validate the request
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(CreateErrorResponse(400, "Validation error", errors.array()));
  }
  next();
};

const loginValidation = [
    body('username')
      .notEmpty().withMessage('Username không được để trống'),
    
    body('password')
      .notEmpty().withMessage('Password không được để trống')
  ];

const signupValidation = [
    body('username')
      .notEmpty().withMessage('Username không được để trống')
      .isLength({ min: 3, max: 30 }).withMessage('Username phải từ 3-30 ký tự')
      .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username chỉ được chứa chữ cái, số và dấu gạch dưới'),
    
    body('password')
      .notEmpty().withMessage('Password không được để trống')
      .isLength({ min: 6 }).withMessage('Password phải có ít nhất 6 ký tự')
      .matches(/\d/).withMessage('Password phải chứa ít nhất 1 chữ số'),
    
    body('email')
      .notEmpty().withMessage('Email không được để trống')
      .isEmail().withMessage('Email không hợp lệ'),
    
    body('fullname')
      .optional()
      .isLength({ max: 100 }).withMessage('Fullname không được vượt quá 100 ký tự')
  ];

const changePasswordValidation = [
    body('oldpassword')
      .notEmpty().withMessage('Mật khẩu cũ không được để trống'),
    
    body('newpassword')
      .notEmpty().withMessage('Mật khẩu mới không được để trống')
      .isLength({ min: 6 }).withMessage('Mật khẩu mới phải có ít nhất 6 ký tự')
      .matches(/\d/).withMessage('Mật khẩu mới phải chứa ít nhất 1 chữ số')
];

const forgotPasswordValidation = [
    body('email')
      .notEmpty().withMessage('Email không được để trống')
      .isEmail().withMessage('Email không hợp lệ')
];

const resetPasswordValidation = [
    body('password')
      .notEmpty().withMessage('Mật khẩu không được để trống')
      .isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự')
      .matches(/\d/).withMessage('Mật khẩu phải chứa ít nhất 1 chữ số')
];

router.post('/signup', signupValidation, validate, async function (req, res, next) {
    try {
        let newUser = await userController.CreateAnUser(
            req.body.username, req.body.password, req.body.email, 'user'
        )
        CreateSuccessResponse(res, 200, newUser)
    } catch (error) {
        next(error)
    }
});

router.post('/login', loginValidation, validate, async function (req, res, next) {
    try {
        let user_id = await userController.CheckLogin(
            req.body.username, req.body.password
        )
        let token = jwt.sign({
            id: user_id,
            exp: (new Date(Date.now() + 60 * 60 * 1000)).getTime()
        }, constants.SECRET_KEY)
        CreateSuccessResponse(res, 200, token)
    } catch (error) {
        next(error)
    }
});

router.get('/me', check_authentication, function (req, res, next) {
    CreateSuccessResponse(res, 200, req.user)
});

router.post('/change_password', check_authentication, changePasswordValidation, validate,
    function (req, res, next) {
        try {
            let oldpassword = req.body.oldpassword;
            let newpassword = req.body.newpassword;
            let result = userController.Change_Password(req.user, oldpassword, newpassword)
            CreateSuccessResponse(res, 200, result)
        } catch (error) {
            next(error)
        }
    });

router.post('/forgotpassword', forgotPasswordValidation, validate, async function (req, res, next) {
    try {
        let email = req.body.email;
        let user = await userController.GetUserByEmail(email);
        user.resetPasswordToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordTokenExp = (new Date(Date.now() + 10 * 60 * 1000));
        await user.save();
        let url = 'http://localhost:3000/auth/resetpassword/' + user.resetPasswordToken;
        await mailer.sendMailForgotPassword(user.email, url);
        CreateSuccessResponse(res, 200, url)
    } catch (error) {
        next(error)
    }
});

router.post('/resetpassword/:token', resetPasswordValidation, validate, async function (req, res, next) {
    try {
        let token = req.params.token;
        let password = req.body.password;
        let user = await userController.GetUserByToken(token);
        user.password = password;
        user.resetPasswordToken = null;
        user.resetPasswordTokenExp = null;
        await user.save();
        CreateSuccessResponse(res, 200, user)
    } catch (error) {
        next(error)
    }
});

module.exports = router;
