const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();
const MongoClient = require('mongodb').MongoClient;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var validator = require('validator');

//Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));




app.use(express.static('public'));


app.get('/', (req, res) => {
    res.render('index.ejs');
   // res.sendFile(path.join(__dirname, 'login.html'));
});
//redirects view to login.html
app.get('/login', (req, res) => {
    res.sendFile('login.html',{root: __dirname});
});


app.post('/login', (req, res) => {
   
    console.log(req.body.userid);
    console.log(req.body.pwd);
    //check if the username is admin and password is Admin@123
    if(req.body.userid=='admin'&&req.body.password=='Admin@123')
    {
        console.log("Succesfully Logged In!!");
        res.redirect('/admin');
    }
    else{ 
        console.log("Wrong username or password.");
        res.end("Wrong username or password.");
    }
});




app.get('/register', (req, res) => {
    console.log("Working");
    res.render('register.ejs');
    //res.sendFile('admin.html',{root: __dirname});
});


app.get('/post-register',(req,res)=>{
    console.log("Working");

    
    res.render('register.ejs');

});
app.post('/register',(req,res)=>{
    console.log("Working");
    res.render('register.ejs');

});

app.post('/post-register',(req,res)=>{
    console.log("Mst kam kar ra");


    var url = "mongodb://sidgore:sidgore@sidmongo-shard-00-00-uesva.mongodb.net:27017,sidmongo-shard-00-01-uesva.mongodb.net:27017,sidmongo-shard-00-02-uesva.mongodb.net:27017/Zeppelin?ssl=true&replicaSet=SidMongo-shard-0&authSource=admin";
	var obj = {
        firstname: req.param("firstname"),
		lastname: req.param("lastname"),
		email: req.param("email"),
		password: req.param("password")
		
    };
    
    MongoClient.connect(url, (err, db) => {
		if (err) return console.log(err);
		db.collection('Zeppelin').save(obj, (err, result) => {
			if (err) return console.log(err)

			console.log('saved to database')
			res.redirect('/')
		});

    });
});


app.get('/lisOfUsers',(req,res)=>{
    console.log("Working");
    var url = "mongodb://sidgore:sidgore@sidmongo-shard-00-00-uesva.mongodb.net:27017,sidmongo-shard-00-01-uesva.mongodb.net:27017,sidmongo-shard-00-02-uesva.mongodb.net:27017/Zeppelin?ssl=true&replicaSet=SidMongo-shard-0&authSource=admin";
	
    MongoClient.connect(url, (err, db) => {
		if (err) return console.log(err);



		db.collection("Zeppelin").find().toArray((err, result) => {
            if (err) throw err;
        
            


			console.log(result);

		
		
			res.render('listOfUsers.ejs', {users: result });
	

		});
	});

   

});



//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));