import Phaser from 'phaser';

import { debugDraw } from '../utils/debug';
import { createSlimeAnims, removeSlimeAnims } from '../anims/EnemyAnims';
import { createHeroAnims, removeHeroAnims } from '../anims/CharacterAnims';
import { createChestAnims, removeChestAnims } from '../anims/TreasureAnims';

import Slime from '~/enemies/Slime';

import '../characters/Hero';
import Hero from '../characters/Hero';

import { sceneEvents } from '../events/EventsCenter';
import Chest from '../items/Chest';
import Gift from '~/items/Gift';

export default class Game extends Phaser.Scene {
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

	private map: any
	private hero!: Hero

	private finalLevel = false;

	private chests: any

	private slimes!: Phaser.Physics.Arcade.Group
	private gifts!: any

	private snowBalls!: Phaser.Physics.Arcade.Group

	private playerSlimeCollider?: Phaser.Physics.Arcade.Collider
	private playerGiftCollider?: Phaser.Physics.Arcade.Collider

	constructor() {
		super('game')
	}

	preload() {
		this.cursors = this.input.keyboard.createCursorKeys();
	}

	public destroyLevel(gameOverText: any, buttonAgain: any, buttonQuit: any) {
		if (gameOverText) {
			gameOverText.destroy();
		}
		if (buttonAgain) {
			buttonAgain.destroy();
		}
		if (buttonQuit) {
			buttonQuit.destroy();
		}
		removeChestAnims(this.anims);
		removeHeroAnims(this.anims);
		removeSlimeAnims(this.anims);

		this.physics.world.colliders.destroy();
		this.slimes.destroy(true);
		this.snowBalls.destroy(true);
		this.gifts.destroy(true);
		this.hero.destroy(true);
		this.chests.destroy(true);
		this.map.destroyLayer(true);
		this.map.destroy(true);
	}

	public loadLevel(key: any) {
		createHeroAnims(this.anims);
		createSlimeAnims(this.anims);
		createChestAnims(this.anims);

		this.map = this.add.tilemap(key);
		const tileset: any = this.map.addTilesetImage('dungeon', 'tiles', 16, 16);
		const tilesetTrees: any = this.map.addTilesetImage('Trees', 'tilesTrees', 16, 16);
		const tilesetStones: any = this.map.addTilesetImage('Stones', 'tilesStones', 16, 16);

		this.map.createLayer('Ground', tileset);

		const treesLayer: any = this.map.createLayer('Trees', tilesetTrees);

		treesLayer.setCollisionByProperty({ collides: true });

		const blockSLayer: any = this.map.createLayer('Stones', tilesetStones);

		blockSLayer.setCollisionByProperty({ collides: true });

		this.chests = this.physics.add.staticGroup({
			classType: Chest
		});

		const chestsLayer: any = this.map.getObjectLayer('Chests');

		chestsLayer.objects.forEach(chestObj => {
			this.chests.get(chestObj.x! + chestObj.width! * 0.5, chestObj.y! - chestObj.height! * 0.5, 'treasure');
		});

		this.gifts = this.physics.add.staticGroup({
			classType: Gift
		});

		const giftsLayer: any = this.map.getObjectLayer('Gifts');

		giftsLayer.objects.forEach(giftObj => {
			this.gifts.get(giftObj.x! + giftObj.width! * 0.5, giftObj.y! - giftObj.height! * 0.5, 'gift');
		});


		this.snowBalls = this.physics.add.group({
			classType: Phaser.Physics.Arcade.Image,
			maxSize: 4
		});

		this.hero = this.add.hero(128, 128, 'hero');

		this.hero.setSnowBalls(this.snowBalls);

		sceneEvents.emit('player-health-changed', this.hero.health);

		this.cameras.main.startFollow(this.hero, true);
		this.physics.add.collider(this.hero, treesLayer);

		this.physics.add.collider(this.hero, blockSLayer);

		this.slimes = this.physics.add.group({
			classType: Slime,
			createCallback: (go) => {
				const slimeGo: any = go as Slime;
				slimeGo.body.onCollide = true;
			}
		});

		const slimesLayer: any = this.map.getObjectLayer('Slimes');
		slimesLayer.objects.forEach(lizObj => {
			this.slimes.get(lizObj.x! + lizObj.width! * 0.5, lizObj.y! - lizObj.height! * 0.5, 'lizard');
		});

		this.physics.add.collider(this.slimes, treesLayer);
		this.physics.add.collider(this.slimes, blockSLayer);
		this.physics.add.collider(this.slimes, this.chests);
		this.physics.add.collider(this.slimes, this.gifts);

		this.physics.add.collider(this.hero, this.chests, this.handlePlayerChestCollision, undefined, this);

		this.physics.add.collider(this.snowBalls, treesLayer, this.handleSnowBallsTreesCollision, undefined, this);
		this.physics.add.collider(this.snowBalls, blockSLayer, this.handleSnowBallsTreesCollision, undefined, this);
		this.physics.add.collider(this.snowBalls, this.slimes, this.handleSnowBallsSlimesCollision, undefined, this);

		this.playerGiftCollider = this.physics.add.collider(this.hero, this.gifts, this.handlePlayerGiftCollision, undefined, this);
		this.playerSlimeCollider = this.physics.add.collider(this.slimes, this.hero, this.handlePlayerSlimeCollision, undefined, this);
	}

