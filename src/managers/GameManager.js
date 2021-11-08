const { SaveUser, UpdateUser, GetById } = require('../service/userService')

async function Start( msg ){
    let user = await GetById( msg.from.id )
    if (user) return console.log(`User [id=${user.id}] already exists`)
    await SaveUser( msg )
    console.log(`User ${msg.from.id} saved.`)
    return Promise.resolve('start')
}

async function Name( msg ){
    let text = msg.text

    if (!text) return

    let hasEmoji = text.match(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/) //regex for emoji. Just trust
    if(hasEmoji) return Promise.resolve('name_emoji')

    if (text.length > 20 ) return Promise.resolve('name_long')
   
    let user = await UpdateUser(msg.from.id, {name: text, status:'avatar'})
    return Promise.resolve(user)
}

module.exports = { 
    Start,
    Name
}