import Phaser from 'phaser'
import { sceneEvents } from '~/events/EventsCenter';

export default class Chest extends Phaser.Physics.Arcade.Sprite {
	constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
		super(scene, x, y, texture, frame)

		this.play('chest-closed')
	}

	open() {
		if (this.anims.currentAnim.key !== 'chest-closed') {
			return 0;
		}

		this.play('chest-open');
		sceneEvents.emit('hero-open-chest');
		return 10;
		/* return Phaser.Math.Between(50, 200) */
	}
}
