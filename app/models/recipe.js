		
var mongoose = require('mongoose');
var Comment = require('./comment.js');
var Step = require('./step.js');
var User = require('./user.js');
var Schema = mongoose.Schema;


// var Step = mongoose.Schema({
	
// 	stepContent: String,
// 	picture: String,
// 	video: String
	
// });

var recipeSchema = mongoose.Schema({
	owner: User,
	recipeTitle: String,
	date: String,
	// steps: [{type: Schema.Types.ObjectId, ref: 'Step'}],
	steps: [Step],
	// comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
	comments: [Comment],
	numLikes: Number
});

module.exports = mongoose.model('Recipe', recipeSchema);