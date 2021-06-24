const sec = 1000 
const min = 60* sec

const events = {

    walk: {
        timer: 1000,
        start:{
            text: [
                {
                    ru: 'Ты ушёл на прогулку.',
                    en: 'walk'
                }
            ]
        },
        end:{
            text:[
                {
                    ru:'Конец прогулки', 
                    en:'walk end'
                },
                {
                    ru:'Еще один конец прогулки', 
                    en:'another walk end'
                },
            ]
        }
    },

    cave:{
        timer:1000,
        start:{
            text: [
                {
                    ru: 'Ты ушёл на прогулку.',
                    en: 'walk'
                }
            ]
        },
    }
}

module.exports = events