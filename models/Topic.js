const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter question name'],
        unique: true
      },
    link: {
        type: String,
        required: [true, 'Please enter link'],
        unique: true
      },
    topicname: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
      },
      approved: {
        type: Boolean,
        default: false,
      }
});

const topicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter topic name'],
        unique: true,
        lowercase: true
      },
    //questions: [questionSchema]
});


const Topic = mongoose.model('Topic', topicSchema);
const Question = mongoose.model('Question', questionSchema);


module.exports = { Topic, Question };
