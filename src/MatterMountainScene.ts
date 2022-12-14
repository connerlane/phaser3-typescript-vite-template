import Phaser from 'phaser'
export default class ShittyMountainScene extends Phaser.Scene {
	private currentChain: Phaser.Physics.Matter.Image[] = [];
	private currentLine!: Phaser.GameObjects.Graphics;
	private depth =  0;
	private cloudTweens: Phaser.Tweens.Tween[] = [];
	constructor() {
		super('mountain');
	}

	preload() {
		this.load.image('background', 'background.png');
		this.load.image('cloud1', 'cloud1.png');
		this.load.image('cloud2', 'cloud2.png');
		this.load.image('cloud3', 'cloud3.png');
		this.load.image('ball', 'ball.png');
		this.load.image('rope', 'rope.png');
	}

	create() {
		this.currentLine = this.add.graphics();
		this.currentLine.setDepth(this.depth);
		this.depth += 1;
		this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
			if (pointer.y < 400) return;
			this.makeFog();
			
			this.depth += 1;
			this.makeChain(new Phaser.Math.Vector2(pointer.x, pointer.y));
			this.currentLine = this.add.graphics();
			this.currentLine.setDepth(this.depth);
			this.depth += 1;
			this.slowClouds();
			this.maybeAddCloud();

	});
		this.input.on('pointerup', () => {
			this.finalizeMountain();
		});
		this.add.image(960 / 2, 540 / 2, 'background');
		this.matter.add.mouseSpring();
		// this.add.line(0,0,0,400,1960,400,0x000000, 1);
		this.makeSun();
	}

	private makeChain(midpoint: Phaser.Math.Vector2) {
		const chain = [];
		const l = 500;
		const tightness = 15;
		const startPos = midpoint.clone();
		startPos.x -= l;
		const endPos = midpoint.clone();
		endPos.x += l;
		const segments = 30;
		const leftBlock = this.matter.add.image(startPos.x, startPos.y, 'ball', undefined, { ignoreGravity: true, mass: 1000000 });
		leftBlock.setVisible(false);
		chain.push(leftBlock);
		let prev = leftBlock;
		const interval = (l * 2) / segments;
		for (var i = 0; i < segments; i++) {
			const ball = this.matter.add.image(startPos.x + (i * interval), startPos.y, 'ball', undefined, { mass: 0.1, ignoreGravity: true });
			chain.push(ball);
			ball.setCircle(11);
			ball.setIgnoreGravity(true);
			ball.setVisible(false);
			this.matter.add.joint(prev as any, ball as any, interval - tightness, ELASTICITY);

			prev = ball;

		}
		const rightBlock = this.matter.add.image(endPos.x, endPos.y, 'ball', undefined, { ignoreGravity: true, mass: 1000000 });
		rightBlock.setVisible(false);
		chain.push(rightBlock);
		this.matter.add.joint(prev as any, rightBlock as any, interval - tightness, ELASTICITY);
		this.deleteCurrentChain();
		this.currentChain = chain;
	}
	private deleteCurrentChain() {
		for (let i = 0; i < this.currentChain.length; i++) {
			this.currentChain[i].destroy();
		}
		this.currentChain = [];
	}
	private finalizeMountain() {
		this.deleteCurrentChain();

	}

	update(): void {
		if (this.currentChain.length > 0) {
			this.drawMountain();
		}
	}

	private maybeAddCloud() {
		if (Math.random() > 0.6) {
			const cloud = this.add.image(-300,250 + (Math.random() * 2 - 1) * 200,'cloud' + Phaser.Math.Between(1,3));
			cloud.setAlpha(0.9);
			cloud.setDepth(this.depth);
			this.depth += 1;
			this.cloudTweens.push(this.tweens.add({
				targets: cloud,
				x: 1560,
				duration: 16000,
				yoyo: true,
				repeat: -1,
			}));
		}
	}

	private slowClouds() {
		this.cloudTweens.forEach((t) => {
			t.setTimeScale(t.timeScale *= 0.9);
		});
	}

	private makeFog() {
		const fog = this.add.image(960 / 2, 540 / 2, 'background',);
		fog.setAlpha(0.1);
		fog.setDepth(this.depth);
	}

	private makeSun() {
		const light = this.add.pointlight(0,0,0xffa91c, 800,0.05,0.1);
		const ball = this.add.pointlight(0,0,0xffa91c, 70,0.75,0.31);
		// light.setDepth(100000);
		const container = this.add.container(800, 100, [ball, light]);
		container.setDepth(100000);
		container.setSize(140, 140);

		container.setInteractive();

		this.input.setDraggable(container);
		this.input.on('drag', function (_pointer: any, gameObject: any, dragX: number, dragY: number) {

			gameObject.x = dragX;
			gameObject.y = dragY;
	
		});
	}
	private drawMountain() {
		const color = 0x44525f;
		this.currentLine.clear();
		this.currentLine.lineStyle(5, color, 1.0);
		this.currentLine.fillStyle(color, 1);
		this.currentLine.beginPath();
		this.currentLine.moveTo(0,540);
		this.currentLine.lineTo(Math.min(this.currentChain[0].x, 0), this.currentChain[0].y);
		for (let i = 1; i < this.currentChain.length; i++) {
			const v = this.currentChain[i];
			if (i === this.currentChain.length - 1) {
				this.currentLine.lineTo(Math.max(v.x, 960), v.y);
			}
			else {
				this.currentLine.lineTo(v.x, v.y);
			}
		}
		this.currentLine.lineTo(960, 540);
		this.currentLine.closePath();
		this.currentLine.fillPath();
		this.currentLine.strokePath();
	}


}

const ELASTICITY = 0.3;