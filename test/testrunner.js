"use strict";
var page = require('webpage').create();
var server = require('webserver').create();
var system = require('system');
var host, port;
var port = "8080";


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

