import Phaser from 'phaser'

import { sceneEvents } from '../events/EventsCenter'

export default class GameUI extends Phaser.Scene {
	private hearts!: Phaser.GameObjects.Group

	private level = 1;
	private coins = 0;

	private gifts = 0;

	private pauseButton: any;

	constructor() {
		super({ key: 'game-ui' })
	}

	create() {
		const coinsImage = this.add.image(6, 26, 'treasure', 'coin_anim_f0.png');
		coinsImage.setDepth(1);

		const coinsLabel = this.add.text(12, 20, '0', {
			fontSize: '14'
		});

		coinsLabel.setDepth(1);

		const levelLabel = this.add.text(6, 34, `Уровень ${this.level}`, {
			fontSize: '14'
		});

		levelLabel.setDepth(1);

		sceneEvents.on('player-level-changed', (restart: boolean) => {
			this.level = restart ? 1 : ++this.level;
			levelLabel.text = `Уровень ${this.level}`
		});

		const giftImage = this.add.image(12, 60, 'gift', 'gift.png');
		giftImage.setScale(0.7);

		giftImage.setDepth(1);
		const giftsLabel = this.add.text(28, 53, `${this.gifts}`, {
			fontSize: '30'
		});

		giftsLabel.setDepth(1);

		sceneEvents.on('player-gift-changed', (restart: boolean) => {
			this.gifts = restart ? 0 : ++this.gifts;
			giftsLabel.text = `${this.gifts}`
		});

		sceneEvents.on('player-coins-changed', (coins: number) => {
			this.coins = coins === -1 ? 0 : this.coins + coins;
			coinsLabel.text = this.coins.toLocaleString();
		})

		sceneEvents.on('player-finished-game', () => {
			let content = [
				`Поздравляем!`, `Вы победили!`, `Ваш результат:`, `Моонеты:${this.coins}`, `Подарки:${this.gifts}`
			];

			const finalResult = this.add.text(this.cameras.main.worldView.x + this.cameras.main.width / 2, this.cameras.main.height / 2, content, { align: 'center' }).setOrigin(0.5);
			finalResult.setDepth(1);
		})

		this.hearts = this.add.group({
			classType: Phaser.GameObjects.Image
		})

		this.pauseButton = this.add.image(this.cameras.main.width - 40, 20, 'pauseButton')
			.setOrigin(0.5)
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
			quantity: 1,
			setDepth: { value: 1 }
		},)

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
		this.scene.pause('game');;
		let rt = this.add.renderTexture(0, 0, window.screen.width, this.game.scale.canvas.offsetHeight + 500);
		rt.fill(0x000000, 0.5);
		const buttonResume = this.add.image(this.cameras.main.worldView.x + this.cameras.main.width / 2 - 30, this.cameras.main.worldView.y + this.cameras.main.height / 2, 'startButton')
			.setOrigin(0.5)
			.setInteractive({ useHandCursor: true })
			.on('pointerdown', () => {
				this.scene.resume('game');
				this.pauseButton.setActive(true).setVisible(true);
				buttonResume.destroy();
				buttonQuit.destroy();
				rt.destroy();
			})
		const buttonQuit = this.add.image(this.cameras.main.worldView.x + this.cameras.main.width / 2 + 30, this.cameras.main.worldView.y + this.cameras.main.height / 2, 'quitButton')
			.setOrigin(0.5)
			.setInteractive({ useHandCursor: true })
			.on('pointerdown', () => {
				this.scene.resume('game');
				this.pauseButton.setActive(true).setVisible(true);
				buttonQuit.destroy();
				buttonResume.destroy();
				rt.destroy();
			});
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
