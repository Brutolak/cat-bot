var emoji = require('node-emoji').emoji

var items = {
    fish:{
        itemCode: 'fish',
        itemEmoji:`${emoji.fish}`,
        name:{
            ru:"Рыбка",
            en:"Fish"
        },
        caption:{
            ru:"Ценная еда и вкусная валюта!",
            en:"Valuable food, tasty currency!"
        }
    },
    fishpole:{
        itemCode: 'fishpole',
        itemEmoji:`${emoji.fishpole}`,
        name:{
            ru:"Удочка",
            en:"Fishpole"
        },
        caption:{
            ru:"Волшебная палочка!",
            en:"Magic wand!"
        }
    },
}

module.exports = items;