const { GetById, UpdateUser } = require("../service/userService");
const { StartEvent } = require("./EventManager");
const { Message } = require("./MessageManager");

async function CallbackManager(query) {
  if (query.data == "slot") return;
  if (query.data == "empty_inv") return;

  let key = await GetKey(query);

  let id = query.from.id;
  let user = await GetById(id);
  if (user.status == "avatar")
    user = await UpdateUser(id, { status: "free", avatar: "default" });

  if (key == "walk") await StartEvent(key, user);

  Message(key, query);
}

async function GetKey(query) {
  let cb = query.data;

  if (cb.match(/^lang_/)) {
    let language = cb.match(/^lang_(..)/)[1];
    await UpdateUser(query.from.id, { language: language });
    return "options";
  }
  if (cb.match(/^notes_/)) {
    let data = cb.match(/^notes_(.*)/)[1];
    data = data == "on" ? false : true;
    await UpdateUser(query.from.id, { delete_notes: data });
    return "options";
  }
  if (cb.match(/^back_/)) {
    let menu = cb.match(/^back_(.*)/)[1];
    return menu;
  }

  return cb;
}

module.exports = {
  CallbackManager,
};
