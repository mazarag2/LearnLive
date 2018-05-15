var CourseModify = function(){

	this.withdrawCourse = function(email,enrollmentRef,CourseKeys){
		
		return new Promise(function(resolve,reject){
				enrollmentRef.child(email).once('value', function(snapshot) {
				console.log("snapsho withdrawCourse" + JSON.stringify(snapshot.exportVal()));
					if(snapshot.val() === null ) { 
						
						console.log("yea its not in here man");
						var emptyList = new Array();
						//emptyList.push(["",""]);
						resolve(emptyList);

					}
					else{
						
						snapshot.forEach(function(snapshot) {
							console.log(JSON.stringify(snapshot.exportVal()));
							
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

