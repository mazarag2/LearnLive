var query = function() {
	
	var self = this;
	var LoggedIn = false;
	var firstName = "";
	const NodeCache = require("node-cache");
    const userCache = new NodeCache();
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
		return newArr;
	
	}
	this.getFirstNamebyEmail = function(email,userRef){

	
		if (!email) return false
		// Replace '.' (not allowed in a Firebase key) with ',' (not allowed in an email address)
		email = email.toLowerCase();
		email = email.replace(/\./g, ',');
		
		return new Promise(function(resolve) {
			
			userRef.child(email).once('value').then(function(snapshot){
			
				
				var obj = snapshot.exportVal();
				console.dir(obj);
				var key = Object.keys(snapshot.exportVal());
				console.log("key " + key);
				//console.log("FirstName " + JSON.stringify(snapshot) + " " + snapshot.exportVal());
				console.log(obj[key].firstname);
				resolve(obj[key].firstname);
			});
		});

	};
	this.getCoursesForInstructor = function(email,instructorRef){
		
		
		if (!email) return false
		// Replace '.' (not allowed in a Firebase key) with ',' (not allowed in an email address)
		email = email.toLowerCase();
		email = email.replace(/\./g, ',');
		console.log('email' + email);
		var res = [];
		console.log("Instructor");
		//check if node exists for this emai
		//we figured out detection now promise callback
		return new Promise(function(resolve){
			
			instructorRef.child(email).once('value', function(snapshot) {
				console.log("snapshot " + JSON.stringify(snapshot.exportVal()));
				if(snapshot.val() === null ) { 
					
					console.log("yea its not in here man instrcutorCourses");
					var emptyList = new Array();
					//emptyList.push(["",""]);
					resolve(emptyList);

				}
				else{
				
					snapshot.forEach(function(snapshot) {
						var tempArray = [snapshot.val().CourseKey,snapshot.val().CourseName];
						res.push(tempArray);
						
					});
					console.log('instrcutorres' + res);
					resolve(res);
					/*
					var instrcutorData = snapshot.exportVal();
					var tempArray = [snapshot.val().CourseKey,snapshot.val().CourseName];
					console.log("instrucotr " + tempArray);
					
					resolve(res);
					*/
					
				}

			});
		
		});		
	}
	this.getCoursesRF = function(courseRef){
		
		var res = [];
		var tempArr = [];
		var allKeys = [];
		return new Promise(function(resolve) {
			
			courseRef.orderByKey().on("child_added", function(snapshot) {
				res.push([snapshot.key,snapshot.val().CourseName]);
			});			
			console.log('inside CoursesRF ' + res);
			resolve(res);
			
		});
	}
	this.getCourseKeys = function(courseRef){
		var courses = [];
		var index = 0;
		return new Promise(function(resolve) {
			//setTimeout( function() {
				
				//order by Child ('CourseName')
			courseRef.orderByKey().on("child_added", function(snapshot) {
				//console.log(snapshot.val().CourseName);
				courses.push(snapshot.key);
				++index;
				
			})
			resolve(courses);
			//},2000);
		});
	}
	this.createCourse = function(postData,firebase,courseRef){
		
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
	
	this.getCoursesEnrolled = function(email,enrollRef){
		var courses = [];
		var courseName = [];
		var courseInfo = {};
		var index = 0;

		console.log("email and ref" + email + " " + enrollRef);
		
		
		if (!email) return false
			// Replace '.' (not allowed in a Firebase key) with ',' (not allowed in an email address)
		email = email.toLowerCase();
		email = email.replace(/\./g, ',');
		console.log('check ' + enrollRef.child(email).toString());
		console.log('check JSON' + enrollRef.child(email).toJSON());
		
		
		return new Promise(function(resolve){
			
			
			enrollRef.child(email).once('value', function(snapshot) {
				console.log("snapshot" + snapshot.exportVal());
				if(snapshot.val() === null ) { 
					
					
					var emptyList = new Array();
					//emptyList.push(["",""]);
					resolve(emptyList);

				}
				else{
					
					snapshot.forEach(function(snapshot) {
						var childKey = console.log("key " + snapshot.val().CourseName);
						courseName[index] =  snapshot.val().CourseName;
						var childData = console.log("Data " + snapshot.val().Course);
						courses[index] = snapshot.val().Course;
						++index;
						
					});
					
					courseInfo = self.toArrayObject(courses,courseName);
					resolve(courseInfo);
					
				}

			});
		
		});
		//check if email exists
		return new Promise(function(resolve){
			enrollRef.orderByKey().equalTo(email).on("child_added",function(snapshot){
				console.log("We in");
				console.log(snapshot.hasChildren());
				//console.log("Brand new Query by On " + JSON.stringify(snapshot));
				
				if(snapshot.hasChildren()){
					snapshot.forEach(function(snapshot) {
						var childKey = console.log("key " + snapshot.val().CourseName);
						courseName[index] =  snapshot.val().CourseName;
						var childData = console.log("Data " + snapshot.val().Course);
						courses[index] = snapshot.val().Course;
						++index;
						
					});
					
					courseInfo = self.toArrayObject(courses,courseName);
					resolve(courseInfo);
				}
				else{
					
					var emptyList = new Array();
					//emptyList.push(["",""]);
					resolve(emptyList);
					
				}
				//return courseInfo;
				
			});
				//console.log('wtf');
				//var res = new Array();
				//res.push(["",""]);
				//resolve(res);
			
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
	this.getCourseforInstructor = function(email,instructorRef){
		
		email = email.toLowerCase();
		email = email.replace(/\./g, ',');
		var instrcutorCourses = new Array();
		
		return new Promise(function(resolve){
			instructorRef.orderByKey().equalTo(email).on("child_added",function(snapshot){
			
				//console.log("Brand new Query by On " + JSON.stringify(snapshot));
				if(snapshot.hasChildren()){
					
					snapshot.forEach(function(snapshot) {
						instrcutorCourses.push([snapshot.val().CourseName,snapshot.val().CourseKey]);
					
					});
					console.log(instrcutorCourses);
					resolve(instrcutorCourses);
					
				}
				else{
					console.log("boi we outta here instrucotr");
					var emptyList = new Array();
					//emptyList.push(["",""]);
					resolve(emptyList);
				}
				
			});
		});
		
	}
	this.renderCoursesEnrolledList = function(courseRef,enrollRef,email){
		

		return Promise.all([

			self.getCoursesRF(courseRef),
			self.getCourseKeys(courseRef),
			self.getCoursesEnrolled(email,enrollRef)
	
		]).then(function (results){
			//console.log(results[0] + ' -- ' + results[1])
			//var keys = new Set(results[1]);
			console.log("renderCoursesEnrolledList");
			var keys = new Set(results[1]);
			console.log(keys);
			var CourseEnrollList = results[2];
			console.dir(CourseEnrollList);
			
			var CourseRF = results[0];
			console.log("CourseRef" + CourseRF);
			//var unEnrolledCourses = new Array();4
			if(CourseEnrollList.length == 0){
				console.log('boi we out');
				var emptyList = new Array();
				return emptyList;
				
			}
			
			for (var key in CourseRF) {
				if (CourseRF.hasOwnProperty(key)) {
					//console.log(key + " -> " + CourseRF[key]);
					var val = JSON.stringify(CourseRF[key]);
					var courseKey = JSON.parse(val)[0];
					
					for(var enKey in CourseEnrollList){
						var enrollKey = JSON.parse(JSON.stringify(CourseEnrollList[enKey]))[0];
						if(courseKey == enrollKey){
							console.log('key' + key);
							delete CourseRF.key;
							delete CourseRF[key];
						}

					}
				}
			}
			return CourseRF;
			
		}).catch(function(error){
		
			console.log(error + "in query");
		})
		
	}
	this.renderIndex = function(resolve,email,ref){
	
		if(resolve){
			//User is LOgged In usrName
			
			var Usrname = ref.cacheRef.get( "usrName" );

			if ( Usrname == undefined ){
			  console.log("Sorry Name is missing");
			}
			
			if(Usrname != undefined){
				
				//Display back to login once in
				return Promise.all([
					
					self.renderCoursesEnrolledList(ref.courseRef,ref.enrollRef,email),
					self.getCoursesEnrolled(email,ref.enrollRef),
					self.getCoursesForInstructor(email,ref.instructorRef)
				
				]).then(function (results){
					
					var courseInfo = results[0];
					console.log(results[0]+ ' --- ' + results[1] + ' --- Results[2] ->' + results[2]);
					//res.render('index',{name : Usrname.name,courseInfo: courseInfo,coursesEnrolled : results[2]});
					return {name : Usrname.name,courseInfo: courseInfo,coursesEnrolled : results[1],InstructorCourse : results[2]};

				});
			}
			else{
				//Displaying Login Page
				return Promise.all([

					self.getFirstNamebyEmail(email,ref.userRef),
					self.renderCoursesEnrolledList(ref.courseRef,ref.enrollRef,email),
					//self.getCoursesRF(ref.courseRef),
					self.getCoursesEnrolled(email,ref.enrollRef),
					self.getCoursesForInstructor(email,ref.instructorRef)
			
				]).then(function (results){
					
					console.log(results[0]+ ' -- ' + results[1] + ' -- ' + results[2]+ 'coursesenrolled ' + results[3]);
					//console.log('results' + results);
					//console.log("Call by Itself " + self.getCoursesEnrolled(email,ref.enrollRef));
					var data = {name : results[0]};
					var success = ref.cacheRef.set( "usrName", data,0);
					var value = ref.cacheRef.get( "usrName" );
					//console.log("name " + value.name);
					console.log('name ' + results[0]);
					self.firstName = results[0];
					var courseInfo = results[1];
					console.log('render ' + JSON.stringify(results[1]) + ' end');
					//res.render('index',{name : results[0],courseInfo: courseInfo,coursesEnrolled : results[3]});
					//console.log(results[0] + courseInfo + results[3]);
					return {name : results[0],courseInfo: results[1],coursesEnrolled : results[2],InstructorCourse : results[3]};
				}).catch(function(error){
				
					console.log(error + "in query");
				})
				
			}
			
		}

	}
	
};
module.exports = query;