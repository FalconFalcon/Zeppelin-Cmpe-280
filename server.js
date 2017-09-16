const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();
const sessions=require('express-session');
var validator = require('validator');
var session;



// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));



app.use(express.static('public'));


app.use(sessions({
    secret:'123456',
    resave:false,
    saveUninitialized:true
}))



// Send all other requests to the Angular app


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});
app.get('/login', (req, res) => {
    res.sendFile('login.html',{root: __dirname});
});


app.post('/login', (req, res) => {
    session=req.session;
    console.log(req.body.userid);
    console.log(req.body.pwd);
    if(req.body.userid=='admin'&&req.body.password=='Admin@123')
    {
        console.log("Succesfully Logged In!!");
        res.redirect('/admin');
    }
    else{ 
        console.log("Wrong username or password.");
        res.redirect('/login');
    }
});

app.get('/admin', (req, res) => {
    res.sendFile('admin.html',{root: __dirname});
});


//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));