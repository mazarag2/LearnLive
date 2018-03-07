var assert = require('assert');
const query = require("../src/query");
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



describe('Create', function() {
  describe('#CheckUserFunctions()', function() {
	    
    it('should return an error msg for Creating an Account with Existing email', function() {
		
		const errorMsg = "The email address is already in use by another account.";
		var newQuery = new query();
		var newAuth = new auth();
		var existingEmail = process.env.TEST_EMAIL;
		var password1 = process.env.TEST_PASSWORD;

		var postData = {
			
			email : existingEmail,
			password : password1,
			password2 : password1,
			firstname : "Mike",
			lastname : "Z"
			
		}
		const resolvingPromise = new Promise(function(resolve){
			
			resolve(newAuth.CreateUser(postData,firebase,userRef));
			
		});
		return resolvingPromise.then(function(resolve){
			
			assert.equal(errorMsg,resolve);
			
		})
		
    });
	
	it('should return true logging in Existing User',function(done){
		
		const result = true;
		
		var newAuth = new auth();
		
		const resolvingPromise = new Promise(function(resolve){
			
			resolve(newAuth.signInUser(existingEmail,password1,firebase));
			done();
			
		});
		return resolvingPromise.then(function(resolve){
			

			assert.equal(result,resolve);
			
		})
	});
	
	it('should fail logging in non-existant user',function(){
		
		const result = "The password is invalid or the user does not have a password.";
		
		var newAuth = new auth();
		
		var password2 = process.env.TEST_PASSWORD2;
		
		const resolvingPromise = new Promise(function(resolve,reject){
			
			resolve(newAuth.signInUser(existingEmail,password2,firebase));
			done();
			
		});
		return resolvingPromise.catch(function(e) {
			expect(e).to.equal(result);
		})
		
	});
	
	
  });
  /* Under Construction
  describe('#CourseCreate',function(){
		we give it a testREf and create one FB testCreadeDummy
		it('should ')
		
		
		
  })
  */
  
  
});

describe('CourseIndex',function(){
	
	describe('#CourseIndex',function(){
		
		before(function() {
			// runs before all tests in this block(need to log in a test user to authenticate Fb Calls)
			var newAuth = new auth();
	
			const resolvingPromise = new Promise(function(resolve){
				
				resolve(newAuth.signInUser(existingEmail,password1,firebase));
				done();
				
			});
			return resolvingPromise.then(function(resolve){
				
				return resolve;
				
			})
			
		 });
		it('should return a list of Available Courses',function(done){
			
			var newQuery = new query();
			
			var resolve = true;
	
			const resolvingPromise = new Promise(function(resolve){
				
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
			
			var newQuery = new query();
			
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
			
			
			var newQuery = new query();
			
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
			
			
			var newQuery = new query();
			
			var resolve = true;
	
			const resolvingPromise = new Promise(function(resolve){
				
				resolve(newQuery.getCoursesRF(courseRef));
				done();
			});
			return resolvingPromise.then(function(resolve){
				
				expect(resolve).to.be.an('array').to.have.length.above(1);
				
				
			}).catch(function(er){
				
				done(new Error(er));
				
			})

		});
		it('should return Instructor info',function(done){
			
			
			var newQuery = new query();
			
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
		
	})
	
	
})