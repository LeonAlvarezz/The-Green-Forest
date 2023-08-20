var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    parent: 'gameContainer',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    backgroundColor: '#FFFFFF' // Set your desired background color here
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image('background', 'images/background.png');
    this.load.image('tiles', 'map/tiles.png');
    this.load.tilemapTiledJSON('map', 'map/map1.json');
}

function create() {

    var background = this.add.image(0,-120, 'background');
    background.displayHeight = this.sys.game.config.height;
    background.scaleX = background.scaleY;
    background.setOrigin(0)
    const map = this.make.tilemap({ key: "map"});
    const tileset = map.addTilesetImage("groundTiles", "tiles");
    const layer = map.createLayer("ground", tileset, 0);
    this.cameras.main.scrollY = -120
    // layer.setDisplaySize(this.sys.game.config.width, layer.height);
}

function update() {

}



