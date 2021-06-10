const userService = require('../service/userService')
var emoji = require('node-emoji').emoji


function getText( type ){

    //console.log(JSON.stringify(text[type][language]))
    return text[type][language];
}

var language = 'ru'

var text = {
    btn_1:{
        ru: `${emoji.white_large_square}`
    },

    btn_profile: {
        ru: `${emoji.sparkles} Профиль`,
        en: `${emoji.sparkles} Profile`
    },

    btn_actions: {
        ru: `${emoji.running} Действия`,
        en: `${emoji.running} Actions`
    },

    btn_options: {
        ru: `${emoji.gear} Настройки`,
        en: `${emoji.gear} Options`
    },

    btn_stats: {
        ru: `${emoji.heart} Статы`,
        en: `${emoji.heart} Stats`
    },

    btn_equip: {
        ru: `${emoji.shirt} Экипировка`,
        en: `${emoji.shirt} Equip`
    },

    btn_achieves: {
        ru: `${emoji.trophy} Достижения`,
        en: `${emoji.trophy} Achieves`
    },

    btn_inventory: {
        ru: `${emoji.handbag} Инвентарь`,
        en: `${emoji.handbag} Inventory`
    },

    btn_main: {
        ru: `${emoji.house} Назад на главную`,
        en: `${emoji.house} Back to Main`
    },

    btn_back: {
        ru: `${emoji.arrow_left} Назад`,
        en: `${emoji.arrow_left} Back`
    },

    profile: {
        ru: `Профиль`,
        en: `Profile`
    },

    main: {
        ru: ``
    },

    actions: {
        ru: ``
    },

    options: {
        ru: ``
    },

    back: {
        ru: ``
    },

    stats: {
        ru: ``
    },

    equip: {
        ru: ``
    },

    achieves: {
        ru: ``
    },

    inventory: {
        ru: ``
    }


}

module.exports = getText