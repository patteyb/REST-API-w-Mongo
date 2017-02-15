/** 
 * SEED.JS
 *
 * @author: Pattey Bleecker
 * Date:    February 15, 2017
 * For:     teamTreehouse Project 11, Build a RESTful API
 * 
 * Seeds the database with initial data
 */
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