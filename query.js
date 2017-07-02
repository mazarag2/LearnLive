module.exports = function (){
			
	this.firebase = require("firebase");
	this.config = {
		apiKey: "AIzaSyCTMUtfwd3jr4BCPQLeajXCpqfdd-lX7Eo",
		authDomain: "learnlive-f6376.firebaseapp.com",
		databaseURL: "https://learnlive-f6376.firebaseio.com",
		projectId: "learnlive-f6376",
		storageBucket: "learnlive-f6376.appspot.com",
		messagingSenderId: "749566368306"
	};
	this.firebase.initializeApp(this.config);
	this.database = this.firebase.database();
	this.courseRef = this.firebase.database().ref("Courses");
	this.enrollRef = this.firebase.database().ref("Enrollment");
	this.userRef = this.firebase.database().ref("Users");
	
	
	this.toArrayObject = function (arr1,arr2){
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
			
	};
	
    this.getCourseKeys = function () {
	//Select * FROM COURSES WHERE name = CourseName
	//OrderBy 
		var courses = [];
		var index = 0;
		return new Promise(function(resolve) {
			setTimeout( function() {
				
				//order by Child ('CourseName')
				this.courseRef.orderByKey().on("child_added", function(snapshot) {
					//console.log(snapshot.val().CourseName);
					courses[index] = snapshot.key;
					++index;
					resolve(courses);
				})
			},2000);
		});
	};
    this.getFirstNameByEmail = function (email){

	return new Promise(function(resolve) {
		console.log(email + ' getting the userName');
		setTimeout(function() { 
			
			this.userRef.orderByChild("email").equalTo(email).on("child_added", function(data) {
				name = data.val().firstname;
				app.locals.firstName = name;
				resolve(name);
			});
			//resolve(false);
			},3000);//3000
		});
	};
	this.getCourses = function (){

		var courses = [];
		var index = 0;
		return new Promise(function(resolve) {
			setTimeout( function() {
				
				//order by Child ('CourseName')
				this.courseRef.orderByKey().on("child_added", function(snapshot) {
					//console.log(snapshot.val().CourseName);
					courses[index] = snapshot.key;
					++index;
					resolve(courses);
				})
			},2000);
		});
	}
	this.renderIndex = function(resolve,email,res){
		
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

	};
	this.getCoursesEnrolled = function (userEmail){
		var courses = [];
		return new Promise(function(resolve) {
		setTimeout( function() {
			
			enrollRef.orderByChild("email").equalTo(userEmail).on("child_added", function(snapshot) {
				//console.log(snapshot.val().CourseName);
				courses[index] = snapshot.key;
				++index;
				resolve(courses);
			})
		},2000);
		});
	}
	this.signInUser = function(email,password,res){
	
	
	return new Promise(function (resolve,reject){
		
		setTimeout(function(){
			console.log("inside");
			this.firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
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

};