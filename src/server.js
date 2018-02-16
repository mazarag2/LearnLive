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

//Experimental work to upload files to Firebase
/*
function uploadFileToFB(CourseKey){
	
	//read courseTemplate in the Storage
	
	//var pathReference = gcs.ref('CourseTemplate.jade');
	
	const Storage = require('@google-cloud/storage');

		// Creates a client
	const storage = new Storage();

	/**
	 * TODO(developer): Uncomment the following lines before running the sample.
	 
	const srcBucketName = 'Name of the source bucket, e.g. my-bucket';
	const srcFilename = 'Name of the source file, e.g. file.txt';
	const destBucketName = 'Name of the destination bucket, e.g. my-other-bucket';
	 const destFilename = 'Destination name of file, e.g. file.txt';

	// Copies the file to the other bucket
	/*
	var PostaggingURL = 'https://www.googleapis.com/storage/v1/b/learnlive-f6376.appspot.com/o/CourseTemplate.jade/copyTo/b/learnlive-f6376.appspot.com/Courses/o/' + CourseKey + '.jade?';
	
	//var input = document.getElementById('input').value;
	
	xhttp.onreadystatechange = function(){
		
		//stuff we need to do when the request come backs
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				//document.getElementById("demo").innerHTML =
				console.log('xmlhttpresponse ' + this.responseText);
			}
		};
	}
	//sending request 
	xhttp.open("POST",PostaggingURL,true);
	//xhttp.setRequestHeader('Authorization','bearer 749566368306-e4j38e5t1d9hd8j0ifh4jipipvdbktru.apps.googleusercontent.com');
	xhttp.setRequestHeader('Content-Type", "text/plain');
	
	xhttp.send('key=AIzaSyBwkhpMW3rp-zqyjv66D71hWl0TGOpfSjg');
	
	
	gcs
	  .bucket('learnlive-f6376.appspot.com')
	  .file('learnlive-f6376.appspot.com/CourseTemplate.jade')
	  .copy(storage.bucket('learnlive-f6376.appspot.com').file('learnlive-f6376.appspot.com/Courses/' + CourseKey + '.jade'))
	  .then(() => {
		console.log(
		  `gs://${srcBucketName}/${srcFilename} copied to gs://${destBucketName}/${destFilename}.`
		);
	  })
	  .catch(err => {
		console.error('ERROR:', err);
	  });
	  
	
	//memcached-10583.c10.us-east-1-4.ec2.cloud.redislabs.com:10583
	

	
	/*
	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
		
		
		var bucket = gcs.bucket('learnlive-f6376.appspot.com');
		
		//var gsReference = storage.refFromURL('gs://learnlive-f6376.appspot.com/');
		
		
		//var file = bucket.file('https://storage.googleapis.com/learnlive-f6376.appspot.com/CourseTemplate.jade');
		
		var file = bucket.file('CourseTemplate.jade');
		
		//const Storage = require('@google-cloud/storage');
		
				// Creates a client
		//const storage = new Storage();

		/**
		 * TODO(developer): Uncomment the following lines before running the sample.
		 
		 const srcBucketName = 'learnlive-f6376.appspot.com';
		 const srcFilename =   'CourseTemplate.jade';
		 const destBucketName = 'learnlive-f6376.appspot.com/Courses';
		 const destFilename = CourseKey + '.jade';
				
		/*
		gcs
		  .bucket(srcBucketName)
		  .file(srcFilename)
		  .copy(storage.bucket(destBucketName).file(destFilename))
		  .then(() => {
			console.log(
			  `gs://${srcBucketName}/${srcFilename} copied to gs://${destBucketName}/${destFilename}.`
			);
		  })
		  .catch(err => {
			console.error('ERROR:', err);
		  });
		
		file.get(function(err, file, apiResponse) {
			console.log(err + JSON.stringify(apiResponse));
			//console.dir(file);
		});
		//var path = 'https://storage.googleapis.com/learnlive-f6376.appspot.com/Courses/' + CourseKey + '.jade';
		var path = 'Courses/' + CourseKey + '.jade';
		file.copy(path,function(err, copiedFile, apiResponse) {
		  // `my-bucket` now contains:
		  // - "my-image.png"
		  // - "my-image-copy.png"
			console.log("Copy " + err + JSON.stringify(apiResponse));
		  // `copiedFile` is an instance of a File object that refers to your new
		  // file.
		});
			
							
			
		
	  } else {
		// User is signed out.
		app.locals.LoggedIn = false;
	  }
	});
	
	var bucket = gcs.bucket('learnlive-f6376.appspot.com');
	
	//var gsReference = storage.refFromURL('gs://learnlive-f6376.appspot.com/');
	
	
	//var file = bucket.file('https://storage.googleapis.com/learnlive-f6376.appspot.com/CourseTemplate.jade');
	
	var file = bucket.file('CourseTemplate.jade');
	
	/*
	file.download(function(err, contents) {
		
		
		console.log(err + contents);
		
		
	});
	*/
	//var path = 'https://storage.googleapis.com/learnlive-f6376.appspot.com/Courses/' + CourseKey + '.jade';
	/*
	gsReference.child('CourseTemplate.jade').getDownloadURL().then(function(url){
		
		  var xhr = new XMLHttpRequest();
		  xhr.responseType = 'file';
		  xhr.onload = function(event) {
			console.log("File Boi" + file);
			var file = xhr.response;
			
			var newCourseRef = storageRef.child('Courses/' + CourseKey + '.jade');
			newCourseRef.put(file).then(function(snapshot){
				
				console.log("File Uploaded Succesfully");
				
			});
			
		  };
		  xhr.open('GET', url);
		  xhr.send();

	}).catch(function(error) {
		console.log("Error in File Fb " + error)
	});;
	*/
	
	//grab that and write file to storage using name with Course key
	
//}

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
			var newQuery = new query();
			
			newQuery.getCourseInfo(CourseKey,courseRef).then(function(resolve){
				
				console.log("CourseInfo" + resolve);

				res.render("CourseTemplate.jade",{Color : resolve.Color,CourseName : resolve.CourseName});
				
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
		
		var newQuery = new query();
		
		var msg = newQuery.CreateUser(postData,firebase,userRef);
		
		res.render('Create',{errorMsg : msg});
		/*
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
			
			
		}
		else{
		
			var email = origEmail.toLowerCase();
			email = email.replace(/\./g, ',');
			
			
			var newQuery = new query();
			
				
			// New User lets sign them up 

			var promise = new Promise(function(resolve){
				firebase.auth().createUserWithEmailAndPassword(origEmail, password).catch(function(error) {
				
				var errorMessage = error.message;
				resolve(errorM);

			})});
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
		
			res.render('Create',{errorMsg : errorMessage});
		
		}
	});
	*/
	
	
	
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



	


