// Импортируем файлы локализаций
// На данный момент доступна только одна локализация -- российская
// В планах: английская
const { ru } = require("../content/localization/ru");
const { GetTop } = require("../service/userService");

async function Text(key, user) {
  //console.log(key)
  let text = ru[key];
  if (typeof text === "string") return await Fill(text, user);
  if (Array.isArray(text)) return await Fill(Random(text), user);
  if (typeof text == "object") return text;
  return key;
}

function Random(text_array) {
  let n = Math.floor(Math.random() * text_array.length);
  return text_array[n];
}

// Функция, которая заполняет переменные в тексте
// Все данные берутся из данных пользователя (уровень, энергия и т.д)
async function Fill(text, user) {
  // Если в тексте есть переменные, заполняем их

  if (text.match(/\{(\w*)\}/)) {
    // формат переменных - {text}. Подробнее в гугле: регулярные выражения

    // Создаём копию текста, которую будем заполнять
    let s = "" + text;

    // Повторяем, пока в тексте есть переменные
    while (s.match(/\{(\w*)\}/)) {
      let a = s.match(/\{(\w*)\}/);
      let e = await GetVar(a[1], user);
      s = s.replace(a[0], e);
    }

    // Возвращем заполненный текст
    return s;
  }

  // Если переменных нет, возвращаем текст
  return text;
}

async function GetVar(key, user) {
  //console.log(user)

  switch (key) {
    case "user_name":
      return user.name;

    case "user_level":
      return user.level;

    case "user_exp":
      return user.exp;

    case "user_exp_max":
      return user.exp_max;

    case "user_fish":
      return user.inv[0].amt;

    case "user_energy":
      return `(${user.energy.cur}/${user.energy.max})`;

    case "reward_items":
      return await RewardText(user);

    case "event_timer":
      return await Timer();

    case "top":
      return await TopText(user);

    default:
      return await Text(key, user);
  }
}

async function RewardText(user) {
  let { reward, exp } = user.event;
  let rewardText = "";
  for (let key in reward) {
    let item = await Text(key);
    rewardText += `\n${item.icon}${item.name} x${reward[key]}`;
  }
  rewardText += `\n${await Text("exp", user)} x${exp}`;

  return rewardText;
}

async function TopText(user) {
  let N = 10; //ТОП-10 игроков

  let top = await GetTop(); // Получаем топ всех игроков

  let text = ""; //
  let inList = false; //

  //
  for (let i in top) {
    let { id, level, name } = top[i]; //

    if (i == "0") name = `👑 ${name} 👑`; //
    if (id == user.id) {
      inList = +i;
      name += YouSign(id);
    }
    if (i < N) text += `\n${+i + 1}. [${level}] ${name}`;
  }

  if (inList >= N) {
    text += `\n:\n${+inList + 1}. [${user.level}] ${user.name} ${YouSign(
      user.id
    )}`;
  }

  return text;
}

function YouSign(id) {
  switch (id) {
    case "85193591":
      return "🍆";

    case "764345345":
      return "♋";

    case "768478516":
      return "💀";

    case "1095075810":
      return "🗿";

    default:
      return "✅";
  }
}

module.exports = { Text };
