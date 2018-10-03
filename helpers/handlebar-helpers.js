module.exports = {

    equals: function (type, options) {
        if (type === 'student') {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    },

    equalt: function (type, options) {
        if (type === 'instructor') {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    }

}