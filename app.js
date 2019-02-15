const express = require('express');
const exphbs  = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');
const app = express();


// database
const db = require('./config/database');

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect('mongodb://remah:remah654312@ds133875.mlab.com:33875/vidjot-prod', { // db.mongoURI
  useMongoClient: true
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// passport
require('./config/passport')(passport);


// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// bodyParser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Middleware public
app.use(express.static(path.join(__dirname,'public')));
//To serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function in Express.

// methodOverride Middleware
app.use(methodOverride('_method'));

// Middleware express-session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

// passport middleware must be after express-session
app.use(passport.initialize());
app.use(passport.session());

// Middleware flash
app.use(flash());

// global variables
app.use(function(req,res,next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null; // This will make a user variable available in all templates, provided that req.user is populated.
  next();
})

// index route
app.get('/',(req,res)=>{
  const title = 'Welcome';
  res.render('index',{
    title : title
  })
})

// about
app.get('/about',(req,res)=>{
  res.render('about');
})

// Use routes
app.use('/ideas',ideas); // if go to /ideas /anythin go to idea file
app.use('/users',users);

const port = process.env.PORT || 5000;

app.listen(port, () =>{
  console.log(`Server started on port ${port}`);
  console.log(__dirname);
});
/*
user heroku = 'Remah Amr';
password heroku = 'remah654312@';
*/
