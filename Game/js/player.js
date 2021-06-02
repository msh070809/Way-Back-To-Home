
export default class Player {

	

  constructor(scene, x, y) {
    
	 this.scene = scene;

    // 캐릭터 애니메이션
    const anims = scene.anims;
    anims.create({
      key: "player-idle",
      frames: anims.generateFrameNumbers("player", { start: 0, end: 3 }),
      frameRate: 3,
      repeat: -1
    });
    anims.create({
      key: "player-run",
      frames: anims.generateFrameNumbers("player", { start: 8, end: 15 }),
      frameRate: 12,
      repeat: -1
    });

    // 캐릭터 물리엔진
    this.sprite = scene.physics.add
      .sprite(x, y, "player", 0)
      .setDrag(1000, 0)
      .setMaxVelocity(300, 400)
      .setSize(18, 24)
      .setOffset(7, 9);

    // 화살표 키인식
    const { LEFT, RIGHT, UP} = Phaser.Input.Keyboard.KeyCodes;
    this.keys = scene.input.keyboard.addKeys({
      left: LEFT,
      right: RIGHT,
      up: UP,
    });
  }

  freeze() {
    this.sprite.body.moves = false;
  }

  update() {
    const { keys, sprite } = this;
    const onGround = sprite.body.blocked.down;
    const acceleration = onGround ? 600 : 200;

    // 방향키를 통한 가속
    if (keys.left.isDown) {
      sprite.setAccelerationX(-acceleration);
      //거울 상을 통해서 반대 방향으로 달릴때 애니메이션을 구현해주는 기능
      sprite.setFlipX(true);
    } else if (keys.right.isDown) {
      sprite.setAccelerationX(acceleration);
      sprite.setFlipX(false);
    } else {
      sprite.setAccelerationX(0);
    }

    // 땅위에 있을때만 점프 허용
    if (onGround && (keys.up.isDown)) {
      sprite.setVelocityY(-500);
    }

    // 캐릭터 상태에 따른 애니메이션 업데이트
    if (onGround) {
      if (sprite.body.velocity.x !== 0) sprite.anims.play("player-run", true);
      else sprite.anims.play("player-idle", true);
    } else {
      sprite.anims.stop();
      sprite.setTexture("player", 10);
    }
  }

  destroy() {
    this.sprite.destroy();
  }
}
