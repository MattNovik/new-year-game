import Phaser from 'phaser'

import { sceneEvents } from '../events/EventsCenter'

export default class GameUI extends Phaser.Scene {
	private hearts!: Phaser.GameObjects.Group

	private level = 1;
	private coins = 0;

	private gifts = 0;

	private pauseButton: any;

	constructor() {
		super({ key: 'game-ui' });
	}

	getViewport = (scaleManager, out) => {
		if (out === undefined) {
			out = new Phaser.Geom.Rectangle();
		}

		let baseSize = scaleManager.baseSize;
		let canvasBounds = scaleManager.canvasBounds;
		let displayScale = scaleManager.displayScale;
		let parentSize = scaleManager.parentSize;

		out.x = (canvasBounds.x >= 0) ? 0 : -(canvasBounds.x * displayScale.x);
		out.y = (canvasBounds.y >= 0) ? 0 : -(canvasBounds.y * displayScale.y);

		let width = baseSize.width - (canvasBounds.width - parentSize.width) * displayScale.x;
		out.width = Math.min(baseSize.width, width);
		let height = baseSize.height - (canvasBounds.height - parentSize.height) * displayScale.y;
		out.height = Math.min(baseSize.height, height);
		return out;
	};

	create() {
		this.viewport = new Phaser.Geom.Rectangle();

		this.getViewport(this.scale, this.viewport);

		this.scale.on('resize', () => {
			console.log('resized');
			this.getViewport(this.scale, this.viewport);
			coinsImage.setPosition(this.viewport.left + 20, this.viewport.top + 36);
			coinsLabel.setPosition(this.viewport.left + 26, this.viewport.top + 30);
			levelLabel.setPosition(this.viewport.left + 18, this.viewport.top + 44);
			giftImage.setPosition(this.viewport.left + 26, this.viewport.top + 70);
			giftsLabel.setPosition(this.viewport.left + 42, this.viewport.top + 63);
			this.pauseButton.setPosition(this.viewport.right - 40, this.viewport.top + 36);

			Phaser.Actions.SetXY(this.hearts.children.entries, this.viewport.left + 24, this.viewport.top + 25, 16)
		}, this);

		const coinsImage = this.add.image(20, 36, 'treasure', 'coin_anim_f0.png');
		coinsImage.setDepth(1);


		const coinsLabel = this.add.text(26, 30, '0', {
			fontSize: '14', color: '#e2ac02'
		});

		coinsLabel.setDepth(1);

		const levelLabel = this.add.text(18, 44, `Уровень ${this.level}`, {
			fontSize: '14', color: '#e2ac02'
		});

		levelLabel.setDepth(1);

		sceneEvents.on('player-level-changed', (restart: boolean) => {
			this.level = restart ? 1 : ++this.level;
			levelLabel.text = `Уровень ${this.level}`
		});

		const giftImage = this.add.image(26, 70, 'gift', 'gift.png');
		giftImage.setScale(0.7);

		giftImage.setDepth(1);
		const giftsLabel = this.add.text(42, 63, `${this.gifts}`, {
			fontSize: '30', color: '#e2ac02'
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
		});

		this.pauseButton = this.add.image(this.cameras.main.width - 40, 25, 'pauseButton')
			.setOrigin(0.5)
			.setInteractive({ useHandCursor: true })
			.on('pointerdown', () => {
				sceneEvents.emit('button-click', true);
				this.pauseGame();
			});

		this.hearts.createMultiple({
			key: 'ui-heart-full',
			setXY: {
				x: 24,
				y: 20,
				stepX: 16
			},
			quantity: 2,
			setDepth: { value: 1 }
		},)

		sceneEvents.on('player-health-changed', this.handlePlayerHealthChanged, this)

		this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
			sceneEvents.off('player-health-changed', this.handlePlayerHealthChanged, this);
			sceneEvents.off('player-level-changed');
			sceneEvents.off('player-gift-changed');
			sceneEvents.off('player-coins-changed');
		});
	}

	pauseGame() {
		this.pauseButton.setActive(false).setVisible(false);
		this.scene.pause('game');;
		let rt = this.add.renderTexture(Math.abs(this.cameras.main.worldView.x), Math.abs(this.cameras.main.worldView.y), window.screen.width, this.game.scale.canvas.offsetHeight + 500);
		rt.fill(0x000000, 0.5);
		const buttonResume = this.add.image(this.cameras.main.worldView.x + this.cameras.main.width / 2 - 30, this.cameras.main.worldView.y + this.cameras.main.height / 2, 'startButton')
			.setOrigin(0.5)
			.setInteractive({ useHandCursor: true })
			.on('pointerdown', () => {
				sceneEvents.emit('button-click', true);
				this.scene.resume('game');
				this.pauseButton.setActive(true).setVisible(true);
				buttonResume.destroy();
				buttonQuit.destroy();
				buttonMusic.destroy();
				rt.destroy();
			})
		const buttonQuit = this.add.image(this.cameras.main.worldView.x + this.cameras.main.width / 2 + 30, this.cameras.main.worldView.y + this.cameras.main.height / 2, 'quitButton')
			.setOrigin(0.5)
			.setInteractive({ useHandCursor: true })
			.on('pointerdown', () => {
				sceneEvents.emit('button-click', true);
				this.scene.stop('game-ui');
				this.scene.stop('game');
				this.scene.start('menu');
			});

		const buttonMusic = this.add.image(this.cameras.main.worldView.x + this.cameras.main.width / 2 + 90, this.cameras.main.worldView.y + this.cameras.main.height / 2, 'quitButton')
			.setOrigin(0.5)
			.setInteractive({ useHandCursor: true })
			.on('pointerdown', () => {
				sceneEvents.emit('button-click', true);
				if (this.game.sound.mute === true) {
					this.game.sound.mute = false;
				} else {
					this.game.sound.mute = true;
				}
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
