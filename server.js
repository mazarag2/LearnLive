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


/*

	ref - the reference within the Firebase DB Tree  
	email - the email which we want the fristname for

*/

function getFirstNamebyEmail(ref,email){

	return new Promise(function(resolve) {
		
		setTimeout(function() { 
			ref.orderByChild("email").equalTo(email).on("child_added", function(data) {
				name = data.val().firstname;
				resolve(name);
		});
		},2000);
	});
}


app.get('/', function (req, res) {
	
	res.render('login');
});

app.post('/', function (req,res){
	
	firebase.auth().signOut().then(function() {
		// Sign-out successful.
		res.render('login');
		}).catch(function(error) {
		// An error happened.
		console.log(error.code);
		console.log(error.message);
	});
	
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
		var role = postData['type'];
		var errorFlag = false;
		
		//need to check for dofferent roles
		
		firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
			// Handle Errors here.
			errorFlag = true;
			console.log(error.code);
			var errorMsg = "Email and Password Incorrect please try again";
			res.render('login',{errorMsg : errorMsg});
		});
		if(!errorFlag){
				
			var ref = database.ref("Users/");
			getFirstNamebyEmail(ref,email).then(function(name){
				console.log(name);
				res.render('index',{name : name});
			});
				
		}

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

app.get('/CreateCourse',function(req,res){
	
	res.render('CreateCourse');
	
});


app.post('/CreateCourse',function(req,res){
	
	var bodyData = '';
	req.on('data', function (chunk) {
		bodyData += chunk.toString();
	});
	
	req.on('end',function (){
		
		
		//need to create course here 
		var postData = qstring.parse(bodyData);
		
		var courseName = postData['course'];
		
		
		
		
	});
	
	
});

