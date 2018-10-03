var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

// Instrucor Schema
var InstructorSchema = mongoose.Schema({
    first_name:String,
    last_name:String,
    address: [{
        street_address:String,
        city: String,
        state:String,
        zip:String
    }],
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        uniqueCaseInsensitive: true
    },
    classes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    }]
}, { usePushEach: true });

//check duplicate info
InstructorSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

var Instructor = module.exports = mongoose.model('instructor', InstructorSchema);

module.exports.getInstructorByUsername = function (username, callback) {
    var query = { username: username };
    Instructor.findOne(query, callback);
}



