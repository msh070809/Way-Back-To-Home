import Player from "./player.js";
import MouseTileMarker from "./mouse-tile-maker.js";

var Num=15;
var DNum=15;
export default class Fourthscene extends Phaser.Scene {
  constructor() {
    super({ key: "Fourthscene" });
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
    //스파이크 이미지와 , 타일이미지 , 맵을 로드해논다
  //맵을 불러오기 위해서는 해당 json의 level에 해당하는 이미지의 부분이 어떤 부분인지 알아야 해서 이미지를 불러와야함

    this.load.image("spike", "../assets/images/0x72-industrial-spike.png");
    this.load.image("tiles", "../assets/tilesets/0x72-industrial-tileset-32px-extruded.png");
    this.load.tilemapTiledJSON("map4", "../assets/tilemaps/Map4.json");
  }

  create() {
	 Num=10;
   DNum=10;
	  //사망 여부 체크
    this.isPlayerDead = false;
  //위에서 불러논 맵을 변수에 할당한다 key를 사용
    const map = this.make.tilemap({ key: "map4" });
    //위에서 불러논 타일을 변수에 할당한다 key를 사용
    const tiles = map.addTilesetImage("0x72-industrial-tileset-32px-extruded", "tiles");
  //맵에서 background로 설정한 타일들을 레이어 설정을 해준다
    map.createLayer("Background", tiles);
    //캐릭터가 밟을 땅을 지정한 레이어를 설정해준다
    this.groundLayer = map.createDynamicLayer("Ground", tiles);
    //맵에서 foreground로 설정한 타일들을 레이어 설정을 해준다
    map.createLayer("Foreground", tiles);
    const endPoint = map.findObject("Objects", obj => obj.name =="End Point");
    const spawnPoint = map.findObject("Objects", obj => obj.name == "Spawn Point");
    this.player = new Player(this, spawnPoint.x, spawnPoint.y);
    // 맵의 오브젝트로 스폰포인트 표현.
    // 전역변수로서 캐릭터의 스폰포인트를 가지고있는게 아닌 맵에서 스폰포인트를 기억 
    this.groundLayer.setCollisionByProperty({ collides: true });
    this.physics.world.addCollider(this.player.sprite, this.groundLayer);
    
    //맵에서 가시가 충돌할때 맵에서 가시를 지우고 캐릭터 스프라이트를 그 자리에 부르고 충돌 판정한다
    this.spikeGroup = this.physics.add.staticGroup();//맵의 여러가지 가시들을 그룹화해서 관리한다
    this.groundLayer.forEachTile(tile => {
      if (tile.index === 77)//가시 타일 인덱스 z누르면 타일맵 상에서 회전 ( 캔버스상에선 회전 x )
      {
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

  }

  update(time, delta) {
    if(this.player.sprite.x >= 1680 && this.player.sprite.y <= 288){
		  //다른 씬으로 이동. 인자는 이동할 씬의 키값
		  this.scene.start("Sixthscene");
	  }
    let ShiftKey;	
    if (this.isPlayerDead) return;

    this.marker.update();
    this.player.update();
    
    // 클릭시 타일생성 쉬프트시 삭제 갯수 제한
    const pointer = this.input.activePointer;
    const worldPoint = pointer.positionToCamera(this.cameras.main);
    ShiftKey=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    if (ShiftKey.isDown&&DNum>0) {
        if (pointer.isDown) {
        	this.groundLayer.removeTileAtWorldXY(worldPoint.x, worldPoint.y);
          DNum=DNum-1;
        }
    }
    else
    {
        if (pointer.isDown&&Num>0) {
            const tile = this.groundLayer.putTileAtWorldXY(6, worldPoint.x, worldPoint.y);
            if(tile!=null)
            	{
            	 tile.setCollision(true);
            	}
            Num=Num-1;
          }
    }
    	//충돌 판정 캐릭터와 스파이크 그룹이 겹칠때 충돌판정  
    	//
    if (
    		this.player.sprite.y > this.groundLayer.height ||
      this.physics.world.overlap(this.player.sprite, this.spikeGroup)
    ) {
      // 
      this.isPlayerDead = true;
      //이펙트
      const cam = this.cameras.main;
      cam.shake(100, 0.05);
      cam.fade(250, 0, 0, 0);

      // 캐릭터 죽을때 순간 멈추는 기능
      this.player.freeze();
      this.marker.destroy();
      //카메라가 꺼지면서 캐릭터 랑 씬 리스타트
      cam.once("camerafadeoutcomplete", () => {
        this.player.destroy();
        this.scene.restart();
      });
    }
    // 안내문
    this.add
      .text(16, 16, "남은 상자 생성가능 갯수:"+Num+"\n남은 삭제가능 갯수:"+DNum, {
        font: "18px bold",
        fill: "#000000",
        padding: { x: 20, y: 10 },
        backgroundColor: "#ffffff"
      })
      .setScrollFactor(0);
  }
}
