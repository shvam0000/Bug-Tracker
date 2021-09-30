const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const bcrypt = require('bcryptjs');

require('dotenv').config();

const app = express();

const MongoClient = require('mongodb').MongoClient;

var db;
var user = null;

//for file uploads
//multer --> node module for file uploads
var storage = multer.diskStorage({
  diskStorage: function (req, file, cb) {
    cb(null, 'public/files/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

//database connection
const uri = `mongodb+srv://admin:${process.env.MONDODB_PW}@node-rest-shop.5kcqy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect(err => {
  db = client.db('test');
  console.log('connected');
});

//to import templating engine -> EJS
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('public'));

//middleware
app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/index', (req, res, next) => {
  res.render('index');
});

app.get('/signup', (req, res, next) => {
  res.render('signup');
});

app.get('/login', (req, res, next) => {
  res.render('login', { x: '' });
});

//to fetch the data from DB and display it
app.get('/main', (req, res, next) => {
  db.collection('items')
    .find()
    .toArray((err, result) => {
      if (err) return console.log(err);

      res.render('main', {
        items: result,
      });
    });
});

//save user creds in the database
app.post('/signup', (req, res, next) => {
  db.collection('signup').save(req.body, (err, result) => {
    //error handling
    if (err) {
      res.status(302).redirect('/signup');
      console.log(err);
    }
    //if no error
    console.log('saved to database');
    res.status(302).redirect('/login');
  });
});

//this triggers when you submit the login form
app.post('/logindata', (req, res, next) => {
  db.collection('signup').findOne({ username: req.body.username, password: req.body.password }, (err, result) => {
    if (err) {
      return console.log(err);
    }
    if (!result) {
      res.render('login', { x: 'Username or password fault' });
      res.end();
      return console.log('Username or password fault');
    } else {
      user = req.body.username;
      console.log(req.body.username + ' was logged in successfully');
      res.status(302).redirect('/main');
      return res.send();
    }
  });
});

//to store the data in DB
app.post('/add', (req, res, next) => {
  db.collection('items').insertOne(req.body.item, (err, result) => {
    if (err) {
      console.log(err);
      res.json(err);
    } else {
      console.log(result);
      res.status(302).redirect('/main');
    }
  });
});

//to logout the user
app.post('/logout', (req, res, next) => {
  user = null;
  res.redirect('/login');
});

//page not found error
app.get('*', (req, res, next) => {
  res.status(404).render('404');
});

//to start the server
app.listen(process.env.PORT || 3000, () => {
  console.log('listening on 3000');
});

client.close();
