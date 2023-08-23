export const AboutScene = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function AboutScene() {
        Phaser.Scene.call(this, { key: 'AboutScene' });
    },

    preload: function () {
        this.load.image('background', 'images/background.png');
    },

    create: function () {
        var background = this.add.sprite(0, 0, 'background');
        background.setOrigin(0, 0);
        background.displayWidth = this.game.config.width;
        background.displayHeight = this.game.config.height;
        var centerX = this.game.config.width / 2;
        var centerY = this.game.config.height / 2;
        background.alpha = 0.5;

        var aboutText = this.add.text(centerX, centerY + 530, 'Game is created to educate people to \nprotect the nature and show people \nthe effective of deforestation.\n\nThank you for playing \nPrey Cher Game game.\nHope you enjoy.\n\nDeveloped by:\nHong Narethputponleu\nSreng Kuong\nVysedh', {
            fontFamily: 'Silkscreen',
            fontSize: '72px',
            color: '#ffffff',
            align: 'center',
            wordWrap: true,
            wordWrapWidth: 1000
        });

        aboutText.setOrigin(0.5, 0);
        aboutText.setShadow(5, 5, '#000000', 5);
        aboutText.setStroke('#000000', 6);

        var self = this; // Store the scope of 'this'
        var tween = this.tweens.add({
            targets: aboutText,
            y: centerY - aboutText.height - 560, // Move to the top of the screen
            duration: 17000, // Adjust the duration as needed
            ease: 'Linear', // Use linear easing for consistent speed
            onComplete: function () {
                self.closeAboutPage(); // Use the stored scope
            }
        });

        this.input.on('pointerdown', function () {
            tween.stop();
            self.closeAboutPage();
        }, this);

        this.input.keyboard.on('keydown-ESC', function () {
            tween.stop();
            self.closeAboutPage();
        }, this);
    },

    closeAboutPage: function () {
        this.scene.start('TitleScreen'); // Transition to TitleScreen scene
    }
});