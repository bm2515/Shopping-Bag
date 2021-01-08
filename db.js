//Code to connect to our database
//Our schema

const mongoose = require('mongoose');


// is the environment variable, NODE_ENV, set to PRODUCTION? 
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 const fs = require('fs');
 const path = require('path');
 const fn = path.join(__dirname, 'config.json');
 const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 const conf = JSON.parse(data);
 dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/bm2515';
}

const ItemsSchema = new mongoose.Schema({
    ItemName: {type: String, required: true}
,
    Seller_ID: {type: String, required: true}
,
    Price: {type: Number, required: true}
,
    Description: {type: String, required: true}
});


const UserSchema = new mongoose.Schema({
    id: {type: String, required: true}
,
    name: {type: String, required: true}
,
    email: {type: String, required: true}
,
    password: {type: String, required: true}
});


const UserDashboard = new mongoose.Schema({
    ItemName: {type: String, required: true}
,
    Seller_ID: {type: String, required: true}
,
    Price: {type: Number, required: true}
,
    Description: {type: String, required: true}

});

mongoose.model('Item', ItemsSchema);
mongoose.model('User', UserSchema);
mongoose.model('Dashboard', UserDashboard);
mongoose.connect(dbconf);