var express = require('express')
var router = express.Router() 
const qstring = require('querystring');
const url = require('url');


function escapeEmailAddress(email){
		
	if (!email) return false
	// Replace '.' (not allowed in a Firebase key) with ',' (not allowed in an email address)
	email = email.toLowerCase();
	email = email.replace(/\./g, ',');
	return email;
}

// define the enroll route
router.get('/Enroll', function (req,res) {
	
	var bodyData = '';
	req.on('data', function (chunk) {
		bodyData += chunk.toString();
	});
	req.on('end', function () {
		
		// we need to put the coursename in the enrollment 
		
		var header = url.parse(req.url, true);
		console.log(header.query);
		var postData = qstring.parse(bodyData);
		var CourseKey = header.query.course;
		var coursename = header.query.name;
		console.log("CourseName " + coursename);
		const server = require('./server');
		var email = req.app.get("userEmail");
		console.log("Email " + email)
		var ref = req.app.get("enrollRef");
		var id = ref.child(escapeEmailAddress(email));
		var newRef = id.push();
		newRef.set({
			//email : email,
			Course : CourseKey,
			CourseName : coursename
		})
		res.render('EnrollConfirm');

	});
})

module.exports = router