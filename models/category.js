var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({

    name: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model('categories', CategorySchema);
