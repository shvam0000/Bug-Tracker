const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const multer = require('multer');

const app = express();

const MongoClient = require('mongodb').MongoClient;

var db
var user = null;

var storage = multer.diskStorage({
    diskStorage: function(req, file, cb) {
        cb(null, 'public/files/')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage: storage
})

const uri = 'mongodb+srv://Hack:test@database.y1m2l.mongodb.net/<dbname>?retryWrites=true&w=majority'
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
client.connect(err => {
    db = client.db('test');
    console.log('connected');
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res, next) => {
    res.render('index');
})

app.get('/index', (req, res, next) => {
    res.render('index');
})

app.get('/signup', (req, res, next) => {
    res.render('signup')
})

app.get('/login', (req, res, next) => {
    res.render('login', {x: ''})
})

app.get('/main', (req, res, next) => {
    db.collection('items').find().toArray((err, result) => {
        if(err) return console.log(err)

        res.render('main', {
            items: result
        })
    })
})

app.post('/signup', (req, res, next) => {
    db.collection('signup').save(req.body, (err, result) => {
        if (err) {
            res.redirect('/signup');
            console.log(err);
        }
        console.log('saved to database');
        res.redirect('/login');    
    })
})

app.post('/logindata', (req, res, next) => {
    db.collection('signup').findOne({username: req.body.username, password: req.body.password}, (err, result) => {
        if(err) {
            return console.log(err);
        } if(!result) {
            res.render('login', {x: 'Username or password fault'});
            res.end();
            return console.log('Username or password fault');
        } else {
            user = req.body.username;
            console.log((req.body.username + ' was logged in successfully'));
            res.redirect('/main')
            return res.send()
        }
    })
})

app.post('/add', (req, res, next) => {
    db.collection('items').insertOne(req.body.item, (err, result) => {
        if(err) {res.json(err)}
        else {
            console.log(result);
            res.redirect('/main')
        }
    })
})

app.post('/logout', (req, res, next) => {
    user = null;
    res.redirect('/login');
})

app.listen(process.env.PORT || 3000, () => {
    console.log('listening on 3000');
})

client.close();     