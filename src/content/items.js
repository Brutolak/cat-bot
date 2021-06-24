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
        }
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
    herbs:{
        icon:`🌿`,
        unique: false,
        type: 'item',
        name:{
            ru:"Травки",
            en:"Herbs"
        },
        caption:{
            ru:"Очень полезный ингредиент.",
            en:"Herbs caption"
        }
    },
    yarn:{
        icon:`🧶`,
        unique: true,
        type: 'item',
        name:{
            ru:"Волшебный клубок",
            en:"Yarn"
        },
        caption:{
            ru:"Славянская навигационная система\nВыполнение заданий происходит быстрее на 10%",
            en:"Caption"
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