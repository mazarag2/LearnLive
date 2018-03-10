const fs = require('fs');
const http = require('http');
const url = require('url');
const qstring = require('querystring');
const express = require('express');
const jade = require('pug');
const query = require("./query");
const auth = require("./auth");
const NodeCache = require("node-cache");
const userCache = new NodeCache();
const path = require('path');
const LOGIN = 'Login';
const CREATE = 'Create';
const router = express.Router();
const dotev = require('dotenv').config();

//const envs = require('envs');
var app = express();
var session = require('express-session');


console.log(path.join(__dirname, '../public'));

app.set('view engine', 'jade');
app.engine('jade', jade.__express);
app.set('views', path.join(__dirname, '../src/views'));
app.listen(8080);
app.use('/public',express.static(path.join(__dirname, '../public')));

var firebase = require("firebase");


var config = {
    apiKey : process.env.API_KEY,
    authDomain: "learnlive-f6376.appspot.com",
    databaseURL: "https://learnlive-f6376.firebaseio.com",
    projectId: "learnlive-f6376",
    storageBucket: "learnlive-f6376.appspot.com",
    messagingSenderId: "749566368306"

};

firebase.initializeApp(config);




var courseRef = firebase.database().ref("Courses");
var userRef = firebase.database().ref("Users");
var enrollmentRef = firebase.database().ref("Enrollment");
var instructorRef = firebase.database().ref("Instructors");
var user = firebase.auth().currentUser;


app.set("enrollmentRef",enrollmentRef);

function createCourse(postData){
	
	console.log(postData);
	
	var user = firebase.auth().currentUser;

	var id = courseRef.push();
	
	var email = user.email.toLowerCase();
	email = user.email.replace(/\./g, ',');
	
	var ref = instructorRef.child(email);
	var newRef = ref.push();
	newRef.set({
		
		CourseKey : id.key,
		CourseName : postData['CourseName']
		
	});

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
	
	if(firebase.auth().currentUser){
	
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
			cacheRef : userCache,
			instructorRef : instructorRef
		}
		if(CourseKey != null){
			
			//need to get Color for Course 
			var newQuery = new query();
			
			newQuery.getCourseInfo(CourseKey,courseRef).then(function(resolve){
				
				console.log("CourseInfo" + resolve);

				res.render("CourseTemplate.jade",{Color : resolve.Color,CourseName : resolve.CourseName});
				
			});
			
		}
		else{
			
			var indexData = newQuery.renderIndex(true,email,ref);
				
			indexData.then(function(resolve){
				
				console.dir('listresponse' + resolve);
				res.render('index',{name : resolve.name,courseInfo: resolve.courseInfo,coursesEnrolled : resolve.coursesEnrolled,InstructorCourse : resolve.InstructorCourse});
				
			});
	
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
			cacheRef : userCache,
			instructorRef : instructorRef
		}
		var newAuth = new auth();
		
		var result = newAuth.signInUser(email,password,firebase);
		console.log('res' + result)
		result.then(function(resolve,reject){
			console.log(resolve);
			if(resolve === true){
				app.set("userEmail",email);
				var indexData = newQuery.renderIndex(resolve,email,ref);
				
				indexData.then(function(resolve){
					
					console.dir('listresponse' + JSON.stringify(resolve));
					res.render('index',{name : resolve.name,courseInfo: resolve.courseInfo,coursesEnrolled : resolve.coursesEnrolled,InstructorCourse : resolve.InstructorCourse});
					
				});
			}
	
		}).catch(function(e) {
			res.render('login',{errorMsg : e});
		});
		
		
		/*
		our unit test work now lets use auth test it manually then phantomize it
		newQuery.signInUser(email,password,firebase).then(function(resolve,reject){
			
			if(reject){
				
				res.render('login',{errorMsg : errorMsg});
				
			}
			
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
		*/
		
		
	
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
		
		var newQuery = new query();
		
		var msg = newQuery.CreateUser(postData,firebase,userRef);
		
		res.render('Create',{errorMsg : msg});
	
	});
});

app.get('/CreateCourse',function(req,res){
	
	if(firebase.auth().currentUser){
	
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
		//var indx = key.lastIndexOf("/");
		//console.log(indx);
		//key = key.substring(indx);
		//console.log("new key " + key);
		res.render('Confirmation');
		//renderIndex(key,email,res);
		
	});
	
});



	


