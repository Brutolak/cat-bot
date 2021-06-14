function getMedia( name ){
    link = `${list[name]}`

    return link
}

const list = {
    fish:     'https://media1.tenor.com/images/ef74a7fe57c2e4280d895667a2a15901/tenor.gif?itemid=5064185',
    fishpole: 'https://s3-eu-west-1.amazonaws.com/uploads.playbaamboozle.com/uploads/images/73264/1618862783_41520_gif-url.gif'
}

module.exports = getMedia
