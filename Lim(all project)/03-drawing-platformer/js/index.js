//사용할 모든 js파일 호출
import PlatformerScene from "./platformer-scene.js";
import firstScene from "./first.js";
import startscene from "./start.js";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  pixelArt: true,
  backgroundColor: "#1d212d",
  //사용할 씬 전부 호출, 배열 안의 순서대로 호출됨
  scene: [startscene, firstScene, PlatformerScene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1000 }
    }
  }
};

const game = new Phaser.Game(config);