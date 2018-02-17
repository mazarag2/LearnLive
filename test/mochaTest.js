var assert = require('assert');
const query = require("../src/query");
var firebase = require("firebase");
const dotev = require('dotenv').config();
var config = {
    apiKey : process.env.API_KEY,
    authDomain: "learnlive-f6376.appspot.com",
    databaseURL: "https://learnlive-f6376.firebaseio.com",
    projectId: "learnlive-f6376",
    storageBucket: "learnlive-f6376.appspot.com",
    messagingSenderId: "749566368306"

};

firebase.initializeApp(config);


var courseRef = firebase.database().ref("Courses");
var userRef = firebase.database().ref("Users");
var enrollmentRef = firebase.database().ref("Enrollment");
var instructorRef = firebase.database().ref("Instructors");

describe('Create', function() {
  describe('#CheckifUserExists()', function() {
	    
    it('should return an error msg for pre-existing users', function() {
		
		const errorMsg = "The email address is already in use by another account.";
		var newQuery = new query();
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
			
			resolve(newQuery.CreateUser(postData,firebase,userRef));
			
		});
		return resolvingPromise.then(function(resolve){
			
			assert.equal(errorMsg,resolve);
			
		})
		
    });
	
  });
});