import Player from "./player.js";
import MouseTileMarker from "./mouse-tile-maker.js";

export default class Secondscene extends Phaser.Scene {
  constructor() {
    super({ key: "Secondscene" });
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
    this.load.tilemapTiledJSON("map2", "../assets/tilemaps/Map2.json");
  }

  create() {
    this.isPlayerDead = false;

    const map = this.make.tilemap({ key: "map2" });
    const tiles = map.addTilesetImage("0x72-industrial-tileset-32px-extruded", "tiles");

    map.createDynamicLayer("Background", tiles);
    this.groundLayer = map.createDynamicLayer("Ground", tiles);
    map.createDynamicLayer("Foreground", tiles);
    //플레이어 생성
    const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");
    this.player = new Player(this, spawnPoint.x, spawnPoint.y);
    //레이어와 충동 처리 
    this.groundLayer.setCollisionByProperty({ collides: true });
    this.physics.world.addCollider(this.player.sprite, this.groundLayer);

    //스파이크 그륩
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
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.marker = new MouseTileMarker(this, map);

    //안내 메시지 출력
    this.add
      .text(16, 16, "마우스클릭을 통한 박스생성\nshift+마우스 왼쪽 클릭을 통한 박스 제거", {
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
    let ShiftKey;
    ShiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

    const pointer = this.input.activePointer;
    const worldPoint = pointer.positionToCamera(this.cameras.main);
    if (ShiftKey.isDown) {
      if (pointer.isDown) {
        this.groundLayer.removeTileAtWorldXY(worldPoint.x, worldPoint.y);
        }
    }
    else
    {
      if (pointer.isDown) {
          const tile = this.groundLayer.putTileAtWorldXY(6, worldPoint.x, worldPoint.y);
          if(tile!=null)
            {
             tile.setCollision(true);
            }
        }
    }
    //가시에 닿으면 사망
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
    //맵을 종료하고 다음 맵으로 넘어감
    if(this.player.sprite.x >=2430 && this.player.sprite.y <= 530){
		  this.scene.start("Thirdscene");
	  }
  }
}
