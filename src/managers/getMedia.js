function getMedia( name ){
  
    if ( list[name] ) return list[name]
    return list['default']
    
}

const list = {
    default: 'https://i.pinimg.com/originals/f0/12/e3/f012e388a7a74441228bb106de1c471d.gif',
    fish: 'https://media1.tenor.com/images/ef74a7fe57c2e4280d895667a2a15901/tenor.gif?itemid=5064185',
    fishpole: 'https://s3-eu-west-1.amazonaws.com/uploads.playbaamboozle.com/uploads/images/73264/1618862783_41520_gif-url.gif',

    main_pic:'https://sun9-65.userapi.com/impg/csd5MDMbKq8DwxhI2ofPwx5twDifOYueQzge_A/YODplZv3xCU.jpg?size=700x300&quality=96&sign=e80dca9f78ec9ff53734151a43ef69f1&type=album'
}

module.exports = getMedia
