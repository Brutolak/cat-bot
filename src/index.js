const cMg = require('./managers/CallbackManager')
const mMg = require('./managers/MessageManager')
const telegramToken = require('./config/telegramToken')
const connectionString = require('./config/mongoToken')
const TelegramAPI = require('node-telegram-bot-api')
const commands = require('./config/commands')
const mongoose = require('mongoose');
const { match } = require('./config/telegramToken')

const bot = new TelegramAPI(telegramToken, { polling: true })
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });


bot.setMyCommands( commands )
    
bot.on("polling_error", (m) => console.log(m));

bot.on('callback_query', query => {
    cMg.callbackManager( bot, query)
})

bot.onText( /\/start/, ( msg, match ) => {
    mMg.messageManager( bot, msg )
})