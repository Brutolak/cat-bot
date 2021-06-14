var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
	telegramId: String,
	mainMessageId: {type: Number, default: 0},
	lastType: {type: String, default: 'main'},
	language: {type: String, default: 'ru'},
	notify: Boolean,

	firstName: {type: String, default:'Player'},
	surrName:  {type: String, default:''},

	inventory: {type: Array, default: [
		{code: 'fish', amt: 0}
	]},
	ach: {type: Array, default: []},

	level: {type: Number, default: 1},
	health: {type: Number, default: 30},
	energy: {type: Number, default: 10},
	attack: {type: Number, default: 5},
	deffence: {type: Number, default: 1}
});

var User = mongoose.model('user', UserSchema);

module.exports = User;