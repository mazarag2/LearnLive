module.exports = function() {
	
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
	var ref = firebase.database().ref("Courses");

	this.toArrayObject = function(arr1,arr2){
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
	
    this.getCourseKeys = function() {
	//Select * FROM COURSES WHERE name = CourseName
	//OrderBy 
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
    this.getFirstNameByEmail = function (email){

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
	this.getCourses = function(){

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

	}

}