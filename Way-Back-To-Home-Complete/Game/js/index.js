//사용할 모든 js파일 호출

import Firstscene from "./map1.js";
import Secondscene from "./map2.js";
import Thirdscene from "./map3.js";
import Fourthscene from "./map4.js";
import Fifthscene from "./map5.js";
import Sixthscene from "./map6.js";
import Startscene from "./start.js";
import Endingscene from "./end.js";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  pixelArt: true,
  backgroundColor: "#1d212d",
  //사용할 씬 전부 호출, 배열 안의 순서대로 호출됨
  scene: [Startscene, Firstscene ,Secondscene ,Thirdscene, Fourthscene ,Fifthscene ,Sixthscene ,Endingscene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1000 }
    }
  }
};

const game = new Phaser.Game(config);