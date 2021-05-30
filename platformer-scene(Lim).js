import Player from "./player.js";
import MouseTileMarker from "./mouse-tile-maker.js";


/**
 * A class that extends Phaser.Scene and wraps up the core logic for the platformer level.
 */

export default class PlatformerScene extends Phaser.Scene {
  preload() {
    this.load.spritesheet(
      "player",
      "../assets/spritesheets/0x72-industrial-player-32px-extruded.png",
      {
        frameWidth: 32,
        frameHeight: 32,
        margin: 1,
        spacing: 2
      }
    );
    this.load.image("spike", "../assets/images/0x72-industrial-spike.png");
    this.load.image("tiles", "../assets/tilesets/0x72-industrial-tileset-32px-extruded.png");
    this.load.tilemapTiledJSON("map", "../assets/tilemaps/platformer.json");
  }

  create() {
    this.isPlayerDead = false;

    const map = this.make.tilemap({ key: "map" });
    const tiles = map.addTilesetImage("0x72-industrial-tileset-32px-extruded", "tiles");

    map.createDynamicLayer("Background", tiles);
    this.groundLayer = map.createDynamicLayer("Ground", tiles);
    map.createDynamicLayer("Foreground", tiles);

    const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");
    this.player = new Player(this, spawnPoint.x, spawnPoint.y);

    this.groundLayer.setCollisionByProperty({ collides: true });
    this.physics.world.addCollider(this.player.sprite, this.groundLayer);
    
    this.spikeGroup = this.physics.add.staticGroup();
    this.groundLayer.forEachTile(tile => {
      if (tile.index === 77) {
        const spike = this.spikeGroup.create(tile.getCenterX(), tile.getCenterY(), "spike");

        spike.rotation = tile.rotation;
        if (spike.angle === 0) spike.body.setSize(32, 6).setOffset(0, 26);
        else if (spike.angle === -90) spike.body.setSize(6, 32).setOffset(26, 0);
        else if (spike.angle === 90) spike.body.setSize(6, 32).setOffset(0, 0);

        this.groundLayer.removeTileAt(tile.x, tile.y);
      }
    });

    this.cameras.main.startFollow(this.player.sprite);
    //this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setSize(300, 200);

    this.marker = new MouseTileMarker(this, map);

    this.add
      .text(16, 16, "Arrow/WASD to move & jump\nLeft click to draw platforms", {
        font: "18px monospace",
        fill: "#000000",
        padding: { x: 20, y: 10 },
        backgroundColor: "#ffffff"
      })
      .setScrollFactor(0);
  }
  
  update(time, delta) {
    if (this.isPlayerDead) return;

    this.marker.update();
    this.player.update();

    const pointer = this.input.activePointer;
    const worldPoint = pointer.positionToCamera(this.cameras.main);
    
    if (pointer.isDown) {
    	const tile = this.groundLayer.putTileAtWorldXY(6, worldPoint.x, worldPoint.y);
        tile.setCollision(true);
    }
    
    //카메라가 비추는 범위를 증가시켜준다.
    if(this.player.sprite.x <= this.groundLayer.width * 0.02 && this.player.sprite.y < this.groundLayer.height * 0.7){
    		this.cameras.main.startFollow(this.player.sprite);
            this.cameras.main.setSize(500, 400);
    }
    
    if (
      this.player.sprite.y > this.groundLayer.height ||
      this.physics.world.overlap(this.player.sprite, this.spikeGroup)
    ) {
      this.isPlayerDead = true;

      const cam = this.cameras.main;
      cam.shake(100, 0.05);
      cam.fade(250, 0, 0, 0);

      this.player.freeze();
      this.marker.destroy();

      cam.once("camerafadeoutcomplete", () => {
        this.player.destroy();
        this.scene.restart();
      });
    }
  }
}
