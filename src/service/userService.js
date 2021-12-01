const Top = require("../schema/top");
const User = require("../schema/user");
const items = require("../content/items");

async function GetById(id) {
  return User.findOne({ id: id });
}

async function SaveUser(msg) {
  let user = GetUserInfo(msg);
  let saved_user = await user.save({ new: true });
  return saved_user;
}

function GetUserInfo(msg) {
  let lang = msg.from.language_code == "ru" ? "ru" : "en";
  return new User({
    id: msg.from.id,
    language: lang,
  });
}

async function UpdateUser(id, newData) {
  let user = await User.findOneAndUpdate({ id: id }, newData, { new: true });
  console.log(`User ${id} updated: ${JSON.stringify(newData)}`);
  return Promise.resolve(user);
}

async function UserDataUpdater(callback) {
  console.log(`User Data Updater is started.`);
  const updateInterval = 20 * 1000; //one minute
  setInterval(() => {
    User.find({}, function (err, docs) {
      if (err) throw err;
      let user_list = [];
      docs.forEach(async (user) => {
        let now = new Date();
        let { id, level, name, level_date } = user;
        if (user.name) user_list.push({ id, level, name, level_date });
        let energy_data = energyUpdater(user, now);
        let isEnergy = Object.keys(energy_data).length ? true : false;
        let event_data = eventUpdater(user, now);
        let isEvent = Object.keys(event_data).length ? true : false;
        let newData = { ...energy_data, ...event_data };
        if (Object.keys(newData).length) {
          let event;
          if (isEvent) event = user.event;
          let new_user = await UpdateUser(id, newData);
          callback(new_user, isEvent, event, isEnergy);
        }
      });
      UpdateTop(user_list);
    });
  }, updateInterval);
}

async function UpdateTop(user_list) {
  // Сортируем персонажей сначала по уровню. 			  Если уровни равны, то сравниваем по дате получения уровня.
  user_list.sort((a, b) =>
    a.level < b.level
      ? 1
      : a.level === b.level
      ? new Date(a.level_date) > new Date(b.level_date)
        ? 1
        : -1
      : -1
  );
  let new_top = [];
  for (let i in user_list) {
    let { id, level, name } = user_list[i];
    new_top.push({ n: +i + 1, id, level, name });
  }
  await Top.findOneAndUpdate({ id: 1 }, { top: new_top }, { new: true });
}

async function GetTop() {
  let top_db = await Top.findOne({});
  return top_db.top;
}

function energyUpdater(user, now) {
  let { cur, max } = user.energy;
  if (cur >= max) return {};
  let new_energy = { ...user.energy };
  let { timer, date } = new_energy;
  const energy_timer = 60 * 1000; //one hour
  if (!timer) {
    new_energy.timer = true;
    new_energy.date = now;
    return { energy: new_energy };
  }
  let dTimer = now - date;
  if (dTimer >= energy_timer) {
    new_energy.date = now;
    new_energy.cur += 1;
    if (new_energy.cur >= max) {
      new_energy.timer = false;
      new_energy.date = null;
    }
    return { energy: new_energy };
  }
  return {};
}

function eventUpdater(user, now) {
  switch (user.status) {
    case "free":
    case "start":
    case "name":
    case "avatar":
      return {};
  }
  let { event } = user;
  let { act, steps, msg } = event;
  let current_step = steps[act];
  let new_event = {};
  if (!current_step.active) {
    if (!msg) {
      new_event = { event: event };
      new_event.event.msg = true;
      return new_event;
    } else return {};
  }
  let { timer, reward, exp } = current_step;
  let dTimer = now - event.timer;
  if (dTimer >= timer) {
    if (act + 1 > steps.length - 1) {
      new_event = {
        event: { text: current_step.text, reward, exp },
        status: "free",
      };
    } else {
      new_event = {
        event: event,
      };
      new_event.event.msg = false;
      new_event.event.timer = now;
      new_event.event.act = act + 1;
    }
    if (Object.keys(reward).length) {
      new_event.inv = giveItems(user, reward);
    }
    if (exp) {
      let levelData = giveExp(user, exp);
      for (key in levelData) {
        new_event[key] = levelData[key];
      }
    }
    return new_event;
  }
  return {};
}

async function SetEvent(id, event) {
  let user = await GetById(id);
  await UpdateUser(id, {
    event: event,
    status: "in_action",
    energy: SetEnergy(user, 1),
  });
  return;
}

function SetEnergy(user, cost) {
  let new_energy = { ...user.energy };
  new_energy.cur -= cost;
  if (!user.energy.timer) {
    new_energy.timer = true;
    new_energy.date = new Date();
  }
  return new_energy;
}

function giveExp(user, bonus_exp) {
  let { level, exp, exp_max } = user;
  let new_exp = exp + bonus_exp;
  if (new_exp >= exp_max)
    return {
      level: user.level + 1,
      level_date: new Date(),
      exp: new_exp - exp_max,
      exp_max: exp_max + level,
    };
  return { exp: new_exp };
}

function giveItems(user, items) {
  let { inv } = user;
  for (var item in items) {
    let pos = isNewItem(item, inv);
    if (pos == -1) {
      inv.push({ code: item, amt: items[item] });
    } else {
      inv[pos].amt += items[item];
    }
  }
  return inv;
}

function isNewItem(item, inventory) {
  if (items[item].unique) return -1;
  for (var i in inventory) {
    if (inventory[i].code == item) {
      return i;
    }
  }
  return -1;
}

module.exports = {
  GetUserInfo,
  SaveUser,
  GetById,
  UpdateUser,
  giveItems,
  UserDataUpdater,
  SetEvent,
  giveExp,
  GetTop,
};
