
var express = require('express');
var router = express.Router();
var roleController = require('../controllers/roles')
let roleSchema = require('../schemas/role')
let {CreateSuccessResponse,CreateErrorResponse} = require('../utils/responseHandler')

/* GET users listing. */
router.get('/', async function (req, res, next) {
  try {
    let roles = await roleController.GetAllRoles();
    CreateSuccessResponse(res,200,roles);
  } catch (error) {
    CreateErrorResponse(res,404,error.message)
  }
});
router.post('/', async function (req, res, next) {
  try {
    let body = req.body;
    let newRole = await roleController.CreateARole(body.name);
    CreateSuccessResponse(res,200,newRole);
  } catch (error) {
    CreateErrorResponse(res,404,error.message)
  }
});


module.exports = router;
