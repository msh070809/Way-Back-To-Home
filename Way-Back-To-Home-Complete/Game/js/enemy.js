export default class Enemy {
    constructor(scene, x, y) {
      this.scene = scene;
  
      // 애니메이션 생성
      const anims = scene.anims;
      anims.create({
        key: "enemy-idle",
        frames: anims.generateFrameNumbers("enemy", { start: 800, end: 801 }),
        frameRate: 3,
        repeat: -1
      });
      
      anims.create({
        key: "enemy-run",
        frames: anims.generateFrameNumbers("enemy", { start: 802, end: 803 }),
        frameRate: 12,
        repeat: -1
      });

      
    // 디폴트 애니메이션 지정
    this.sprite = scene.physics.add
      .sprite(x, y, "enemy", 800)
      .setDrag(1000, 0)
      .setMaxVelocity(300, 400)
      .setSize(18, 24)
      .setOffset(7, 9);
    
  }

  freeze() {
    this.sprite.body.moves = false;
  }

  update() {
    const { keys, sprite } = this;
    const onGround = sprite.body.blocked.down;

    if (onGround) {
      if (sprite.body.velocity.x !== 0) sprite.anims.play("enemy-run", true);
      else sprite.anims.play("enemy-idle", true);
    } else {
      sprite.anims.stop();
      sprite.setTexture("enemy", 10);
    }
  }

  destroy() {
    this.sprite.destroy();
  }

  movetoleft()
  {
    this.sprite.setAccelerationX(-300);
  }

  movetoright(){
    this.sprite.setAccelerationX(300);
  }
}