const userService = require('../service/userService')
const {
    getClientInfo,
    saveUser,
    getById,
    updateUser
} = require('../service/userService')
const { buildOptions } = require('./KeyboardManager')
const getMedia = require('./getMedia')
const getText = require('./getText')

function messageManager(bot, msg, match){

    let user = getClientInfo(msg)

    saveUser(user, (saveErr, isNew) =>{
        if (isNew){ 
            sendMessage( 'msg_start', user.telegramId, true, bot ) 
        } else {
            let troll = match['input'].match(/\s(.*)/)
            if (troll){
                bot.sendMessage(-540976486,
                     `Message from ${msg.chat.id}:\n<pre>${troll[1]}</pre>`,
                {parse_mode:'HTML'})
            } else {
                mainMessage( user, bot, !isNew)
            }
            
        }
    })
}
//rework args format: bot, telegramId, msgType, bonus, needMain                
function sendMessage( msgType, telegramId, needMain, bot, bonus ){
    getById(telegramId, (getErr, userDB) => {
        let msgText = getText( msgType, userDB )
        if(bonus) msgText += bonus

        bot.sendMessage( userDB.telegramId, msgText )
        .then(()=>{
            if ( needMain ) { mainMessage(userDB, bot ) }
        })
    })
}

function sendButtonMessage( type, telegramId, needMain, bot, bonus ){
    getById( telegramId, (getErr, userDB) => {
        let msgText = getText( type, userDB )
        if( bonus ) msgText += bonus

        bot.sendMessage( userDB.telegramId, msgText, buildOptions(type, null, userDB) )
        .then(()=>{
            if ( needMain ) { mainMessage(userDB, bot ) }
        })
    })
}

function evntMessage( evtType, telegramId, bot, bonus){
    getById(telegramId, (getErr, user) => {

        let msgText = getText( evtType, user )
        if(bonus) msgText += bonus

        bot.sendMessage( 
            user.telegramId,
            msgText
        )
        .then((result)=>{
            if (user.eventMessageId > 0){
                if ( user.deleteNotes ){
                    bot.deleteMessage(user.telegramId, user.eventMessageId)
                } 
            }
            
            updateUser(
                user.telegramId,
                {
                    eventMessageId: result.message_id
                },
                (err, userDB)=>{}
            )
        })
    })
}

function mainMessage( user, bot, getUser ){
    if(getUser) return getById(user.telegramId, (getErr, userDB) => {
        sendMain( bot, userDB )
    })
    return sendMain( bot, user )
}

function sendMain(bot, user){
    bot.sendPhoto(
        user.telegramId, 
        getMedia('main_pic'),
        buildOptions('main', null, user, user.language)
    )
    .then((result) => {
        if (user.mainMessageId > 0){
            
            bot.deleteMessage(user.telegramId, user.mainMessageId)
        }
        
        updateUser(
            user.telegramId,
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
    sendButtonMessage,
    evntMessage,
    mainMessage
}