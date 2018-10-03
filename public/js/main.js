$(document).ready(function () {
    $('.delete-class').on('click', function () {
        var id = $(this).data('id');
        var url = '/instructors/classes/delete/' + id;
        if (confirm('Delete Class ?')) {
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function (result) {
                    window.location = '/instructors/classes/';
                }, error: function (err) {
                    console.log(err);
                }
            });
        }
    });


    $('.delete-class-s').on('click', function () {
        var id = $(this).data('id');
        var url = '/students/classes/delete/' + id;
        if (confirm('Delete Class ?')) {
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function (result) {
                    window.location = '/students/classes/';
                }, error: function (err) {
                    console.log(err);
                }

            });

        }

    });

    $('.delete-comment-s').on('click', function () {
        var id = $(this).data('id');
        var url = '/students/classes/comment/delete/' + id;
        if (confirm('Delete Comment ?')) {
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function (result) {
                    window.location = '/students/comments/';
                }, error: function (err) {
                    console.log(err);
                }
            });
        }
    });

});

