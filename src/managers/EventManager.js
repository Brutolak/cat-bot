const messageManager = require('./MessageManager')

function startEvent ( eventType, user, bot ){

    messageManager.sendMessage ( eventType, user, true, bot )
}

module.exports = {
    startEvent
}