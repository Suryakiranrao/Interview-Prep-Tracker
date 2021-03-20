const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const { Topic, Question }  = require('./models/Topic');
const  { Company , Experience } = require('./models/Company');
const  adminRouter = require('./routes/admin.router');
const fs = require('fs');
var path = require('path');
var multer = require('multer');



const app = express();

// middleware
app.use('/admin', adminRouter);
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://surya:test123@cluster0.somyv.mongodb.net/node-auth';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => {
    console.log('connection made!!');
    app.listen(3000)
    })
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/topics', requireAuth, (req, res) => Topic.find({}).then(
    function(result){ 
      //console.log(result);
      res.render('topics', {topicArray: result})
      }
    )
  );
app.get('/topics/*', requireAuth, (req, res) => Topic.findOne({name: decodeURIComponent(req.url.substring(8))}).then(
  function(result){ 
    //console.log(decodeURIComponent(req.url.substring(8)));
    //console.log('val of result:', result);
    Question.find({topicname: result._id, approved: true}).then(function(result1){
      res.render('questions', {questionArray: result1});
    })
    }
  )
);
app.get('/interviews', requireAuth, (req, res) => Company.find({}).then(
  function(result){ 
    //console.log(result);
    res.render('interviews', {companies: result})
    }
  ));
app.get('/interviews/*', requireAuth, (req, res) => {
  if(decodeURIComponent(req.url).split("/").length == 4){
    //console.log("its ok bro!!");
    //console.log(decodeURIComponent(req.url).split("/"));
    Experience.findOne({_id: decodeURIComponent(req.url).split("/")[3]}).then(
      function(result){ 
        //console.log("val of experience result: ",result);
        res.render('fullexperience', {experience: result, companyname: decodeURIComponent(req.url).split("/")[2]});
        }
      )
  }
  else{
    Company.findOne({name: decodeURIComponent(req.url.substring(12))}).then(
      function(result){ 
        //console.log("company name:", decodeURIComponent(req.url));
        //console.log("val of result: ",result);
        Experience.find({companyname: result._id, approved: true}).then(function(result1){
          res.render('experiences', {experiences: result1, companyname: result.name});
        })
        }
      )
  } 
}
); 
app.use(authRoutes);
