const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
require('./db.js');
const userrecord = [];


function initialize(passport, getUserByEmail, getUserById){
    const authenticateUser = async (email, password, done) => {
        console.log("The email is : " + email);
        
        
        const user = getUserByEmail(email)
        userrecord.push(user);
        
        //Over here: Instead of checking if user == null, check if user is present in the Users database
        if (user === undefined){
            console.log("No user with this email");
            return done(null, false, {message: "No user with this email"})
        }

        try{
            if (await bcrypt.compare(password, user.password)){
                return done(null, user)
            } else{
                return done(null, false, {message : "Password incorrect"})
            }
        } catch(e) {
            return done(e)
        }
    }



passport.use(new localStrategy({usernameField: "email"},
authenticateUser))
passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
})
}

module.exports = {
    initialize: initialize,
    userrecord: userrecord
}