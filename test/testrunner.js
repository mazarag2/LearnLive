"use strict";
var page = require('webpage').create();
var server = require('webserver').create();
var system = require('system');
var fs = require('fs');
var host;
var port = "8080";

//LOCALLY USE ENV VAR THEN RESEARCH TRAVIS 



var url = 'http://127.0.0.1:8080/';
var args = system.args;

if(args.length == 1){
	
	console.log("In order to run the test script please pass your credetials(email,password)\n" + 
				"For example phantomjs test/testrunner.js email password");
	phantom.exit(1);			
}


page.open(url ,function(status) {
	console.log(status);
	
	if(status != 'success'){
		console.log('Could not open page' + url);
		phantom.exit(1);
	}
	var ua = page.evaluate(function() {
	    console.log("DOC" + document);
	  
	    return document.getElementsByTagName('h1')[0].innerHTML;
	});
	
	if(!ua){
		
		console.log('Home page not found');
		phantom.exit(1);
	}
	else{
		console.log("Success retreiving Title " + ua);
		//phantom.exit()
	}
	
	
});

//setTimeout(function(){console.log(" On to Test Case 2 ")},3000);

var indexPage = require('webpage').create();

indexPage.open(url, args, function (status) {
   
    indexPage.includeJs('https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js', function () {
   
       
        indexPage.onLoadFinished = function () {
           
            indexPage.render("after_submit.png");
            console.log("Succesfull Login");
			var ua = indexPage.evaluate(function() {
				console.log("DOC" + document);
				return document.getElementsByTagName('h1')[0].innerHTML;
			});
			console.log("Title after login " + ua);
            phantom.exit();
           
        };
       

        indexPage.evaluate(function (args){
           
            $('[name="email"]').val(args[1]);
			$('[name="password"]').val(args[2]);
			$("button").click();
        },args);
       
       
        indexPage.render("before_submit.png");
       
       
   
    });
});


//console.log(" All testCases Passed");
//phantom.exit();
/*
var createUser = 'http://127.0.0.1:8080/CreateUser';
page.open(createUser,function(status){
	
	console.log(status);
	
	if(status != 'success'){
		console.log('Could not open page ' + createUser);
		phantom.exit(1);
	}
	var ua = page.evaluate(function() {
	  console.log("DOC" + document);
	  //console.log(document.querySelectorAll('.pageheader')[0]);
	   var form =  document.getElementsByTagName('form')[0];
	  
	  
	  
	});
	
	
}); 
*/

