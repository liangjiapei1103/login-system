// app/routes

var User = require('./models/user.js');
var Recipe = require('./models/recipe.js');
var Step = require('./models/step.js');

module.exports = function(app, passport) {

	// Home page (with login links) ==========================
	app.get('/', function (req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});

	// Login Page ===========================================
	app.get('/login', function (req, res) {
		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	//process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile', // redirect to the secure profile section
		failureRedirect: '/login', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));

	// Signup page ==========================================
	app.get('/signup', function (req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile', // redirect to the secure profile section
		failureRedirect: '/signup', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
 	}));
	
	// profile page =========================================
	app.get('/profile', isLoggedIn, function (req, res) {
		res.render('profile.ejs', {
			user: req.user // get the user out of session and pass to template
		});
	});


	// Facebook routes ======================================
	// route for facebook authentication and login
	app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

	// handle the callback after facebook has authenticated the user
	app.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect: '/profile',
		failureRedirect: '/'
	}));


	// Twitter routes =======================================
	app.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/profile',
            failureRedirect : '/'
        })
    );

    // Google routes =========================================
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }))
    ;


	// logout ================================================
	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});


	// Authorize (already logged in / connecting other social account)

	// locally connect ==================================================
	app.get('/connect/local', function (req, res) {
		res.render('connect-local.ejs', { message: req.flash('loginMessage') });
	});
	app.post('/connect/local', passport.authenticate('local-login', {
		successRedirect: '/profile', // redirect to the secure profile section
		failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));

	// facebook connect ===============================================
	// send to facebook to do the authentication
    app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

    // handle the callback after facebook has authorized the user
    app.get('/connect/facebook/callback',
        passport.authorize('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        })
    ); 

    // twitter connect =======================================
    // send to twitter to do the authentication
    app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

    // handle the callback after twitter has authorized the user
    app.get('/connect/twitter/callback',
        passport.authorize('twitter', {
        successRedirect : '/profile',
        failureRedirect : '/'
    }));


    // google connect =================================================   
    // send to google to do the authentication
	app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

	// the callback after google has authorized the user
	app.get('/connect/google/callback',
	    passport.authorize('google', {
	        successRedirect : '/profile',
	        failureRedirect : '/'
	    })
    );



	// unlink accounts ======================================

	// local -----------------------------------
    app.get('/unlink/local', function(req, res) {

        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // twitter --------------------------------
    app.get('/unlink/twitter', function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
           res.redirect('/profile');
        });
    });

    // google ---------------------------------
    app.get('/unlink/google', function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
           res.redirect('/profile');
        });
    });






    // GET /recipe?username= & title= & date = 
	app.get('/recipe', function (req, res) {
		var query = req.query;

		if (query.username && query.title && query.date) {
			var recipe = Recipe.findOne({
				'username': query.username,
				'title': query.title,
				'data': query.date
			});
			res.json(recipe);
		} else {
			res.status(404).send();
		}
	});

	// POST /create-recipe/   
	app.post('/create-recipe', isLoggedIn, function (req, res, next) {


		if (req.user) {

			var body = req.body;

			var newRecipe = new Recipe();

			newRecipe.owner = req.user;
			newRecipe.recipeTitle = body.recipeTitle;

			newRecipe.date = new Date();
			newRecipe.numLikes = 0;


			for(var key in req.body) {
				if (key.substring(0,4) === "step") {
					var order = parseInt(key.substring(4));
					newRecipe.steps.push({order: parseInt(key.substring(4)), 
						stepContent: body[key], 
						picture: body["picture" + order], 
						video: body["video" + order]
					});
				}
			};

			newRecipe.save(function (err, newRecipe) {
				if (err) return console.log(err);
				//return res.redirect('/');
				return res.json(newRecipe);
			});
		} else {
			return res.json("Not login");
		}
	});

	// GET /create-recipe
	app.get('/create-recipe', isLoggedIn, function (req, res, next) {
		if (err) return console.log(err);
		res.sendfile('views/create-recipe.html');
	});


	// GET /recipes
	app.get('/recipes', function (req, res, next) {
		
		Recipe
			.find({})
			.exec(function (err, recipes) {
				if (err) return console.log(err);
				return res.json(recipes);
			});
	});

	// GET /recipe
	app.get('/recipe/:id', function (req, res, next) {
		Recipe.findById({ _id: req.params.id }, function (err, recipe) {
			if (err) return next(err);
			res.json(recipe);
		});
	});

	// GET /:usr/favorite
	app.get('/usr/favorite', function (req, res, next) {
		User.find({username: req.params.usr})
			.exec(function (err, user) {
				if (err) return next(err);
				return res.json(user.favorite);
			});
	});

	// GET /usr/:usr
	app.get('/usr/:usr', function (req, res, next) {
		User.find({username: req.params.usr})
			.exec(function (err, user) {
				if (err) return next(err);
				return res.json(user);
			});
	});

	// GET /usr/currentUser
	app.get('/usr/currentUser', isLoggedIn, function (req, res, next) {
		return json(req.user);
	});

	// POST /addToFavorite
	app.post('/recipe/:id/addToFavorite', function (req, res, next) {

		// find current recipe 
		Recipe.findById({ _id: req.params.id }, function (err, recipe) {
			if (err) return next(err);

			// find current User
			User.find({username: req.params.usr})
			.exec(function (err, user) {
				if (err) return next(err);
				user.favorite.push(recipe);
			});

			res.json(recipe);
		});
	});

};    

// route middleware to make sure a user is logged in
function isLoggedIn (req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't authenticated, redirect them to the home page
	res.redirect('/');
}