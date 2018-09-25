var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt-nodejs");
var User = require("../models/user");
var config = require("../../config");
var checkAuth = require("../middleware/check-auth");
var mongoose = require('mongoose');

router.post('/signup', function(req, res) {
  User.find({ email: req.body.email })
  .exec()
  .then(email => {
    if (email.length >= 1) {
      return res.status(409).json({
        message: 'Mail exists'
      });
    } else {
      User.find({ name: req.body.name})
      .exec()
      .then(name => {
        if (name.length >= 1) {
          return res.status(409).json({
            message: 'Name exists'
          });
        } else {
          var hashedPassword = bcrypt.hashSync(
            req.body.password,
            bcrypt.genSaltSync(8),
            null
          );
          var user = new User({
            _id: mongoose.Types.ObjectId(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            admin: req.body.admin
          });
          user
            .save()
            .then(resuft => {
              var token = jwt.sign({ id: user._id }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
              });
              res.status(201).json({ auth: true, token: token });
            })
            .catch(err => {
              res.status(500).json({ error: err });
            });
        }
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      })
    }
  })
  .catch(err => {
    res.status(500).json({
      error: err
    });
  });
});

router.post("/login", function(req, res) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if (err) {
      return res.status(500).json({
        error : 'Error on the server.'
      });
    };
    if (!user) {
      return res.status(404).json({
        errer : 'No user found.'
      });
    };
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid)
    {
      return res.status(401).json({ auth: false, token: null });
    }
    var token = jwt.sign(
      { 
        id: user._id,
        email: user.email,
      }, 
      config.secret, 
      {
      expiresIn: 86400 // expires in 24 hours
      }
    );
    res.status(200).json({ auth: true, token: token });
  });
});

router.get("/logout", function(req, res) {
  res.status(200).json({ auth: false, token: null });
});

router.get("/me", checkAuth, function(req, res, next) {
  User.findById(req.userId, { password: 0 }, function(err, user) {
    if (err)
      return res.status(500).json({
        error:'There was a problem finding the user.'
      });
    if (!user) return res.status(404).json({
      error:'No user found.'
    });
    res.status(200).json({
      user:user
    });
  });
});

router.use(function(user, req, res, next) {
  res.status(200).json({
    user: user
  });
});

router.post("/authenticate", function(req, res) {
  // find the user
  User.findOne({email: req.body.email},
    function(err, user) {
      if (err) throw err;
      if (!user) {
        res.json({
          success: false,
          message: "Authentication failed. User not found."
        });
      } else if (user) {
        // check if password matches
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
        if (!passwordIsValid) {
          res.json({
            success: false,
            message: "Authentication failed. Wrong password."
          });
        } else {
          // if user is found and password is right
          var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
          });
          res.json({
            success: true,
            message: "Enjoy your token!",
            token: token
          });
        }
      }
    }
  );
});

router.use(checkAuth, function(req, res, next) {
  console.log(req)
  User.findById(req.userId, { password: 0 }, function(err, user) {
    if (err)
    {
      return res.status(500).json({
        error: 'There was a problem finding the user.'
      });
    };
    if (!user) return res.status(404).json({
      error: 'No user found.'
    });
    res.status(200).json({
      user:user
    });
  });
});

module.exports = router;
