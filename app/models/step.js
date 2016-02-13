var mongoose = require('mongoose');

var Step = mongoose.Schema({
	
	order: Number,
	stepContent: String,
	picture: String,
	video: String
	
});

// module.exports = mongoose.model('Step', stepSchema);
module.exports = Step;