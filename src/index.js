const telegramToken = require('./config/telegramToken')
const connectionString = require('./config/mongoToken')
const TelegramAPI = require('node-telegram-bot-api')
const { callbackManager } = require('./managers/CallbackManager')
const { messageManager, sendMessage } = require('./managers/MessageManager')
const { energyManager } = require('./service/userService')
const commands = require('./config/commands')
const mongoose = require('mongoose');

const bot = new TelegramAPI(telegramToken, { polling: true })
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });


bot.setMyCommands( commands )
    
bot.on("polling_error", (m) => console.log(m));

bot.on('callback_query',( query ) => {
    callbackManager( bot, query)
})

bot.onText( /\/start/, ( msg, match ) => {
    messageManager( bot, msg, match )
})

energyManager((isFull, telegramId)=>{
    if(isFull){
      //  sendMessage('msg_energy', telegramId, true, bot)
    }
})