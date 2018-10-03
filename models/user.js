var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var uniqueValidator = require('mongoose-unique-validator');

//user schema
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password:String,
    email: {
        type: String,
        uniqueCaseInsensitive: true
    },
    type:String
});

//check duplicate info
UserSchema.plugin(uniqueValidator, { message: 'Error, expected be unique.' });


var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
}

module.exports.getUserByUsername = function (username, callback) {
    var query = { username: username };
    User.findOne(query, callback);
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, res) {
        callback(null, res);
    });
}

// Create Student User
module.exports.saveStudent = function (newUser,newStudent, callback) {
    bcrypt.hash(newUser.password, 10, function (err, hash) {
        newUser.password = hash;
      //  async.parallel([newUser.save, newStudent.save], callback);
        newUser.save().then(newadd => {
            newStudent.save();
        });

    });
}

// Create Instructor User
module.exports.saveInstructor = function (newUser, newInstructor, callback) {
    bcrypt.hash(newUser.password, 10, function (err, hash) {
        newUser.password = hash;
        console.log('Instructor is being saved');
       // async.parallel([newUser.save, newInstructor.save], callback);
        newUser.save();
        newInstructor.save();
    });
}