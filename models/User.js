const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please enter an username'],
    unique: true,
    minlength: [6, 'Minimum username length is 6 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters'],
  }
});


// fire a function before doc saved to db
userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login user
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};

userSchema.statics.reset = async function(email, password, repassword) {
  const user = await this.findOne({ email });
  console.log(email);
  if (!user) {
    console.log("hi");
    throw Error('incorrect email');
  }
  else if(password!=repassword){
    throw Error('passwords not matched');
  }
  else if(password.length < 6){
    throw Error('min lenth of password is 6');
  }
  return user.username;
};

const User = mongoose.model('user', userSchema);

module.exports = User;