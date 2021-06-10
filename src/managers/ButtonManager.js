const userService = require('../service/userService')
const getText = require('./getText')

function buildKeyboard( type, query, telegramId ){
    
    var buttons = {
        main: [
            ['profile'],
            ['actions'],
            ['options']
        ],
        profile: [
            ['stats', 'equip'],
            ['achieves', 'inventory'],
            ['main']
        ],
        
    }

    if (query){
        
        if ( buttons[type] ){
            return {
                chat_id: telegramId,
                message_id: query.message.message_id,
                reply_markup: JSON.stringify({
                    inline_keyboard: buildButtons( buttons[type] )
                })
            }
        } else {
            return {
                chat_id: telegramId,
                message_id: query.message.message_id,
                reply_markup: JSON.stringify({
                    inline_keyboard: buildButtons( [['main']] )
                })
            }
        }

    }else{
        return {
            reply_markup: JSON.stringify({
                inline_keyboard: buildButtons( buttons[type] )
            })
        }
    }
}

function buildButtons( buttons ){
    
    var kbd = []

    //console.log(JSON.stringify(buttons))

    for ( var row in buttons){
        var kbdRow = []
        for ( var col in buttons[row] ){

            kbdRow.push({
                text: `${ getText( `btn_${buttons[row][col]}` )}`,
                callback_data: `${ buttons[row][col] }`
            })
            
        }
        kbd.push(kbdRow)
    }

    return kbd;
}

module.exports = {
    buildKeyboard
}