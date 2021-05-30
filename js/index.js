import PlatformerScene from "./platformer-scene.js";

const config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 800,
  parent: "Canvas",
  pixelArt: true,
  backgroundColor: "#1d212d",
  scene: PlatformerScene,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1000 }
    }
  }
};

const game = new Phaser.Game(config);
