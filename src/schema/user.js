var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var now = new Date()

var UserSchema = new Schema({
	id: {type: String},
	created: {type: Date, default: now},
	status: {type: String, default:'name'},
	language: {type: String, default: 'en'},
	message: {type: Object, default:{
		main: 0,
		event: 0,
		energy: 0,
	}},
	delete_Notes: {type:Boolean, default: false},

	name: {type: String},
	avatar: {type: String},
	
	level: {type: Number, default: 1},
	exp: {type: Number, default: 0},
	exp_max: {type: Number, default: 10},
	level_date: {type: Date, default: now},

	energy: {type: Object, default:{
		cur: 5,
		max: 5,
		date: now,
		timer: false,
	} },
	event: {type: Object, default: {}},
	inv: {type: Array, default: [
		{code: 'fish', amt: 0}
	]},
	ach: {type: Array, default: []},

	//curHealth: {type: Number, default: 30},
	//maxHealth: {type: Number, default: 30},
	//attack: {type: Number, default: 3},
	//deffence: {type: Number, default: 0},
	//equip: {type: Object, default: {} },
});

var User = mongoose.model('user', UserSchema);

module.exports = User;