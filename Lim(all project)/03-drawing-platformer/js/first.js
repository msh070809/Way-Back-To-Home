import Player from "./player.js";//캐릭터 객체 가져오기

export default class firstScene extends Phaser.Scene {
	//씬끼리 구분을 위한 키값 부여
	constructor() {
	    super({ key: "firstScene" });
	  }
	
	//게임이 만들어지기 전 맵과 타일을 불러오는 phaser 기능
  preload() {
    //캐릭터 스프라이트시트 png가져오기 스프라이트시트(캐릭터의 연속동작을 연결해놓은 png)
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
    //
    this.load.image("tiles", "../assets/tilesets/0x72-industrial-tileset-32px-extruded.png");
    this.load.tilemapTiledJSON("map", "../assets/tilemaps/platformer-simple.json");
  }
//맵을 불러오기 위해서는 해당 json의 level에 해당하는 이미지의 부분이 어떤 부분인지 알아야 해서 이미지를 불러와야함
  
  create() {
	  //위에서 불러논 맵을 변수에 할당한다 key를 사용
	  const map = this.make.tilemap({ key: "map" });
	  //위에서 불러논 타일을 변수에 할당한다 key를 사용
	  const tiles = map.addTilesetImage("0x72-industrial-tileset-32px-extruded", "tiles");

	  //맵에서 background로 설정한 타일들을 레이어 설정을 해준다
	  map.createLayer("Background", tiles);
	  //캐릭터가 밟을 땅을 지정한 레이어를 설정해준다
	  this.groundLayer = map.createDynamicLayer("Ground", tiles);
	   //맵에서 foreground로 설정한 타일들을 레이어 설정을 해준다
	  map.createLayer("Foreground", tiles);

    // 맵의 오브젝트로 스폰포인트 표현.
    // 전역변수로서 캐릭터의 스폰포인트를 가지고있는게 아닌 맵에서 스폰포인트를 기억 
    const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");
    this.player = new Player(this, spawnPoint.x, spawnPoint.y);

    // groundlayer와 캐릭터의 충돌
    this.groundLayer.setCollisionByProperty({ collides: true });
    this.physics.world.addCollider(this.player.sprite, this.groundLayer);
    //카메라가 플레이어를 따라감
    this.cameras.main.startFollow(this.player.sprite);
    //카메라는 캔버스 바깥을 보여주지 않음
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // 게임 플레이 설명
    this.add
      .text(16, 16, "화살표를 이용해 움직이고 점프해보자", {
        font: "18px bold",
        fill: "#000000",
        padding: { x: 20, y: 10 },
        backgroundColor: "#ffffff"
      })
      .setScrollFactor(0);
  }

  update(time, delta) {
	  
	  if(this.player.sprite.x > this.groundLayer.width * 0.99 && this.player.sprite.y > this.groundLayer.height * 0.5){
		  //다른 씬으로 이동. 인자는 이동할 씬의 키값
		  this.scene.start("PlatformerScene");
	  }
	  
    // 캐릭터 업데이트
    this.player.update();
    //떨어지면 죽음
    if (this.player.sprite.y > this.groundLayer.height) {
      this.player.destroy();
      this.scene.restart();
    }
  }
}
