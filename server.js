const fs = require('fs');
const http = require('http');
const url = require('url');
const qstring = require('querystring');
const express = require('express');
const jade = require('pug');
const LOGIN = 'Login';
const CREATE = 'Create';

var app = express();
var session = require('express-session');
//var cookieParser = require('cookie-parser');
app.set('news', './news');
app.set('view engine', 'jade');
app.engine('jade', jade.__express);
app.listen(8080);

var firebase = require("firebase");

var config = {
    apiKey: "AIzaSyCTMUtfwd3jr4BCPQLeajXCpqfdd-lX7Eo",
    authDomain: "learnlive-f6376.firebaseapp.com",
    databaseURL: "https://learnlive-f6376.firebaseio.com",
    projectId: "learnlive-f6376",
    storageBucket: "learnlive-f6376.appspot.com",
    messagingSenderId: "749566368306"
  };
firebase.initializeApp(config);



app.get('/', function (req, res) {
	
	res.render('login');
});

app.post('/login', function (req,res) {
	
	var bodyData = '';
	req.on('data', function (chunk) {
		bodyData += chunk.toString();
	});
	req.on('end', function () {
		
		var postData = qstring.parse(bodyData);
		console.log(postData);
		var email = postData['email'];
		var password = postData['password'];
		var action = postData['submit'];
		
		if(action == LOGIN){
		
			firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
				// Handle Errors here.

				res.send(errorMessage);
				// ...
			});
			//respind with lading page 
			res.send('We done');
		}
		else{
			//we want to create a new user 
			console.log('ok');
			res.render('Create');
		}
		
	});
	
});

app.post('/Create',function (req,res){
	
	
	var bodyData = '';
	req.on('data', function (chunk) {
		bodyData += chunk.toString();
	});
	req.on('end', function () {
		
		var postData = qstring.parse(bodyData);
		console.log(postData);
		var email = postData['email'];
		var password = postData['password'];
		firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			res.send(errorMessage);
		});
		
		res.send('We in boi');

	});
	
		
});