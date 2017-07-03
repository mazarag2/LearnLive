module.exports = function (){
	
	this.firstName = ""
	this.LoggedIn = false;
	
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
	
    this.getCourseKeys = function (courseRef) {
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
    this.getFirstNameByEmail = function (email,userRef){

		return new Promise(function(resolve) {
			console.log(email + ' getting the userName');
			setTimeout(function() { 
				
				this.userRef.orderByChild("email").equalTo(email).on("child_added", function(data) {
					name = data.val().firstname;
					this.firstName = name;
					resolve(name);
				});
				//resolve(false);
				},3000);//3000
			});
	};
	this.getCourses = function (courseRef){

		var courses = [];
		var index = 0;
		return new Promise(function(resolve) {
			setTimeout( function() {
				
				//order by Child ('CourseName')
				courseRef.orderByKey().on("child_added", function(snapshot) {
					//console.log(snapshot.val().CourseName);
					courses[index] = snapshot.key;
					++index;
					resolve(courses);
				})
			},2000);
		});
	}
	this.renderIndex = function(resolve,email,res,ref){
		
		if(resolve){
		
			if(this.firstName != ""){
				
				this.getCourseKeys(ref.courseRef).then(function(resolve){
					
					this.getCourses(ref.courseRef).then(function(resolve2){
						
						var courseInfo = toArrayObject(resolve,resolve2);
						
						res.render('index',{name : this.firstName,courseInfo: courseInfo});
						
					});
					
				});
				
			}
			else{
				
				Promise.all([

					this.getFirstNamebyEmail(email,ref.userRef),
					this.getCourseKeys(ref.courseRef),
					this.getCourses(ref.courseRef)
			
				]).then(function (results){
					
					//console.log(results[0]);
					
					console.log(results[0]+ ' ' + results[1] + ' ' + results[2]);
					
					//res.render('index',{name : results[0],courses : results[1]});
					
					var courseInfo = this.toArrayObject(results[1],results[2]);
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
	this.signInUser = function(email,password,res,firebase){
	
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

};