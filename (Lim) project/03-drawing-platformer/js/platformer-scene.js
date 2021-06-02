import Player from "./player.js";
import MouseTileMarker from "./mouse-tile-maker.js";

export default class PlatformerScene extends Phaser.Scene {
	//씬끼리 구분을 위한 키값 부여
	constructor() {
	    super({ key: "PlatformerScene" });
	  }
	
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
    this.load.tilemapTiledJSON("miromap", "../assets/tilemaps/platformer.json");
  }

  create() {
    this.isPlayerDead = false;

    const miromap = this.make.tilemap({ key: "miromap" });
    const tiles = miromap.addTilesetImage("0x72-industrial-tileset-32px-extruded", "tiles");

    miromap.createDynamicLayer("Background", tiles);
    this.groundLayer = miromap.createDynamicLayer("Ground", tiles);
    miromap.createDynamicLayer("Foreground", tiles);

    const spawnPoint = miromap.findObject("Objects", obj => obj.name === "Spawn Point");
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
    this.cameras.main.setBounds(0, 0, miromap.widthInPixels, miromap.heightInPixels);
    this.cameras.main.setSize(400, 200);

    this.marker = new MouseTileMarker(this, miromap);

    this.add
      .text(16, 16, "어두운 미로를 탈출하자!", {
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
    if(this.player.sprite.x <= this.groundLayer.width * 0.02 && this.player.sprite.y < this.groundLayer.height * 0.3){
    		this.cameras.main.startFollow(this.player.sprite);
            this.cameras.main.setSize(800, 600);
    }
    
    //함정 게이트
    if(this.player.sprite.x <= this.groundLayer.width * 0.03 && this.player.sprite.y > this.groundLayer.height * 0.3) {
    	this.player.sprite.x = this.groundLayer.width * 0.95;
    	this.player.sprite.y = this.groundLayer.height * 0.55;
    }
    
    //클리어 게이트
    if(this.player.sprite.x >= this.groundLayer.width * 0.36 && this.player.sprite.x <= this.groundLayer.width * 0.37 && this.player.sprite.y < this.groundLayer.height * 0.15) {
    	this.player.sprite.x = this.groundLayer.width * 0.9;
    	this.player.sprite.y = this.groundLayer.height * 0.3;
    }
    
    if(this.player.sprite.x > this.groundLayer.width * 0.99 && this.player.sprite.y < this.groundLayer.height * 0.5){
		  //다른 씬으로 이동. 인자는 이동할 씬의 키값
		  this.scene.start("clearscene");
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
