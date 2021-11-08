const keyboard = {
    name:[
        ['mirror']
    ],
    main: [
        ['profile'],
        ['actions'],
        ['options']
    ],
    profile: [
        ['stats'],
        ['inventory'],
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
        inventory: [
            ['inv'],
            ['main', 'back_profile']
        ],
            fish: [
                ['eat'],
                ['buy'],
                ['main', 'back_inventory']
            ],
            eat: [
                ['main', 'back_inventory']
            ],
            buy: [
                ['main', 'back_inventory']
            ],
            item: [
                ['main', 'back_inventory']
            ],
            food:[
                ['eat'],
                ['main', 'back_inventory']
            ],
    actions: [
        ['walk'],
        ['main']
    ],
    options: [
        ['lang'],
        ['notes'],
        ['main']
    ],
    lang: [
        ['lang_ru'],
        ['lang_en'],
        ['main', 'back_options']
    ],
    notes: [
        ['notes_on'],
        ['notes_off'],
        ['main', 'back_options']
    ],

}

module.exports = keyboard