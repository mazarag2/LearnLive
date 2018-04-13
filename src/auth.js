var auth = function() {
	
	var self = this;
	var LoggedIn = false;
	var firstName = "";
	const NodeCache = require("node-cache");
    const userCache = new NodeCache();
	this.CreateUser = function(postData,firebase,userRef){
		
		var origEmail = postData['email'];
		console.log(origEmail);
		var password = postData['password'];
		var password2 = postData['password2'];
		var firstName = postData['firstname'];
		var lastName = postData['lastname'];
		if(password != password2){
			
			return "Passwords do not match please try again";
			
		}
		else{
		
			var email = origEmail.toLowerCase();
			email = email.replace(/\./g, ',');
				
			// New User lets sign them up 

			var promise = new Promise(function(resolve){
				
				firebase.auth().createUserWithEmailAndPassword(origEmail, password).catch(function(error) {
				
					var errorMessage = error.message;
					console.log(errorMessage)
					return resolve(errorMessage);

				})
				firebase.auth().onAuthStateChanged(function(user) {
						if (user) {
					//var ref = database.ref('Users');
					
					var id = userRef.child(email);
					var newRef = id.push();
					
					newRef.set({
						firstname: firstName ,
						lastname : lastName 
					})
					//return resolve("Account Created Succesfully!");
					return  resolve("Account Created Succesfully");
					} else {
					// User is signed out.
					}
				});

		
			});
			
			return promise.then(function(resolve){
				
				if(resolve === "The email address is already in use by another account."){
					return resolve;
				}
				else{
					return "Account Created Succesfully";
				}
				
				//return resolve;
				/*
				if(resolve){
					
					return resolve;
				}
				else{
					//succesfully created
					return firebase.auth().onAuthStateChanged(function(user) {
						  if (user) {
							console.log(user);
							//var ref = database.ref('Users');
							
							var id = userRef.child(email);
							var newRef = id.push();
							
							newRef.set({
								firstname: firstName ,
								lastname : lastName 
							})
							return "Account Created Succesfully!";
							
						  } else {
							// User is signed out.
						  }
					});
					
					
				}
				*/
				
				
			});
			
		
		}
	}
	this.signInUser = function(email,password,firebase){
	
	
		var promise = new Promise(function (resolve,reject){
			
			
			firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
				var errorMsg = "Email and Password Incorrect please try again";
				reject(error.message);
				console.log(error.message);
				
				//res.render('login',{errorMsg : errorMsg});
			});
			
			firebase.auth().onAuthStateChanged(function(user) {
				  if (user) {return resolve(true);}
			});
			console.log('we out');
			
		});
		
		return promise.then(function(resolve,reject){
			
			console.log(resolve + '--' + reject);
			if(reject){
				
				return reject;
				
			}
			else{
				return resolve;
			}
			
			
			
			
		})
	}
};
module.exports = auth;