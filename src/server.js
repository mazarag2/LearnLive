const fs = require('fs');
const http = require('http');
const url = require('url');
const qstring = require('querystring');
const express = require('express');
const jade = require('pug');
const query = require("./query");
const NodeCache = require("node-cache");
const userCache = new NodeCache();
const path = require('path');
const LOGIN = 'Login';
const CREATE = 'Create';
const router = express.Router()

var app = express();
var session = require('express-session');


console.log(path.join(__dirname, '../public'));

app.set('view engine', 'jade');
app.engine('jade', jade.__express);
app.listen(8080);
app.use('/public',express.static(path.join(__dirname, '../public')));

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

var courseRef = firebase.database().ref("Courses");
var userRef = firebase.database().ref("Users");
var enrollmentRef = firebase.database().ref("Enrollment");
var user = firebase.auth().currentUser;

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
		Color : postData['favcolor'],
		CreatedBy : user.email
		
	})
	
	return id;
}

function createCourseView(name){
	
	var readFile = new Promise(function(resolve,reject) {
		fs.readFile('views/CourseTemplate.jade', function (err, data) {
			if (err) {
				reject(true);
			}
		   resolve(data.toString());
		});
	});
	
	readFile.then(function(resolve,reject){
		
		if(resolve){
			
			fs.writeFile("views/Courses/" + name + ".jade", resolve , function(err) {
				   if (err) {
					  return console.error(err);
				   }
				   
				   console.log("Data written successfully!");
			});
		}
	});
}

function removeWhiteSpaces(courseName){
	
	return courseName.replace(/\s+/g, '');
}

function removeWhiteSpacesCourses(courses){
	
	var newcourses = [];
	
	if(Array.isArray(courses)){
	
		for(int = 0; x <= courses.length ; x++){
			
			newcourses[x] = removeWhiteSpaces(courses[x]);
			
		}
	}
	
	return newcourses;
	
}


function toArrayObject(arr1,arr2){
	
	var newArr = Array();
	
	if(arr1.length == arr2.length){
		
		
		for(var x = 0; x <= arr1.length - 1 ; x++){
			
			var nestArr = new Array();
			nestArr.push(arr1[x]);
			nestArr.push(arr2[x]);
			newArr.push(nestArr);
			
		}
		
	}
	console.log(newArr);
	return newArr;
	
}

function getCourseColorbyKey(key,ref){
	
	return new Promise(function (resolve,reject){
	
		setTimeout(function(){
			console.log("inside");
			ref.child(key).on("child_added", function(snapshot) {
				//console.log(snapshot.val().CourseName);
				var val = snapshot.val();
				//console.log(snapshot.val()["Color"]);
				console.log(val);
				//var Color = val["Color"];
				resolve(val);
			})
		},1000);
		
	});
	
}


app.get('/', function (req, res) {
	
	res.render('login');
});

app.post('/', function (req,res){
	
	firebase.auth().signOut().then(function() {
		// Sign-out successful.
		res.render('login');
		app.locals.LoggedIn = false;
		userCache.del("usrName");
			
	}).catch(function(error) {
		// An error happened.
		console.log(error.code);
		console.log(error.message);
	});
	
});

app.get('/index',function (req,res){
	
	if(app.locals.LoggedIn){
	
		var header = url.parse(req.url, true);
		console.log(header);
		var CourseKey = header.query.course;
		console.log(CourseKey);
		var email = firebase.auth().currentUser.email;
		var newQuery = new query();
		var ref = {
			
			courseRef : courseRef,
			userRef : userRef,
			enrollRef : enrollmentRef,
			cacheRef : userCache
		}
		if(CourseKey != null){
			
			//need to get Color for Course 
			
			getCourseColorbyKey(CourseKey,courseRef).then(function(resolve){
				
				res.render("Courses/" + CourseKey,{Color : resolve});
				
			});
			
		}
		else{
			
			newQuery.renderIndex(true,email,res,ref);
			
		}
	}
	else{
		
		res.redirect('/');
		
	}
	
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
		
		var newQuery = new query();
			
		var ref = {
			
			courseRef : courseRef,
			userRef : userRef,
			enrollRef : enrollmentRef,
			cacheRef : userCache
		}
		
		newQuery.signInUser(email,password,res,firebase,app).then(function(resolve){
			
			firebase.auth().onAuthStateChanged(function(user) {
				  if (user) {
					// User is signed in.
					console.log("mh");
					app.set("userEmail",email);
					newQuery.renderIndex(resolve,email,res,ref);
					app.locals.LoggedIn = true;

				  } else {
					// User is signed out.
					// ...
				  }
			});

		}).catch(function(error){
				
			console.log(error + " in server");
		})
		

	});

});


app.set("enrollRef",enrollmentRef);
const index = require("./index");
app.use('/index',index);


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
		var origEmail = postData['email'];
		console.log(email);
		var password = postData['password'];
		var password2 = postData['password2'];
		var firstName = postData['firstname'];
		var lastName = postData['lastname'];
		console.log(password);
		if(password != password2){
			
			var errorMsg = "Passwords do not match please try again";
			res.render('Create',{errorMsg : errorMsg});
			
		}
		else{
		
			var email = origEmail.toLowerCase();
			email = email.replace(/\./g, ',');
			//console.log(userRef.child(email));
			
			
			var newQuery = new query();
			
			if(newQuery.doesUserExist(email,userRef)){
				
				//User with that email is already in the DB
				var errorMsg = "A User with that email is already in use If you forgot your password click here ";
				res.render('Create',{errorMsg : errorMsg});
				
				
			}
			else{
				
				// New User lets sign them up 
				firebase.auth().createUserWithEmailAndPassword(origEmail, password).catch(function(error) {
					
					var errorCode = error.code;
					var errorMessage = error.message;
					console.log(errorMessage + errorCode);

				});
				firebase.auth().onAuthStateChanged(function(user) {
				  if (user) {
					console.log(user);
					//var ref = database.ref('Users');
					
					var id = userRef.child(email);
					var newRef = id.push();
					
					newRef.set({
						firstname: firstName ,
						lastname : lastName 
					})
					
				  } else {
					// User is signed out.
					app.locals.LoggedIn = false;
				  }
				});

				//store first and last name in FIrebase DB 		
				res.redirect('/');	
				
			}
			
		}
	});
	
	
	
});

app.get('/CreateCourse',function(req,res){
	
	if(app.locals.LoggedIn){
	
		res.render('CreateCourse');
	
	}
	else{
		
		res.redirect('/');
		
		
	}
	
});


app.post('/CreateCourse',function(req,res){
	
	
	var bodyData = '';
	req.on('data', function (chunk) {
		bodyData += chunk.toString();
	});
	
	req.on('end',function (){
		
		//need to create course here and send it to Firebase DB 
		var postData = qstring.parse(bodyData);
		var key = new String(createCourse(postData));
		var user = firebase.auth().currentUser;
		var email = user.email;
		console.log(email);
		console.log("Key " + key);
		var indx = key.lastIndexOf("/");
		console.log(indx);
		key = key.substring(indx);
		console.log("new key " + key);
		createCourseView(key);
		res.render('Confirmation');
		//renderIndex(key,email,res);
		
	});
	
});



	


