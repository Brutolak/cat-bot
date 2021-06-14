const getText = require('./getText')
const items = require('./Items')

var buttons = {
    main: [
        ['profile'],
        ['actions'],
        ['options']
    ],
    profile: [
        ['stats', 'equip'],
        ['achieves', 'inventory'],
        ['main']
    ],
        stats: [
            ['main', 'back_profile']
        ],
        equip: [
            ['main', 'back_profile']
        ],
        achieves: [
            ['main', 'back_profile']
        ],
        inventory: ['inv'],
            fish: [
                ['eat'],
                ['buy'],
                ['main', 'back_inventory']
            ],
            item: [
                ['main', 'back_inventory']
            ],
            food:[
                ['eat'],
                ['main', 'back_inventory']
            ],
            outfit:[
                ['put_on'],
                ['main', 'back_inventory']
            ],
    actions: [
        ['act_walk'],
        ['act_cave'],
        ['main']
    ],
    options: [
        ['opt_lang'],
        ['opt_notify'],
        ['main']
    ],
    opt_lang: [
        ['opt_lang_ru'],
        ['opt_lang_en'],
        ['main']
    ],
    work_in_progress: [
        ['work_in_progress'],
        ['main']
    ],
    
}

function buildKeyboard( type, query, user, lang){

    let { telegramId } = user

    if (query){
    
        if ( buttons[type] ){

            return {
                chat_id: telegramId,
                message_id: query.message.message_id,
                reply_markup: JSON.stringify({
                    inline_keyboard: buildButtons( buttons[type], user, lang )
                })
            }
        } else {
            return {
                chat_id: telegramId,
                message_id: query.message.message_id,
                reply_markup: JSON.stringify({
                    inline_keyboard: buildButtons( buttons['work_in_progress'], user, lang  )
                })
            }
        }

    }else{
        return {
            reply_markup: JSON.stringify({
                inline_keyboard: buildButtons( buttons[type], user, lang  )
            })
        }
    }

}

function buildButtons( buttons, user, lang ){
    
    let kbd = []

    if(buttons[0] == 'inv'){
        let btn = user.inventory[1]

        if ( btn ) {

            kbd = buildInventory( user )

        }else{
            kbd.push([{
                text: `${ getText( `btn_empty`, user )}`,
                callback_data: 'empty'
            }])
        }

        kbd.push(
            [{text: `${ getText( `btn_item_fish`, user )}: ${user.inventory[0].amt}`, callback_data:'item_fish'}],
            [{text: `${ getText( `btn_main`, user )}`, callback_data:'main'},
             {text: `${ getText( `btn_back`, user )}`, callback_data:'back_profile'}]
        )
    }else{

        for ( let row in buttons){
            let kbdRow = []
            for ( let col in buttons[row] ){

                let btn = buttons[row][col]

                kbdRow.push({
                    text: `${ getText( `btn_${btn}`, user, lang  )}`,
                    callback_data: btn
                })
            }
            kbd.push(kbdRow)
        }
    }
    //console.log(kbd) 
    return kbd;
}

function buildInventory( user ){

    const row = 4
    const col = 3

    let inventory = []

    for ( let i = 0; i<row; i++){
        let invRow = []
        for ( let j = 0; j<col; j++ ){

            btn = user.inventory[5*i+j + 1]

            if(btn){
                if(items[btn.code]){
                invRow.push({
                    text: `${ items[btn.code].icon } ${ (items[btn.code].unique)?'':btn.amt }`,
                    callback_data: `item_${btn.code}`
                })}
            }else{
                invRow.push({
                    text: `${ getText( `btn_empty_slot`, user )}`,
                    callback_data: 'empty'
                })
            }
        }
        
        inventory.push( invRow )
    }

    return inventory
}

module.exports = {
    buildKeyboard
}