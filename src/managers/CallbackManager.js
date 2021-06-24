const userService = require('../service/userService')
const keyboardManager = require('./KeyboardManager')
const eventManager = require('./EventManager')
const items = require('../content/items')
const getMedia = require('./getMedia')
const getText = require('./getText')


function callbackManager(bot, query){

    let type = query.data
    
    if ( needToUpdate(type) ) {

        let telegramId = query.from.id

        userService.getById( telegramId, (getErr, user) =>{

            console.log(`User ${user.playerName}(${user.telegramId}) pressed btn_${type}`)

            let { telegramId } = user

            let newMsgData = {
                bot: bot,
                mediaType: 'photo',
                media: getMedia('main_pic'),
                caption: getText( type, user ),
                kbType: type,
                query: query
            }

            let itemName = type.match(/item_(\w*)_/)
            let optType = type.match(/opt_(\w*)/)
            let actType = type.match(/act_(\w*)/)
            let backType = type.match(/back_(\w*)/)

            if ( itemName ){
                let language = user.language
                let item = items[itemName[1]]
                let itemNumber = type.match(/item_\w*_(\d*)/)[1]
                newMsgData.caption = `${item.icon} *${item.name[language]}${(itemNumber == 1)?'':`, ${itemNumber}`}*\n\n_${item.caption[language]}_`

                newMsgData.mediaType = 'animation'
                newMsgData.media = getMedia( itemName[1] )
                newMsgData.kbType = item.type
            }

            if ( actType ){
                let updateAction = (...args) => {
                    newMsgData.kbType = 'main'
                    let newEnergy = user.curEnergy - 1

                    if( newEnergy >= 0){
                        userService.updateUser( telegramId, {curEnergy: newEnergy }, (err, userDB) =>{
                            let eventType = actType[1]
                            eventManager.startEvent( eventType, userDB, bot )
                            userService.giveEnergy( telegramId, userDB )
                            editMessage( newMsgData, userDB)
                        })
                    }
                }
                
                return updateAction()
            }

            if ( optType ){

                let updateLang = (...args) => {
                    optLang = optType[1].match(/lang_(..)/)
                
                    if (optLang){
                        let language = optLang[1]
                        newMsgData.kbType = 'options'

                        userService.updateUser( telegramId, { language: language }, (err, userDB)=>{
                            editMessage( newMsgData, userDB )
                        })
                    } else{
                        editMessage( newMsgData, user )
                    }
                }

                return updateLang()
            }

            if ( backType ) newMsgData.kbType = backType[1]

            editMessage( newMsgData, user )    
        })
    }
}

function editMessage( newMsgData, user ){

    let {
        bot,
        mediaType,
        media,
        caption,
        kbType,
        query
    } = newMsgData

    bot.editMessageMedia(
        { 
            type: mediaType,
            media: media,
            caption: caption,
            parse_mode: 'Markdown'
        },
        keyboardManager.buildOptions( kbType, query, user )
    ) 
}

function needToUpdate( type ){

    switch (type){

        case 'empty':
        case 'work_in_progress':
            return false
        break

        default:
            return true
        break
    }
}

module.exports = {
    callbackManager
}