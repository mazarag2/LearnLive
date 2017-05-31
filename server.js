const fs = require('fs');
const http = require('http');
const url = require('url');
const qstring = require('querystring');
const express = require('express');
const jade = require('pug');



// This template root is for our homegrown templates
var usernameDict = { username: "Jane Doe", role: "Guest" };
var app = express();
var session = require('express-session');
//var cookieParser = require('cookie-parser');
app.set('news', './news');
app.set('view engine', 'jade');
app.engine('jade', jade.__express);
app.listen(8080);
app.locals.username = usernameDict.username;
app.locals.role = usernameDict.role;


var firebase = require("firebase");
/*
var serviceAccount = require("serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://learnlive-f6376.firebaseio.com"
});
*/

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

		//var fileNames = readNewsDirSync();
		//app.locals.fileNames = fileNames;
		//res.render("landing",{fileNames : fileNames});	
			res.render('login');
});

app.post('/login', function (req,res) {
	
	var bodyData = '';
	req.on('data', function (chunk) {
		bodyData += chunk.toString();
	});
	req.on('end', function () {
		
		var postData = qstring.parse(bodyData);
		var role = postData['role'];
		var email = postData['username'];
		var password = postData['password'];
		
		firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			res.render(errorMessage);
			// ...
		});
		console.log('we in');
		/*
		usernameDict.role = postData['role'];
		usernameDict.username = postData['username'];
		app.locals.username = username;
		app.locals.role = role;
		*/
		
		//var pageToRender = getLoginPage(username,password,role);
		
		//render login page 
		
		//res.render(pageToRender,{fileNames : fileNames});

	});
	
	
	
});


app.get('/create', function(req,res){
	
	res.render('create');
	
	
});
	

app.post('/Create',function (req,res){
	
	
	
	app.locals.Articles = fileNames;
	res.render("CreateUser");
	/*
	var bodyData = '';
	req.on('data', function (chunk) {
		bodyData += chunk.toString();
	});
	req.on('end', function () {
		
		var postData = qstring.parse(bodyData);
		var role = postData['role'];
		var username = postData['username'];
		var password = postData['password'];
		usernameDict.role = postData['role'];
		usernameDict.username = postData['username'];
		app.locals.username = username;
		app.locals.role = role;
		
		var pageToRender = getLoginPage(username,password,role);
		
		res.render(pageToRender,{fileNames : fileNames});

	});
	*/
		
});