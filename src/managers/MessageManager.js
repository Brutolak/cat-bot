const userService = require('../service/userService')
const keyboardManager = require('./KeyboardManager')
const getText = require('./getText.js')

function messageManager(bot, msg){

    let user = userService.getClientInfo(msg)

    userService.saveUser(user, (saveErr, isNew) =>{
        if (saveErr){
            bot.sendMessage(user.telegramId, 'Some error with saving');
			return;
        }        
        sendMessage('start', user, isNew, bot)
    })
}

function sendMessage(type, user, send, bot){

    userService.getById(user.telegramId, (getErr, userDB) => {

        if ( send ){
            bot.sendMessage(
                userDB.telegramId, 
                getText( type, userDB )
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
            'https://sun9-65.userapi.com/impg/csd5MDMbKq8DwxhI2ofPwx5twDifOYueQzge_A/YODplZv3xCU.jpg?size=700x300&quality=96&sign=e80dca9f78ec9ff53734151a43ef69f1&type=album',
            keyboardManager.buildKeyboard('main', null, userDB.telegramId, userDB.language)
        )
    .then((result) => {
        if (userDB.mainMessageId > 0){
            bot.deleteMessage(userDB.telegramId, userDB.mainMessageId)
        }
        
        userService.updateUser(
            userDB.telegramId,
            {
                mainMessageId: result.message_id
            }
        )
    })
}

module.exports = {
    messageManager,
    sendMessage,
    mainMessage
}