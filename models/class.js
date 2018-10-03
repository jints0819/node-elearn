var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ClassSchema = new Schema({
    title: String,
    description: String,
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'instructor'
    },
    image: String,
    category: String,
    lesson: [{
        lesson_number: Number,
        lesson_title: String,
        lesson_body: String,
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comments'
    }]
}, { usePushEach: true });

var Class = mongoose.model('Class', ClassSchema);
module.exports = Class;

//fetch all class
module.exports.getClasses = function (callback, limit) {
    Class.find(callback).limit(limit);
}

//get single class
module.exports.getClassById = function (id, callback) {
    Class.findById(id, callback);
}

// Add Lesson
module.exports.addLesson = function (info, callback) {
    class_id = info['class_id'];
    lesson_number = info['lesson_number'];
    lesson_title = info['lesson_title'];
    lesson_body = info['lesson_body'];

    Class.findByIdAndUpdate(
        class_id,
        { $push: { "lesson": { lesson_number: lesson_number, lesson_title: lesson_title, lesson_body: lesson_body } } },
        { safe: true, upsert: true },
        callback
    );
}

//Add Class
module.exports.saveClass = function (newClass, callback) {
    newClass.save();
}

// Update Lesson
module.exports.updateLesson = function (info, callback) {
    class_id = info['class_id'];
    lesson_number = info['lesson_number'];
    lesson_title = info['lesson_title'];
    lesson_body = info['lesson_body'];
    lesson_id = info['lesson_id'];

    Class.findOneAndUpdate({
        '_id': class_id,
        'lesson': {
            $elemMatch: {
                '_id': lesson_id
            }
        }
    }, {
            $set:
            {
                'lesson.$': {
                    lesson_title,
                    lesson_number,
                    lesson_body
                }
            }

        },
        function (err, response) {
            if (err) {
                console.log(err);
            }
        });

}
// Delete Lesson
module.exports.deleteLesson = function (info, callback) {
    class_id = info['class_id'];
    lesson_id = info['lesson_id'];


    Class.findOneAndUpdate({
        '_id': class_id,
        'lesson': {
            $elemMatch: {
                '_id': lesson_id
            }
        }
    },
        {
            $pull: { 'lesson': { '_id': lesson_id } }

        }, function (err, response) {
            if (err) {
                console.log(err);
            }
        });

}


