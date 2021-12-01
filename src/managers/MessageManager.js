const { bot } = require("../bot");
const { Text } = require("./GetText");
const { Media } = require("./GetMedia");
const { Name, Start } = require("./GameManager");
const { BuildKeyboard } = require("./KeyboardManager");
const { GetById, UpdateUser } = require("../service/userService");

async function MessageManager(msg) {
  let text = MsgText(msg);

  if (text == "/start")
    return await Start(msg).then((isNew) => {
      if (isNew) Message("start", msg);
    });
  if (text == "/main") return Message("main", msg);

  let user = await GetById(msg.from.id);
  if (user.status == "name") return Name(msg).then((key) => Message(key, msg));
  if (user.status != "free" && user.status != "in_action") return;
  if (text == "/main") return Message("main", msg);
  if (text == "/me") return Message("me", msg);
  if (text == "/top") return Message("top", msg);
}

async function Message(key, msg) {
  let opt = await Options(key, msg);
  let {
    del,
    type,
    text,
    chat_id,
    media,
    reply_markup,
    user,
    parse_mode,
    message_id,
  } = opt;
  //console.log(opt);
  console.log(`User ${user.id} => ${key}`);

  if (type == "edit") {
    await bot.editMessageMedia(
      { type: "photo", media, caption: text, parse_mode },
      { chat_id, message_id, reply_markup }
    );
  }

  if (type == "text") {
    await bot.sendMessage(chat_id, text, { reply_markup, parse_mode });
  }

  if (type == "photo") {
    await bot
      .sendPhoto(chat_id, media, { caption: text, reply_markup, parse_mode })
      .then((result) => {
        if (chat_id == user.id && (key == "main" || key == "me")) {
          let new_id = result.message_id;
          UpdateUser(user.id, { message: { main: new_id } });
        }
        if (del) bot.deleteMessage(chat_id, del);
      });
  }

  let next = NextMessage(key);
  if (next) await Message(next, { from: { id: user.id } });
}

function NextMessage(key) {
  if (key.match(/^walk/)) return "main";
  switch (key) {
    case "look":
      return "yahoo";

    case "yahoo":
    case "full_energy":
      return "main";

    default:
      return false;
  }
}

async function Options(key, msg) {
  let user = await GetById(msg.from.id);
  let reply_markup,
    media,
    text,
    del = undefined;
  if (key == "me" || key == "stats") {
    if (msg.chat?.id == msg.from.id || msg.message?.chat?.id == msg.from.id) {
      reply_markup = await BuildKeyboard("stats", user);
      text = await Text("stats", user);
      del = NeedDelete(key, user);
    } else {
      text = await Text("me", user);
    }
    media = Media(user.avatar);
  } else {
    reply_markup = await BuildKeyboard(key, user);
    media = Media("main");
    text = key != "look" ? await Text(key, user) : await Text("mirror", user);
    if (typeof text != "string") {
      text = `<b>${text.icon} ${text.name}</b>\n\n<i>${text.caption}</i>`;
    }
    del = NeedDelete(key, user);
  }

  return {
    del,
    type: Type(key, msg),
    text,
    user,
    media,
    chat_id: ChatId(key, msg),
    message_id: MessageId(msg),
    parse_mode: "HTML",
    reply_markup,
  };
}

function NeedDelete(key, user) {
  switch (key) {
    case "main":
    case "me":
      return user.message.main;

    default:
      return false;
  }
}

function Type(key, msg) {
  if (msg.data && msg.data != "walk" && msg.data != "yahoo") return "edit";
  switch (key) {
    case "me":
    case "main":
    case "stats":
    case "start":
    case "name_correct":
    case "mirror":
      return "photo";

    default:
      return "text";
  }
}

function ChatId(key, msg) {
  if (msg.data) return msg.message.chat.id;
  if (key == "me" || key == "top")
    return msg.from.id == msg.chat.id ? msg.from.id : msg.chat.id;
  return msg.from.id;
}

function MessageId(msg) {
  if (msg.data) return msg.message.message_id;
}

function MsgText(msg) {
  if (msg.from.id == msg.chat.id) return msg.text;

  if (msg.text.match(/@/)) return msg.text.match(/^(.*)@/)[1];

  if (msg.reply_to_message?.from.id == 1818291689) return msg.text;

  return "";
}

module.exports = {
  MessageManager,
  Message,
};
