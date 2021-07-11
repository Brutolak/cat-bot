const keyboard = {
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
        inventory: [
            ['inv'],
            ['fish'],
            ['main', 'back_profile']
        ],
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
        ['opt_notes'],
        ['main']
    ],
    opt_lang: [
        ['opt_lang_ru'],
        ['opt_lang_en'],
        ['main', 'back_options']
    ],
    opt_notes: [
        ['opt_notes_on'],
        ['opt_notes_off'],
        ['main', 'back_options']
    ],
    work_in_progress: [
        ['work_in_progress'],
        ['main']
    ],

}

module.exports = keyboard