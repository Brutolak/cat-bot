// Импортируем файлы локализаций
// На данный момент доступна только одна локализация -- российская
// В планах: английская
const { ru } = require('../content/localization/ru')

async function Text( key, user ) {
    let text = ru[key]
    if( typeof text === 'string' ) return await Fill( text, user )
    if( Array.isArray(text) ) return await Fill( Random(text), user )
    if( typeof text == 'object' ) return text
    return key
}

function Random( text_array ){
    let n = Math.floor(Math.random()*text_array.length)
    return text_array[n]
}

// Функция, которая заполняет переменные в тексте
// Все данные берутся из данных пользователя (уровень, энергия и т.д)
async function Fill( text, user ){

    // Если в тексте есть переменные, заполняем их
    
    if ( (text.match(/\{(\w*)\}/)) ){ // формат переменных - {text}. Подробнее в гугле: регулярные выражения

        // Создаём копию текста, которую будем заполнять
        let s = text

        // Повторяем, пока в тексте есть переменные
        while( (s.match(/\{(\w*)\}/)) ){
            let a = s.match(/\{(\w*)\}/)
            let e = await GetVar( a[1], user )
            s = s.replace( a[0], e)
        }

        // Возвращем заполненный текст
        return s
    }

    // Если переменных нет, возвращаем текст
    return text
}

async function GetVar(key, user){
    
    switch( key ){
        case 'user_name':
            return user.name

        case 'user_level':
            return user.level

        case 'user_exp':
            return user.exp

        case 'user_exp_max':
            return user.exp_max

        case 'user_fish':
            return user.inv[0].amt

        case 'user_energy':
            return `(${user.energy.cur}/${user.energy.max})`
 
        case 'reward_items':
            return await RewardText(user)

        case 'event_timer':
            return await Timer()

        default:
            return await Text(key,user)
    }
}

async function RewardText( user ){
    let {act, steps} = user.event
    let actStep = steps[act]
    let itemsR = actStep.reward
    let exp = actStep.exp
    let rewardText = ''
    for(let key in itemsR){
        let item = await Text(key)
        rewardText += `\n${item.icon}${item.name} x${itemsR[key]}`
    }
    rewardText += `\n${ await Text('exp', user) } x${exp}`

    return rewardText
}

module.exports = { Text }