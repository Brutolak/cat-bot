var userModel = require('../schema/user');

function getClientInfo(msg) {
	return {
        id: msg.from.id,
		firstName: msg.from.first_name,
		lastName: msg.from.last_name,
		
	};
}

function isNew(id, callback) {
	userModel.findOne({ id: id }, (err, existingUser) => {
		if (err) {
			callback(err, null);
			return;
		}

		if (existingUser) {
			callback(null, false);
		} else {
			callback(null, true);
		}
	});
}

function saveUser(user, callback) {
	isNew(user.id, (err, result) => {
		if (err) {
			callback(err, null);
			return;
		}

		if (result) {
			var newUserDto = new userModel({
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName
			});

			newUserDto.save((err) => {
				if (err) {
					callback(err, null);
				} else {
					callback(null, true);
				}
			});
		} else {
			callback(null, false);
		}
	})
}

function getById(id, callback) {
	userModel.findOne({ id: id }, (err, user) => {
		if (err) {
			callback(err, null);
		}
		else {
			callback(null, user);
		}
	});
}

module.exports = {
    getClientInfo,
	isNew,
	saveUser,
    getById
};