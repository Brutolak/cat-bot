const { GetById, UpdateUser } = require('../service/userService');
const { StartEvent } = require('./EventManager')
const { Message } = require('./MessageManager')

async function CallbackManager( query ){
    if (query.data == 'slot') return
    let key = await GetKey(query)
    let id = query.from.id

    let user = await GetById( id )
    if(user.status == 'avatar') user = await UpdateUser(id, {status:'free', avatar:'default'})
    
    if(key == 'walk') StartEvent(key, user)

    Message( user, key, query.message )
}

async function GetKey( query ){
    let cb = query.data

    if (cb.match(/^lang_/)){
        let language = cb.match(/^lang_(..)/)[1]
        await UpdateUser(query.from.id, {language: language})
        return 'options'
    }
    if (cb.match(/^back_/)){
        let menu = cb.match(/^back_(.*)/)[1]
        return menu
    }

    return cb
}

module.exports = {
    CallbackManager
}