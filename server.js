const mongoose = require("mongoose");
const express = require('express');
const path = require('path');
const app = express(); 
var qs = require('querystring');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const hostname = '188.166.166.187';
const port = 5000;



mongoose.set('strictQuery', false);

const mongoDB = 'mongodb+srv://doadmin:8Hs65792U3ALVxy0@ostaa-648ba59f.mongo.ondigitalocean.com/admin?tls=true&authSource=admin&replicaSet=ostaa';


main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

app.use(express.static(path.join(__dirname, '/public_html')));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(cookieParser());

app.get('/', function(req, res){
    res.statusCode = 200;
    res.redirect('index.html');
})

// This app.get(/login/user) logs a user in based on the username and password
// sent in the body of the request. The function calls checkUser() to see if
// the user exists in the database. If the user exists then the function 
app.get('/login/user', function(req, res){

});


function checkUser(username, password){
/*This function checks to see if a user exists in mongodb database and
returns true or false if it is found*/
  let curUser = Users.find({username: username, password: password}).exec();
  curUser.then(function(docs){
    if(docs.length > 0){
      return true;
    }
    else{
      return false;
    }
  });

}

function saltAndHash(password){
/*This function takes in the passed in password then salts and hashes it and returns
the new salted and hashed password*/ 
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);
  return hash;
}

/*This function creates a cookie based on the currrent user.
 Then it sets a expiration date for the cookie that is 20 minutes from the current time
 then returns the cookie*/
function createCookie(username){
  let cookie = username + Date.now();
  let date = new Date();
  date.setTime(date.getTime() + (20 * 60 * 1000));
  let expires = "expires=" + date.toUTCString();
  return cookie + ";" + expires + ";path=/";
}



//---------------------------------------------------------------------------------------

/*This function gets a random image from the mongoDB database collection called
Images. Then it send the image back to the client*/
app.get('/get/image', function(req, res){
  let image = Images.find({}).exec();
  image.then(function(docs){
    length = docs.length;
    let rand = Math.floor(Math.random() * length);
    res.end(docs[rand].image);
  });
})

/*This function searches for the image by the object id passed in then it checks the users
guess passed in against the age in the database*/
app.get('/guess/age', function(req, res){
  let id = req.query.id;
  let guess = req.query.guess;
  let image = Images.findOne({_id: id}).exec();
  image.then(function(doc){
    if(guess == doc.age){
      res.end("correct");
    }
    else{
      res.end("incorrect");
    }
  });
});


app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});