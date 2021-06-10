const userModel = require('../schema/user');
const User = require('../schema/user');

function getClientInfo(msg) {
	return {
        telegramId: msg.from.id,
		firstName: msg.from.first_name,
		lastName: msg.from.last_name,
	};
}

function isNew(telegramId, callback) {
	userModel.findOne({ telegramId: telegramId }, (err, existingUser) => {
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
	isNew(user.telegramId, (err, result, _id) => {
		if (err) {
			callback(err, null);
			return;
		}

		if (result) {

			let newUserDto = new User({
				telegramId: user.telegramId,
				firstName: (user.firstName === undefined) ? '' : user.firstName
			})

			newUserDto.save((err) => {
				if (err) {
					callback(err, null);
				} else {
					callback(null, true);
					console.log(`User ${user.telegramId} saved.`)
				}
			});
		} else {
			callback(null, false);
		}
	})
}

function getById(telegramId, callback) {
	userModel.findOne({ telegramId: telegramId }, (err, user) => {
		if (err) {
			callback(err, null);
		}
		else {
			callback(null, user);
		}
	});
}

function updateUser( telegramId, newData ){

	let filter = { telegramId: telegramId }

	userModel.findOneAndUpdate(filter, newData, {new: true}, (err, user)=>{
		console.log(`User: ${user.telegramId}> Update data: ${JSON.stringify(newData)}`)
	})
}

function giveItems(telegramId, items){
	getById(telegramId, (err, user)=>{
		let { inventory } = user

		for ( var item in items ){
			let pos = isNewItem(item, inventory)
			if ( pos == -1 ){
				inventory.push(
					{ code: item, amt: items[item] }
				)
			}else{
				inventory[pos].amt += items[item]
			}

		}

		updateUser(telegramId, { inventory: inventory })
	})
}

function isNewItem(item, inventory){
	for ( var i in inventory ){

		if ( inventory[i].code == item ){
			return i;
		}
		pos++;
	}

	return -1;
}

module.exports = {
    getClientInfo,
	isNew,
	saveUser,
    getById,
	updateUser,
	giveItems
};