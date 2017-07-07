var express = require('express')
var router = express.Router() 
const qstring = require('querystring');
const url = require('url');


// define the enroll route
router.get('/Enroll', function (req,res) {
	
	var bodyData = '';
	req.on('data', function (chunk) {
		bodyData += chunk.toString();
	});
	req.on('end', function () {
		var header = url.parse(req.url, true);
		var postData = qstring.parse(bodyData);
		var CourseKey = header.query.course;
		const server = require('./server');
		var email = req.app.get("userEmail");
		var ref = req.app.get("enrollRef");
		var id = ref.push();
		id.set({
			email : email,
			Course : CourseKey
		})
		res.send("Enrolled Succesfully");

	});
})

module.exports = router