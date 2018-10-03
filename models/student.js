var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

// Student Schema
var StudentSchema = mongoose.Schema({
    first_name:String,
    last_name: String,
    address: [{
        street_address:  String,
        city:String,
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
        class_title: String
    }]

}, { usePushEach: true });

//check duplicate info
StudentSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

var Student = module.exports = mongoose.model('Student', StudentSchema);


module.exports.getStudentByUsername = function (username, callback) {
    var query = { username: username };
    Student.findOne(query, callback);
}


// Register Student for Class
module.exports.register = function (info, callback) {
    student_username = info['student_username'];
    class_id = info['class_id'];
    class_title = info['class_title'];

    var query = { username: student_username };


    Student.findOneAndUpdate(
        query,
        { $push: { "classes": { _id: class_id, class_title:class_title } } },
        { safe: true, upsert: true },
        callback
    );
}
