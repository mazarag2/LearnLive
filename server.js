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

function getFirstNamebyEmail(email){

	return new Promise(function(resolve) {
		
		setTimeout(function() { 
			var ref = database.ref("Users/");
			ref.orderByChild("email").equalTo(email).on("child_added", function(data) {
				name = data.val().firstname;
				app.locals.firstName = name;
				resolve(name);
			});
		},1000);
	});
}

/*
	postData - A dictionary carrying data to create a course 
	usually in the form of a parsed
	request
	
	
*/

function createCourse(postData){
	
	console.log(postData);
	
	var user = firebase.auth().currentUser;

	var ref = database.ref('Courses');
	var id = ref.push();
	id.set({
		
		CourseName : postData['CourseName'],
		Subject : postData['subject'],
		Maxmembers : postData['members'],
		CurentMembers : 0,
		StartDate : postData['startDate'],
		EndDate : postData['endDate'],
		Rating : 0.0,
		CreatedBy : user.email
		
	})
}

function getUsersEnrollled(){
	
	
}

function getCourses(){
	
	//Select * FROM COURSES WHERE name = CourseName
	
	//OrderBy 
	var ref = firebase.database().ref("Courses");
	var courses = [];
	var index = 0;
	return new Promise(function(resolve) {
		setTimeout( function() {
			
			//order by Child ('CourseName')
			ref.orderByKey().on("child_added", function(snapshot) {
				//console.log(snapshot.val().CourseName);
				courses[index] = snapshot.val().CourseName;
				++index;
				resolve(courses);
			/*
			snapshot.forEach(function(childSnapshot) {
				var childKey = childSnapshot.key;
				var childData = childSnapshot.val();
				console.log(childKey +  ' ' + childData);
			});
			*/
		})
		},1000);
	});
}

function signInUser(email,password,res){
	
	
	return new Promise(function (resolve,reject){
		
		setTimeout(function(){
			console.log("inside");
			firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
				resolve(false);
				console.log(error.code);
				var errorMsg = "Email and Password Incorrect please try again";
				res.render('login',{errorMsg : errorMsg});
			});
			resolve(true);
			
		},1000);
		
	});
	
	
}

function renderIndex(){
	
	var user = firebase.auth().currentUser;
	var email = user.email;
	
	return new Promise(function (resolve){
		console.log('were in promise');
		Promise.all([
			
			getFirstNamebyEmail(email),
			getCourses()
		
		]).then(function (results){
			console.log(results[0]+ ' in redner indx ' + results[1]);
			resolve(results);
			//return results;
			
		}).catch(function(error){
			
			console.log(error);
		})
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
		
		//NEED TO DO PROMISE HERE FO SIGNING USER 
			
		signInUser(email,password,res).then(function(resolve){
			console.log("mh");
			if(resolve){
				
				Promise.all([
			
					getFirstNamebyEmail(email),
					getCourses()
				
				]).then(function (results){
					console.log(results[0]+ '' + results[1]);
					
					res.render('index',{name : results[0],courses : results[1]});
					
				}).catch(function(error){
					
					console.log(error);
				})
			
			}
			
			
		});

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
			console.log(user);
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
	
	//need a flag for bounded conversation 
	//User should not access tyhis withoiut first loggin in 
	res.render('CreateCourse');
	
});


app.post('/CreateCourse',function(req,res){
	
	var bodyData = '';
	req.on('data', function (chunk) {
		bodyData += chunk.toString();
	});
	
	req.on('end',function (){
		
		//need to create course here and send it to Forebase DB 
		var postData = qstring.parse(bodyData);
		createCourse(postData);
		var user = firebase.auth().currentUser;
		var email = user.email;
		console.log(email);
		Promise.all([
	
			getFirstNamebyEmail(email),
			getCourses()
		
		]).then(function (results){
			console.log(results[0]+ '' + results[1]);
			
			res.render('index',{name : results[0],courses : results[1]});
			
		}).catch(function(error){
			
			console.log(error);
		})
		
	
	});
	
	
});

