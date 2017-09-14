const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();
const sessions=require('express-session');

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
    //res.end(JSON.stringify(req.body));
    session=req.session;

    console.log(req.body.userid);
    console.log(req.body.pwd);
    if(req.body.userid=='admin'&&req.body.password=='admin')
    {
        console.log("Succesfully Logged In!!");
        res.redirect('/admin');
       // session.id=req.body.userid;
    }
    else res.end('Sorry Wrong Username or Password');
    //res.redirect('/redirects');
});

app.get('/admin', (req, res) => {
    res.sendFile('admin.html',{root: __dirname});
});


//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));