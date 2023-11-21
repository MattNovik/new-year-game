import Phaser from 'phaser'

import { sceneEvents } from '../events/EventsCenter'

export default class GameUI extends Phaser.Scene {
	private hearts!: Phaser.GameObjects.Group

	private level = 1;

	private gifts = 0;

	private pauseButton: any;

	constructor() {
		super({ key: 'game-ui' })
	}

	create() {
		this.add.image(6, 26, 'treasure', 'coin_anim_f0.png');
		const coinsLabel = this.add.text(12, 20, '0', {
			fontSize: '14'
		});

		const levelLabel = this.add.text(6, 34, `Уровень ${this.level}`, {
			fontSize: '14'
		});

		sceneEvents.on('player-level-changed', () => {
			levelLabel.text = `Уровень ${++this.level}`
		});

		const giftImage = this.add.image(12, 60, 'gift', 'gift.png');
		giftImage.setScale(0.7);


		const giftsLabel = this.add.text(28, 53, `${this.gifts}`, {
			fontSize: '30'
		});

		sceneEvents.on('player-gift-changed', () => {
			giftsLabel.text = `${++this.gifts}`
		});

		sceneEvents.on('player-coins-changed', (coins: number) => {
			coinsLabel.text = coins.toLocaleString()
		})

		this.hearts = this.add.group({
			classType: Phaser.GameObjects.Image
		})

		this.pauseButton = this.add.text(this.cameras.main.width - 40, 20, 'Pause')
			.setOrigin(0.5)
			.setPadding(10)
			.setStyle({ backgroundColor: '#fff', color: '#000' })
			.setInteractive({ useHandCursor: true })
			.on('pointerdown', () => {
				this.pauseGame();
			})

		this.hearts.createMultiple({
			key: 'ui-heart-full',
			setXY: {
				x: 10,
				y: 10,
				stepX: 16
			},
			quantity: 1
		})

		sceneEvents.on('player-health-changed', this.handlePlayerHealthChanged, this)

		this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
			sceneEvents.off('player-health-changed', this.handlePlayerHealthChanged, this);
			sceneEvents.off('player-level-changed');
			sceneEvents.off('player-gift-changed');
			sceneEvents.off('player-coins-changed');
		})
	}

	pauseGame() {
		this.pauseButton.setActive(false).setVisible(false);
		this.scene.pause('game');
		const buttonResume = this.add.text(this.cameras.main.worldView.x + this.cameras.main.width / 2, this.cameras.main.worldView.y + this.cameras.main.height / 2, 'ПРОДОЛЖИТЬ')
			.setOrigin(0.5)
			.setPadding(10)
			.setStyle({ backgroundColor: '#111' })
			.setInteractive({ useHandCursor: true })
			.on('pointerdown', () => {
				this.scene.resume('game');
				this.pauseButton.setActive(true).setVisible(true);
				buttonResume.destroy();
			})
	}

	private handlePlayerHealthChanged(health: number) {
		this.hearts.children.each((go, idx) => {
			const heart = go as Phaser.GameObjects.Image
			if (idx < health) {
				heart.setTexture('ui-heart-full')
			}
			else {
				heart.setTexture('ui-heart-empty')
			}
		})
	}
}
