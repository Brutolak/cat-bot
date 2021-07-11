const User = require('../schema/user');

function getClientInfo( msg ) {

	let userLang = msg.from.language_code
	switch(userLang){

		case 'ru':
		case 'en':
		break

		default:
			userLang = 'en'
		break
	}

	return {
        telegramId: msg.from.id,
		playerName: msg.from.first_name,
		language: userLang
	};
};

function isNew( telegramId, callback ) {
	User.findOne({ telegramId: telegramId }, (err, existingUser) => {
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
	User.findOne({ telegramId: telegramId }, (err, user) => {
		if (err) {
			callback(err, null);
		}
		else {
			callback(null, user);
		}
	});
};

function updateUser( telegramId, newData, callback){

	User.findOneAndUpdate({ telegramId: telegramId }, newData, {new: true}, (err, user)=>{
		if (err) {
			callback(err, null);
		}
		else {
			console.log(`User: ${user.telegramId}> Update data: ${JSON.stringify(newData)}`)
			callback(null, user);
		}
	});
};

function energyManager(callback){

	console.log(`Energy Updater is started.`)

	const updateInterval = 60 * 1000 //one minute
	setInterval(()=>{

		const timer =  60 * 60 * 1000 //one hour
		let now = new Date()

		User.find({}, function (err, docs) { if(err) throw err; docs.forEach(user => {

			let {
				curEnergy,
				maxEnergy,
			} = user

			if ( curEnergy >= maxEnergy ) return 

			let {
				telegramId,
				timerEnergy,
				nextEnergy
			} = user

			if ( !timerEnergy ){
				let newData = {
					timerEnergy: true,
					nextEnergy: now
				}
				return updateUser( telegramId, newData, (err, userDB) =>{} )
			}

			let dTimer = now - nextEnergy

			if ( dTimer >= timer ){

				let newData = {
					nextEnergy: now,
					curEnergy: curEnergy + 1
				}

				if(newData.curEnergy >= maxEnergy){
					newData.timerEnergy = false
				}

				updateUser( telegramId, newData, (err, userDB)=>{
					if(userDB.curEnergy >= userDB.maxEnergy) callback(true, telegramId)
				} )	
			}
		})});
	}, updateInterval)
};

function setEnergyTimer( telegramId, costEnergy){

	getById( telegramId, (err, user)=> {

		let newData = {
			inAction: true,
			curEnergy: user.curEnergy - costEnergy,
		}
		
		if ( !user.timerEnergy ){
			newData.timerEnergy = true
			newData.nextEnergy =  new Date()
		}

		updateUser ( telegramId, newData, (err, user)=>{} )
	})
}

function giveExp( telegramId, exp ){

	getById( telegramId, (err, userDB) => {

		let levelData = {}
		let {level, curExp, maxExp} = userDB
		let newExp = curExp + exp

		if( newExp >= maxExp ){
			levelData.level = userDB.level + 1
			levelData.curExp = newExp - maxExp
			levelData.maxExp = maxExp + level
		} else{
			levelData.curExp = newExp
		}

		updateUser( telegramId, levelData, (err, updatedUser)=>{})
	})
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
	energyManager,
	setEnergyTimer,
	giveExp,
	takeItems
};