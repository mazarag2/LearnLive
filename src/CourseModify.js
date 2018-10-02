var CourseModify = function(){

	this.EnrollCourse = function(email,enrollmentRef,Courses){
	
	    var CoursesListIsEmpty = Courses.length == 0;
		if(!Courses || CoursesListIsEmpty){
			return false;
		}
	    
		for(var x = 0; x <= Courses.length - 1 ; x++){
			console.log('indx' + Courses[x]);
			
			var CourseInfo = Courses[x].toString().split(',');
			console.log(CourseInfo);
			var courseKey = CourseInfo[0];
			console.log(courseKey)
			var courseName = CourseInfo[1];
			console.log(courseName);
			var id = enrollmentRef.child(email);
			var newRef = id.push();
			newRef.set({
				
				Course : courseKey,
				CourseName : courseName
			})
		}
		return true;

	}
	this.withdrawCourse = function(email,enrollmentRef,CourseKeys){
		
		return new Promise(function(resolve,reject){
			enrollmentRef.child(email).once('value', function(snapshot) {
				if(snapshot.val() === null ) { 
					
					var emptyList = new Array();
					resolve(emptyList);
				}
				else{
					
					snapshot.forEach(function(snapshot) {
						for(var x = 0 ; x <= CourseKeys.length - 1 ; x++){
							if(snapshot.val().Course == CourseKeys[x]){
								
								var delRef = enrollmentRef.child(email + '/' +  snapshot.key);
								console.log("delRef " + delRef);
								delRef.remove().then(function() {
									resolve(true);
								})
								 .catch(function(error) {
									reject("Remove failed: " + error.message);
									
								 });
								
							}
						}
						
					});			
				}
			});	
		});
		
	}
};
module.exports = CourseModify;

