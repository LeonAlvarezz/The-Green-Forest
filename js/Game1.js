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
    physics: {
        default: "matter",
        matter: {
            debug: true
        }
    },
    backgroundColor: '#FFFFFF' // Set your desired background color here
};

var game = new Phaser.Game(config);
var cursors;
var player;
var jumpKey;
const speed = 1;
const jumpForce = 8 ;     
var isTouchingGround = false

function preload() {
    this.load.image('background', 'images/background.png');
    this.load.image('tiles', 'map/tiles.png');
    // this.load.image('sophy', 'images/sophy.png',);
    this.load.tilemapTiledJSON('map', 'map/map1.json');
    // this.load.spritesheet('characterSheet', 'images/sophy_walk.png', {
    //     frameWidth: 20.5, // The width of a single frame in pixels
    //     frameHeight: 33 // The height of a single frame in pixels
    // });
    this.load.atlas('sophy', 'images/sophy_walk.png', 'images/sophy_walk.json')
    this.load.atlas('sophy_idle', 'images/sophy_idle.png', 'images/sophy_idle.json')

}

function create() {

    var background = this.add.image(0, 0, 'background');
    background.setOrigin(0)
    background.displayHeight = this.sys.game.config.height;
    background.scaleX = background.scaleY;

    const map = this.make.tilemap({ key: "map"});
    const tileset = map.addTilesetImage("groundTiles", "tiles");
    const ground = map.createLayer("ground", tileset, 0);
    ground.setCollisionByProperty({ collide: true})
    this.matter.world.convertTilemapLayer(ground)


    player = this.matter.add.sprite(100, 810, 'sophy');
    player.scaleX = 1.3
    player.scaleY = 1.2

    player.setFixedRotation(true)
    this.anims.create({
        key: 'sophy_walk',
        frames: this.anims.generateFrameNumbers('sophy', {start: 1, end: 6, prefix: '', suffix:'.png' }), 
        frameRate: 6, // Adjust the frame rate as needed
        repeat: -1 // Repeat the animation indefinitely
    });

    this.anims.create({
        key: 'sophy_idle',
        frames: this.anims.generateFrameNumbers('sophy_idle', {start: 1, end: 4, prefix: '', suffix:'.png' }), 
        frameRate: 4, // Adjust the frame rate as needed
        repeat: -1 // Repeat the animation indefinitely
    });



    cursors = this.input.keyboard.createCursorKeys(); // Create cursor keys for input
    this.input.keyboard.on('keydown-SPACE', () => {
        player.setVelocityY(jumpForce);
    });

    player.setOnCollide(function (data) {
        isTouchingGround = true
    });

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels); // Set camera bounds to the size of the map
    this.cameras.main.startFollow(player)
    this.cameras.main.setZoom(3)
}

function update() {

    if(cursors.left.isDown)
    {
        player.flipX = true
        player.setVelocityX(-speed)
        player.anims.play('sophy_walk', true); // Use anims.play instead of player.play
    } else if(cursors.right.isDown)
    {
        player.flipX = false
        player.setVelocityX(speed)
        player.anims.play('sophy_walk', true); // Use anims.play instead of player.play
    } else 
    {
        player.setVelocityX(0)
        player.anims.play('sophy_idle', true); // Use anims.play instead of player.play

    }

    if (cursors.space.isDown && isTouchingGround )  {
        player.setVelocityY(-jumpForce)    
        isTouchingGround = false
    }
}



