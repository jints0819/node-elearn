if (process.env.NODE_ENV === 'production') {

    module.exports = require('./prod_database');

} else {

    module.exports = require('./dev_database');

}
