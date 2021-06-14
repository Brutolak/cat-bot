const userService = require('../service/userService')
const keyboardManager = require('./KeyboardManager')
const eventManager = require('./EventManager')
const getMedia = require('./getMedia')
const getText = require('./getText')
const items = require('./Items')


function callbackManager(bot, query){    
    
    let mediaType = 'photo'
    let media = 'https://sun9-65.userapi.com/impg/csd5MDMbKq8DwxhI2ofPwx5twDifOYueQzge_A/YODplZv3xCU.jpg?size=700x300&quality=96&sign=e80dca9f78ec9ff53734151a43ef69f1&type=album'
    let type = query.data
    let user = query.from

    console.log(`User ${user.first_name}(${user.id}) pressed btn_${type}`)

    let needToUpdate

    switch (type){

        case 'empty':
        case 'work_in_progress':

            needToUpdate = false
        break

        default:

            needToUpdate = true
        break
    }

    if ( needToUpdate ) {
        
        userService.getById( user.id, (getErr, userDB) =>{

            let { telegramId } = userDB

            let caption = getText( type, userDB )
            let kbType = type
            let lang = userDB.language

            let itemName = type.match(/item_(\w*)/)
            let optType = type.match(/opt_(\w*)/)
            let actType = type.match(/act_(\w*)/)
            let backType = type.match(/back_(\w*)/)

            if ( itemName ){
                let item = items[itemName[1]]

                mediaType = 'animation'
                media = getMedia( itemName[1] )
                caption = `*${item.name[lang]}*\n\n_${item.caption[lang]}_`

                kbType = item.type
            }

            if ( actType ){
                eventManager.startEvent( actType[1], userDB, bot)
                kbType = 'main'
            }

            if ( optType ){
                optLang = optType[1].match(/lang_(..)/)
                
                if (optLang){
                    lang = optLang[1]
                    kbType = 'options'

                    userService.updateUser( telegramId, { language: lang })
                }
            }

            if ( backType ){
                kbType = backType[1]
            }

            bot.editMessageMedia(
                { 
                    type: mediaType,
                    media: media,
                    caption: caption,
                    parse_mode: 'MarkdownV2'
                },
                keyboardManager.buildKeyboard( kbType, query, userDB, lang )
            )    
        })
    }
}

module.exports = {
    callbackManager
}