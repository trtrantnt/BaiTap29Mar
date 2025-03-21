
var express = require('express');
var router = express.Router();
let userController = require('../controllers/users')
let { CreateSuccessResponse, CreateErrorResponse } = require('../utils/responseHandler')


/* GET users listing. */
router.get('/', async function (req, res, next) {
  let users = await userController.GetAllUser();
  CreateSuccessResponse(res, 200, users)
});
router.post('/', async function (req, res, next) {
  try {
    let body = req.body;
    let newUser = await userController.CreateAnUser(body.username, body.password, body.email, body.role);
    CreateSuccessResponse(res, 200, newUser)
  } catch (error) {
    CreateErrorResponse(res, 404, error.message)
  }
});
router.put('/:id', async function (req, res, next) {
  try {
    let body = req.body;
    let updatedResult = await userController.UpdateAnUser(req.params.id,body);
    CreateSuccessResponse(res, 200, updatedResult)
  } catch (error) {
    CreateErrorResponse(res, 404, error.message)
  }
});


module.exports = router;
