var express = require('express');
var router = express.Router();
let productSchema = require('../schemas/product')

/* GET users listing. */
router.get('/', async function(req, res, next) {
    let products = await productSchema.find({});
    res.send(products);
});

router.post('/', async function(req, res, next) {
    let newProduct = productSchema(req.body);
    await newProduct.save()
    res.send(newProduct);
});

module.exports = router;
