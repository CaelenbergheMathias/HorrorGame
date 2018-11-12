let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);
let cursors;
let player;
function preload ()
{
    this.load.spritesheet("dude","assets/character.png",{frameWidth:23,frameHeight:37})
}

function create ()
{
    player = this.physics.add.sprite(100, 450, 'dude');
    player.setScale(2);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('dude',{start:0, end:11}),
        frameRate: 8,
        repeat:-1
    });
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('dude',{start:12, end:19}),
        frameRate: 8,
        repeat:-1
    });
    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('dude',{start:25, end:26}),
        repeat:-1
    });


    cursors = this.input.keyboard.createCursorKeys();
}

function update ()
{
    if (cursors.left.isDown)
    {
        player.body.setVelocityX(-200); // move left
        player.anims.play('walk', true); // play walk animation
        player.flipX= true; // flip the sprite to the left
    }
    else if (cursors.right.isDown) {
        player.body.setVelocityX(200); // move right
        player.anims.play('walk', true); // play walk animatio
        player.flipX = false; // use the original sprite looking to the right
    }else {
        player.body.setVelocityX(0);
        player.anims.play("idle", true);
    }
    if (cursors.up.isDown && cursors.right.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
        player.anims.play("jump",true);
    }
    else if(cursors.up.isDown && cursors.left.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
        player.anims.play("jump",true);
        player.flipX= true;
    }
}