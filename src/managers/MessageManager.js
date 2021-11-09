const { bot } = require('../bot')
const { Text } = require('./GetText')
const { Media } = require('./GetMedia')
const { Name, Start } = require('./GameManager')
const { BuildKeyboard } = require('./KeyboardManager')
const { GetById, UpdateUser } = require('../service/userService')

async function MessageManager( msg ){
    let isCommand = msg.text.match(/\//)

    if (isCommand) {
        if (msg.text == '/start') return await Start( msg ).then((key) => Message(msg.from, key))

        let user = await GetById(msg.from.id)
        if (!(user.status == 'free' || user.status == 'in_action')) return
        if (msg.text == '/main') Message(user, 'main')
        if (msg.text == '/top') Message(user, 'top')
        if (msg.text == '/me'){
            if(msg.chat.id != msg.from.id) return Message(user, 'me')
            return Message( user, 'stats' )
            .then(msg => {
                UpdateUser(user.id, {message:{main:msg.message_id}})
                bot.deleteMessage(user.id, user.message.main)
            })
        }

    }else{
        let user = await GetById(msg.from.id)
        switch(user.status){
            case 'name': return Name(msg).then((user) => Message(user, 'name_correct'))
        }
    }
}

async function Message( user, key, callback ){

    let type = MessageType( key, callback )
    let next = NextMessage( key )
    let del = NeedDelete( key )
    let main = NeedMain( key )

    console.log(`${(user.name)? user.name : user.id} => Message( ${key}, ${type} )`)

    let opt = await Options(key, user)
    
    if( type == 'photo' ) {
        let media = (key == 'profile'||key == 'me'||key == 'yahoo')? Media(user.avatar) : Media(key) 
        await bot.sendPhoto(
        user.id,    // chat
        media, // media
        opt         // message options: caption, buttons
    ).then( result =>{
        let message_id = result.message_id
        if(del) bot.deleteMessage(user.id, user.message.main).then(
            UpdateUser(user.id, {message:{main: message_id}})
        )
    })}

    if( type == 'text') await bot.sendMessage(
        user.id,
        opt.caption,
        opt
    )


    if( type == 'edit'){
        let { caption, reply_markup, parse_mode } = opt
        let media = Media('main')
        await bot.editMessageMedia(
            {type:'photo', media, caption, parse_mode},
            {chat_id:user.id, message_id:callback.message_id, reply_markup }
        )
    }

    if (next) await Message( user, next )
    if (main) await Message( user, 'main')

    return msg
}

async function Options( key, user ){

    let text = await Text(key, user)
    
    if(typeof text !='string'){
        new_text = `<b>${text.icon} ${text.name}</b>\n\n<i>${text.caption}</i>`
        text = new_text
    }

    let opt = {
        caption: text,
        parse_mode: 'HTML',
        reply_markup: await BuildKeyboard(key, user)
    }
    
    return opt
}

function MessageType( key, callback ){ //text, photo, edit

    switch(key){
        case 'walk':
        case 'start':
        case 'name_invalid':
        case 'name_long':
        case 'full_energy':
        case 'top':
            return 'text'

        case 'stats':
            if(!callback) return 'photo'
        case 'actions':
            return 'edit'

        case 'me':
            return 'photo'
    }

    if(callback) return 'edit'

    let command = key.match(/_/)
    if ( !command ) return 'photo'
    return 'text'    
}

function NextMessage( key ){
    switch( key ){
        case 'mirror':
            return 'yahoo'

        default:
            return false
    }
}

function NeedDelete( key ){
    switch( key ){
        case 'main':
            return true

        default:
            return false
    }
}

function NeedMain( key ){
    if(key.match(/^walk/)) return true

    switch(key){
        case 'yahoo':
        case 'full_energy':
            return true
        
        default:
            return false
    }
}

module.exports = { 
    MessageManager,
    Message 
}