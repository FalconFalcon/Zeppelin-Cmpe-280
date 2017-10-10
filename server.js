const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const jquery=require('jquery');
const app = express();

var validator = require('validator');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static('js'));


app.use(express.static('public'));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});
app.get('/login', (req, res) => {
    res.sendFile('login.html',{root: __dirname});
});


app.post('/login', (req, res) => {
   
    console.log(req.body.userid);
    console.log(req.body.pwd);
    if(req.body.userid=='admin'&&req.body.password=='Admin@123')
    {
        console.log("Succesfully Logged In!!");
        res.redirect('/register');
    }
    else{ 
        console.log("Wrong username or password.");
        res.redirect('/login');
    }
});
app.post('/register',(req,res)=>{
    console.log("shilpa");
     res.redirect('/register');
});
app.get('/admin', (req, res) => {
    res.sendFile('admin.html',{root: __dirname});
});
app.get('/contacts', (req, res) => {
    res.sendFile('contacts.txt',{root: __dirname});
});
//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);



const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));