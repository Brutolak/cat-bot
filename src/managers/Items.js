const items = {
    fish:{
        icon:`🐟`,
        type: 'fish',
        name:{
            ru:"Рыбка",
            en:"Fish"
        },
        caption:{
            ru:"Ценная еда и вкусная валюта",
            en:"Valuable food, tasty currency"
        },
        media:'https://i.makeagif.com/media/9-04-2018/YHjozT.gif'
    },
    fishpole:{
        unique: true,
        icon:`🎣`,
        type: 'item',
        name:{
            ru:"Удочка",
            en:"Fishpole"
        },
        caption:{
            ru:"Волшебная палочка",
            en:"Magic wand"
        }
    },
    example:{
        icon:`ℹ`,
        unique: true,
        type: 'String',
        name:{
            ru:"Название",
            en:"Name"
        },
        caption:{
            ru:"Описание",
            en:"Caption"
        }
    },
}

module.exports = items;