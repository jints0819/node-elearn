var express = require('express');
var router = express.Router();

Class = require('../models/class');
Student = require('../models/student');
User = require('../models/user');
Comment = require('../models/comment');


router.get('/classes', function (req, res, next) {
    Student.getStudentByUsername(req.user.username, function (err, student) {
        if (err) throw err;
        res.render('students/classes', { student: student });
    });
});


// register class
router.post('/classes/register', function (req, res) {
    /* Get Values
    var userid = req.user.id;
    var class_id = req.body.class_id;
    var class_title = req.body.class_title;

    Student.findOne({ username: req.user.username }).then(students => {


        students.classes.push({'_id':class_id, class_title:class_title});
        console.log('student:'+ students);
        console.log('class_id:' + class_id);

        students.save().then(saveclass => {
            req.flash('success_msg', 'You are now registered');
            res.redirect('/students/classes');
            });

    }).catch(error => {
        console.log(error);
        });
    */
    
    info = [];
    info['student_username'] = req.user.username;
    info['class_id'] = req.body.class_id;
   info['class_title'] = req.body.class_title;

   console.log(info);

    Student.register(info, function (err, student) {
        if (err) throw err;
        console.log(student);
    });

    req.flash('success_msg', 'You are now registered');
    res.redirect('/students/classes');

   
});


//add comment
router.get('/classes/:id/comment', function (req, res, next) {
    res.render('students/addcomment', {
        class_id: req.params.id,
        username: req.user.username
    });
});

router.post('/classes/:id/comment', function (req, res, next) {
    // Get Values
    var userid = req.user.id;
    var comment_title=  req.body.comment_title;
    var comment_body = req.body.comment_body;


        Class.findOne({ _id: req.params.id }).then(classes => {
            var newComment = new Comment({
                user: userid,
                title: comment_title,
                body: comment_body
            });

            classes.comments.push(newComment);
            classes.save().then(saveclass => {
                newComment.save().then(saveComment => {
                    req.flash('success_msg', 'Comment Added');
                    res.redirect('/classes/' + req.params.id+ '/details');

                });
            });

        }).catch(error => {
            console.log(error);
            });
});


//view all comments
router.get('/comments', function (req, res, next) {

    User.findOne({ username: req.user.username })
        .then(users => {
           


            Comment.find({ user: users._id }).then(findcomment => {
                console.log(findcomment);

                res.render('students/comments', { comments: findcomment });
            });

        }).catch(e => {
            console.log(e);
        });

});  

//delete class
router.delete('/classes/delete/:id/', function (req, res, next) {
    var username = req.user.username;
    var class_id = req.params.id;
    
        Student.findOneAndUpdate(
            {username: username },
            {
                $pull: { 'classes': { '_id': class_id } }
            }).catch(e => {
                console.log(e);

            });

    res.status(200).send();

    req.flash('success_msg', 'Class Deleted');

});



//delete comment
router.delete('/classes/comment/delete/:id/', function (req, res, next) {

    console.log('tesst' + req.params.id);

    Comment.remove({ _id: req.params.id }).then(updateclass => {
        Class.findOneAndUpdate(
            { comments: req.params.id },
            {
                $pull: { comments: req.params.id }
            }, (err, data) => {
                if (err) console.log(err);
            });

        res.status(200).send();
        req.flash('success_msg', 'Comment Deleted');

    });

});

module.exports = router;