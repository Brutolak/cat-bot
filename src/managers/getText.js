function getText( type, user, lang){

    let { language } = user

    let isBack = type.match(/btn_back_(\w*)/)

    if ( text[type] ){

        if ( lang ){
            return text[type][lang]
        }else{
            return text[type][language]
        }

    } else {

        if ( isBack ){
            return text['btn_back'][language]
        }else{
            return '';
        }
    }
}

var text = {

    start: {
        ru: `Ура! 🙀 Теперь ты кот!`,
        en: `Wow! 🙀 You're a cat now!`
    },

    walk: {
        ru: `Ты пошёл на прогулку. `,
        en: `You went for a walk`
    },

    cave: {
        ru: `Ты пошёл в пещеру.`,
        en: `You went to the cave.`
    },

    btn_main: {
        ru: `🏠 На главную`,
        en: `🏠 Back to Main`
    },

    btn_profile: {
        ru: `😺 Профиль`,
        en: `😺 Profile`
    },

    btn_actions: {
        ru: `🏃 Действия`,
        en: `🏃 Actions`
    },

        btn_act_walk: {
            ru: `🐾 Прогулка`,
            en: `🐾 To walk`
        },

        btn_act_cave: {
            ru: `⛰ Пещера`,
            en: `⛰ To the Cave `
        },
    
    btn_options: {
        ru: `⚙ Настройки`,
        en: `⚙ Options`
    },
    
        btn_opt_lang: {
            ru: `🌐 Язык`,
            en: `🌐 Language`
        },

            btn_opt_lang_ru: {
                ru: `🇷🇺 Русский`,
                en: `🇷🇺 Russian`
            },

            btn_opt_lang_en: {
                ru: `🇬🇧 Английский`,
                en: `🇬🇧 English`
            },

        btn_opt_notify: {
            ru: `🔔 Оповещения`,
            en: `🔔 Notifications`
        },

    btn_stats: {
        ru: `📊 Статы`,
        en: `📊 Stats`
    },

    btn_equip: {
        ru: `👕 Экипировка`,
        en: `👕 Equip`
    },

    btn_achieves: {
        ru: `🏆 Достижения`,
        en: `🏆 Achieves`
    },

    btn_inventory: {
        ru: `👜 Инвентарь`,
        en: `👜 Inventory`
    },
        btn_eat:{
            ru: `🍽 Съесть`,
            en: `🍽 Eat`
        },

        btn_buy:{
            ru: `🪙 Купить`,
            en: `🪙 Buy`
        },

        btn_put_on:{
            ru: `🔼 Надеть`,
            en: `🔼 Put on`
        },        

        btn_empty:{
            ru: `🕸 Здесь пока нет вещей.`,
            en: `🕸 It's empty for now.`
        },

        btn_empty_slot:{
            ru: `⬛`,
            en: `⬛`
        },

        btn_item_fish: {
            ru: `🐟 Рыбка`,
            en: `🐟 Fish`
        },

    btn_back: {
        ru: `↩ Назад`,
        en: `↩ Back`
    },

    btn_work_in_progress: {
        ru: `🚧 Ведутся работы. 🚧`,
        en: `🚧 Work in progress. 🚧`
    },
}

module.exports = getText