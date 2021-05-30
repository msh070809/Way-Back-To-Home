export default class enemy {
    constructor(scene, x, y) {
      this.scene = scene;
  
      // Create the animations we need from the player spritesheet
      const anims = scene.anims;
      anims.create({
        key: "enemy-idle",
        frames: anims.generateFrameNumbers("enemy", { start: 1, end: 4 }),
        frameRate: 3,
        repeat: -1
      });

      // Create the physics-based sprite that we will move around and animate
      this.sprite = scene.physics.add
        .sprite(x, y, "enemy", 16)
        .setDrag(1000, 0)
        .setMaxVelocity(300, 400)
        .setSize(18, 24)
        .setOffset(7, 9);

    }
}