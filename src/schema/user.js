var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
	telegramId: String,
	created: Date,
	mainMessageId: {type: Number, default: 0},
	energyMessageId: {type: Number, default: 0},
	eventMessageId: {type: Number, default: 0},
	deleteNotes: {type:Boolean, default: false},
	language: {type: String, default: 'ru'},

	playerName: String,

	level: {type: Number, default: 1},
	curExp: {type: Number, default: 0},
	maxExp: {type: Number, default: 10},

	curHealth: {type: Number, default: 30},
	maxHealth: {type: Number, default: 30},

	maxEnergy: {type: Number, default: 5},
	curEnergy: {type: Number, default: 5},
	inAction: {type: Boolean, default: false},
	nextEnergy: {type: Date},
	timerEnergy: {type: Boolean, default: false},

	attack: {type: Number, default: 3},
	deffence: {type: Number, default: 0},
	equip: {type: Object, default: {} },

	inventory: {type: Array, default: [
		{code: 'fish', amt: 0}
	]},
	ach: {type: Array, default: []},
});

var User = mongoose.model('user', UserSchema);

module.exports = User;