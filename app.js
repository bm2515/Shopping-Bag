const mongoose = require('mongoose');
require('./db.js');

if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}
const path = require('path');
const express = require("express")
const app = express()
const bcrypt = require('bcrypt')
const passport = require("passport")
const flash = require("express-flash")
const session = require("express-session")
const methodOverride = require('method-override')


const passport_config = require('./passport-config')
passport_config.initialize(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

//constructors
const users = []
var currentuser;
var currenuseremail;
const itemsPurchased = []
const userItemsList = []
const Item = mongoose.model('Item');
const User = mongoose.model('User');
const Dashboard = mongoose.model('Dashboard');

app.set('view-engine', 'hbs')
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

//userItemsList.push( ['bm2515@nyu.edu',[{"ItemName" : "FishFillet", "Seller_ID" : "bilal", "Price" : "220", "Description" : "A Very Tasty Fish!" },
//{"ItemName" : "ps4", "Seller_ID" : "uzar", "Price" : "2320", "Description" : "A ps4!" }] ] ); 


app.post('/purchased', (req, res) =>{
  //Testiing
  console.log("this is an xhr test!");
  const item = Item.findOne({'ItemName': req.body.ItemName});
  console.log("the item fetched is: ");
const itemp = new Item({
ItemName: req.body.ItemName,
Seller_ID: req.body.ItemSeller,
Price: req.body.Itemprice,
Description: req.body.ItemDecp});
console.log(itemp);
itemsPurchased.push(itemp);
currentuser = passport_config.userrecord[passport_config.userrecord.length - 1];
console.log("CURRENT USER IS: ");
console.log(currentuser);
console.log("CURENT USER EMAIL IS: ");

currentuseremail = currentuser.email;
console.log(currentuseremail);
const userRecordPushed = []
userRecordPushed.push(currentuseremail);
userRecordPushed.push(itemp);

userItemsList.push(userRecordPushed);
console.log("NOW WITHSTANIND USER LIST WITH ALL PURCHASES ARE: ");
console.log(userItemsList);

mongoose.model("Item").remove({ItemName:req.body.ItemName}, function(err, delData){
console.log("data has been deleted!");
console.log(delData);
//alert(location); 

Item.find({}, (err, result2) => {
                if (err){
                        console.log(err)

}
//location.assign("http://linserv1.cims.nyu.edu:23509/");
//console.log(result2)
    res.render('index2.hbs', {items: result2});
});
//location.assign("http://linserv1.cims.nyu.edu:23509/");
});
//location.assign("http://linserv1.cims.nyu.edu:23509/");

});

app.get('/postadd', checkAuthenticated, (req, res) =>{
  res.render('postadd.hbs');
})
app.get('/', checkAuthenticated, (req, res) => {
  console.log("user test record: ");
  console.log(passport_config.userrecord);
  console.log("The items list is: ");
  console.log(userItemsList);
  //you can have user record over here ---> That's fine

  Item.find({}, (err, result) => {
          //console.log(result);
          if (err){
                  console.log(err)
                                  }
                      //const result2 = [{"ItemName" : "FishFillet", "Seller_ID" : "bilal", "Price" : "220", "Description" : "A Very Tasty Fish!" },
                      //{"ItemName" : "ps4", "Seller_ID" : "uzar", "Price" : "2320", "Description" : "A ps4!" }];
  //Here all the filtering will occur



res.render('index.hbs', {items: result});
});
});

app.post('/postadd', checkAuthenticated, (req, res) => {

  const record = new Item({
ItemName: req.body.ItemName,
Seller_ID: req.body.Seller_ID,
Price: req.body.Price,
Description: req.body.Description});
record.save();
res.redirect('/postadd');
});


app.post('/query', (req, res) => {

Item.find({}, (err, result) => {
          if (err){
                  console.log(err)
                      }
    result = result.filter(result => result.ItemName.toLowerCase() == req.body.itemName.toLowerCase())
  console.log(result);
  const mgs=''
  if (result.length > 0){
  msg = "Here's your filtered result";
}
else{
msg = "Ops! Nothing Found!"
}
res.render('query.hbs', {items: result,
                          message:msg});
                        });

                      });
                      
    
    
    app.get('/mydashboard', checkAuthenticated, (req, res) => {
    //simply use find to figure out the user with given email address
    currentuser = passport_config.userrecord[passport_config.userrecord.length - 1];
    currentuseremail = currentuser.email;
    console.log("curren user email is: ");
    console.log(currentuseremail);
    
    let array= [];
    for (var i = 0; i < userItemsList.length; i++){
      if (userItemsList[i][0] === currentuseremail){
            console.log("indeed enters true statement!!!");
        array.push(userItemsList[i][1]);
    
      }
    
    }
    
    
    console.log("IN DASHBOARD: USER ITEM LIST ");
    console.log(userItemsList);
    console.log("My dahsboad array is: IN DASHBOARD IS ");
    
    
    res.render('dashboard.hbs', {items: array})
    });
    
    app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    }))
    
    app.get('/login',checkNotAuthenticated, (req, res) =>{
    res.render('login.hbs', {user_: users})
    })
    
    app.get('/register', checkNotAuthenticated, (req, res) =>{
      res.render('register.hbs')
    })
    app.post('/register', checkNotAuthenticated, async (req, res) =>{

      try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const myid = Date.now().toString();
      
        users.push({
          id: myid,
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword
        })
      
        const myuser = new User({
          id: myid,
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword
        });
      
      myuser.save();
      
      res.redirect('/login')
      } catch{
      res.redirect('/register')
      }
      })
      
      
      function checkAuthenticated(req, res, next){
        if (req.isAuthenticated()){
          return next()
        }
        res.redirect('/login')
      }
      
      app.delete('/logout', (req, res) => {
        req.logOut()
        res.redirect('/login')
      })
      function checkNotAuthenticated(req, res, next){
        if (req.isAuthenticated()){
          return res.redirect('/')
        }
        next()
      }
      app.listen(process.env.PORT || 3000);                                              