let media = {
  name: "https://cdn.dribbble.com/users/25625/screenshots/2505961/pixel_cube_water_v2_shot.png",
  default:
    "https://everythingisviral.com/wp-content/uploads/2020/10/polite-cat.png",
  main: "https://sun9-65.userapi.com/impg/csd5MDMbKq8DwxhI2ofPwx5twDifOYueQzge_A/YODplZv3xCU.jpg?size=700x300&quality=96&sign=e80dca9f78ec9ff53734151a43ef69f1&type=album",
};

function Media(key) {
  if (media[key]) return media[key];
  return media["main"];
}

module.exports = {
  Media,
};
