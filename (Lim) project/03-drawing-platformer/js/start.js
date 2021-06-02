export default class startscene extends Phaser.Scene {
	constructor() {
	    super({ key: "startscene" });
	  }

	preload(){
		this.load.image("start", "../assets/images/gamestart.png");
	}
	
	create(){
		this.add.image(420, 200, 'start');
		
		this.add
	      .text(150, 400, "아무곳이나 눌러서 게임 시작", {
	        font: "36px bold",
	        fill: "#000000",
	        padding: { x: 20, y: 10 },
	        backgroundColor: "#ffffff"
	      })
	      .setScrollFactor(0);
	}
	
	update(time, delta){
		const pointer = this.input.activePointer;
	    
	    if (pointer.isDown) {
	    	this.scene.start("firstScene");
	    }
	}
}