const getText = require('./getText')
const keyboard = require('../content/keyboard')

function buildOptions( type, query, user ){

    let { telegramId } = user
    let message_id

    if ( !keyboard[type] ){
        type = 'work_in_progress'
    }

    if (query){
        message_id = query.message.message_id
    }

    return {
        chat_id: telegramId,
        message_id: message_id,
        reply_markup: JSON.stringify({
            inline_keyboard: buildKeyboard( keyboard[type], user )
        })
    }
}

function buildKeyboard( buttons, user ){
    
    let keyboard = []

    if(buttons){

        for ( let row in buttons){
            let keyboardRow = []
            for ( let col in buttons[row] ){
                let btn = buttons[row][col]
                let needToDuild = true
                let btnText = ''
                let btnCB = btn

                switch(btn){

                    case 'act_walk':
                        if ( (user.inAction) || (user.curEnergy == 0) ){       
                            needToDuild = false
                        }
                    break

                    case 'opt_notes_on':
                        if ( user.deleteNotes ){
                            needToDuild = false
                        }
                    break

                    case 'opt_notes_off':
                        if ( !user.deleteNotes ){
                            needToDuild = false
                        }
                    break

                    case 'equip':
                        if ( isEmpty(user.equip) ){       
                            needToDuild = false
                        }
                    break

                    case 'achieves':
                        if ( !user.ach.length ){       
                            needToDuild = false
                        }
                    break

                    case 'inv':
                        keyboard = buildInventory(user)
                        needToDuild = false
                    break
                    

                    case 'fish':
                        btnText = `${ getText( `btn_item_fish`, user ) }: ${user.inventory[0].amt}`
                        btnCB = `btn_item_fish_${user.inventory[0].amt}`
                    break

                }

                if(needToDuild){
                    if (btnText == ''){
                        btnText = getText( `btn_${btn}`, user )
                    }
                    keyboardRow.push( buildButton( btnText, btnCB ))
                }
            }
            keyboard.push(keyboardRow) 
        }
    }
    //console.log(keyboard) 
    return keyboard;
}

function isEmpty( obj ){
    for(i in obj) return false
    return true
}

function buildButton( text, callback ){

    let button = {
        text: text
    }

    if (callback){
        button.callback_data = callback
    }else{
        button.callback_data = 'empty'
    }

    return button
}

function buildInventory( user ){

    const row = 4
    const col = 3

    let inventory = []
    let btn = user.inventory[1]

    if ( btn ) {        
        for ( let i = 0; i<row; i++){
            let invRow = []
            for ( let j = 0; j<col; j++ ){

                btn = user.inventory[5*i+j + 1]
                let btnText = ''
                let btnCB = 'empty'

                if(btn){
                    btnText = getText( `btn_item_${btn.code}_${btn.amt}`, user )
                    btnCB = `btn_item_${btn.code}_${btn.amt}`
                }else{
                    btnText = getText( `btn_empty_slot`, user )
                }
                invRow.push( buildButton( btnText, btnCB ))
            }
            inventory.push( invRow )
        }
    }else{
        inventory.push([ buildButton( getText(`btn_empty`, user) )])
    }

    return inventory
}

module.exports = {
    buildOptions
}