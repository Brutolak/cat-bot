const getText = require('./getText')
const keyboardManager = require('./ButtonManager')

function callbackManager(bot, query){    
    
    let type = query.data

    console.log(`User ${query.from.id} pressed btn_${type}`)
    bot.editMessageMedia(
        { 
            type: 'photo',
            media: 'https://sun9-65.userapi.com/impg/csd5MDMbKq8DwxhI2ofPwx5twDifOYueQzge_A/YODplZv3xCU.jpg?size=700x300&quality=96&sign=e80dca9f78ec9ff53734151a43ef69f1&type=album',
            caption: getText( type )
        },
        keyboardManager.buildKeyboard( type, query, query.from.id )
    )
}

module.exports = {
    callbackManager
}