"use strict";
var page = require('webpage').create();
var server = require('webserver').create();
var system = require('system');
var host, port;
var port = "8080";





var service = server.listen(8080, {keepAlive:true}, function() {
	/*
	console.log("GOT HTTP REQUEST");
	console.log(JSON.stringify(request, null, 4));

	// we set the headers here
	response.statusCode = 200;
	response.headers = {"Cache": "no-cache", "Content-Type": "text/html"};
	// this is also possible:
	// now we write the body
	// note: the headers above will now be sent implictly
	response.write("Success");
	// note: writeBody can be called multiple times
   // response.write("<body><p>pretty cool :)</body></html>");
	response.close();
	*/
});
if (service) {
	//var page = new WebPage();
	var url = "http://localhost:" + "8080/";
	console.log("SENDING REQUEST TO:");
	console.log(url);
	page.open(url, function(status) {
	  if (status !== 'success') {
		console.log('Unable to access network');
	  } else {
		var ua = page.evaluate(function() {
			console.log(document);
		  console.log(document.getElementByClassName('pageheader').innerHTML);
		  return document.getElementByClassName('pageheader').innerHTML;
		});
		if(!ua){
			
			console.log('Home page not found');
			phantom.exit(1);
		}
	  }
	  //phantom.exit();
	});
	page.open('http://localhost:8080/',function(status){
	   console.log(status);
	   page.render('home.png');
	   phantom.exit();
	});
}
else{
	
	console.log("Unable to create server");
	phantom.exit(1);
}
page.open("http://localhost:8080/" ,function(status) {
	console.log(status);
	page.onResourceError = function(resourceError) {
		 console.log('Unable to load resource (#' + resourceError.id + 'URL:' + resourceError.url + ')');
		  console.log('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
	};
	page.onLoadFinished = function(status) {
		system.stderr.writeLine('= onLoadFinished()');
		system.stderr.writeLine('  status: ' + status);
		if (status !== 'success') {
		console.log('Unable to access network');
		} 
		else {
			var ua = page.evaluate(function() {
			  console.log("DOC" + document);
			  //console.log(document.querySelectorAll('.pageheader')[0]);
			  return document.getElementsByTagName('h1')[0].innerHTML;
			});
			
			
			/*
			var DOM = JSON.parse(JSON.stringify(ua));
			console.log(DOM);
			console.log("doc" + JSON.stringify(ua));
			*/
			if(!ua){
				
				console.log('Home page not found');
				phantom.exit(1);
			}
			else{
				console.log("Success retreiving Title " + ua);
				phantom.exit()
			}
		  }
		
	
	};
});

