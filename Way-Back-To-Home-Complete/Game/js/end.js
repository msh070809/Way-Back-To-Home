export default class Endingscene extends Phaser.Scene {
	constructor() {
	    super({ key: "Endingscene" });
	  }

	  preload(){
		this.load.image("ending", "../assets/images/gameend.png");
	}
	
	create(){
		this.add.image(420, 200, 'ending');
		
		this.add
	      .text(150, 400, "아무곳이나 눌러서 게임다시 시작", {
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
	    	this.scene.start("FirstScene");
	    }
	}
}