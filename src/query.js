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
		
		return userRef.child(email).once('value').then(function(snapshot){
			
			
			var obj = snapshot.exportVal();
			var key = Object.keys(snapshot.exportVal());
			
			//console.log("FirstName " + JSON.stringify(snapshot) + " " + snapshot.exportVal());
			return obj[key].firstname;
			
		});

	};
	this.getCoursesForInstructor = function(email,instructorRef){
		
		console.log('email' + email)
		if (!email) return false
		// Replace '.' (not allowed in a Firebase key) with ',' (not allowed in an email address)
		email = email.toLowerCase();
		email = email.replace(/\./g, ',');
		
		var res = [];
		
		
		return new Promise(function(resolve) {
			
			instructorRef.child(email).on("child_added", function(snapshot) {
				var tempArray = [snapshot.val().CourseKey,snapshot.val().CourseName];
				console.log(tempArray);
				res.push(tempArray);
				resolve(res);
			});		
		});
		
		
	}
	this.getCourses = function(courseRef){
		
		var courses = [];
		var index = 0;
		return new Promise(function(resolve) {
			setTimeout( function() {
				//order by Child ('CourseName')
				courseRef.orderByKey().on("child_added", function(snapshot) {
					//console.log(snapshot.val().CourseName);
					courses[index] = snapshot.val().CourseName;
					++index;
					resolve(courses);
				})
			},2000);
		});
	}
	this.getCoursesRF = function(courseRef){
		
		var res = [];
		var tempArr = [];
		var allKeys = [];
		return new Promise(function(resolve) {
			
			courseRef.orderByKey().on("child_added", function(snapshot) {
				//allKeys.push(snapshot.key);
				var tempArrray = [snapshot.key,snapshot.val().CourseName];
				res.push(tempArrray);

			})			
			//console.log('inside CoursesRF ' + res);
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
		

		
		return new Promise(function(resolve){
			enrollRef.orderByKey().equalTo(email).on("child_added",function(snapshot){
			
				//console.log("Brand new Query by On " + JSON.stringify(snapshot));
				
				snapshot.forEach(function(snapshot) {
					var childKey = console.log("key " + snapshot.val().CourseName);
					courseName[index] =  snapshot.val().CourseName;
					var childData = console.log("Data " + snapshot.val().Course);
					courses[index] = snapshot.val().Course;
					++index;
					
				});
				
				
				courseInfo = self.toArrayObject(courses,courseName);
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
					//console.log(val);
					//var Color = val["Color"];
					resolve(val);
				})
			},1000);
		
		});
	}
	this.renderCoursesEnrolledList = function(courseRef,enrollRef,email){
		
		
		// we're going to do an interesection and render those withdraw / checkmark
		
		return Promise.all([

			self.getCoursesRF(courseRef),
			self.getCourseKeys(courseRef),
			self.getCoursesEnrolled(email,enrollRef),
			
	
		]).then(function (results){
			//console.log(results[0] + ' -- ' + results[1])
			//var keys = new Set(results[1]);
			var keys = new Set(results[1]);
			//console.dir(keys);
			/*
			for(var y = 0 ; y <= CourseEnrollList.length - 1 ; y++){
				console.log(keys.has(CourseEnrollList[y]));
				if(keys.has(CourseEnrollList[y])){
					keys.delete(CourseEnrollList[y]);
				}
			}
			*/
			//loop over CoursesRF entries set 
			//if it does not coontain it delete that shit 
			var CourseEnrollList = results[2];
			
			
			var CourseRF = results[0];
			//var unEnrolledCourses = new Array();
			for (var key in CourseRF) {
				if (CourseRF.hasOwnProperty(key)) {
					console.log(key + " -> " + CourseRF[key]);
					var val = JSON.stringify(CourseRF[key]);
					var courseKey = JSON.parse(val)[0];
					for(var enKey in CourseEnrollList){
						console.log('enkey ' + enKey);
						var enrollKey = JSON.parse(JSON.stringify(CourseEnrollList[enKey]))[0];
						console.log('enrollKey ' + enrollKey)
						console.log(courseKey == enrollKey);
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
		
		
		/*
		var getkeyVal = self.getCoursesRF(courseRef);
		return getkeyVal.then(function(resolve){
			/*
			for (var x = 0; x <= CourseEnrollList.length - 1; x++){
				
				
				var Enrolledkey = CourseEnrollList[x][0];
				console.log('Enrolledkey ' + Enrolledkey);
				var alreadyEnrolled = CourseList.has(Enrolledkey);
				console.log(alreadyEnrolled);
				if(alreadyEnrolled){
					CourseList.delete(Enrolledkey);
				}
			}
			
			console.log(typeof resolve);
			//we only need a set of keys once we 
			//got it remove it and return the whole thing with the vals
			console.log('resolve ' + JSON.stringify(resolve));
			var CourseList = new Set(resolve);
			var enrolledSet = new Set(CourseEnrollList);
			console.dir(CourseList);
			console.dir(enrolledSet);
			
			console.log('CourseList' + CourseEnrollList);
			console.dir('bef' + CourseList);
			console.log(CourseList.entries());
			
			for (var x = 0; x <= CourseEnrollList.length - 1; x++){
				
				
				var Enrolledkey = CourseEnrollList[x][0];
				console.log('Enrolledkey ' + Enrolledkey);
				var alreadyEnrolled = CourseList.has(Enrolledkey);
				console.log(alreadyEnrolled);
				if(alreadyEnrolled){
					CourseList.delete(Enrolledkey);
				}
			}
			
			console.dir(CourseList);
	
			return CourseList;
			
			
		});
		*/
		
		
	}
	/*
	this.getValsForKeys(courseRef,enrollKeys){
		
		//fuck we have keys now we need vals....
		//we still have other options...
		
		for(var y = 0; y <= enrollKeys.length - 1; y++){
		
			courseRef.orderByChild("CourseName").equalTo("John").on("child_added", function(data) {
				console.log("Equal to filter: " + data.val().name);
			});
		
		}
		
	}
	*/
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
					//console.log(results[0]+ ' --- ' + results[1] + ' --- Results[2] ->' + results[2]);
					//res.render('index',{name : Usrname.name,courseInfo: courseInfo,coursesEnrolled : results[2]});
					return {name : Usrname.name,courseInfo: courseInfo,coursesEnrolled : results[1],InstructorCourse : results[2]};

				})
			}
			else{
				//Displaying Login Page
				return Promise.all([

					self.getFirstNamebyEmail(email,ref.userRef),
					self.renderCoursesEnrolledList(ref.courseRef,ref.enrollRef,email),
					self.getCoursesEnrolled(email,ref.enrollRef),
					self.getCoursesForInstructor(email,ref.instructorRef)
			
				]).then(function (results){
					
					//console.log(results[0]+ ' ' + results[1] + ' ' + results[2]+ 'coursesenrolled ' + results[3]);
					console.log('results' + results);
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
	//the function will return the list for the index view 
	/*
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
					
					self.getCourseKeys(ref.courseRef),
					self.getCourses(ref.courseRef),
					self.getCoursesEnrolled(email,ref.enrollRef)
				
				]).then(function (results){
					
					var courseInfo = self.toArrayObject(results[0],results[1]);
					//console.log(results[0]+ ' --- ' + results[1] + ' --- Results[2] ->' + results[2]);
					//res.render('index',{name : Usrname.name,courseInfo: courseInfo,coursesEnrolled : results[2]});
					return {name : Usrname.name,courseInfo: courseInfo,coursesEnrolled : results[2]};

				})
			}
			else{
				//Displaying Login Page
				return Promise.all([

					self.getFirstNamebyEmail(email,ref.userRef),
					self.getCourseKeys(ref.courseRef),
					self.getCourses(ref.courseRef),
					self.getCoursesEnrolled(email,ref.enrollRef)
			
				]).then(function (results){
					
					//console.log(results[0]+ ' ' + results[1] + ' ' + results[2]+ 'coursesenrolled ' + results[3]);
					
					//console.log("Call by Itself " + self.getCoursesEnrolled(email,ref.enrollRef));
					var data = {name : results[0]};
					var success = ref.cacheRef.set( "usrName", data,0);
					var value = ref.cacheRef.get( "usrName" );
					//console.log("name " + value.name);
					
					self.firstName = results[0];
					var courseInfo = self.toArrayObject(results[1],results[2]);
					//res.render('index',{name : results[0],courseInfo: courseInfo,coursesEnrolled : results[3]});
					//console.log(results[0] + courseInfo + results[3]);
					return {name : results[0],courseInfo: courseInfo,coursesEnrolled : results[3]};
				}).catch(function(error){
				
					console.log(error + "in query");
				})
				
			}
			
		}

	}
	*/
};
module.exports = query;