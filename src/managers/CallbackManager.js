const { getById, updateUser } = require('../service/userService');
const { buildOptions } = require('./KeyboardManager')
const {startEvent} = require('./EventManager')
const items = require('../content/items')
const getMedia = require('./getMedia')
const getText = require('./getText')


function callbackManager(bot, query){

    let type = query.data
    
    if ( needToUpdate(type) ) {

        let telegramId = query.from.id

        getById( telegramId, (getErr, user) =>{

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

            let backType = type.match(/back_(\w*)/)
            if ( backType ) newMsgData.kbType = backType[1]

            let actType = type.match(/act_(\w*)/)
            if ( actType ){
                newMsgData.kbType = 'main'
                return updateAction( actType, user, bot, newMsgData) 
            }

            let itemName = type.match(/item_(\w*)_/)
            if ( itemName ){
                let language = user.language
                let item = items[itemName[1]]
                let itemNumber = type.match(/item_\w*_(\d*)/)[1]
                newMsgData.caption = `${item.icon} *${item.name[language]}${(itemNumber == 1)?'':`, ${itemNumber}`}*\n\n_${item.caption[language]}_`

                newMsgData.mediaType = 'animation'
                newMsgData.media = getMedia( itemName[1] )
                newMsgData.kbType = item.type
            }

            let optType = type.match(/opt_(\w*)/)
            if ( optType ){
                
                optLang = optType[1].match(/lang_(..)/)
                if (optLang) {
                    newMsgData.kbType = 'options'
                    return updateLang( optLang, telegramId, newMsgData )
                }

                optNotes = optType[1].match(/notes_(..)/)
                if (optNotes) {
                    newMsgData.kbType = 'options'
                    return updateNotes( optNotes, telegramId, newMsgData )
                }
                
            }
            editMessage( newMsgData, user )    
        })
    }
}

function updateAction( actType, user, bot, newMsgData ) {
    let eventType = actType[1]
    startEvent( eventType, user, bot )
    editMessage( newMsgData, user)
}

function updateLang( optLang, telegramId, newMsgData ) {
    
    let language = optLang[1]
       
    updateUser( telegramId, { language: language }, (err, userDB)=>{
        editMessage( newMsgData, userDB )
    })
}

function updateNotes( optNotes, telegramId, newMsgData ) {
    
    let bool = false
    let value = optNotes[1]
    if (value === 'on'){
        bool = true
    }
       
    updateUser( telegramId, { deleteNotes: bool }, (err, userDB)=>{
        editMessage( newMsgData, userDB )
    })
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
        buildOptions( kbType, query, user )
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