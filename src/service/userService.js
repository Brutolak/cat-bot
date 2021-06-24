const userModel = require('../schema/user');
const User = require('../schema/user');

function getClientInfo( msg ) {
	return {
        telegramId: msg.from.id,
		playerName: msg.from.first_name,
		language: msg.from.language_code
	};
};

function isNew( telegramId, callback ) {
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
};

function saveUser( user, callback ) {
	isNew( user.telegramId, (err, result) => {
		if (err) {
			callback(err, null);
			return;
		}

		if (result) {

			let newUserDto = new User({
				telegramId: user.telegramId,
				playerName: user.playerName,
				language: user.language,
				created: new Date(),
				nextEnergy: new Date()
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
};

function getById(telegramId, callback) {
	userModel.findOne({ telegramId: telegramId }, (err, user) => {
		if (err) {
			callback(err, null);
		}
		else {
			callback(null, user);
		}
	});
};

function updateUser( telegramId, newData, callback){
		userModel.findOneAndUpdate({ telegramId: telegramId }, newData, {new: true}, (err, user)=>{
			if (err) {
				callback(err, null);
			}
			else {
				//console.log(`User: ${user.telegramId}> Update data: ${JSON.stringify(newData)}`)
				callback(null, user);
			}
		});
};

function giveEnergy( telegramId, user){

	const hour = 20 * 1000
	
	if( user.curEnergy < user.maxEnergy ){
		let nextE = new Date()
		let dT = nextE - user.nextEnergy

		if( (dT >= hour) || (user.timerStarted == false) ){
			updateUser( telegramId, { nextEnergy: nextE, timerStarted: true }, (err, userDB) => {})

			setTimeout(() => {
				getById( telegramId, (err, userDB) => {
					updateUser( telegramId, { curEnergy: (userDB.curEnergy+1), timerStarted: false}, (err, updatedUser)=>{
						giveEnergy( telegramId, updatedUser )
					})
				} )
					
			}, hour);
		}
	}
};

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
		updateUser( telegramId, { inventory: inventory }, (err, userDB)=>{})
	})
};

function takeItems( telegramId, items ){
	getById(telegramId, (err, user)=>{
		let { inventory } = user

		for ( var item in items ){
			let pos = isNewItem(item, inventory)
			if ( pos == -1 ){
				return
			}else{
				let resultAmt = inventory[pos].amt - items[item]

				if (resultAmt > 0){
					inventory[pos].amt = resultAmt
				}else{
					if (resultAmt = 0){
						if (inventory[pos].code !== 'fish'){
							inventory.splice( pos, 1 )
						}else{
							inventory[pos].amt = resultAmt
						}
					}else{
						return
					}
				}
				updateUser(telegramId, { inventory: inventory }, (err, userDB)=>{})
			}
		}	
	})
};

function isNewItem(item, inventory){
	for ( var i in inventory ){
		if ( inventory[i].code == item ){
			return i;
		}
	}
	return -1;
};

module.exports = {
    getClientInfo,
	isNew,
	saveUser,
    getById,
	updateUser,
	giveItems,
	giveEnergy,
	takeItems
};