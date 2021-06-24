const userService = require('../service/userService')
const keyboardManager = require('./KeyboardManager')
const getMedia = require('./getMedia')
const getText = require('./getText')

function messageManager(bot, msg){

    let user = userService.getClientInfo(msg)

    userService.saveUser(user, (saveErr, isNew) =>{
        if (saveErr){
            bot.sendMessage(user.telegramId, 'Some error with saving');
			return;
        }        
        sendMessage( 'msg_start', user, isNew, bot )
    })
}

function sendMessage( msgType, user, send, bot ){

    userService.getById(user.telegramId, (getErr, userDB) => {

        if ( send ){
                bot.sendMessage(
                    userDB.telegramId, 
                    getText( msgType, userDB )
                )
                .then(()=>{ 
                    mainMessage(userDB, bot ) 
                })
        } else {
            mainMessage(userDB, bot )
        }
    })
}

function mainMessage(userDB, bot){

    bot.sendPhoto(
        userDB.telegramId, 
        getMedia('main_pic'),
        keyboardManager.buildOptions('main', null, userDB, userDB.language)
    )
    .then((result) => {
        if (userDB.mainMessageId > 0){
            bot.deleteMessage(userDB.telegramId, userDB.mainMessageId)
        }
        
        userService.updateUser(
            userDB.telegramId,
            {
                mainMessageId: result.message_id
            },
            (err, userDB)=>{}
        )
    })
}

module.exports = {
    messageManager,
    sendMessage,
    mainMessage
}