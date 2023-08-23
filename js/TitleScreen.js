export const TitleScreen = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { key: 'TitleScreen' });
    },

    preload: function () {
        this.load.image('background', 'images/background.png');
        this.load.audio('titleScreenSound', 'sounds/TitleScreenSound.mp3');
    },

    create: function () {
        this.sound.stopAll();
        const titleScreenSound = this.sound.add('titleScreenSound')
        titleScreenSound.play()
        var background = this.add.sprite(0, 0, 'background');
        background.setOrigin(0, 0); // Set the origin to top-left corner
        background.displayWidth = this.game.config.width;
        background.displayHeight = this.game.config.height;

        

        // Create a title text
        var titleText = this.add.text(this.game.config.width / 2, this.game.config.height / 2 - 300, "The Green Forest", { font: "148px Silkscreen", fill: "#ffffff" });
        titleText.setOrigin(0.5);
        titleText.setShadow(3, 3, "#000000", 5);
        titleText.setStroke("#000000", 6);

        var playButton = this.add.text(this.game.config.width / 2, this.game.config.height / 2 - 40, "Play", { font: "72px 'Silkscreen'", fill: "#ffffff" });
        playButton.setOrigin(0.5);
        playButton.setInteractive();
        playButton.setStroke("#000000", 4);

        playButton.on('pointerover', function () {
            playButton.setFill("#37fd12");
            playButton.setShadow(3, 3, "#000000", 5);
            this.input.setDefaultCursor('pointer');
        }, this);

        playButton.on('pointerout', function () {
            playButton.setFill("#ffffff");
            playButton.setShadow(0, 0, "#000000", 0);
            this.input.setDefaultCursor('default');
        }, this);

        playButton.on('pointerdown', function () {
            console.log("Play button clicked"); // Debugging
            this.scene.start("GameState");
        }, this);

        var aboutButton = this.add.text(this.game.config.width / 2, this.game.config.height / 2 + 100, "About", { font: "72px 'Silkscreen'", fill: "#ffffff" });
        aboutButton.setOrigin(0.5);
        aboutButton.setInteractive();
        aboutButton.setStroke("#000000", 4);

        aboutButton.on('pointerover', function () {
            aboutButton.setFill("#37fd12");
            aboutButton.setShadow(3, 3, "#000000", 5);
            this.input.setDefaultCursor('pointer');
        }, this);

        aboutButton.on('pointerout', function () {
            aboutButton.setFill("#ffffff");
            aboutButton.setShadow(0, 0, "#000000", 0);
            this.input.setDefaultCursor('default');
        }, this);

        aboutButton.on('pointerdown', function () {
            console.log("About button clicked"); // Debugging
            this.scene.start('AboutScene');
        }, this);
    }
});