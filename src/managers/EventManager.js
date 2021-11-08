const { SetEvent } = require('../service/userService')
const events = require('../content/events')

async function StartEvent ( type, user ){
    let event = buildEvent( type, user )
    SetEvent( user.id, event, ()=>{})
}

function buildEvent( type ){

    let newEvent = {                        
        timer: new Date(),
        text: `${type}_start`,
        act: 0,
        msg: false,
        steps: buildSteps( type )
    }

    return newEvent
}

function buildSteps ( type ){ //exp, reward, text, timer
    let event = events[type]
    let steps = []
    let n = 1 // количество шагов в ивенте

    for ( let i = 0; i < n; i++ ){
        let point = getEventPoint( event )

        steps[i] = {
            timer: 1,
            active: true,
            text: `${type}_${point}`,
            reward: buildItems( event[point].items ),
            exp: event.exp
        }
    }

    return steps
}

function buildItems(items){
    let reward = {}
    for (let i in items){
        let x = Math.random()
        if( x <= items[i][0] ){
            x = getRandomInt(items[i][1],1)
            reward[i] = x
        }
    }

    return reward
}

function getEventPoint(event){
    for(var point in event){
        if(event[point].chance){
            let x = Math.random()
            console.log(`Chanse -- ${x}`)
            if(x <= event[point].chance){
                return point
            }
        }
    }
}

function getRandomInt(n, d){
    if (d) return Math.floor( Math.random() * n ) + d
    return Math.floor( Math.random() * n )
}

module.exports = {
    StartEvent,
    buildEvent
}