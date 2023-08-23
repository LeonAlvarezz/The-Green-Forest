import { sharedData } from './SharedData.js';

export const WinScene = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { key: 'WinScene' });
    },

    preload: function () {
        this.load.image('background', 'images/background.png');
        this.load.audio('sumScore', 'sounds/SumScore.mp3');
        this.load.audio('levelComplete', 'sounds/levelComplete.mp3');
    },

    create: function (data) {
        this.sound.stopAll();
        const sumScore = this.sound.add('sumScore')
        const levelComplete = this.sound.add('levelComplete')
        levelComplete.play()
        var scoreText = data.score;
        var lives = data.lives;
        var background = this.add.sprite(0, 0, 'background');
        background.setOrigin(0, 0);
        background.displayWidth = this.game.config.width;
        background.displayHeight = this.game.config.height;
        background.alpha = 0.5;

        var centerX = this.game.config.width / 2;
        var centerY = this.game.config.height / 2.5;

        var texts = [];

        function createText(x, y, content, font, align) {
            var text = this.add.text(x, y, content, {
                fontFamily: 'Silkscreen',
                fontSize: font + 'px',
                color: '#ffffff'
            });
            text.setOrigin(align, 0.5);
            text.setShadow(5, 5, '#000000', 5);
            text.setStroke('#000000', 6);
            texts.push(text);
            return text;
        }

        createText.call(this, centerX, centerY - 300, 'Level Complete', 128);
        createText.call(this, centerX - 600, centerY - 100, scoreText + " Seed x 1000", 72, 0);
        var newScoreText = createText.call(this, centerX + 600, centerY - 100, '0', 72, 1);
        //createText.call(this, centerX + 600, centerY - 100, scoreText, 72, 1);
        createText.call(this, centerX - 600, centerY + 50, lives + " lives x 1000", 72, 0);
        var newLevelScore = createText.call(this, centerX + 600, centerY + 50, lives *= 1000, 72, 1);
        createText.call(this, centerX - 600, centerY + 200, "Total Score", 72, 0);
        var newTotalScore = createText.call(this, centerX + 600, centerY + 200, lives + scoreText, 72, 1);

        function animateScore(targetText, finalValue) {
            this.tweens.addCounter({
                from: 0,
                to: finalValue,
                duration: 1300, // Adjust the duration as needed
                onUpdate: function (tween) {
                    var value = Math.floor(tween.getValue());
                    targetText.text = value;
                },
                onComplete: function () {
                    // You can perform additional actions here when the animation completes
                }
            });
        }
        sumScore.play()
        animateScore.call(this, newScoreText, scoreText *= 1000);
        animateScore.call(this, newLevelScore, lives);
        animateScore.call(this, newTotalScore, lives + scoreText);

        function createTextWithInteractivity(x, y, text, fontSize, onClick) {
            var newText = this.add.text(x, y, text, {
                fontFamily: 'Silkscreen',
                fontSize: fontSize + 'px',
                color: '#ffffff',
                align: 'center'
            });

            newText.setOrigin(0.5);
            newText.setShadow(5, 5, '#000000', 5);
            newText.setStroke('#000000', 6);

            newText.on('pointerover', function () {
                newText.setFill("#37fd12");
                newText.setShadow(3, 3, "#000000", 5);
                this.input.setDefaultCursor('pointer');
            }, this);

            newText.on('pointerout', function () {
                newText.setFill("#ffffff");
                newText.setShadow(0, 0, "#000000", 0);
                this.input.setDefaultCursor('default');
            }, this);

            newText.setInteractive();
            newText.on('pointerdown', onClick, this);

            return newText;
        }

        var playAgainButton = createTextWithInteractivity.call(this, centerX, centerY + 330, 'Next Level', 72, function () {
            this.scene.start('GameState');
        });

        var titleScreenButton = createTextWithInteractivity.call(this, centerX, centerY + 450, 'Go Back To Main Page', 52, function () {
            this.scene.start('TitleScreen');
        });
    }
});