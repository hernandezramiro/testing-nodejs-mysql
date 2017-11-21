// Module dependencies
var express = require('express');
var mysql = require('mysql');
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const hbs = require("hbs");

// Application initialization
var connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'jessicazuniga',
    database: 'testingnode20171016'
});

const port = process.env.PORT || 3000;
var app = express();

app.set("view engine", "hbs");

//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Main route sends our HTML file
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// Main route sends our HTML file
app.get('/login', function (req, res) {
    res.sendFile(__dirname + '/views/login.html');
});

app.post('/users', function (req, res) {

    var password = '';

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            password = hash;

            var sql = 'INSERT INTO users (FirstName, LastName, Email, Password, Active) VALUES ("'
                + req.body.firstName + '","' + req.body.lastName + '","'
                + req.body.email + '","' + password + '","1")';
            connection.query(sql, function (err, result) {
                if (err) {
                    throw err;
                }
                //res.sendFile(__dirname + '/views/insertSuccess.html');
                res.render("insertSuccess.hbs", {
                    email: req.body.email,
                    password: req.body.password
                });
            });
        });
    });
});

app.post('/login', function (req, res) {
    var sql = 'SELECT * FROM users WHERE Active = "1" AND Email = "' + req.body.email + '"';
    connection.query(sql, function (err, result) {
        if (err) {
            throw err;
        }

        if (result.length > 0) {
            bcrypt.compare(req.body.password, result[0].Password, (err, resbcrypt) => {
                if (resbcrypt) {
                    //res.sendFile(__dirname + '/views/insertSuccess.html');
                    res.render("insertSuccess.hbs", {
                        email: result[0].Email,
                        password: result[0].Password
                    });
                } else {
                    res.sendFile(__dirname + '/views/errorPage.html');
                }
            });
        }
    }
    );
});

// Begin listening
app.listen(port, () => {
    console.log(`The server is up on port ${port}`);
});