	create() {
		this.scene.run('game-ui');
		this.loadLevel('dungeon');

		this.scale.startFullscreen();
	}

	private handlePlayerChestCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
		const chest = obj2 as Chest;
		this.hero.setChests(chest);
	};

	private handleSnowBallsTreesCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
		obj1.destroy();
		/* this.snowBalls.killAndHide(obj1); */
	};

	private handleSnowBallsSlimesCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
		obj1.destroy();
		obj2.destroy();
		/* this.snowBalls.killAndHide(obj1);
		this.slimes.killAndHide(obj2); */
	};

	private handlePlayerGiftCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
		if (!this.finalLevel) {
			sceneEvents.emit('player-level-changed');
			sceneEvents.emit('player-gift-changed');
			this.destroyLevel(undefined, undefined, undefined);
			let gameOverText = this.add.text(this.cameras.main.worldView.x + this.cameras.main.width / 2, this.cameras.main.worldView.y + this.cameras.main.height / 2, 'Загрузка уровня', { fontSize: '32px', color: '#fff', fontStyle: '700' }).setOrigin(0.5);
			setTimeout(() => {
				gameOverText.destroy();
				this.loadLevel('dungeon-2');
				this.finalLevel = true;
			}, 3000);
		} else {
			this.destroyLevel(undefined, undefined, undefined);
			this.finishedGame()
		}
	}

	private handlePlayerSlimeCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {

		const slime = obj2 as Slime;

		const dx = this.hero.x - slime.x;
		const dy = this.hero.y - slime.y;

		const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

		this.hero.handleDamage(dir);

		sceneEvents.emit('player-health-changed', this.hero.health);

		if (this.hero.health <= 0) {
			this.playerSlimeCollider?.destroy();
			let rt = this.add.renderTexture(0, 0, window.screen.width, this.game.scale.canvas.offsetHeight + 500);
			rt.fill(0x000000, 0.5);
			let gameOverText = this.add.text(this.cameras.main.worldView.x + this.cameras.main.width / 2, this.cameras.main.worldView.y + this.cameras.main.height / 2, 'GAME OVER', { fontSize: '32px', color: 'red', fontStyle: '700' }).setOrigin(0.5);
			// Then later in one of your scenes, create a new button:
			const buttonAgain = this.add.image(this.cameras.main.worldView.x + this.cameras.main.width / 2 - 30, this.cameras.main.worldView.y + this.cameras.main.height / 2 + 50, 'startButton')
				.setOrigin(0.5)
				.setInteractive({ useHandCursor: true })
				.on('pointerdown', () => {
					this.destroyLevel(gameOverText, buttonAgain, buttonQuit);
					this.loadLevel('dungeon');
					rt.destroy();
				})
			const buttonQuit = this.add.image(this.cameras.main.worldView.x + this.cameras.main.width / 2 + 30, this.cameras.main.worldView.y + this.cameras.main.height / 2 + 50, 'quitButton')
				.setOrigin(0.5)
				.setInteractive({ useHandCursor: true })
				.on('pointerdown', () => {
					this.destroyLevel(gameOverText, buttonAgain, buttonQuit);
					this.loadLevel('dungeon');
					rt.destroy();
				});
			buttonAgain.setDepth(1);
			buttonQuit.setDepth(1);
		}
	};

	finishedGame() {
		sceneEvents.emit('player-finished-game');
		const buttonRestart = this.add.text(this.cameras.main.worldView.x + this.cameras.main.width / 2 - 60, this.cameras.main.worldView.y + this.cameras.main.height / 2 - 70, 'Ещё раз',)
			.setOrigin(0.5)
			.setPadding(10)
			.setStyle({ backgroundColor: '#111' })
			.setInteractive({ useHandCursor: true })
			.on('pointerdown', () => {
				this.scene.restart();
			})
		const buttonSendFinaldata = this.add.text(this.cameras.main.worldView.x + this.cameras.main.width / 2 + 60, this.cameras.main.worldView.y + this.cameras.main.height / 2 - 70, 'Отправить',)
			.setOrigin(0.5)
			.setPadding(10)
			.setStyle({ backgroundColor: '#111' })
			.setInteractive({ useHandCursor: true })
			.on('pointerdown', () => {
				console.log('sendData');
			})
	}

	update(t: number, dt: number) {
		if (this.hero) {
			this.hero.update(this.cursors);
		}
	}
}
