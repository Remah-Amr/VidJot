const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helper/auth');// = require('').functionName
// Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

// ideas page
router.get('/', ensureAuthenticated ,(req,res)=>{
  Idea.find({user:req.user.id}).sort({date:'desc'}).then(ideas =>{
    console.log(req.user.id);
    res.render('ideas/index',
    {
      ideas : ideas
    });
  })
})



// Edit Route
router.get('/edit/:id', ensureAuthenticated ,  (req, res) => {
  Idea.findOne({
    _id : req.params.id
  }).then(idea =>{
    res.render('ideas/edit',{
      idea : idea
    });
  })
});



// Add Idea Form
router.get('/add', ensureAuthenticated , (req, res) => {
  res.render('ideas/add');
});

// process Form
router.post('/', ensureAuthenticated ,(req,res)=>{
  let errors = []; // arrays special kind of objects i can store number and text at same array like var person = {firstName:"John", lastName:"Doe", age:46};
  if(!req.body.title)
  {
    errors.push({text:'please fill title'})
  }
  if(!req.body.details)
  {
    errors.push({text:'please fill details'})
  }
  if(errors.length > 0)
  {
    res.render('ideas/add',{
      errors : errors,
      title : req.body.title,
      details : req.body.details
    })
  } else {
    const newUser = {
      title : req.body.title,
      details : req.body.details,
      user : req.user.id // idea.user == req.user.id
    }
    new Idea(newUser).save().then(idea => // Promise : use .then whenever you're going to do something with the result (even if that's just waiting for it to finish)
      {
        req.flash('success_msg','Video is added');
        res.redirect('/ideas');
      })

  }

})

// Edit process Form
router.put('/:id', ensureAuthenticated ,(req,res)=>{
  Idea.findOne({
    _id : req.params.id
  }).then(idea => {
      idea.title = req.body.title;
      idea.details = req.body.details;

      idea.save().then(idea => { // i can remove idea and put ()
      req.flash('success_msg','Video is Updated');
        res.redirect('/ideas');
      } )

})
})

// DELETE idea
router.delete('/:id', ensureAuthenticated ,(req,res)=>{
  Idea.deleteOne({
    _id : req.params.id
  }).then(()=>
  {
    req.flash('success_msg','Video is deleted');
    res.redirect('/ideas');
  }
)
})

module.exports = router;
