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
            debug: true,
            enableSleeping: false,

        }
    },
    backgroundColor: '#1B2210' // Set your desired background color here
};

var game = new Phaser.Game(config);
var cursors;
var player;
var jumpKey;
const speed = 4
const jumpForce = 15
var seed   
var isTouchingGround = false
var canJump = true
var playerX
var playerY

var score = 0
var seedStored = 0
function preload() {
    this.load.image('background', 'images/background.png');
    this.load.image('tiles', 'map/tiles.png');
    this.load.image('seed', 'images/seed.png');
    // this.load.image('sophy', 'images/sophy.png',);
    this.load.tilemapTiledJSON('map', 'map/map1.json');
    // this.load.spritesheet('characterSheet', 'images/sophy_walk.png', {
    //     frameWidth: 20.5, // The width of a single frame in pixels
    //     frameHeight: 33 // The height of a single frame in pixels
    // });
    this.load.atlas('sophy', 'images/sophy_walk.png', 'images/sophy_walk.json')
    this.load.atlas('sophy_idle', 'images/sophy_idle.png', 'images/sophy_idle.json')
    this.load.atlas('sophy_jump', 'images/sophy_jump.png', 'images/sophy_jump.json')
    this.load.atlas('sophy_plant', 'images/sophy_plant.png', 'images/sophy_plant.json')

}

function create() {

    var background = this.add.image(0, 665, 'background');
    background.setOrigin(0)
    // background.displayHeight = this.sys.game.config.height;
    background.displayHeight = 300
    background.scaleX = background.scaleY;

    const seedGroup = this.matter.world.nextGroup();
    const seeds = []; // Array to store seed sprites


    const map = this.make.tilemap({ key: "map"});
    const tileset = map.addTilesetImage("groundTiles", "tiles");
    const ground = map.createLayer("ground", tileset, 0);
    ground.setCollisionByProperty({ collide_dynamic: true})
    ground.setCollisionByProperty({ collide: true})
    this.matter.world.convertTilemapLayer(ground)

    //Player 
    player = this.matter.add.sprite(100, 810, 'sophy');
    player.scaleX = 1.3
    player.scaleY = 1.2
    player.setFixedRotation(true)
    player.setFriction(10, 0); // The first value is for horizontal friction, the second for vertical friction


    //Camera
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player)
    this.cameras.main.setZoom(2)
    //Seed
    const objectLayer = map.getObjectLayer('seed')
    objectLayer.objects.forEach(objData => {
        const {x = 0, y = 0, name, width = 0} = objData
        switch(name)
        {
            case 'seed':
            {
                seed = this.matter.add.sprite(x, y, 'seed')  
                seed.displayHeight = 25
                seed.displayWidth = 25
                seed.setData('type', 'seed')
                break
            }
        }
    })





    cursors = this.input.keyboard.createCursorKeys(); // Create cursor keys for input


    player.setOnCollide(function (data) {
        const body = data.bodyB;
        isTouchingGround = true
        const gameObject = body.gameObject
        const sprite = gameObject
        const type = sprite.getData('type')
        switch(type)
        {
            case 'seed':
            {
                sprite.destroy()
                playerX = player.body.position.x
                playerY = player.body.position.y
                console.log(playerX)
            }
        }
    });




    //Score
    const textStyle = {
        fontFamily: 'Silkscreen',
        fontSize: '20px',
        color: '#ffffff',
        align: 'center'
    };
    
    const infoText = this.add.text(10, 610, 'Press E to plant', textStyle);
    infoText.setOrigin(1,1)
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

    this.anims.create({
        key: 'sophy_jump',
        frames: this.anims.generateFrameNumbers('sophy_jump', {start: 1, end: 6, prefix: '', suffix:'.png' }), 
        frameRate: 6, // Adjust the frame rate as needed
        repeat: -1 // Repeat the animation indefinitely
    });

    this.anims.create({
        key: 'sophy_plant',
        frames: this.anims.generateFrameNumbers('sophy_plant', {start: 1, end: 6, prefix: '', suffix:'.png' }), 
        frameRate: 6, // Adjust the frame rate as needed
        repeat: -1 // Repeat the animation indefinitely
    });




}

function update() {
    eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    if(cursors.left.isDown)
    {
        player.flipX = true
        player.setVelocityX(-speed)
        if(isTouchingGround)
        {
            player.anims.play('sophy_walk', true);
        }
    } else if(cursors.right.isDown)
    {
        player.flipX = false
        player.setVelocityX(speed)
        if(isTouchingGround)
        {
            player.anims.play('sophy_walk', true);
        }
    } else 
    {
        player.setVelocityX(0)
    }
    

    if (player.body.velocity.x === 0 && player.body.velocity.y === 0 && !eKey.isDown) {
        player.anims.play('sophy_idle', true);
    }
    
    if(spaceKey.isDown)
    {
        if (isTouchingGround) {
            player.setVelocityY(-jumpForce); 
            player.anims.play('sophy_jump', true)
            isTouchingGround = false
        }
    }

    if(eKey.isDown)
    {
        player.anims.play('sophy_plant', true)
    }
}



