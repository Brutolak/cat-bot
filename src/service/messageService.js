var messageModel = require('../schema/message');

function getByTitle(title, callback) {
	messageModel.findOne({ title: title }, (err, message) => {
		if (err) {
			callback(err, null);
		}
		else {
			callback(null, message);
		}
	});
}

module.exports = {
    getByTitle
}