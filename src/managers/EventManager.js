const userService = require('../service/userService')
const messageManager = require('./MessageManager')
const getText = require('./getText')
const events = require('../content/events')
const items = require('../content/items')

function startEvent ( type, user, bot ){

    let { telegramId } = user
    let text = getText( `evt_${type}_start_`, user )
    let event = events[type]

    console.log(text)

    setTimeout(()=>{
        userService.updateUser( telegramId, {inAction: false}, (err, userDB)=>{

            //ЗАБАБАХАТЬ ТУТ СОБЫТИЕ

        })
    }, event.timer)
}

module.exports = {
    startEvent
}