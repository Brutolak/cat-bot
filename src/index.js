//Импортируем библиотеку Mongoose для работы с Базой Данных (БД)
const mongoose = require('mongoose');

//Импортируем токен для соединения с БД
const connectionString = require('./config/mongoToken')

//Коннектимся к БД
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

//Импортируем необходимые функции из файлов
const { UserDataUpdater } = require('./service/userService')
const { CallbackManager } = require('./managers/CallbackManager')
const { MessageManager, Message } = require('./managers/MessageManager')

//Импортируем бота, которого создали в соседнем файле
const { bot } = require('./bot')

// При возникновении ошибки бот будет выводить её в консоль
bot.on("polling_error", (m) => console.log(m) );

// При получении сообщения бот вызывает функцию обработки сообщений
bot.on('message', msg => MessageManager(msg))

// При нажатии на кнопки бот вызывает функцию обработки нажатий
bot.on('callback_query',( query ) => CallbackManager(query) )

// Запускаем функцию, которая обновляет данные пользователей
UserDataUpdater( (user, isEvent, event, isEnergy)=>{

    // Если были обновлены данные евента
    // то отправляем сообщение с текстом шага*
    if(isEvent){

        // Достаём переменные шагов 
        // и активного шага из евента
        let { steps, act } = event
        let step = steps[act]
        
        user.event = event
        Message(user, step.text)
    }

    // Если обновлены данные энергии
    if(isEnergy){

        // Достаём переменные из объекта пользователя 
        let { cur, max } = user.energy

        // Если у пользователя полная энергия
        if (cur >= max) Message(user, 'full_energy')
    }
})