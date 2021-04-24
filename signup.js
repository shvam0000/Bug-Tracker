const express = require('express')
const bodyParser = require('body-parser')

const app = express()

function createdb() {
    const MongoClient = require('mongodb').MongoClient;
    const uri = 'mongodb+srv://admin:admin@node-rest-shop.5kcqy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
    const client = new MongoClient(uri, {useNewUrlParser: true});
    client.connect(err => {
        const collection = client.db('test').collection(devices);
        client.close();
    })
}
var db

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(express.static(__dirname, '/public'));

app.get('/', (req, res, next)=> {
    db.collection('data').find().toArray((err, result) => {
        if (err) return console.log(err);
        res.render('login.ejs', {quotes: result})
    })
})

// app.post('/data', (req, res, next) => {
//     db.collection('data').findOne({username: req.body.username, password: bcrypt.hash(req.body.password, 10)}, (err, result) => {
//         if (err) {
//             return console.log(err);
//         } if(!result) {
//             console.log('Username and password fault');
//             res.redirect('/')
//             alert('No such account found')
//         } else {
//             console.log(req.body.username + ' was found');
//             res.render('main.ejs')
//             return res.send()
//         }
//     })
// })

app.post('/data', (req, res, next) => {
    db.collection('data').findOne({
        username: req.body.username,
        password: bcrypt.hash(req.body.password, 10, (err, hash) => {
            if(err) {
                console.log(err);
            } 
        })
    }, (err, result) => {
        if (err) {
            return console.log(err);
        } if(!result) {
            console.log('Username and password fault');
            res.redirect('/')
            alert('No such account found')
        } else {
            console.log(req.body.username + ' was found');
            res.render('main.ejs')
            return res.send()
        }
    })
})