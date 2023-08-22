var cursors;
var player;
var jumpKey;
const speed = 10
const jumpForce = 8
var seed   
var isTouchingGround = false
var canJump = true
var playerX
var playerY
var infoText
var plantText
var eKey
var spaceKey
var score = 0
var seedStored = 1
var plantable = false
var eKeyDownTime = 0;
var holdingE = false;
class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene'});
        event = new Phaser.Events.EventEmitter();

    }

    create() {


        infoText = this.add.text(
            10, // Center horizontally
            30, // Fixed position at the top
            'Seed: ' + seedStored,  {
                fontFamily: 'Silkscreen',
                fontSize: '40px',
                color: '#ffffff',
            }).setOrigin(0, 0); // Set origin to center horizontally and top vertically

        

        plantText = this.add.text(
            this.cameras.main.width / 2, 
            this.cameras.main.height / 3, 
            'Press E to Plant',  {
                fontFamily: 'Silkscreen',
                fontSize: '40px',
                color: '#ffffff',
            }).setOrigin(0.5, 0.5); //
        plantText.setVisible(false)

    }

        updateSeedText(newSeedStored) {
            seedStored+=1
            infoText.text = 'Seed: ' + seedStored
        }
        

        updatePlantText() {
            infoText.text = 'Planting'
        }
     
    }

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        event = new Phaser.Events.EventEmitter();
        this.enemies = []; // Initialize an empty array to store enemies

    }

    preload() {
        this.load.image('background', 'images/background.png');
        this.load.image('tiles', 'map/tiles.png');
        this.load.image('seed', 'images/seed.png');
        this.load.image('tree', 'map/tree.png');
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
        this.load.atlas('goon_idle', 'images/goon_idle.png', 'images/goon_idle.json')
        this.load.atlas('goon_walk', 'images/goon_walk.png', 'images/goon_walk.json')
        this.load.image('bigTree', 'images/tree.png');
    }

    create() {
        var background = this.add.image(0, 665, 'background');
        background.setOrigin(0)
        // background.displayHeight = this.sys.game.config.height;
        background.displayHeight = 300
        background.scaleX = background.scaleY;

        const seedGroup = this.matter.world.nextGroup();
        const seeds = []; // Array to store seed sprites
        this.scene.launch("UIScene")

        const map = this.make.tilemap({ key: "map"});
        const tileset = map.addTilesetImage("groundTiles", "tiles");
        const ground = map.createLayer("ground", tileset, 0);
        ground.setCollisionByProperty({ collide: true})
        this.matter.world.convertTilemapLayer(ground)


        //Player 
        player = this.matter.add.sprite(100, 810, 'sophy');
        player.scaleX = 1.3
        player.scaleY = 1.2
        player.setFixedRotation(true)
        player.setFriction(0, 0)
        player.setDepth(1)

        //Camera
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(player)
        this.cameras.main.setZoom(3) 
        


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

        this.anims.create({
            key: 'goon_idle',
            frames: this.anims.generateFrameNumbers('goon_idle', {start: 1, end: 4, prefix: '', suffix:'.png' }), 
            frameRate: 3, // Adjust the frame rate as needed
            repeat: -1 // Repeat the animation indefinitely
        });
        this.anims.create({
            key: 'goon_walk',
            frames: this.anims.generateFrameNumbers('goon_walk', {start: 1, end: 6, prefix: '', suffix:'.png' }), 
            frameRate: 6, // Adjust the frame rate as needed
            repeat: -1 // Repeat the animation indefinitely
        });

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


        const enemyLayer = map.getObjectLayer('enemy')
        enemyLayer.objects.forEach(objData => {
            const {x = 0, y = 0, name, width = 0} = objData
            switch(name)
            {
                case 'enemy':
                {
                    var enemy = this.matter.add.sprite(x, y, 'goon_idle')  
                    enemy.displayHeight = 45
                    enemy.displayWidth = 26
                    enemy.setData('type', 'enemy')
                    this.enemies.push(enemy); // Add enemy to the enemies array
                    enemy.setFixedRotation(true)
                    break
                }
            }
        })



        const treeLayer = map.getObjectLayer('tree')
        treeLayer.objects.forEach(objData => {
            const {x = 0, y = 0, name, width = 0} = objData
            switch(name)
            {
                case 'tree':
                {
                    var tree = this.matter.add.image(x, y, 'tree')
                    tree.setCollisionCategory(0); // Set collision category to 0 (none)
                    tree.setCollidesWith(1); // Set collides with category to 1 (player category)

                    // You can also set the body as static so it doesn't fall due to gravity
                    tree.setStatic(true);
                    tree.setDepth(0)

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
                    event.emit('updateSeed')
                    sprite.destroy()
                    // playerX = player.body.position.x
                    // playerY = player.body.position.y
                    // console.log(seedStored)
                    break;
                }
                case 'enemy':
                {
                    const knockbackForce = 5; // Adjust the force as needed
                    const knockbackDirection = player.x < sprite.x ? -1 : 1; // Determine the direction based on enemy's position
                    
                    // Apply knockback to the player
                       player.setData('knockedBack', true);
                        player.setVelocityX(knockbackForce * knockbackDirection);
                        player.setVelocityY(-jumpForce);

                    // Play hit animation for the player (if you have one)
                    player.anims.play('sophy_jump', true);
                    
                    // Handle other collision interactions (e.g., reducing player health)
                    
                    break;
                }    
            }

        });
        
        this.keyHoldTimer = this.time.addEvent({
            delay: 1000,
            callback: this.handleKeyHold,
            callbackScope: this,
            loop: true
        })
        
    }

    update() {
            eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
            spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
            var playerY = player.body.position.y // Get the player's y-position
            var playerX = player.body.position.x // Get the player's y-position
            var currentTime = new Date().getTime()
            let eKeyPressStartTime = 0;
            const E_KEY_DURATION = 1000; // 1 
            this.keyHoldTimer.paused = true
            if (playerX >= 1650 && playerX <= 1780) {
                plantText.setVisible(true); 
                if (eKey.isDown) {
                    this.keyHoldTimer.paused = false
                    player.anims.play('sophy_plant', true);
                    plantText.text = 'Planting';
                } else {
                    this.keyHoldTimer.paused = true
                    plantText.text = 'Press E to Plant'; // Reset the text
                }
            } else {
                plantText.setVisible(false);
            }
            
            var playerPosition = player.getCenter(); // Get the player's center position

                if (cursors.left.isDown) {
                    player.flipX = true
                    player.setVelocityX(-speed)
                    if(isTouchingGround)
                    {
                        player.anims.play('sophy_walk', true);
                    }
                } else if (cursors.right.isDown) {
                    player.flipX = false
                    player.setVelocityX(speed)
                    if(isTouchingGround)
                    {
                        player.anims.play('sophy_walk', true);
                    }
                } else {
                    player.setVelocityX(0);
                }
        
            // Update player animation based on velocity
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
        
            

        




            // Update enemy behavior

        // Update enemy behavior
        this.enemies.forEach(enemy => {
            const enemyPosition = enemy.getCenter(); // Get the enemy's center position
            const enemyY = enemyPosition.y; // Get the enemy's y-position
    
            // Calculate the distance between player and enemy in the x and y directions
            const distanceX = playerPosition.x - enemyPosition.x;
            const distanceY = playerY - enemyY;
    
            // Define the threshold distances for enemies to start moving
            const vicinityThresholdX = 150;
            const vicinityThresholdY = 50; // Adjust the threshold as needed
    
            // Check if the enemy is on the same platform and within the y-threshold
            if (Math.abs(distanceY) < vicinityThresholdY) {
                if (Math.abs(distanceX) < vicinityThresholdX) {
                    // Move the enemy towards the player's x-position
                    const speed = 1; // Adjust the speed as needed
                    const velocityX = distanceX > 0 ? speed : -speed;
                    enemy.setVelocityX(velocityX);
                } else {
                    // Stop the enemy if it's too far from the player in the x-direction
                    enemy.setVelocityX(0);
                }
            } else {
                // Stop the enemy if it's not on the same platform
                enemy.setVelocityX(0);
            }



            if(enemy.body.velocity.x > 0)
            {
                enemy.flipX = false
                enemy.anims.play('goon_walk', true)
            }else if(enemy.body.velocity.x < 0)
            {
                enemy.flipX = true
                enemy.anims.play('goon_walk', true)
            } else
            {
                enemy.setVelocityX(0)
                enemy.anims.play('goon_idle', true)

            }
        });
    }

    handleKeyHold() {
        this.add.sprite(player.body.position.x, 830, 'bigTree')
        console.log(player.body.position.x)
    }



}



var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    parent: 'gameContainer',
    scene: [GameScene, UIScene], // Include both UI scene and Game scene

    physics: {
        default: "matter",
        matter: {
            debug: true,
        }
    },
    backgroundColor: '#1B2210' // Set your desired background color here
};

var game = new Phaser.Game(config);






