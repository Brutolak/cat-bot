const textCaption = require('../content/textCaption')
const textMessage = require('../content/textMessage')
const textButton = require('../content/textButton')
const event = require('../content/events')

const items = require("../content/items")

function getText( type, user ){

    let { language } = user

    let btn = type.match( /btn_(\w*)/ )
    if ( btn ) return getButtonText( type, language )

    let evt = type.match( /evt_(\w*)/ )
    if ( evt ) return getEventText( type, language )

    let msg = type.match( /msg_(\w*)/ )
    if ( msg ) return textMessage[type][language]

    if ( textCaption[type] ) return textCaption[type][language]
    return genText( type, user )
}

function getEventText( type, language ){

    let evType = type.match( /evt_(\w*)_\w*_/)[1]
    let point = type.match(/evt_\w*_(\w*)_/)[1]
    let n = type.match(/evt_\w*_\w*_(\d*)/ )[1]

    if(n) return event[evType][point].text[n][language]
    return event[evType][point].text[0][language]
}

function getButtonText( type, language){
    let back = type.match( /btn_back_(\w*)/ )
    let item = type.match( /btn_item_(\w*)_/ )

    if ( back ){
       return textButton['btn_back'][language]
    }

    if ( item ){
        let name = item[1]
        let amt = type.match( /btn_item_\w*_(\d*)/ )[1]
        let icon = items[name].icon
            
       return `${icon} ${amt}`
    }

    return textButton[type][language]
}

function genText( type, user ){
    let { language } = user
    let text = {}
    
    switch(type){

        case 'stats':
            text = buildStats( user, language )
        break

        case 'actions':
            let timer = buildTimer(user)[language]
            text = {
                ru: `⚡ Энергия: ${user.curEnergy}/${user.maxEnergy} ${timer}`,
                en: `⚡ Energy: ${user.curEnergy}/${user.maxEnergy} ${timer}`
            }
        break

        default:
            return ''
        break
    }

    return text[language]
}

function buildStats(user, language){
    let timer = buildTimer(user)[language]
    let statList = {
        level: {
            ru: `⭐ Уровень: ${user.level} (${user.curExp}/${user.maxExp})\n`,
            en: `⭐ Level: ${user.level} (${user.curExp}/${user.maxExp})\n`
        },
        health: {
            ru: `❤️ Жизни: ${user.curHealth}/${user.maxHealth}\n`,
            en: `❤️ Health: ${user.curHealth}/${user.maxHealth}\n`
        },
        energy: {
            ru: `⚡ Энергия: ${user.curEnergy}/${user.maxEnergy} ${timer}`,
            en: `⚡ Energy: ${user.curEnergy}/${user.maxEnergy} ${timer}`
        }
    }

    let stats = {
        ru:'',
        en:''
    }

    for(key in statList){
        stats[language] += statList[key][language]
    }
    
    return stats
}

function buildTimer( user ){
    const timer = 60 * 60 * 1000
    const now = new Date()
    dTimer = now - user.nextEnergy

    if( user.curEnergy < user.maxEnergy ){

        energyTimer = Math.floor((timer - dTimer) / (60 * 1000) )

        return {
            ru:` (⏰ ${energyTimer}мин)`,
            en:` (⏰ ${energyTimer}min)`
        }
    }else{
        return {ru:``,en:''}
    }
}

module.exports = getText