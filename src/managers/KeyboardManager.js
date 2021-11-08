const{ Text } = require('./GetText')

async function BuildKeyboard( key, user ){
    const keyboard = require('../content/keyboard')
    const items = require('../content/items')

    let buttons = ( keyboard[key] ) ? keyboard[key] :
                ( items[key] ) ? keyboard[items[key].type] : []

    if( !(buttons.length) ) return

    let new_keyboard = []
    for ( let row in buttons){
        let keyboardRow = []
        for ( let col in buttons[row] ){

            let button = buttons[row][col]

            if(button == 'inv'){
                new_keyboard = await BuildInv(user)
            } else if( (NeedBuild(button, user)) ){
                keyboardRow.push( await BuildButton( button, user ) )
            }
        }
        new_keyboard.push(keyboardRow) 
    }

    return JSON.stringify({inline_keyboard: new_keyboard})
}

async function BuildButton( button, user ){

    let back = button.match(/^back_/)
    let text
    if (back){
        text = await Text(`b_back`, user)
    }else{
        text = await Text(`b_${button}`, user)
    }
    
    return {
        text: text,
        callback_data: button
    }
}

function NeedBuild(button, user){
    switch(button){
        case 'walk':
            if(user.energy.cur <= 0 || user.status == 'in_action') return false
        break
    }
    return true
}

async function BuildInv(user){
    let inv = []
    const row = 4
    const col = 3

    if( !(user.inv[1]) ){
        inv.push( [await BuildButton( 'empty_inv' ,user )] )
        return inv
    }

    for( i=0; i < row; i++ ){
        let inv_row = []
        for( j=0; j < col; j++ ){
            let inv_item = user.inv[5*i+j + 1]
            if(inv_item){
                let item = await Text(inv_item.code, user)
                inv_row.push( {
                    text:`${item.icon} ${inv_item.amt}`,
                    callback_data: inv_item.code
                })
            }else{
                inv_row.push( await BuildButton( 'slot', user ) )
                
            }
        }
        inv.push( inv_row )
    }
    inv.push( [await BuildButton( 'fish', user )] )
    
    return inv
}

module.exports = {
    BuildKeyboard
}