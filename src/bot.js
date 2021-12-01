// Импортируем токен бота, который получили в BotFather
const telegramToken = require("./config/telegramToken");

// Импортируем библиотеку для работы с ботом
const TelegramAPI = require("node-telegram-bot-api");

// Создаём бота
const bot = new TelegramAPI(telegramToken, { polling: true });

// Импортируем комманды для бота
const commands = require("./config/commands");

// И устанавливаем их
bot.setMyCommands(commands);

// Экспортируем созданного бота,
// чтобы к нему был доступ из других файлов
module.exports = { bot };
