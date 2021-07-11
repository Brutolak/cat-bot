const { sendMessage, sendButtonMessage, evntMessage  } = require('./MessageManager')
const { updateUser, giveItems, giveExp, setEnergyTimer } = require('../service/userService')
const events = require('../content/events')
const items = require('../content/items')

function startEvent ( type, user, bot ){
    let { telegramId } = user
    console.log(`User ${user.playerName}(${telegramId}) started event ${type}.`)
    let startText = `evt_${type}_start_`
    evntMessage( startText, telegramId, bot, getTimerText(events[type].timer, user.language))

    let event = buildEvent( type, user )
    setEnergyTimer( telegramId, 1 )
    setTimeout(()=>{
        if (event.end) return endEvent(event, user, bot)
        return stepEvent(event, user, bot)
    }, event.timer)
}

function endEvent(event, user, bot){
    let {telegramId} = user
    updateUser( telegramId, {inAction: false}, (err, userDB)=>{
        let { language, curExp, maxExp } = userDB
        let rewardText = ''
        let reward = {
            ru: `\n\nТы получил:`,
            en: `\n\nReward:`
        }
        let exp = {
            ru: `\n✨ Опыт x${event.exp}`,
            en: `\n✨ Exp x${event.exp}`
        }
        
        rewardText += reward[language]
        if(event.reward.text !== ''){
            rewardText += event.reward.text
            giveItems( telegramId, event.reward.items)
        }
        rewardText += exp[language]

        let isLvlUp = false
        if( event.exp + curExp >= maxExp) isLvlUp = true
        giveExp( telegramId, event.exp )

        sendMessage( event.textPoint, telegramId, !isLvlUp, bot, rewardText)
        if( isLvlUp ){
            sendMessage( 'msg_level', telegramId, true, bot )
        }
    })
    console.log('end')
}

function stepEvent(event, user, bot){
    console.log('step')
}

function buildEvent( type, user ){
    let { language } = user
    let event = events[type]
    let point = getEventPoint( event, user )
    let n = getRandomInt( event[point].text.length )
    let reward = getReward( event[point].items, user )
    let exp = event.exp

    let end = false
    if (type = 'walk') end = true

    return {
        timer: event.timer,
        textStart: `evt_${type}_start_`,
        textPoint: `evt_${type}_${point}_${n}`,
        reward: reward,
        exp: exp,
        end: end
    } 
}

function getEventPoint( event, user ){

    let x = Math.random()

    for(key in event){
        if (event[key].chance){
            let { chance } = event[key]

            if( x <= chance ){
                return key
            }
        }
    }
}

function getReward( itemList, user ){
    let { language } = user
    let reward ={
        items:{},
        text:''
    }

    for(key in itemList){
        let x = Math.random()

        if(x <= itemList[key][0]){
            let n = getRandomInt( itemList[key][1], 1)
            reward.items[key] = n
            reward.text += `\n${items[key].icon} ${items[key].name[language]} x${n}`
        }
    }

    return reward
}

function getTimerText( timer, language ){
    const returnText = {
        ru: '\n⏰ Вернёшься через:',
        en: '\n⏰ You\'ll return after:'
    }
    const second = 1000
    const secondText = {
        ru: 'сек',
        en: 'sec'
    }
    const m = 60 * second
    const minuteText = {
        ru:'мин',
        en:'min'
    }

    let text = returnText[language]
    let newTimer = timer

    let mt = Math.floor( newTimer / m )
    if( mt > 0 ){
        text += ` ${mt}${minuteText[language]}`
        newTimer -= mt*m
    }

    let st = newTimer / second
    if( st > 0 ){
        text += ` ${st}${secondText[language]}`
    }

    text += '.'
    return text
}

function getRandomInt( n, d ){
    if (d) return (d + Math.floor( Math.random() * n ))
    return Math.floor( Math.random() * n )
}

module.exports = {
    startEvent
}