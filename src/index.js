const mongoose = require('mongoose');
const TelegramAPI = require('node-telegram-bot-api')

const telegramToken = require('./config/telegramToken')
const connectionString = require('./config/mongoToken')
const commands = require('./config/commands')

const bot = new TelegramAPI(telegramToken, { polling: true})
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

const start = () =>{
    bot.setMyCommands(commands)
    
    bot.on("polling_error", (m) => console.log(m));

    bot.on('message', msg => {
        //MessageManager(msg)
    })

    bot.on('callback_query', query => {
        //CallbackManager(msg)
    })
}

start();