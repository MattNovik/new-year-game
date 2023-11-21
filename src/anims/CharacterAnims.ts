import Phaser from 'phaser'

const createCharacterAnims = (anims: Phaser.Animations.AnimationManager) => {
	anims.create({
		key: 'faune-idle-down',
		frames: [{ key: 'faune', frame: 'walk-down-3.png' }]
	})

	anims.create({
		key: 'faune-idle-up',
		frames: [{ key: 'faune', frame: 'walk-up-3.png' }]
	})

	anims.create({
		key: 'faune-idle-side',
		frames: [{ key: 'faune', frame: 'walk-side-3.png' }]
	})

	anims.create({
		key: 'faune-run-down',
		frames: anims.generateFrameNames('faune', { start: 1, end: 8, prefix: 'run-down-', suffix: '.png' }),
		repeat: -1,
		frameRate: 15
	})

	anims.create({
		key: 'faune-run-up',
		frames: anims.generateFrameNames('faune', { start: 1, end: 8, prefix: 'run-up-', suffix: '.png' }),
		repeat: -1,
		frameRate: 15
	})

	anims.create({
		key: 'faune-run-side',
		frames: anims.generateFrameNames('faune', { start: 1, end: 8, prefix: 'run-side-', suffix: '.png' }),
		repeat: -1,
		frameRate: 15
	})

	anims.create({
		key: 'faune-faint',
		frames: anims.generateFrameNames('faune', { start: 1, end: 4, prefix: 'faint-', suffix: '.png' }),
		frameRate: 15
	})
}

const createHeroAnims = (anims: Phaser.Animations.AnimationManager) => {
	anims.create({
		key: 'hero-idle-bottom',
		frames: [{ key: 'hero', frame: 'idle_1.png' }]
	})

	anims.create({
		key: 'hero-idle-left',
		frames: [{ key: 'hero', frame: 'left_1.png' }]
	})

	anims.create({
		key: 'hero-idle-right',
		frames: [{ key: 'hero', frame: 'right_1.png' }]
	})

	anims.create({
		key: 'hero-idle-up',
		frames: [{ key: 'hero', frame: 'back_1.png' }]
	})

	anims.create({
		key: 'hero-run-bottom',
		frames: anims.generateFrameNames('hero', { start: 1, end: 3, prefix: 'idle_', suffix: '.png' }),
		repeat: -1,
		frameRate: 10
	})

	anims.create({
		key: 'hero-run-right',
		frames: anims.generateFrameNames('hero', { start: 1, end: 3, prefix: 'right_', suffix: '.png' }),
		repeat: -1,
		frameRate: 10
	})

	anims.create({
		key: 'hero-run-left',
		frames: anims.generateFrameNames('hero', { start: 1, end: 3, prefix: 'left_', suffix: '.png' }),
		repeat: -1,
		frameRate: 10
	})

	anims.create({
		key: 'hero-run-up',
		frames: anims.generateFrameNames('hero', { start: 1, end: 3, prefix: 'back_', suffix: '.png' }),
		repeat: -1,
		frameRate: 10
	})

	anims.create({
		key: 'hero-dead-down',
		frames: [{ key: 'hero', frame: 'back_1.png' }]
	})
};

const removeHeroAnims = (anims: Phaser.Animations.AnimationManager) => {
	anims.remove('hero-idle-bottom');
	anims.remove('hero-idle-left');
	anims.remove('hero-idle-right');
	anims.remove('hero-idle-up');
	anims.remove('hero-run-bottom');
	anims.remove('hero-run-right');
	anims.remove('hero-run-left');
	anims.remove('hero-run-up');
	anims.remove('hero-dead-down');

};

export {
	createCharacterAnims,
	createHeroAnims,
	removeHeroAnims
}
