var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
	telegramId: String,
	mainMessageId: {type: Number, default: 0},
	lastType: {type: String, default: 'main'},

	firstName: {type: String, default:'Player'},
	surrName:  {type: String, default:''},

	inventory: {type: Array, default: [
		{code: 'fish', amt: 0}
	]},
	ach: {type: Array, default: []},

	
});

var User = mongoose.model('user', UserSchema);

module.exports = User;