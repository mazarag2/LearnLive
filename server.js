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

var database = firebase.database();

app.get('/', function (req, res) {
	
	res.render('login');
});

app.post('/index', function (req,res) {
	
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
		
		firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
			// Handle Errors here.
			console.log(error.code);
		});
		
		//We need to wait until this is done before any other event is added 
		setTimeout(function(){
			
			var ref = database.ref("Users/");

			ref.orderByChild("email").equalTo(email).on("child_added", function(data) {
				console.log(data.val().firstname);
				var name = data.val().firstname;
				res.render('index',{name : name});
			})
			
			
		},1000);

	});

});

app.get('/CreateUser',function (req,res){
	
	
	res.render('Create');
	
		
});
app.post('/CreateUser',function (req,res){
	
	var bodyData = '';
	req.on('data', function (chunk) {
		bodyData += chunk.toString();
	});
	req.on('end', function () {
		
		var postData = qstring.parse(bodyData);
		console.log(postData);
		var email = postData['email'];
		console.log(email);
		var password = postData['password'];
		var firstName = postData['firstname'];
		var lastName = postData['lastname'];
		console.log(password);
		firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
			
			var errorCode = error.code;
			var errorMessage = error.message;
			console.log(errorMessage + errorCode);

		});
		firebase.auth().onAuthStateChanged(function(user) {
		  if (user) {
			
			var ref = database.ref('Users');
			var id = ref.push();
			id.set({
				firstname: firstName ,
				lastname : lastName ,
				email : email
			})
			
		  } else {
			// User is signed out.
			// ...
		  }
		});



		//store first and last name in FIrebase DB 

				
		res.redirect('/');
	});
});
