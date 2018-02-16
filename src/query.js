var query = function() {
	
	var self = this;
	var LoggedIn = false;
	var firstName = "";
	const NodeCache = require("node-cache");
    const userCache = new NodeCache();
	this.CreateUser = function(postData,firebase,userRef){
		
		var origEmail = postData['email'];
		console.log(email);
		var password = postData['password'];
		var password2 = postData['password2'];
		var firstName = postData['firstname'];
		var lastName = postData['lastname'];
		console.log(password);
		if(password != password2){
			
			return "Passwords do not match please try again";
			
		}
		else{
		
			var email = origEmail.toLowerCase();
			email = email.replace(/\./g, ',');
			
			
			var newQuery = new query();
			
				
			// New User lets sign them up 

			var promise = new Promise(function(resolve){
				firebase.auth().createUserWithEmailAndPassword(origEmail, password).catch(function(error) {
				
					var errorMessage = error.message;
					console.log(errorMessage)
					resolve(errorMessage);

				})
		
			});
			
			return promise.then(function(resolve){
				
				
				console.log("Resolve after callback " + resolve);
				
				if(resolve){
					
					return resolve;
				}
				else{
					
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
					return "Account Created Succesfully!";
					
				}
				
				
			});
			
		
		}
	}
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
	this.getFirstNamebyEmail = function(email,ref){

	
		if (!email) return false
		// Replace '.' (not allowed in a Firebase key) with ',' (not allowed in an email address)
		email = email.toLowerCase();
		email = email.replace(/\./g, ',');
		
		return ref.child(email).once('value').then(function(snapshot){
			
			
			var obj = snapshot.exportVal();
			var key = Object.keys(snapshot.exportVal());
			console.log(obj[key].firstname);
			
			//console.log("FirstName " + JSON.stringify(snapshot) + " " + snapshot.exportVal());
			return obj[key].firstname;
			
		});

	};
	this.getCourses = function(ref){
		
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
				})
			},2000);
			});
	}
	this.getCourseKeys = function(ref){
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
	this.signInUser = function(email,password,res,firebase,app){
	
	
		return new Promise(function (resolve,reject){
			
			//setTimeout(function(){
				console.log("inside");
				firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
					resolve(false);
					console.log(error.code);
					var errorMsg = "Email and Password Incorrect please try again";
					res.render('login',{errorMsg : errorMsg});
				});
				resolve(true);
				this.LoggedIn = true;
				console.log('resolved');
			//},1000);

			
		});
	}
	this.getCourseNameForKeys = function(ref,keys){
		
		return new Promise(function(resolve){
			setTimeout( function() {	
				ref.orderByChild("email").equalTo(email).on("child_added", function(snapshot) {
					console.log("Inside CourseEnrolled " + snapshot.val());
					if(snapshot.exists()) {					
						courses[index] = snapshot.val().Course;
						++index;
						resolve(courses);
						
					}
					else{
						resolve(0);
					}
				})
			},2000);
			
		});
		
	}
	this.getCoursesEnrolled = function(email,ref){
		var courses = [];
		var courseName = [];
		var courseInfo = {};
		var index = 0;

		console.log("email and ref" + email + " " + ref);
		
		
		if (!email) return false
			// Replace '.' (not allowed in a Firebase key) with ',' (not allowed in an email address)
		email = email.toLowerCase();
		email = email.replace(/\./g, ',');
		
		console.log("email and ref" + email + " " + ref);

		console.log("Query By Itself " + ref.orderByChild("email"));
		
		return new Promise(function(resolve){
			ref.orderByKey().equalTo(email).on("child_added",function(snapshot){
			
			console.log("Brand new Query by On " + JSON.stringify(snapshot));
			
			snapshot.forEach(function(snapshot) {
				var childKey = console.log("key " + snapshot.val().CourseName);
				courseName[index] =  snapshot.val().CourseName;
				var childData = console.log("Data " + snapshot.val().Course);
				courses[index] = snapshot.val().Course;
				++index;
				
			});
			
			
			courseInfo = self.toArrayObject(courses,courseName);
			console.log("Boi our obj " + courseInfo);
			resolve(courseInfo);
			//return courseInfo;
			
			});
		});
		
		//return new Array();
				
	}
	this.getCourseInfo = function(CourseKey,courseRef){
	
		return new Promise(function(resolve,reject){
			
			var courseInfo = {};
			var index = 0;
			courseRef.child(CourseKey).on("child_added", function(snapshot) {
			
				 courseInfo[snapshot.key] = snapshot.val();	
			});
			resolve(courseInfo);

		});
	}
	this.getCourseColorbyKey = function (key){
	
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
	this.renderIndex = function(resolve,email,res,ref){
	
		if(resolve){
			//User is LOgged In usrName
			
			var Usrname = ref.cacheRef.get( "usrName" );

			if ( Usrname == undefined ){
			  console.log("Sorry Name is missing");
			}
			
			if(Usrname != undefined){
				
				//Display back to login once in
				Promise.all([
					
					self.getCourseKeys(ref.courseRef),
					self.getCourses(ref.courseRef),
					self.getCoursesEnrolled(email,ref.enrollRef)
				
				]).then(function (results){
					
					console.log("Call by Itself " + self.getCoursesEnrolled(email,ref.enrollRef));
					var courseInfo = self.toArrayObject(results[0],results[1]);
					console.log(results[0]+ ' --- ' + results[1] + ' --- Results[2] ->' + results[2]);
					res.render('index',{name : Usrname.name,courseInfo: courseInfo,coursesEnrolled : results[2]});

				})
			}
			else{
				//Displaying Login Page
				Promise.all([

					self.getFirstNamebyEmail(email,ref.userRef),
					self.getCourseKeys(ref.courseRef),
					self.getCourses(ref.courseRef),
					self.getCoursesEnrolled(email,ref.enrollRef)
			
				]).then(function (results){
					
					console.log(results[0]+ ' ' + results[1] + ' ' + results[2]+ 'coursesenrolled ' + results[3]);
					
					console.log("Call by Itself " + self.getCoursesEnrolled(email,ref.enrollRef));
					var data = {name : results[0]};
					var success = ref.cacheRef.set( "usrName", data,0);
					var value = ref.cacheRef.get( "usrName" );
					console.log("name " + value.name);
					
					self.firstName = results[0];
					var courseInfo = self.toArrayObject(results[1],results[2]);
					res.render('index',{name : results[0],courseInfo: courseInfo,coursesEnrolled : results[3]});
				}).catch(function(error){
				
					console.log(error + "in query");
				})
				
			}
			
		}

	}
};
module.exports = query;