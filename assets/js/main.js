let cursors;
let player;
let platforms;
let background={};

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
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


function preload ()
{
    this.load.image("layer10","assets/sprites/background/Layer_0010_1.png");
    this.load.image("layer9","assets/sprites/background/Layer_0009_2.png");
    this.load.image("layer8","assets/sprites/background/Layer_0008_3.png");
    this.load.image("layer7","assets/sprites/background/Layer_0007_Lights.png");
    this.load.image("layer6","assets/sprites/background/Layer_0006_4.png");
    this.load.image("layer5","assets/sprites/background/Layer_0005_5.png");
    this.load.image("layer4","assets/sprites/background/Layer_0004_Lights.png");
    this.load.image("layer3","assets/sprites/background/Layer_0003_6.png");
    this.load.image("layer2","assets/sprites/background/Layer_0002_7.png");
    this.load.image("layer1","assets/sprites/background/Layer_0001_8.png");
    this.load.image("layer0","assets/sprites/background/Layer_0000_9.png");
    this.load.image("ground","assets/sprites/platform.png");
    this.load.spritesheet("dude","assets/character.png",{frameWidth:23,frameHeight:37})
}

function create ()
{
    platforms = this.physics.add.staticGroup();
    background.layer10 = this.add.tileSprite(400, 200, 928,793, 'layer10');
    background.layer9 = this.add.tileSprite(400, 200, 928,793, 'layer9');
    background.layer8 = this.add.tileSprite(400, 200, 928,793, 'layer8');
    background.layer7 = this.add.tileSprite(400, 200, 928,793, 'layer7');
    background.layer6 = this.add.tileSprite(400, 200, 928,793, 'layer6');
    background.layer5 = this.add.tileSprite(400, 200, 928,793, 'layer5');
    background.layer4 = this.add.tileSprite(400, 200, 928,793, 'layer4');
    background.layer3 = this.add.tileSprite(400, 200, 928,793, 'layer3');
    background.layer2 = this.add.tileSprite(400, 200, 928,793, 'layer2');
    platforms.create(400, 600, 'ground').setScale(2).refreshBody();
    background.layer1 = this.add.tileSprite(400, 200, 928,793, 'layer1');
    player = this.physics.add.sprite(400, 450, 'dude');
    background.layer0 = this.add.tileSprite(400, 200, 928,793, 'layer0');
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
        frameRate:8,
        repeat:-1
    });

    this.physics.add.collider(player, platforms);
    cursors = this.input.keyboard.createCursorKeys();
    //this.physics.world.setBounds(0,0,800,600)
    //this.cameras.main.startFollow(player, true, 0.05, 0.05);
    console.log(player)
}

function update ()
{
    if (cursors.left.isDown)
    {
        console.log(this.layer0)
        //player.body.setVelocityX(); // move left
        player.anims.play('walk', true); // play walk animation
        player.flipX= true; // flip the sprite to the left
        background.layer10.tilePositionX -= 3;
        background.layer9.tilePositionX -=2.9;
        background.layer8.tilePositionX -=2.7;
        background.layer7.tilePositionX -=2.5;
        background.layer6.tilePositionX -=2.3;
        background.layer5.tilePositionX -=2.1;
        background.layer4.tilePositionX -=1.9;
        background.layer3.tilePositionX -=1.7;
        background.layer2.tilePositionX -=1.5;
        background.layer1.tilePositionX -=1.3;
        background.layer0.tilePositionX -=1.1;
    }
    else if (cursors.right.isDown) {
        //player.body.setVelocityX(); // move right
        player.anims.play('walk', true); // play walk animatio
        player.flipX = false; // use the original sprite looking to the right
        background.layer10.tilePositionX += 3;
        background.layer9.tilePositionX +=2.9;
        background.layer8.tilePositionX +=2.7;
        background.layer7.tilePositionX +=2.5;
        background.layer6.tilePositionX +=2.3;
        background.layer5.tilePositionX +=2.1;
        background.layer4.tilePositionX +=1.9;
        background.layer3.tilePositionX +=1.7;
        background.layer2.tilePositionX +=1.5;
        background.layer1.tilePositionX +=1.3;
        background.layer0.tilePositionX +=1.1;
    }else {
        player.body.setVelocityX(0);
        player.anims.play("idle", true);

    }
    if (cursors.up.isDown  && player.body.touching.down)
    {
        player.setVelocityY(-300);

    }
    if(!player.body.touching.down)
    {
        player.anims.play("jump",true);
    }

}