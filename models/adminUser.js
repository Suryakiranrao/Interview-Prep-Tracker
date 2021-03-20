const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminUserSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters'],
    },
    role: { 
        type: String, 
        enum: ['admin', 'restricted'], 
        required: true 
    },
});

// fire a function before doc saved to db
adminUserSchema.pre('save', async function(next) {
    console.log("hi man u baby");
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    console.log(this);
    next();
});

// Resources definitions
const adminUser = mongoose.model('adminUser', adminUserSchema);

module.exports = adminUser;