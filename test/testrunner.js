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
var url = 'http://localhost:8080/';
page.open(url ,function(status) {
	console.log(status);
	page.onResourceRequested = function (request) {
		system.stderr.writeLine('= onResourceRequested()');
		system.stderr.writeLine('  request: ' + JSON.stringify(request, undefined, 4));
	};
	 
	page.onResourceReceived = function(response) {
		system.stderr.writeLine('= onResourceReceived()' );
		system.stderr.writeLine('  id: ' + response.id + ', stage: "' + response.stage + '", response: ' + JSON.stringify(response));
	};
	 
	page.onLoadStarted = function() {
		system.stderr.writeLine('= onLoadStarted()');
		var currentUrl = page.evaluate(function() {
			return window.location.href;
		});
		system.stderr.writeLine('  leaving url: ' + currentUrl);
	};
	 
	page.onLoadFinished = function(status) {
		system.stderr.writeLine('= onLoadFinished()');
		system.stderr.writeLine('  status: ' + status);
	};
	 
	page.onNavigationRequested = function(url, type, willNavigate, main) {
		system.stderr.writeLine('= onNavigationRequested');
		system.stderr.writeLine('  destination_url: ' + url);
		system.stderr.writeLine('  type (cause): ' + type);
		system.stderr.writeLine('  will navigate: ' + willNavigate);
		system.stderr.writeLine('  from page\'s main frame: ' + main);
	};
	 
	page.onResourceError = function(resourceError) {
		system.stderr.writeLine('= onResourceError()');
		system.stderr.writeLine('  - unable to load url: "' + resourceError.url + '"');
		system.stderr.writeLine('  - error code: ' + resourceError.errorCode + ', description: ' + resourceError.errorString );
	};
	 
	page.onError = function(msg, trace) {
		system.stderr.writeLine('= onError()');
		var msgStack = ['  ERROR: ' + msg];
		if (trace) {
			msgStack.push('  TRACE:');
			trace.forEach(function(t) {
				msgStack.push('    -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
			});
		}
		system.stderr.writeLine(msgStack.join('\n'));
	};
	if(status !== 'success'){
		console.log('Could not open page' + url);
		phantom.exit(1);
	}
	var ua = page.evaluate(function() {
	  console.log("DOC" + document);
	  //console.log(document.querySelectorAll('.pageheader')[0]);
	  return document.getElementsByTagName('h1')[0].innerHTML;
	});
	
	if(!ua){
		
		console.log('Home page not found');
		//phantom.exit(1);
	}
	else{
		console.log("Success retreiving Title " + ua);
		phantom.exit()
	}
	
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
	
});

