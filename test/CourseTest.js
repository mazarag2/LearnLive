var assert = require('assert');
const Course = require("../src/Course");
const CourseModify = require("../src/CourseModify");
const auth = require("../src/auth");
var firebase = require("firebase");
const dotev = require('dotenv').config();
var expect = require('chai').expect;
var config = {
    apiKey : process.env.API_KEY,
    authDomain: "learnlive-f6376.appspot.com",
    databaseURL: "https://learnlive-f6376.firebaseio.com",
    projectId: "learnlive-f6376",
    storageBucket: "learnlive-f6376.appspot.com",
    messagingSenderId: "749566368306"

};

firebase.initializeApp(config);

const NodeCache = require("node-cache");
const userCache = new NodeCache();
var courseRef = firebase.database().ref("Courses");
var userRef = firebase.database().ref("Users");
var enrollmentRef = firebase.database().ref("Enrollment");
var instructorRef = firebase.database().ref("Instructors");
var fbRef = {
	
	courseRef : courseRef,
	userRef : userRef,
	enrollRef : enrollmentRef,
	cacheRef : userCache,
	instructorRef : instructorRef
}
var existingEmail = process.env.TEST_EMAIL;
var password1 = process.env.TEST_PASSWORD;
describe('CourseIndex',function(){
	describe('#CourseIndexFunctions',function(){

		before(function(){
			// runs before all tests in this block(need to log in a test user to authenticate Fb Calls)
			var newAuth = new auth();


				
			const resolvingPromise = new Promise(function(resolve){
				
				resolve(newAuth.signInUser(existingEmail,password1,firebase));
				//done();
				
			});
			return resolvingPromise.then(function(resolve){
				console.log(resolve);
				var id = enrollmentRef.child(("testemail@email,com"));
				var newRef = id.push();
				newRef.set({
			
					CourseName : "test1",
					CourseKey : "-L77QkLgw4IzGwqHzHds"
				});
				expect(resolve).to.be.true;
				
			});
			
			
			
			
		});
		it('should return a list of Available Courses',function(done){
			
			var newQuery = new Course();
			
			var resolve = true;
	
			const resolvingPromise = new Promise(function(resolve){
				
				
				existingEmail = existingEmail.toLowerCase();
				existingEmail = existingEmail.replace(/\./g, ',');
				
				resolve(newQuery.renderIndex(resolve,existingEmail,fbRef));
				done();
			});
			return resolvingPromise.then(function(resolve){

				console.log('renderIndex ' + JSON.stringify(resolve));
				expect(JSON.parse(JSON.stringify(resolve))).to.have.property('courseInfo').to.be.an('array').to.have.lengthOf.above(2);

			}).catch(function(er){
				
				done(new Error(er));
			})
					
		})
		it('should return a list of Courses a User is enrolled In',function(){
			
			var newQuery = new Course();
			
			var resolve = true;
	
			const resolvingPromise = new Promise(function(resolve){
				
				resolve(newQuery.getCoursesEnrolled(existingEmail,enrollmentRef));
				done();
			});
			return resolvingPromise.then(function(resolve){
			
				assert.notEqual(undefined,resolve);
				assert.notEqual(null,resolve);
				
			})

		});
		it('should return a name for a valid user',function(){
			
			
			var newQuery = new Course();
			
			var resolve = true;
	
			const resolvingPromise = new Promise(function(resolve){
				
				resolve(newQuery.getFirstNamebyEmail(existingEmail,userRef));
				done();
			});
			return resolvingPromise.then(function(resolve){
			
				expect(resolve).to.be.an('string');
				
				
			})
			
		});
		it('should return Courses with keys and names',function(done){
			
			
			var newQuery = new Course();
			
			var resolve = true;
	
			const resolvingPromise = new Promise(function(resolve){
				
				resolve(newQuery.getCoursesRF(courseRef));
				done();
			});
			return resolvingPromise.then(function(resolve){
				
				console.log('getCoursesRF ' + resolve);
				expect(resolve).to.be.an('array').to.have.length.above(1);
				
				
			});

		});
		it('should return Instructor info',function(done){
			
			
			var newQuery = new Course();
			
			var resolve = true;
	
			const resolvingPromise = new Promise(function(resolve){
				
				resolve(newQuery.getCoursesForInstructor(existingEmail,instructorRef));
				done();
			});
			return resolvingPromise.then(function(resolve){
				
				expect(resolve).to.be.an('array').to.have.length.above(1);
				
				
			}).catch(function(er){
				
				done(new Error(er));
				
			})
		});
		it('should return a list of courses with course enrolled removed',function(done){
			
			var newQuery = new Course();
			
			var resolve = true;
			
			var enrolledKeyValPair = ['-KqssNUfcExQs8Q-OeKX'];
	
			//courseRef,CourseEnrollList
			const resolvingPromise = new Promise(function(resolve){
				
				resolve(newQuery.renderCoursesEnrolledList(courseRef,enrollmentRef,existingEmail));
				done();
			});
			return resolvingPromise.then(function(resolve){
				
				console.log('length' + resolve.length);
				
				console.dir(resolve);
				expect(resolve).to.be.an('Array').that.does.not.include("-KqssNUfcExQs8Q-OeKX");
				
				
			}).catch(function(er){
				
				done(new Error(er));
				
			})
			
			
		});
		it('should return a list of courses with course Instructor removed',function(done){
			
			var newQuery = new Course();
			
			var resolve = true;
			
	
			//courseRef,CourseEnrollList
			const resolvingPromise = new Promise(function(resolve){
				
				resolve(newQuery.getCourseforInstructor(existingEmail,instructorRef));
				done();
			});
			return resolvingPromise.then(function(resolve){
				
				console.log('length' + resolve.length);
				console.dir(resolve);
				expect(resolve).to.be.an('Array');
				
				
			}).catch(function(er){
				
				done(new Error(er));
				
			})
			
			
		});
		it('should return true when withdrawing a user from a Course',function(done){
			
			
			var newQuery = new CourseModify();
			var resolve = true;
			
			existingEmail = existingEmail.toLowerCase();
			existingEmail = existingEmail.replace(/\./g, ',');
			
			var courseData = ["-L77QkLgw4IzGwqHzHds"];
			//courseRef,CourseEnrollList
			const resolvingPromise = new Promise(function(resolve){
				
				resolve(newQuery.withdrawCourse("testemail@email,com",enrollmentRef,courseData));
				done();
			});
			return resolvingPromise.then(function(resolve){
				
				console.log('length' + resolve.length);
				console.log('resolve yo ' + resolve);
				expect(resolve).to.be.true;
				
				
			}).catch(function(er){
				
				done(new Error(er));
				
			})
			
		});
		
	})

})