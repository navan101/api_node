var express = require('express');
var router =  express.Router();
var Product = require('../models/product');
var mongoose = require('mongoose');

router.get('/products', function(req, res, next) {
    Product
        .find()
        .then(resuft => {
            console.log(resuft);
            res.status(200).json(resuft);
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err });
        });
});

router.post('/products', function(req, res, next){
    // var product = {
    //     name: req.body.name,
    //     tuoi: req.body.tuoi
    // };
    var product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product
        .save()
        .then(resuft => {
            console.log(resuft);
            res.status(200).json(resuft);
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error:err});
        });
});

router.get('/products/:productId', function(req, res, next){
    var id = req.params.productId;
    Product.findById(id)
    .exec()
    .then(resuft => {
        console.log(resuft);
        if(resuft) {
            res.status(200).json(resuft);
        } else {
            res.status(404).json({message: 'Khong tim thay'});
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });

});

router.patch('/products/:productId', function(req, res, next){
    Product.update({_id:id},{$set:updateOps})
    .exec()
    .then(resuft => {
        res.status(200).json(resuft);
    })
    .catch(err => {
        res.status(500).json({
            error : err
        });
    })
});

router.delete('/products/:productId', function (req, res, next) {
    res.status(200).json({
        message: 'delete product'
    })
});

module.exports = router;