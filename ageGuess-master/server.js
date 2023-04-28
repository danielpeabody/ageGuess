const mongoose = require("mongoose");
const express = require('express');
const path = require('path');
const app = express(); 
var qs = require('querystring');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const hostname = '127.0.0.1';
const port = 3000;



mongoose.set('strictQuery', false);

const mongoDB ='mongodb+srv://doadmin:8IVM69G1KCtq4325@finalproj-beb76a02.mongo.ondigitalocean.com/admin?tls=true&authSource=admin&replicaSet=finalproj';

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    topCelebScore: Number
});

const celebimageSchema = new mongoose.Schema({
    person: String,
    birthYear: Number,
    datePhotoTaken: Number,
    filename: String,
    data: Buffer,
});

const athleteimageSchema = new mongoose.Schema({
  person: String,
  birthYear: Number,
  datePhotoTaken: Number,
  filename: String,
  data: Buffer,
});

const communityimageSchema = new mongoose.Schema({
  person: String,
  age: Number,
  datePhotoTaken: Number,
  filename: String,
  data: String,
});

const celebImage = mongoose.model('celebImage', celebimageSchema);
const athleteImage = mongoose.model('athleteImage', athleteimageSchema);
const communityImage = mongoose.model('communityImage', communityimageSchema);
const users  = mongoose.model('user', userSchema);


app.use(express.static(path.join(__dirname, '/public-html')));

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

app.post('/account/login/', async function(req, res){
  let username = req.body.username;
  let password = req.body.password;
  let curUser = users.find({username: username, password: password}).exec();
  if((await curUser).length > 0){
    let cookie = createCookie(username);
    res.cookie('user', cookie);
    res.send("success");
  }
  else{
    res.send("failure");
  }
});

app.get('/account/create/:username/:password', (req, res) => {
  console.log("account")
  let p1 = users.find({username: req.params.username}).exec();
  p1.then( (results) => { 
    if (results.length > 0) {
      res.end('That username is already taken.');
    } else {

      var newUser = new users({ 
        username: req.params.username,
        password: req.params.password
      });
      newUser.save().then( (doc) => { 
          res.end('Created new account!');
        }).catch( (err) => { 
          console.log(err);
          res.end('Failed to create new account.');
        });
    }
  });
  p1.catch( (error) => {
    res.end('Failed to create new account.');
  });
});


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
app.get('/get/image/:mode', function(req, res){
  let image = null;
  if(req.params.mode == "celeb"){
    image = celebImage.aggregate([{ $sample: { size: 1 } }]);
  }
  else if(req.params.mode == "athlete"){
    image = athleteImage.aggregate([{ $sample: { size: 1 } }]);
  }
  else{
    image = communityImage.aggregate([{ $sample: { size: 1 } }]);
  }
  image.then(function(docs){
    
    const data = {
      filename: docs[0].filename,
      pic: docs[0].data,
      name: docs[0].person,
      dateTaken: docs[0].datePhotoTaken,
    }

    res.end(JSON.stringify(data));
    // length = docs.length;
    // let rand = Math.floor(Math.random() * length);
    // console.log(docs[rand].person);
    // res.set('Content-Type', 'application/octet-stream');
    // res.end(docs[rand].data);
  });
})

app.post('/upload/image', function(req, res){
  console.log(req.body);
  data = req.body;
  let file = data.file;
  let name = data.name;
  let ageInPhoto = data.ageInPhoto;
  console.log(ageInPhoto);
  let datePhotoTaken = data.datePhotoTaken;
  // upload image to mongoDB
  let newImage = new communityImage({
    person: name,
    age: ageInPhoto,
    datePhotoTaken: datePhotoTaken,
    filename: genRandStr(),
    data:file
  });
  newImage.save().then(function(doc){
    res.end("success");
  }).catch(function(err){
    res.end("fail");
  });
});

function genRandStr() {
  let result = "";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charsLen = chars.length;
  
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * charsLen));
  }
  
  return result;
}


/*This function searches for the image by the object id passed in then it checks the users
guess passed in against the age in the database*/
app.post('/check/guess', function(req, res){
  let filename = req.body.filename;
  let guess = parseInt(req.body.guess);
  let curScore = parseInt(req.body.score);
  let image = celebImage.findOne({filename: filename}).exec();
  image.then(function(doc){
    const age = doc.datePhotoTaken - doc.birthYear;
    if(guess == age){
      data = {checkedGuess: "correct", curScore: curScore + 1};
      res.end(JSON.stringify(data));
    }
    else if((age - 5) <= guess && guess <= (age + 5)){
      res.end("close");
    }
    else{
      res.end("incorrect");
    }
  });
});


app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});