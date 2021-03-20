const mongoose = require('mongoose');
const fs = require('fs');

const experienceSchema = new mongoose.Schema({
    personname: {
        type: String,
        required: [true, 'Please enter  your name'],
    },
    image:
    {
        data: Buffer,
        contentType: String
    },
    branch: {
        type: String,
        required: [true, 'Please enter  your Branch'],
    },
    year: {
        type: Number,
        required: [true, 'Please enter year of your interview'],
    },
    exp: {
        type:String,
        required: [true, 'Please enter experince in the interview'],
        minlength: [50, 'Minimum experience length is 50 characters']
    },
    companyname: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Please select the company'],
    },
    approved: {
        type: Boolean,
        default: false,
    }
});

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter companyname'],
        lowercase: true
    },
});

const Company = mongoose.model('Company', companySchema);
const Experience = mongoose.model('Experience', experienceSchema);

module.exports = { Company , Experience };
