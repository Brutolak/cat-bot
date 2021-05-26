const userService = require('../service/userService')

function MessageManager(bot){

    bot.onText( /\/start/, (msg, match) => {

        let user = userService.getClientInfo(msg)

        userService.saveUser(user, (saveErr, _) =>{
            if (saveErr){
                bot.sendMessage(clientInfo.telegramId, 'Some error with saving');
				return;
            }
        })
        
        userService.getById(user.id, (getErr, userDB) => {
            if (getErr){
                bot.sendMessage(clientInfo.telegramId, 'Some error with getting user');
				return;
            }else{
                bot.sendMessage(userDB.id, `Hello, ${userDB.firstName}`);
            }
        })

    })
}

module.exports = MessageManager