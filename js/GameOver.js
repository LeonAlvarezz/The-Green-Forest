export const GameOverScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { key: 'GameOverScene' });
    },

    preload: function () {
        this.load.image('background', 'images/background.png');
        this.load.audio('gameOver', 'sounds/game_over.mp3');
    },


    create: function () {
        this.sound.stopAll();
        const gameOverSound = this.sound.add('gameOver')
        gameOverSound.play()
        // Create game over text and any other UI elements
        var background = this.add.sprite(0, 0, 'background');
        background.setOrigin(0, 0); // Set the origin to top-left corner
        background.displayWidth = this.game.config.width;
        background.displayHeight = this.game.config.height;

        background.alpha = 0.5;

        // Calculate the center of the screen
        var centerX = this.game.config.width / 2;
        var centerY = this.game.config.height / 2.5;

        var gameOverText = this.add.text(centerX, centerY - 150, 'Game Over', {
            fontFamily: 'Silkscreen',
            fontSize: '200px',

            color: '#ff0000'
        });

        gameOverText.setOrigin(0.5);
        gameOverText.setShadow(5, 5, '#000000', 5);
        gameOverText.setStroke('#000000', 6);

        var tryAgainButton = this.add.text(centerX, centerY + 100, 'Try Again', {
            fontFamily: 'Silkscreen',
            fontSize: '72px',
            color: '#ffffff'
        });

        tryAgainButton.setOrigin(0.5);
        tryAgainButton.setInteractive();
        tryAgainButton.setStroke("#000000", 4);

        tryAgainButton.on('pointerover', function () {
            tryAgainButton.setFill("#37fd12");
            tryAgainButton.setShadow(3, 3, "#000000", 5);
            this.input.setDefaultCursor('pointer');
        }, this);

        tryAgainButton.on('pointerout', function () {
            tryAgainButton.setFill("#ffffff");
            tryAgainButton.setShadow(0, 0, "#000000", 0);
            this.input.setDefaultCursor('default');
        }, this);

        // Add event listener to the reset button
        tryAgainButton.on('pointerdown', function () {
            this.scene.start('GameState'); // Switch to the main title screen
        }, this);

        var titleScreenButton = this.add.text(centerX, centerY + 250, 'Go Back To Main Page', {
            fontFamily: 'Silkscreen',
            fontSize: '52px',
            color: '#ffffff'
        });

        titleScreenButton.setOrigin(0.5);
        titleScreenButton.setInteractive();
        titleScreenButton.setStroke("#000000", 4);

        titleScreenButton.on('pointerover', function () {
            titleScreenButton.setFill("#37fd12");
            titleScreenButton.setShadow(3, 3, "#000000", 5);
            this.input.setDefaultCursor('pointer');
        }, this);

        titleScreenButton.on('pointerout', function () {
            titleScreenButton.setFill("#ffffff");
            titleScreenButton.setShadow(0, 0, "#000000", 0);
            this.input.setDefaultCursor('default');
        }, this);

        // Add event listener to the reset button
        titleScreenButton.on('pointerdown', function () {
            this.scene.start('TitleScreen'); // Switch to the main title screen
        }, this);
    }
});