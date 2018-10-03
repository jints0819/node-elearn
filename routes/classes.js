var express = require('express');
var router = express.Router();
var Class = require('../models/class');

/* classes pageJC */
router.get('/', function (req, res, next) {
    Class.getClasses(function (err, classes) {
        res.render('classes/index', { classes: classes });
    }, 3);
});

// Class Details
router.get('/:id/details', function (req, res, next) {
    Class.findOne({ _id: req.params.id }).populate('instructor').populate({ path: 'comments', populate: { path: 'user', model: 'User' } })
        .then(classname => {
        res.render('classes/details', { classes: classname });
//console.log(classname);
    });
});


// Get Lessons
router.get('/:id/lessons', function (req, res, next) {
    Class.getClassById([req.params.id], function (err, classname) {
        if (err) throw err;
        res.render('classes/lessons', { class: classname });
    });
});

// Get Lesson
router.get('/:id/lessons/:lesson_id', function (req, res, next) {
    Class.getClassById([req.params.id], function (err, classname) {
        var lesson;
        if (err) throw err;
        for (i = 0; i < classname.lesson.length; i++) {
            if (classname.lesson[i].lesson_number == req.params.lesson_id) {
                lesson = classname.lesson[i];
            }
        }
        res.render('classes/lesson', { class: classname, lesson: lesson });
    });
});






module.exports = router;


