/*
 * initalise Phaser framework with width:960px, height:540px
 */
var game = new Phaser.Game(960, 540, Phaser.AUTO, 'gameContainer', { preload: preload, create: create, update: update });

/*
 * Preload runs before the game starts. Assets such as images and sounds such be preloaded here.
 * A webserver is required to load assets.
 *
 * Also in this function we set game scale so it full browser width.
 */
function preload() {
   
    // set to scale to full browser width
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.parentIsWindow = true;
    //set the background color so can confirm the game renders in the browser
    this.stage.backgroundColor = '#4488cc';
    

    //preload images & sounds
    //game.load.image('key', 'folder/filename.png');
}

/*
* Add game variables here
*
*/
var player;
var ground;


/*
 * Create runs once only when Phaser first loads
 * create the game scene by adding objects to the stage
 */
function create() {
}


/*
 * Update runs continuously. Its the game loop function.
 * Add collision detections and control events here
 */
function update() {
}