
export default class MouseTileMarker {


  constructor(scene, map) {
	this.map = map;
    this.scene = scene;
 // 마우스 움직임에 따라 박스를 놓는 위치에 프레임을 만들어 박스 놓는 위치를 유저가 알게해주는 코드
    this.graphics = scene.add.graphics();
    this.graphics.lineStyle(5, 0xffffff, 1);
    this.graphics.strokeRect(0, 0, map.tileWidth, map.tileHeight);
    this.graphics.lineStyle(3, 0xff4f78, 1);
    this.graphics.strokeRect(0, 0, map.tileWidth, map.tileHeight);
  }

  update() {
    const pointer = this.scene.input.activePointer;
     // 마우스 위치를 캔버스 내부의 x,y좌표로 변환한다
    const worldPoint = pointer.positionToCamera(this.scene.cameras.main);
	//캔버스 내부 좌표에 박스생성 변수를 놓고, 맵의 내부 좌표로 변화하여 맵에 반영
	//맵에서 캔버스 내부로 해당되는 변경을 반영한다 
    const pointerTileXY = this.map.worldToTileXY(worldPoint.x, worldPoint.y);
    const snappedWorldPoint = this.map.tileToWorldXY(pointerTileXY.x, pointerTileXY.y);
    this.graphics.setPosition(snappedWorldPoint.x, snappedWorldPoint.y);
  }

  destroy() {
    this.graphics.destroy();
  }
}
