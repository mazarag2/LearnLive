"use strict";
var page = require('webpage').create();
var server = require('webserver').create();
var system = require('system');
var host, port;
var port = "8080";




// We need the Service 
/*
var service = server.listen(8081, {keepAlive:true}, function() {
	
});

//if (service) {
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
//}
//else{
	
	console.log("Unable to create server");
	phantom.exit(1);
//}
*/
page.open("http://localhost:8080/" ,function(status) {
	console.log(status);
	var ua = page.evaluate(function() {
	  console.log("DOC" + document);
	  //console.log(document.querySelectorAll('.pageheader')[0]);
	  return document.getElementsByTagName('h1')[0].innerHTML;
	});
	
	if(!ua){
		
		console.log('Home page not found');
		phantom.exit(1);
	}
	else{
		console.log("Success retreiving Title " + ua);
		phantom.exit()
	}
	/*
	page.onResourceError = function(resourceError) {
		 console.log('Unable to load resource (#' + resourceError.id + 'URL:' + resourceError.url + ')');
		  console.log('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
	};
	page.onLoadFinished = function(status) {
		
		console.log(status);
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
	*/
});

