// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

// load up the user model
var User = require('../app/models/user');

// load the auth variables
var configAuth = require('./auth');

// expose this function to our app using module.exports
module.exports = function (passport) {

	// passport session setup ===============================
	// required for persistent login sessions
	// passport needs ability to serialize and unserialize users out of session

	// used to serialized the user for the session
	passport.serializeUser(function (user, callback) {
		callback(null, user.id);
	});

	// used to deserialize the user
	passport.deserializeUser(function (id, callback) {
		User.findById(id, function (err, user) {
			callback(err, user);
		});
	});


	// Local signup ========================================
	// we are using named strategies since we have one for login and one fore signup
	// by default, if there was no name, it would just be called 'local'

	passport.use('local-signup', new LocalStrategy({
		// by default, local strategy uses username and password, we will override with email
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true // allow us to pass back the entire request to the callback
	},
	function (req, email, password, callback) {

		// asynchronous
		// User.findOne wont fire unless data is sent back
		process.nextTick(function () {



			// find a user whose email is the same as the forms email
			// we are checking to see if the user trying to login already exists
			User.findOne({ 'local.email': email }, function (err, user) {

				// if there are any errors, return the error
				if (err)
					return callback(err);

				// check to see if theres already a user with that email
				if (user) {
					return callback(null, false, req.flash('signupMessage', 'That email is already takem'));
				} else {

					// if there is no user with that email
					// create the user
					var newUser = new User();

					// set the user's local credentials
					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password);
				
					// save the user
					newUser.save(function (err) {
						if (err)
							throw err;
						return callback(null, newUser);
					});
				}

			});

		});

	}));


	// Local login ========================================
	// we are using named strategies since we have one for login and one fore signup
	// by default, if there was no name, it would just be called 'local'
	
	passport.use('local-login', new LocalStrategy({
		// by default, local strategy uses username and password, we will override with email
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true // allow us to pass back the entire request to the callback
	},
	function (req, email, password, callback) { // callback with email and password from our form

		// find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email': email }, function (err, user) {

        	// if there are any errors, return the error before anything else
        	if (err) 
        		return callback(err);

        	// if no user is found, reutrn the message
        	if (!user) 
        		return callback(null, false, req.flash('loginMessage', 'No user found.'));
        		// req.flash is the way to set flashdata using connect-flash

        	// if the user is found but the password is wrong
        	if (!user.validPassword(password))
        		return callback(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
        		// create the loginMessage and save it to session as flashdata

        	// all is well, return successful user
        	return callback(null, user);
        });

	}));


	// Facebook Login =========================================

	passport.use(new FacebookStrategy({
		// pull in our app id and secret from our auth.js file
		clientID: configAuth.facebookAuth.clientID,
		clientSecret: configAuth.facebookAuth.clientSecret,
		callbackURL: configAuth.facebookAuth.callbackURL,
		profileFields: ['email', 'displayName', 'photos', 'gender', 'birthday']
	},

	// facebook will send back the token and profile
	function (token, refreshToken, profile, callback) {

		// asynchronous
		process.nextTick(function () {

			// find the user in the database based on their facebook id
			User.findOne({ 'facebook.id': profile.id }, function (err, user) {

				// if there is an error, stop everything and return that
				// ie an error connecting to the database
				if (err) 
					return callback(err);

				// if the user is found, then log them in
				if (user) {
					// update info every time login
					user.facebook.id = profile.id; // set the users facebook id                   
                    user.facebook.token = token; // we will save the token that facebook provides to the user                    
                    user.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                    user.facebook.name = profile.displayName;
                    user.facebook.picture = profile.photos[0].value;
                    user.facebook.gender = profile.gender;

                    user.save(function (err) {
                    	if (err) 
                    		throw err;

                    	// if successful, return the new user
                    	return callback(null, user);
                    });
					// return callback(null, user); // user found, return that user
				} else {
					// if there is no user found with that facebook id, create them
					var newUser = new User();

					// set all of the facebook information in our user model
					newUser.facebook.id = profile.id; // set the users facebook id                   
                    newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                    newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                    newUser.facebook.name = profile.displayName;
                    newUser.facebook.picture = profile.photos[0].value;
                    newUser.facebook.gender = profile.gender;

                    // save our user to the database
                    newUser.save(function (err) {
                    	if (err) 
                    		throw err;

                    	// if successful, return the new user
                    	return callback(null, newUser);
                    });
				}

			});

		});
	}));

	// Twitter Login ========================================

	passport.use(new TwitterStrategy({
		// pull in our app id and secret from our auth.js file
		consumerKey: configAuth.twitterAuth.consumerKey,
		consumerSecret: configAuth.twitterAuth.consumerSecret,
		callbackURL     : configAuth.twitterAuth.callbackURL
	},

	// facebook will send back the token and profile
	function (token, tokenSecret, profile, callback) {

		// asynchronous
		process.nextTick(function () {

			// find the user in the database based on their facebook id
			User.findOne({ 'twitter.id': profile.id }, function (err, user) {

				// if there is an error, stop everything and return that
				// ie an error connecting to the database
				if (err) 
					return callback(err);

				// if the user is found, then log them in
				if (user) {
					// update info every time login
					user.twitter.id          = profile.id;
                    user.twitter.token       = token;
                    user.twitter.username    = profile.username;
                    user.twitter.displayName = profile.displayName;

                    user.save(function (err) {
                    	if (err) 
                    		throw err;

                    	// if successful, return the new user
                    	return callback(null, user);
                    });
					// return callback(null, user); // user found, return that user
				} else {
					// if there is no user found with that facebook id, create them
					var newUser = new User();

					// set all of the user data that we need
					alert(profile);
                    newUser.twitter.id          = profile.id;
                    newUser.twitter.token       = token;
                    newUser.twitter.username    = profile.username;
                    newUser.twitter.displayName = profile.displayName;


                    // save our user to the database
                    newUser.save(function (err) {
                    	if (err) 
                    		throw err;

                    	// if successful, return the new user
                    	return callback(null, newUser);
                    });
				}

			});

		});
	}));

};