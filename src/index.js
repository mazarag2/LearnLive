var express = require('express')
var router = express.Router() 
const qstring = require('querystring');
const url = require('url');
const CourseModify = require("./CourseModify");

function escapeEmailAddress(email){
		
	if (!email) return false
	// Replace '.' (not allowed in a Firebase key) with ',' (not allowed in an email address)
	email = email.toLowerCase();
	email = email.replace(/\./g, ',');
	return email;
}

// define the enroll route
router.post('/Enroll', function (req,res) {
	
	var bodyData = '';
	req.on('data', function (chunk) {
		bodyData += chunk.toString();
	});
	req.on('end', function () {
		
		// we need to put the coursename in the enrollment 
		
		var header = url.parse(req.url, true);
		console.log(header.query);
		var postData = qstring.parse(bodyData);
		var courseData = postData.enrollBox;
		
		if (typeof courseData == 'string'){
			var tempArr = new Array();
			tempArr.push(courseData);
			courseData = tempArr;
		}
		var CourseKey = header.query.course;
		var coursename = header.query.name;
		console.log("CourseName " + coursename);
		const server = require('./server');
		var email = req.app.get("userEmail");
		console.log("Email " + email);
		var ref = req.app.get("enrollmentRef");
		var query = new CourseModify();
		//var withdrawEnrollment = 
		query.EnrollCourse(escapeEmailAddress(email),ref,courseData);
		
		res.render('EnrollConfirm');
		//withdrawEnrollment.then(function(resolve){
			
			//res.render('EnrollConfirm');
			
			
		//});
		
		/*
		var id = ref.child(escapeEmailAddress(email));
		var newRef = id.push();
		newRef.set({
			//email : email,
			Course : CourseKey,
			CourseName : coursename
		})
		res.render('EnrollConfirm');
		*/
	});
})


router.post('/Withdraw', function (req,res) {
	
	var bodyData = '';
	req.on('data', function (chunk) {
		bodyData += chunk.toString();
	});
	req.on('end', function () {
		
		// we need to put the coursename in the enrollment 
		
		var header = url.parse(req.url, true);
		console.log(header.query);
		var postData = qstring.parse(bodyData);
		console.log(postData);
		var courseData = postData.withDrawBox;
		console.log(courseData);
		console.log(typeof courseData);
		if (typeof courseData == 'string'){
			var tempArr = new Array();
			tempArr.push(courseData);
			courseData = tempArr;
		}
		
		var CourseKey = header.query.course;
		var coursename = header.query.name;
		console.log("CourseName " + coursename);
		const server = require('./server');
		var email = req.app.get("userEmail");
		console.log("Email " + email);
		var ref = req.app.get("enrollmentRef");
		/*
		var queryRef = req.app.get("CourseModifyRef");
		var query = new queryRef();
		*/
		var query = new CourseModify();
		
		var withdrawEnrollment = query.withdrawCourse(escapeEmailAddress(email),ref,courseData);
		
		withdrawEnrollment.then(function(resolve){
			
			res.render('WithdrawalConfirm');
			
			
		});

	});
})

module.exports = router