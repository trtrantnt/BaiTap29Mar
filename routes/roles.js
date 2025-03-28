
var express = require('express');
var router = express.Router();
var roleController = require('../controllers/roles')
var userController = require('../controllers/users')
let jwt = require('jsonwebtoken')
let constants = require('../utils/constants')
let { CreateSuccessResponse, CreateErrorResponse } = require('../utils/responseHandler')

/* GET users listing. */
router.get('/', async function (req, res, next) {
  try {
    if (!req.headers || !req.headers.authorization) {
      throw new Error("ban chua dang nhap")
    } else {
      let authorizedtoken = req.headers.authorization;
      if (!authorizedtoken.startsWith("Bearer")) {
        throw new Error("ban chua dang nhap")
      } else {
        let token = authorizedtoken.split(" ")[1];
        let result = jwt.verify(token, constants.SECRET_KEY);
        if (result.exp > Date.now()) {
          let user = userController.GetUserByID(result.id);
          console.log(user);
        } else {
          throw new Error("ban chua dang nhap");
        }
      }
    }
    let roles = await roleController.GetAllRoles();
    CreateSuccessResponse(res, 200, roles);
  } catch (error) {
    CreateErrorResponse(res, 404, error.message)
  }
});
router.post('/', async function (req, res, next) {
  try {
    let body = req.body;
    let newRole = await roleController.CreateARole(body.name);
    CreateSuccessResponse(res, 200, newRole);
  } catch (error) {
    CreateErrorResponse(res, 404, error.message)
  }
});


module.exports = router;
