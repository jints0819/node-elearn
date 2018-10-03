var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './public/images/class' });

Class = require('../models/class');
Instructor = require('../models/instructor');
User = require('../models/user');
Comment = require('../models/comment');


router.get('/classes', function (req, res, next) {
  //  Instructor.getInstructorByUsername(req.user.username, function (err, instructor) {
   //     if (err) throw err;

  //      res.render('instructors/classes', { instructor: instructor });
  //  });

    Instructor.findOne({ username: req.user.username }).populate({ path: 'classes' })
        .then(instructor => {
            res.render('instructors/classes', { instructor: instructor });
            console.log(instructor);
        });

});


//new class
router.get('/classes/new', function (req, res, next) {
    Instructor.getInstructorByUsername(req.user.username, function (err, instructor) {
        if (err) throw err;
        res.render('instructors/newclass', { instructor: instructor });
    });
});


router.post('/classes/new', upload.single('image'), function (req, res, next) {
    // Get Values
    var title = req.body.title;
    var description = req.body.description_body;
    var category = req.body.category;
    var image;

    //check image
    if (req.file) {
        image = req.file.filename;
    } else {
        image = 'noimage.jpg';
    }

    req.checkBody('title', 'Title field is required').notEmpty();
    req.checkBody('instructor', 'Instructor field is required').notEmpty();
    req.checkBody('description', 'Description field is required').notEmpty();
    req.checkBody('category', 'Category field is required').notEmpty();

    errors = req.validationErrors();


    Instructor.getInstructorByUsername(req.user.username, function (err, instructor) {
        if (err) throw err;
        var instructorid = instructor._id;

        var newClass = new Class({
            title,
            instructor: instructorid,
            description,
            category,
            image
        });

        //console.log(newClass);
        //   Class.saveClass(newClass, function (err, classes) {
        //       console.log(err);
        //   });

        instructor.classes.push(newClass);
        instructor.save().then(saveclass => {
            newClass.save().then(saveC=> {
                req.flash('success_msg', 'Class Added');
                res.redirect('/instructors/classes/');

            });
        });

    });
    });



//delete class & comment
router.delete('/classes/delete/:id', function (req, res, next) {
    var class_id = req.params.id;

    Class.findOne({ _id: class_id }).populate('comments').populate('instructor').then(post => {

        if (!post.comments.length < 1) {

            post.comments.forEach(comment => {
                comment.remove();
            });
        }

        Instructor.findOneAndUpdate(
            { "_id": post.instructor._id },
            { $pull: { "classes": class_id } },
            { safe: true },
            function (err, obj) {
                console.log("Error " + err);
            });

        post.remove();

        res.status(200).send();

    }).catch(e => {
        console.log(e);
    });

  
});



//new lesson
router.get('/classes/:id/lessons/new', function (req, res, next) {
    res.render('instructors/newlesson', { class_id: req.params.id });
});

router.post('/classes/:id/lessons/new', function (req, res, next) {
    // Get Values
    var info = [];
    info['class_id'] = req.params.id;
    info['lesson_number'] = req.body.lesson_number;
    info['lesson_title'] = req.body.lesson_title;
    info['lesson_body'] = req.body.lesson_body;

    
    Class.addLesson(info, function (err, lesson) {
        console.log(err);
    });


    req.flash('success_msg', 'Lesson Added');
    res.redirect('/instructors/classes');
});

// Get Lessons
router.get('/classes/:id/lessons/', function (req, res, next) {
    Class.getClassById([req.params.id], function (err, classname) {
        if (err) throw err;
        res.render('instructors/viewlessons', { class: classname });
    });
});

//Update lesson
router.get('/classes/:id/lessons/:lesson_id/update', function (req, res, next) {

    Class.getClassById([req.params.id], function (err, classname) {
        var lesson;
        for (i = 0; i < classname.lesson.length; i++) {
            if (classname.lesson[i]._id == req.params.lesson_id) {
                lesson = classname.lesson[i];
            }
        }
        
        res.render('instructors/updatelesson', { class: classname, lesson: lesson });
    });
});



router.post('/classes/:id/lessons/:lesson_id/update', function (req, res, next) {
    // Get Values
    var info = [];
    info['class_id'] = req.params.id;
    info['lesson_number'] = req.body.lesson_number;
    info['lesson_title'] = req.body.lesson_title;
    info['lesson_body'] = req.body.lesson_body;
    info['lesson_id'] = req.params.lesson_id;


    Class.updateLesson(info, function (err, lesson) {
        console.log(err);
    });


    req.flash('success_msg', 'Lesson Updated');
    res.redirect('/instructors/classes/'+req.params.id+'/lessons');
});

//delete lesson
router.get('/classes/:id/lessons/:lesson_id/delete', function (req, res, next) {
  
    // Get Values
    var info = [];
    info['class_id'] = req.params.id;
    info['lesson_id'] = req.params.lesson_id;

    Class.deleteLesson(info, function (err, lesson) {
        console.log(err);
    });


    res.status(200).send();
    req.flash('success_msg', 'Lesson Deleted');
    res.redirect('/instructors/classes/');
});





module.exports = router;