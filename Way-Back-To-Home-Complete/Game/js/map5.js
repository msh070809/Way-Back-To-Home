import Player from "./player.js";
import Enemy  from "./enemy.js";
import Object from "./object.js";
import MouseTileMarker from "./mouse-tile-maker.js";

export default class Fifthscene extends Phaser.Scene {
  constructor() {
    super({ key: "Fifthscene" });
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

    this.load.spritesheet(
      "enemy",
      "../assets/spritesheets/0x72-industrial-tileset-32px-extruded.png",
      {
        frameWidth: 32,
        frameHeight: 32,
        margin: 1,
        spacing: 2
      }
    );

    this.load.spritesheet(
      "object",
      "../assets/spritesheets/0x72-industrial-tileset-32px-extruded.png",
      {
        frameWidth: 32,
        frameHeight: 32,
        margin: 1,
        spacing: 2
      }
    );

    this.load.image("spike", "../assets/images/0x72-industrial-spike.png");
    this.load.image("tiles", "../assets/tilesets/0x72-industrial-tileset-32px-extruded.png");
    this.load.tilemapTiledJSON("map5", "../assets/tilemaps/Map5.json");
  }

  create() {
    this.isPlayerDead = false;

    const map = this.make.tilemap({ key: "map5" });
    const tiles = map.addTilesetImage("0x72-industrial-tileset-32px-extruded", "tiles");
    map.createDynamicLayer("Background", tiles);
    this.groundLayer = map.createDynamicLayer("Ground", tiles);
    map.createDynamicLayer("Foreground", tiles);
    
    //플레이어 생성
    const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");
    this.player = new Player(this, spawnPoint.x, spawnPoint.y); 

    // 적 생성
    this.enemy = new Enemy(this,590,256); 
    this.enemy2 = new Enemy(this,1740,85); 
    this.enemy3 = new Enemy(this,2850,474); 

    //오브젝트 생성 오브젝트는 enemy가 동작하는 기준이 됨
    this.object = new Object(this,600,256);
    this.object2 = new Object(this,400,256);

    this.object3 = new Object(this,1740,85);
    this.object4 = new Object(this,2020,85);

    this.object5 = new Object(this,2860,474);
    this.object6 = new Object(this,2970,474);
    
    //맵과 플레이어 적 오브젝트간의 충돌 처리
    this.groundLayer.setCollisionByProperty({ collides: true });
    this.physics.world.addCollider(this.player.sprite, this.groundLayer);
    this.physics.world.addCollider(this.enemy.sprite, this.groundLayer);
    this.physics.world.addCollider(this.enemy2.sprite, this.groundLayer);
    this.physics.world.addCollider(this.enemy3.sprite, this.groundLayer);

    this.physics.world.addCollider(this.object.sprite, this.groundLayer);
    this.physics.world.addCollider(this.object2.sprite, this.groundLayer);
    this.physics.world.addCollider(this.object.sprite, this.player.sprite);
    this.physics.world.addCollider(this.object2.sprite, this.player.sprite);

    this.physics.world.addCollider(this.object3.sprite, this.groundLayer);
    this.physics.world.addCollider(this.object4.sprite, this.groundLayer);
    this.physics.world.addCollider(this.object3.sprite, this.player.sprite);
    this.physics.world.addCollider(this.object4.sprite, this.player.sprite);

    this.physics.world.addCollider(this.object5.sprite, this.groundLayer);
    this.physics.world.addCollider(this.object6.sprite, this.groundLayer);
    this.physics.world.addCollider(this.object5.sprite, this.player.sprite);
    this.physics.world.addCollider(this.object6.sprite, this.player.sprite);



    // 스파이크 그룹 형성
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

    // 키 설명
    this.add
      .text(16, 16, "적을 피해 달아나!", {
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
    this.enemy.update();
    
    let ShiftKey;
    ShiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

    // 카메라 움직임
    const pointer = this.input.activePointer;
    const worldPoint = pointer.positionToCamera(this.cameras.main);


    //적의 움직임 처리 오브젝트와 overlap 되면 방향을 바꾼다
    if(this.physics.world.overlap(this.enemy.sprite, this.object.sprite))
    {
      this.enemy.movetoleft();
    }
    if(this.physics.world.overlap(this.enemy.sprite, this.object2.sprite))
    {
      this.enemy.movetoright();
    }

    if(this.physics.world.overlap(this.enemy2.sprite, this.object4.sprite))
    {
      this.enemy2.movetoleft();
    }
    if(this.physics.world.overlap(this.enemy2.sprite, this.object3.sprite))
    {
      this.enemy2.movetoright();
    }

    if(this.physics.world.overlap(this.enemy3.sprite, this.object6.sprite))
    {
      this.enemy3.movetoleft();
    }
    if(this.physics.world.overlap(this.enemy3.sprite, this.object5.sprite))
    {
      this.enemy3.movetoright();
    }
    
    
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

    //스파이크에 닿거나 적과 닿으면 사망 처리
    if (
      this.player.sprite.y > this.groundLayer.height ||
      this.physics.world.overlap(this.player.sprite, this.spikeGroup) || this.physics.world.overlap(this.player.sprite,this.enemy.sprite)
      || this.physics.world.overlap(this.player.sprite,this.enemy2.sprite) || this.physics.world.overlap(this.player.sprite,this.enemy3.sprite)
      )
     {

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
    if(this.player.sprite.x >=3711 && this.player.sprite.y <=413){
		  this.scene.start("Sixthscene");
	  }
  }

}
