// app/models/user.js

//load the things we need
var mongoose = require('mongoose');
var Recipe = require('./recipe.js');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

// define the schema for our user models
var userSchema = Schema({

	// local login info
	local: {
		email: String,
		password: String
	},
	// facebook login info
	facebook: {
		id: String,
		token: String,
		email: String,
		name: String,
		picture: String,
		gender: String,
		birthday: String
	},
	// user info
	info: {
		username: String,
		gender: String,
		picture: String,
		// recipes object array
		recipes: [{type: Schema.Types.ObjectId, ref: 'Recipe'}],
		// facorite recipes array
		favorite: [{type: Schema.Types.ObjectId, ref: 'Recipe'}],
		// people who are following you
		follower: [this],
		// the people you are following
		following: [this]
	}

});


// methods ================================================

//generating a hash
userSchema.methods.generateHash = function (password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
	return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);