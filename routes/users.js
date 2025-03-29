var express = require('express');
var router = express.Router();
let userController = require('../controllers/users')
let { CreateSuccessResponse, CreateErrorResponse } = require('../utils/responseHandler')
let{check_authentication,check_authorization} = require('../utils/check_auth');
const constants = require('../utils/constants');
const { body, validationResult } = require('express-validator');

// Helper function to validate the request
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(CreateErrorResponse(400, "Validation error", errors.array()));
  }
  next();
};

// Validation for creating a new user
const createUserValidation = [
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
  
  body('role')
    .notEmpty().withMessage('Role không được để trống')
    .isIn(['user', 'admin', 'mod']).withMessage('Role phải là user, admin hoặc mod')
];

// Validation for updating a user
const updateUserValidation = [
  body('username')
    .optional()
    .isLength({ min: 3, max: 30 }).withMessage('Username phải từ 3-30 ký tự')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username chỉ được chứa chữ cái, số và dấu gạch dưới'),
  
  body('email')
    .optional()
    .isEmail().withMessage('Email không hợp lệ'),
  
  body('role')
    .optional()
    .isIn(['user', 'admin', 'mod']).withMessage('Role phải là user, admin hoặc mod'),
  
  body('fullname')
    .optional()
    .isLength({ max: 100 }).withMessage('Fullname không được vượt quá 100 ký tự')
];

/* GET users listing. */
router.get('/',check_authentication,check_authorization(constants.MOD_PERMISSION), async function (req, res, next) {
  console.log(req.headers.authorization);
  let users = await userController.GetAllUser();
  CreateSuccessResponse(res, 200, users)
});

router.post('/', createUserValidation, validate, async function (req, res, next) {
  try {
    let body = req.body;
    let newUser = await userController.CreateAnUser(body.username, body.password, body.email, body.role);
    CreateSuccessResponse(res, 200, newUser)
  } catch (error) {
    CreateErrorResponse(res, 404, error.message)
  }
});

router.put('/:id', updateUserValidation, validate, async function (req, res, next) {
  try {
    let body = req.body;
    let updatedResult = await userController.UpdateAnUser(req.params.id, body);
    CreateSuccessResponse(res, 200, updatedResult)
  } catch (error) {
    next(error)
  }
});

module.exports = router;
