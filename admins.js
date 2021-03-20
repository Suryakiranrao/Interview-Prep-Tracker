const adminUser = require('./models/adminUser');
const mongoose = require('mongoose');

var adminuser = new adminUser({
    email: 'gannavarpusuryakiran@gmail.com',
    password: '123456789',
    role: 'admin'
});

const email = "mark@google.com";
const password = "qwert123";
const role = "restricted";

const dbURI = 'mongodb+srv://surya:test123@cluster0.somyv.mongodb.net/node-auth';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then(async (result) => {
    console.log('connection made!!');
    adminuser.save().then(function(){
        console.log("admin created suceesfully");
    });
    const adminuser_ = await adminUser.create({ email, password, role });
    console.log(adminuser_);
    })
  .catch((err) => console.log(err));



