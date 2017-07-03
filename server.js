const fs = require('fs');
const http = require('http');
const url = require('url');
const qstring = require('querystring');
const express = require('express');
const jade = require('pug');
const query = require("./query");

const LOGIN = 'Login';
const CREATE = 'Create';
const router = express.Router()

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

var courseRef = firebase.database().ref("Courses");
var userRef = firebase.database().ref("Users");
var enrollmentRef = firebase.database().ref("Enrollment");

/*

	ref - the reference within the Firebase DB Tree  
	email - the email which we want the fristname for

*/
function getEmail(){

	
	return firebase.auth().currentUser.email;
	
}

function getFirstNamebyEmail(email){

	return new Promise(function(resolve) {
		console.log(email + ' getting the userName');
		setTimeout(function() { 
			var ref = database.ref("Users/");
			ref.orderByChild("email").equalTo(email).on("child_added", function(data) {
				name = data.val().firstname;
				app.locals.firstName = name;
				resolve(name);
			});
			//resolve(false);
		},3000);//3000
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
		Color : postData['favcolor'],
		CreatedBy : user.email
		
	})
	
	return id;
}

function createCourseView(name){
	
	/*	
		One idea : we can create a new page and and build it as were are "building it" ()
		Another Idea : we simply just use a template ask them what color the page is (lesser customizable/but less dev time)
	*/
	
	var readFile = new Promise(function(resolve,reject) {
		fs.readFile('views/CourseTemplate.jade', function (err, data) {
			if (err) {
				reject(true);
		   }
		   resolve(data.toString());
		   //console.log("Asynchronous read: " + data.toString());
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
		},2000);
	});
}

function getCourseKeys(){
	
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
				courses[index] = snapshot.key;
				++index;
				resolve(courses);
			})
		},2000);
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
			app.locals.LoggedIn = true;
			console.log('resolved');
		},1000);
		
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

function getCourseColorbyKey(key){
	
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

function getCoursesEnrolled(email){
	
	
	
	
}

app.get('/', function (req, res) {
	
	res.render('login');
});

app.post('/', function (req,res){
	
	firebase.auth().signOut().then(function() {
		// Sign-out successful.
			res.render('login');
			app.locals.LoggedIn = false;
			
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
		var user = firebase.auth().currentUser;
		if(CourseKey != null){
			
			//need to get Color for Course 
			
			getCourseColorbyKey(CourseKey).then(function(resolve){
				
				res.render("Courses/" + CourseKey,{Color : resolve});
				
			});
			
		}
		else{
			
			
			renderIndex(true,user.email,res);
			
		}
	}
	else{
		
		res.redirect('/');
		
	}
	
});

function renderIndex(resolve,email,res){
	
	if(resolve){
		
		if(app.locals.firstName != null){
			
			getCourseKeys().then(function(resolve){
				
				getCourses().then(function(resolve2){
					
					var courseInfo = toArrayObject(resolve,resolve2);
					
					res.render('index',{name : app.locals.firstName,courseInfo: courseInfo});
					
				});
				
			});
			
		}
		else{
			
			Promise.all([

				getFirstNamebyEmail(email),
				getCourseKeys(),
				getCourses()
		
			]).then(function (results){
				
				//console.log(results[0]);
				
				console.log(results[0]+ ' ' + results[1] + ' ' + results[2]);
				
				//res.render('index',{name : results[0],courses : results[1]});
				
				var courseInfo = toArrayObject(results[1],results[2]);
				res.render('index',{name : results[0],courseInfo: courseInfo});
			}).catch(function(error){
				
				console.log(error);
			})
			
		}
		
		
	}

	
}

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
			enrollRef : enrollmentRef
		}
	
		newQuery.signInUser(email,password,res,firebase).then(function(resolve){
			console.log("mh");
			
			newQuery.renderIndex(resolve,email,res,ref);
			
		});

	});

});

const index = require("./index");
app.use('/index',index,renderIndex);


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
		var password2 = postData['password2'];
		var firstName = postData['firstname'];
		var lastName = postData['lastname'];
		console.log(password);
		if(password != password2){
			
			var errorMsg = "Passwords do not match please try again";
			res.render('Create',{errorMsg : errorMsg});
			
		}
		else{
		
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
				app.locals.LoggedIn = false;
			  }
			});

			//store first and last name in FIrebase DB 		
			res.redirect('/');
		
		
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



	


