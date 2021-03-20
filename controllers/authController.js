const User = require("../models/User");
const jwt = require('jsonwebtoken');
const  { Company , Experience } = require('../models/Company');
const { Topic, Question }  = require('../models/Topic');



const handleErrorsQuestion = (err) => {
  console.log(err.message, err.code);
  let errors = { name: '', link: '', topicname: '' };
  // incorrect name
  if (err.message.includes('Please enter question name')) {
    errors.name = 'Please enter question name';
  }
  if (err.message.includes('please select a topic')) {
    errors.topicname = 'please select a topic';
  }

  // incorrect link
  if (err.message.includes('Please enter link')) {
    errors.link = 'Please enter link';
  }
  // incorrect topicname
  if(err.message.includes('no suck kind of topic is there')) {
    errors.topicname = 'no suck kind of topic is there';
  }
  if (err.code === 11000) {
    errors.link = 'that question is already their';
    return errors;
  }
  return errors;
}
// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { username: '', email: '', password: '', repassword: '' };
  
  // incorrect username
  if (err.message === 'incorrect username') {
    errors.username = 'That username is not registered';
  }

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }
  
  //passwords not matched durng reset
  if (err.message === 'passwords not matched') {
    errors.repassword = 'passwords not matched';
  }

  //length of password min 6
  if (err.message === 'min lenth of password is 6') {
    errors.password = 'min lenth of password is 6';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }
  return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'net ninja secret', {
    expiresIn: maxAge
  });
};

// controller actions
module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.login_get = (req, res) => {  
  res.render('login');
}

module.exports.reset_get = (req, res) => {
  res.render('reset');
}

module.exports.signup_post = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({ username, email, password });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}

module.exports.reset_post = async (req, res) => {
  const { email, password, repassword } = req.body;

  try {
    const username = await User.reset(email, password, repassword);
    if(username){
      await User.findOneAndRemove({email: email}).then( async function(){
        const user = await User.create({ username, email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
        });
    }
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
} 

module.exports.questions_post = async (req, res) => {
  const {name, link, topicname } = req.body;
  try {
    if(!topicname){
      throw Error("please select a topic");
    }
    const topic = await Topic.findOne({name: topicname});
    if(!topic){
      throw Error("no suck kind of topic is there");
    }
    else{
      const userquestion = await Question.create({ name, link, topicname:topic._id });
      res.status(201).json({ userquestion: userquestion._id });
    }
  }
  catch(err) {
    const errors = handleErrorsQuestion(err);
    res.status(400).json({ errors });
  }
}