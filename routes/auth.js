var express = require('express');
var router = express.Router();
var userController = require('../controllers/users')
let { CreateSuccessResponse, CreateErrorResponse } = require('../utils/responseHandler')
let jwt = require('jsonwebtoken')
let constants = require('../utils/constants')

router.post('/signup', async function (req, res, next) {
    try {
        let newUser = await userController.CreateAnUser(
            req.body.username, req.body.password, req.body.email, 'user'
        )
        CreateSuccessResponse(res, 200, newUser)
    } catch (error) {
        next(error)
    }
});
router.post('/login', async function (req, res, next) {
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

module.exports = router;
