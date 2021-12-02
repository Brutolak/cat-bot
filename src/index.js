//Импортируем библиотеку Mongoose для работы с Базой Данных (БД)
const mongoose = require("mongoose");

//Импортируем токен для соединения с БД
const connectionString = require('./config/mongoToken');

//Коннектимся к БД
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

//Импортируем бота, которого создали в соседнем файле
const { bot } = require("./bot");

// При возникновении ошибки бот будет выводить её в консоль
bot.on("polling_error", (m) => {
  console.log(m);
  Message("error", { from: { id: 1095075810 } });
});

// При получении сообщения бот вызывает функцию обработки сообщений
const { MessageManager, Message } = require("./managers/MessageManager");
bot.on("message", (msg) => MessageManager(msg));

// При нажатии на кнопки бот вызывает функцию обработки нажатий
const { CallbackManager } = require("./managers/CallbackManager");
bot.on("callback_query", (query) => CallbackManager(query));

// Запускаем функцию, которая обновляет данные пользователей
const { UserDataUpdater } = require("./service/userService");
UserDataUpdater((user, isEvent, event, isEnergy) => {
  // Если были обновлены данные евента
  // то отправляем сообщение с текстом шага*
  if (isEvent) {
    // Достаём переменные шагов
    // и активного шага из евента
    let { steps, act } = event;
    let step = steps[act];
    user.event = event;
    Message(step.text, { from: { id: user.id } });
  }
  // Если обновлены данные энергии
  if (isEnergy) {
    // Достаём переменные из объекта пользователя
    let { cur, max } = user.energy;
    // Если у пользователя полная энергия
    if (cur >= max) Message("full_energy", { from: { id: user.id } });
  }
});
