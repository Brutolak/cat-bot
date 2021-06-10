const userService = require('../service/userService')
const keyboardManager = require('./ButtonManager')
const getText = require('./getText.js')
const { emoji } = require('node-emoji')

function messageManager(bot, msg){

    let user = userService.getClientInfo(msg)
    let language = (msg.from.language_code == "ru") ? 'ru' : 'en'

    userService.saveUser(user, (saveErr, isNew) =>{
        if (saveErr){
            bot.sendMessage(user.telegramId, 'Some error with saving');
			return;
        }        
        sendMessage('start', user, isNew, language, bot)
    })
}

function sendMessage(messageTitle, user, isNew, language, bot){

    userService.getById(user.telegramId, (getErr, userDB) => {
        if (getErr){
            console.log(`Get user error id: ${user.telegramId}`);
            return;
        }

        if ( isNew ){
            bot.sendMessage(
                userDB.telegramId, 
                getText(  )
            )
            .then(()=>{ 
                mainMessage(userDB, bot, language) 
            })
        } else {
            mainMessage(userDB, bot, language)
        }
    })
}

function mainMessage(userDB, bot){
    Promise.all([

        bot.sendPhoto(
            userDB.telegramId, 
            'https://sun9-65.userapi.com/impg/csd5MDMbKq8DwxhI2ofPwx5twDifOYueQzge_A/YODplZv3xCU.jpg?size=700x300&quality=96&sign=e80dca9f78ec9ff53734151a43ef69f1&type=album',
            keyboardManager.buildKeyboard('main', null, userDB.telegramId)
        )
    ])
    .then((results) => {
        if (userDB.mainMessageId > 0){
            bot.deleteMessage(userDB.telegramId, userDB.mainMessageId)
        }
        
        userService.updateUser(
            userDB.telegramId,
            {
                mainMessageId: results[0].message_id
            }
        )
    })
}

module.exports = {
    messageManager,
    sendMessage,
    mainMessage
}