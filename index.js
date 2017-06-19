var express = require('express')
var router = express.Router();

// define the home page route
router.post('/', function (req, res) {
  
  var bodyData = '';
	req.on('data', function (chunk) {
		bodyData += chunk.toString();
	});
	req.on('end', function () {
		
		var postData = qstring.parse(bodyData);
		console.log(postData);
		var email = postData['email'];
		var password = postData['password'];
		var role = postData['type'];
		var errorFlag = false;
		
			
		signInUser(email,password,res).then(function(resolve){
			console.log("mh");
			if(resolve){
				
				Promise.all([
			
					getFirstNamebyEmail(email),
					getCourses()
				
				]).then(function (results){
					console.log(results[0]+ '' + results[1]);
					
					res.render('index',{name : results[0],courses : results[1]});
					
				}).catch(function(error){
					
					console.log(error);
				})
			
			}
			
			
		});

	});

})
// define the about route
router.get('/about', function (req, res) {
  res.send('About birds')
})

module.exports = router