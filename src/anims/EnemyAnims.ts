import Phaser from 'phaser'

const createLizardAnims = (anims: Phaser.Animations.AnimationManager) => {
	anims.create({
		key: 'lizard-idle',
		frames: anims.generateFrameNames('lizard', { start: 0, end: 3, prefix: 'lizard_m_idle_anim_f', suffix: '.png' }),
		repeat: -1,
		frameRate: 10
	})

	anims.create({
		key: 'lizard-run',
		frames: anims.generateFrameNames('lizard', { start: 0, end: 3, prefix: 'lizard_m_run_anim_f', suffix: '.png' }),
		repeat: -1,
		frameRate: 10
	})
}

const createSlimeAnims = (anims: Phaser.Animations.AnimationManager) => {
	anims.create({
		key: 'slime-idle',
		frames: anims.generateFrameNames('slime', { start: 0, end: 3, prefix: 'idle_', suffix: '.png' }),
		repeat: -1,
		frameRate: 10
	});

	anims.create({
		key: 'slime-run',
		frames: anims.generateFrameNames('slime', { start: 0, end: 3, prefix: 'run_', suffix: '.png' }),
		repeat: -1,
		frameRate: 10
	})
};

const removeSlimeAnims = (anims: Phaser.Animations.AnimationManager) => {
	anims.remove('slime-idle');
	anims.remove('slime-run');
};


export {
	createLizardAnims,
	createSlimeAnims, removeSlimeAnims
}
