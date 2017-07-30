var query = function() {
	
	var self = this;
	var LoggedIn = false;
	var firstName = "";
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

		return new Promise(function(resolve) {
			console.log(email + ' getting the userName');
			setTimeout(function() { 
				ref.orderByChild("email").equalTo(email).on("child_added", function(data) {
					name = data.val().firstname;
					this.firstName = name;
					resolve(name);
				});
				//resolve(false);
			},3000);//3000
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
			
			setTimeout(function(){
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
			},1000);

			
		});
	}
	this.getCoursesEnrolled = function(email,ref){
		var courses = [];
		var index = 0;
		return new Promise(function(resolve) {
			setTimeout( function() {	
				//order by Child ('CourseName')
				ref.orderByChild("email").equalTo(email).on("child_added", function(snapshot) {
					//console.log(snapshot.val().CourseName);
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
	this.renderIndex = function(resolve,email,res,ref){
	
		if(resolve){
			
			if(this.firstName != undefined){
				
				self.getCourseKeys(ref.courseRef).then(function(resolve){
					
					self.getCourses(ref.courseRef).then(function(resolve2){
						
						var courseInfo = self.toArrayObject(resolve,resolve2);
						
						res.render('index',{name : this.firstName,courseInfo: courseInfo});
						
					});
					
				});
				
			}
			else{
				
				Promise.all([

					self.getFirstNamebyEmail(email,ref.userRef),
					self.getCourseKeys(ref.courseRef),
					self.getCourses(ref.courseRef),
					self.getCoursesEnrolled(email,ref.enrollRef)
			
				]).then(function (results){
					
					console.log(results[0]+ ' ' + results[1] + ' ' + results[2]+ 'coursesenrolled' + results[3]);
					
					var courseInfo = self.toArrayObject(results[1],results[2]);
					res.render('index',{name : results[0],courseInfo: courseInfo});
				}).catch(function(error){
				
					console.log(error + "in query");
				})
				
			}
			
		}

	}
};
module.exports = query;