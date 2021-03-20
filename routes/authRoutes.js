const { Router } = require('express');
const authController = require('../controllers/authController');
const contributeController = require('../controllers/contributeController');

const fs = require('fs');
var path = require('path');
var multer = require('multer');

//storing image
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './controllers/uploads')
    },
    filename: (req, file, cb) => {
        console.log("file: ", file);
        cb(null, file.fieldname + '-' + Date.now())
    }
  });
  
var upload = multer({ storage: storage });

const router = Router();

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);
router.get('/reset', authController.reset_get);
router.post('/reset', authController.reset_post);
router.post('/interviews', upload.single('file'), contributeController.interviews_post);
router.post('/questions', authController.questions_post);


module.exports = router;