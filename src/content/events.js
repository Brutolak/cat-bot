const events = {

    walk: {
        timer: 5,
        exp: 2,
        
        forest:{
            chance: 0.6,
            items:{// [ chance, max ]
                herbs:[      1,   1 ],
              shrooms:[   0.33,   1 ],
                 nuts:[    0.2,   2 ],
              berries:[    0.1,   3 ]
            }
        },

        nothing:{
            chance: 1
        }
    }
}

module.exports = events