/*
 오브젝트 js
 */
export default class object {
    constructor(scene, x, y) {
      this.scene = scene;
  
    this.sprite = scene.physics.add
      .sprite(x, y, "object", 315)
      .setDrag(1000, 0)
      .setMaxVelocity(300, 400)
      .setSize(18, 24)
      .setOffset(7, 9);
  }
}