var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
	id: String,
	firstName: String,
	lastName: String
});

var User = mongoose.model('user', UserSchema);

module.exports = User;