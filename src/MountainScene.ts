import Phaser from 'phaser'
export default class MountainScene extends Phaser.Scene {
	private currentRope!: Phaser.GameObjects.Rope;
	private isDragging = false;
	private draggingPointIndex = 0;
	constructor() {
		super('mountain');
	}

	preload() {
		this.load.image('background', 'background.png');
		this.load.image('cloud', 'cloud.png');
		this.load.image('rope', 'rope.png');
		this.load.glsl('test', 'shaders/test.frag');
	}

	create() {
		const centerX = this.cameras.main.centerX;
		const centerY = this.cameras.main.centerY;
		const bg = this.add.image(centerX, centerY, 'background');
		// this.drawGround();
		this.currentRope = this.drawGroundRope();
		this.input.on('pointerdown', function (pointer: Phaser.Input.Pointer) {
			this.maybeBeginDrag(pointer);
		}, this);
		this.input.on('pointerup', function (pointer: Phaser.Input.Pointer) {
			this.stopDragging(pointer);
		}, this);
		this.input.on('pointermove',function (pointer: Phaser.Input.Pointer) {
			this.maybeDrag(pointer);
		}, this);
	}
	update(time: number, delta: number): void {
		// this.jiggleRope();
	}

	private drawGround() {
		const groundGraphics = this.add.graphics();
		groundGraphics.lineStyle(5, 0x471d0a, 1.0);
		groundGraphics.beginPath();
		groundGraphics.moveTo(0, 450);
		groundGraphics.lineTo(960, 450);
		groundGraphics.closePath();
		groundGraphics.strokePath();
	}

	private drawGroundRope() {
		const points = [];
		const vertexes = 20;
		for (let i = 0; i < vertexes; i++) {
			points.push(new Phaser.Math.Vector2(i / vertexes * 960, 450 + Phaser.Math.FloatBetween(-5,5)));
		}
		points.push(new Phaser.Math.Vector2(960, 450));
		const rope = this.add.rope(0,0, 'rope', undefined, points);
		return rope;
	}

	private maybeBeginDrag(pointer: Phaser.Input.Pointer) {
		const pointIndex =this.getClosestVertexToCoord(pointer.x, pointer.y)
		if (pointIndex === -1) return;
		this.isDragging = true;
		this.draggingPointIndex = pointIndex;
	}
	private maybeDrag(pointer: Phaser.Input.Pointer) {
		if (!this.isDragging) return;
		const coord = new Phaser.Math.Vector2(pointer.x,pointer.y);
		this.currentRope.points[this.draggingPointIndex] = coord;
		this.currentRope.setDirty();
		for (let i = 0; i < 4; i++) {
			const adjustedLeft = this.draggingPointIndex - i;
			if (adjustedLeft > 0) {
				const groundPoint = this.currentRope.points[adjustedLeft];
				const d = Phaser.Math.Distance.BetweenPoints(groundPoint, coord);
				const strength = (1 - (0.1 * i * i)) * 0.005;
				const f = new Phaser.Math.Vector2((coord.x - groundPoint.x) * strength, (coord.y - groundPoint.y) * strength);
				this.currentRope.points[adjustedLeft].add(f);
			}
			const adjustedRight = this.draggingPointIndex + i;
			if (adjustedRight < this.currentRope.points.length - 1) {
				const groundPoint = this.currentRope.points[adjustedRight];
				const d = Phaser.Math.Distance.BetweenPoints(groundPoint, coord);
				const strength = (1 - (0.01 * i * i)) * 0.005;
				const f = new Phaser.Math.Vector2((coord.x - groundPoint.x) * strength, (coord.y - groundPoint.y) * strength);
				this.currentRope.points[adjustedRight].add(f);
			}
		}
	}

	private getClosestVertexToCoord(x: number, y: number) {
		const coord = new Phaser.Math.Vector2(x,y);
		let closestIndex = 0;
		let closestDist = 999999;
		for (let i = 0; i < this.currentRope.points.length; i++) {
			const point = this.currentRope.points[i];			
			const dist = Phaser.Math.Distance.BetweenPoints(point, coord);
			if (dist < closestDist) {
				closestIndex = i;
				closestDist = dist;
			}
		}
		if (closestDist < MINMIMUM_SELECTION_DISTANCE) {
			return closestIndex;
		}
		else return -1;
	}

	private stopDragging() {
		this.isDragging = false;
	}
}


const MINMIMUM_SELECTION_DISTANCE = 60;