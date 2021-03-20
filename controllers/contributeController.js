const  { Company , Experience } = require('../models/Company');
const { Topic, Question }  = require('../models/Topic');
const fs = require('fs');
var path = require('path');
var multer = require('multer');

const handleErrorsExp = (err) => {
    console.log(err.message, err.code);
    let errors = { personname: '', img: '', branch: '', year: '', companyname: '', exp: ''};
    // incorrect username
    if (err.message.includes('Please enter  your name')) {
      errors.personname = 'Please enter  your name';
    }
  
    // incorrect username
    if (err.message.includes('Please enter  your Branch')) {
      errors.branch = 'Please enter  your Branch';
    }
    if (err.message.includes('Please enter year of your interview')) {
        errors.year = 'Please enter year of your interview';
    }
    if (err.message.includes('Please enter experince in the interview')) {
    errors.exp = 'Please enter experince in the interview';
    }
    
    if (err.message.includes('Please select the company')) {
        errors.companyname = 'Please select the company';
        }
    // incorrect username
    if (err.message.includes('Minimum experience length is 50 characters')) {
      errors.exp = 'Minimum experience length is 50 characters';
    }
  
    return errors;
  }


module.exports.interviews_post = async (req, res) => {
    const { personname, branch, year, companyname, exp } = req.body;
    //console.log("data:", req.body);
    console.log("image: ", req.file);
    if(req.file){
      var filetype = req.file.mimetype;
      console.log(filetype);
      if(filetype === 'image/jpeg' || filetype === 'image/png'){
        console.log(__dirname + '/uploads/' + req.file.filename);
        var pathofimg = __dirname + '/uploads/' + req.file.filename;
      }
      else{
        var pathofimg = __dirname + '/uploads/' + 'defaultimg';
      }
    }
    else{
      var filetype = 'image/png';
      var pathofimg = __dirname + '/uploads/' + 'defaultimg';
    }
    try {
        if(!companyname){
            throw Error("Please select the company");
        }
        const company = await Company.findOne({name: companyname});
        if(!company){
            throw Error("no suck kind of company is there");
        }
        else{
            const userExperience = await Experience.create({ personname, image: {
              data: fs.readFileSync(path.join(pathofimg)),
              contentType: filetype
              }, branch, year, companyname: company._id, exp });
            console.log("exp added sucessfully");
            if(req.file){
              fs.unlink('./controllers/uploads/' + req.file.filename, (err) => {
                if (err) {
                  console.error(err)
                  return
                }
                console.log("file removed");
              });
            }
            res.status(201).json({ userExperience: userExperience._id });
        }
    }
    catch(err) {
      const errors = handleErrorsExp(err);
      res.status(400).json({ errors });
    }
  }
