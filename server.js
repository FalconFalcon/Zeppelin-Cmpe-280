const express = require('express');
const session = require('client-sessions');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();

const monk = require('monk');
const var2 = "sidgore:sidgore@sidmongo-shard-00-00-uesva.mongodb.net:27017,sidmongo-shard-00-01-uesva.mongodb.net:27017,sidmongo-shard-00-02-uesva.mongodb.net:27017/Zeppelin?ssl=true&replicaSet=SidMongo-shard-0&authSource=admin";
const db1 = monk(var2);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var validator = require('validator');

//Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    cookieName: 'session',
    secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    httpOnly: true,
    secure: true,
    ephemeral: true
}));


app.use(express.static('public'));

app.use(function (req, res, next) {
    req.db1 = db1;
    next();
}
);


app.use(function (req, res, next) {

    if (req.session && req.session.user) {

        var db = req.db1;

        db.collection("Zeppelin").findOne({ email: req.session.user.email }, function (err, user) {
            if (user) {
                req.user = user;
                delete req.user.password; // delete the password from the session
                req.session.user = user;  //refresh the session value
                res.locals.user = user;
            }

            next();

        });
    } else {
        next();
    }
});


app.get('/', (req, res) => {
    if (req.session && req.session.user) {
        res.redirect('/dashboard');
    }
    else {
        res.render('index.ejs', { error: '' });
    }

});


app.post('/', (req, res) => {
    res.render('index.ejs', { error: 'Invalid email or password.' });

});
app.get('/login', (req, res) => {
    res.render('index.ejs', { error: '' });

});

app.post('/login', (req, res) => {

    var db = req.db1;
    var query = {
        email: req.body.email,
        password: req.body.password

    };



    db.collection("Zeppelin").findOne(query, (err, user) => {

        if (!user) {
            console.log("Ffffffffffffff");
            res.render('index.ejs', { error: 'Invalid email or password.' });
        }

        else {
            if (req.body.password === user.password) {
                // sets a cookie with the user's info
                req.session.user = user;
                res.redirect('/dashboard');
            }


            else {
                res.render('index.ejs', { error: 'Invalid email or password.' });
            }

        }




    });

});

app.get('/dashboard', requireLogin, function (req, res) {
    res.render('user-dashboard.ejs');
});


function requireLogin(req, res, next) {
    if (!req.user) {
        res.redirect('/login');
    } else {
        next();
    }
};


app.get('/register', (req, res) => {
    console.log("Working");
    res.render('register.ejs');
    //res.sendFile('admin.html',{root: __dirname});
});



app.post('/register', (req, res) => {
    console.log("Working");
    res.render('register.ejs');

});

app.post('/post-register', (req, res) => {

    var db = req.db1;
    var obj = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password

    };


    db.collection('Zeppelin').insert(obj, (err, result) => {
        if (err) return console.log(err)

        console.log('saved to database')
        res.render('index.ejs', { error: 'User Succesfully Registered!!Log in!!' })
    });


});


app.get('/lisOfUsers', (req, res) => {
    console.log("Working");
    var db = req.db1;



    var collection = db.get('Zeppelin');

    collection.find({}, {}, (e, result) => {
        if (e) throw e;
        res.render('listOfUsers', {
            users: result
        });
    });



});


app.get('/update-user', (req, res) => {

    if (req.session) { res.redirect('/dashboard'); }
    else { res.render('index.ejs', { error: '' }); }

});



app.post('/update-user', (req, res) => {
    var db = req.db1;

    var query = { email: req.body.email };
    var user = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password
    };



    db.collection("Zeppelin").update(query, user, function (err, result) {
        if (err) throw err;


        db.close();
    });




    db.collection("Zeppelin").findOne(query, (err, result) => {
        if (err) throw err;

        console.log(result.password);

        db.close();
        res.render('user-dashboard.ejs', { user: result })



    });


});


app.post('/delete-user', (req, res) => {

    var db = req.db1;
    var query = { email: req.body.email };




    db.collection("Zeppelin").remove(query, (err, result) => {
        if (err) throw err;

        console.log("1 document deleted");
        db.close();
    });
    res.render('index.ejs', { error: '' });






});

app.get('/logout', (req, res) => {
    req.session.reset();
    res.redirect('/');

});



//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));