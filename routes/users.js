const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User login Route
router.get('/login',(req,res)=>{
  res.render('users/login');
})

// Load User model
require('../models/User');
const User = mongoose.model('users');

// User register Route
router.get('/register',(req,res)=>{
  res.render('users/register');
})

// Login Form Post
router.post('/login',(req,res,next)=>{
  passport.authenticate('local',{
    successRedirect:'/ideas',
    failureRedirect:'/users/login',
    failureFlash:true
  })(req,res,next);
})

// register Form Post
router.post('/register',(req,res)=>{
  let errors = [];
  if(req.body.password != req.body.password2)
  {
    errors.push({text:"passwords do  not match"});
  }
  if(req.body.password.length < 4)
  {
    errors.push({text:"Password must at least 4 charachers"});
  }
  if(errors.length > 0)
  {
    res.render('users/register',{
      errors : errors,
      name: req.body.name,
      email : req.body.email,
      password : req.body.password
    })
  }
  else {
     User.findOne({
       email : req.body.email
     }).then(user=>{
       if(user){
         req.flash("error_msg","The Email repeated");
         res.redirect('/users/register');
       }
       else {
         const newUser = {
           name: req.body.name,
           email : req.body.email,
           password : req.body.password
         }
         bcrypt.genSalt(10, function(err, salt) {
       bcrypt.hash(newUser.password, salt, function(err, hash) {
         if(err) throw err;
         newUser.password = hash;
         new User(newUser).save().then(user=>{
           req.flash('success_msg',"You registered , you can login");
           res.redirect('/users/login');
         }).catch(err=>{
           console.log(err);
           return;
         })
       });

     })
       }
     })
}
})

// logout
router.get('/logout',(req,res)=>{
  req.logout();// Passport exposes a logout() function on req (also aliased as logOut()) that can be called from any route handler which needs to terminate a login session. Invoking logout() will remove the req.user property and clear the login session (if any).
  req.flash('success_msg','You logged out successfully');
  res.redirect('/users/login');
})

module.exports = router;
