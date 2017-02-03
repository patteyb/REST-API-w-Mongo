'use strict';

var seeder = require('mongoose-seeder');
// Data to seed the database
var data = require('./data/data.json');

seeder.seed(data).then(function(dbData) {
    // The database objects are stored in dbData
    console.log('The database has been seeded.');
}).catch(function(err) {
    // handle error
    if(err) {
        console.log(err);
    }
});