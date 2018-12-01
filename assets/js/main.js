let cursors;
let player;
let platforms;
let background = {};
let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 500},
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
let score = 0;
let scoreCount = 0;
let enemies = [];
let game = new Phaser.Game(config);
let triggered = false;
let sanityText;
let scoreText;
let highscoreText;
let highscore =0;
const startingSanity = 1000;
let playerSanity = startingSanity;
let thing;
let it = [];
let itWidth = 40;
let itMovementCounter = 0;
let parts = ["part1", "part4", "part5", "part6", "part7", "part8", "part10", "part12", "part13", "part14", "part16", "part17", "part18", "part19", "part20"];
let spawns = ["slime", "wraith"];
let ground;
let paused = true;
let pause;

function preload() {
    let p = document.createElement("p");
    p.innerText= "User cursor keys to run and jump";
    document.getElementById("body").appendChild(p);
    thing = this;
    this.load.image("layer10", "assets/sprites/background/Layer_0010_1.png");
    this.load.image("layer9", "assets/sprites/background/Layer_0009_2.png");
    this.load.image("layer8", "assets/sprites/background/Layer_0008_3.png");
    this.load.image("layer7", "assets/sprites/background/Layer_0007_Lights.png");
    this.load.image("layer6", "assets/sprites/background/Layer_0006_4.png");
    this.load.image("layer5", "assets/sprites/background/Layer_0005_5.png");
    this.load.image("layer4", "assets/sprites/background/Layer_0004_Lights.png");
    this.load.image("layer3", "assets/sprites/background/Layer_0003_6.png");
    this.load.image("layer2", "assets/sprites/background/Layer_0002_7.png");
    this.load.image("layer1", "assets/sprites/background/Layer_0001_8.png");
    this.load.image("layer0", "assets/sprites/background/Layer_0000_9.png");
    this.load.image("ground", "assets/sprites/platform.png");
    this.load.image('platforms', "assets/sprites/Tile_02_A.png");
    this.load.spritesheet("dude", "assets/character.png", {frameWidth: 23, frameHeight: 37});
    this.load.spritesheet("slime", "assets/sprites/Slime.png", {frameWidth: 320, frameHeight: 320});
    this.load.spritesheet("wraith", "assets/sprites/Wraith.png", {frameWidth: 48, frameHeight: 48});
    loadIt();
}

function create() {
    platforms = this.physics.add.staticGroup();
    ground = this.physics.add.staticGroup();
    background.layer10 = this.add.tileSprite(400, 200, 928, 793, 'layer10');
    background.layer9 = this.add.tileSprite(400, 200, 928, 793, 'layer9');
    background.layer8 = this.add.tileSprite(400, 200, 928, 793, 'layer8');
    background.layer7 = this.add.tileSprite(400, 200, 928, 793, 'layer7');
    background.layer6 = this.add.tileSprite(400, 200, 928, 793, 'layer6');
    background.layer5 = this.add.tileSprite(400, 200, 928, 793, 'layer5');
    background.layer4 = this.add.tileSprite(400, 200, 928, 793, 'layer4');
    background.layer3 = this.add.tileSprite(400, 200, 928, 793, 'layer3');
    background.layer2 = this.add.tileSprite(400, 200, 928, 793, 'layer2');
    ground.create(400, 600, 'ground').setScale(2).refreshBody();
    background.layer1 = this.add.tileSprite(400, 200, 928, 793, 'layer1');
    player = this.physics.add.sprite(400, 450, 'dude');
    player.setScale(2);
    player.setBounce(0.2);
    player.setCollideWorldBounds(false);
    player.isDead = false;
    player.name = "player";
    createPlatform();

    this.anims.create({
        key: 'slime',
        frames: this.anims.generateFrameNumbers('slime', {start: 0, end: 3}),
        frameRate: 6,
        repeat: -1
    });
    this.anims.create({
        key: 'wraith',
        frames: this.anims.generateFrameNumbers('wraith', {start: 0, end: 3}),
        frameRate: 6,
        repeat: -1
    });
    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 11}),
        frameRate: 8,
        repeat: -1
    });
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('dude', {start: 12, end: 19}),
        frameRate: 8,
        repeat: -1
    });
    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('dude', {start: 25, end: 26}),
        frameRate: 8,
        repeat: -1
    });

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, ground);
    cursors = this.input.keyboard.createCursorKeys();
    pause = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    background.layer0 = this.add.tileSprite(400, 200, 928, 793, 'layer0');
    //console.log(enemies);
    console.log(player);
    createIt();
    player.body.setVelocityX(0);
    player.anims.play("idle", false);
    sanityText = this.add.text(250, 16, 'Sanity: ' + playerSanity, {fontSize: '18px', fill: '#fff'});
    scoreText = this.add.text(400, 16, 'Score: ' + score, {fontSize: '18px', fill: '#fff'});
    localforage.getItem("highscore").then(function (value) {
        if(value===null)
        {
            highscoreText = thing.add.text(600, 16, 'Highscore: ' + 0, {fontSize: '18px', fill: '#fff'});

        }else
        {
            highscore = value;
            highscoreText = thing.add.text(600, 16, 'Highscore: ' + value, {fontSize: '18px', fill: '#fff'});

        }


    })

}

function update() {
    if(pause.isDown)
    {
        paused = !paused;


    }
    if(paused)
    {
        thing.anims.pauseAll();
        player.body.allowGravity = false;
        player.setVelocityX(0);
        player.setAccelerationX(0);
        player.setVelocityY(0);
        //enemies.forEach(e => e.anims.stop());
    }
    else
    {
        player.anims.resume();
        player.body.allowGravity = true;
        thing.anims.resumeAll();

    }

    if(!paused) {
        if (cursors.left.isDown) {

            //player.body.setVelocityX(); // move left
            moveLeft();
        }
        else if (cursors.right.isDown) {
            //player.body.setVelocityX(); // move right
            moveRight();
        } else {
            player.body.setVelocityX(0);
            player.anims.play("idle", true);

        }
        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-500);

        }
        if (!player.body.touching.down) {
            player.anims.play("jump", true);
        }
        sanityStuff();
        moveEnemies();
        movePlatforms(-2);
        spawnEnemy();
        spawnPlatform();
        scoreCount++;
        if (scoreCount > 25) {
            score += playerSanity;
            scoreText.setText("Score: " + score);
            scoreCount = 0;
            setHighscore();

        }
    }
    if(player.isDead && !triggered)
    {
        gameOver();
    }
}

function setHighscore() {
    if(score>highscore)
    {
        highscoreText.setText("Highscore: "+score);
    }

}

function moveLeft() {
    player.anims.play('walk', true); // play walk animation
    player.flipX = true; // flip the sprite to the left
    moveBackgroundLeft();
    itMovementCounter += 1;
    if (itMovementCounter > 15) {
        itMovementCounter = 0;
        moveItCloser();
    }
    movePlatforms(5);
    enemies.forEach(function (enemy) {
        enemyMovement(enemy, 3.5)
    });


}

function moveBackgroundLeft() {
    background.layer10.tilePositionX -= 3;
    background.layer9.tilePositionX -= 1.3;
    background.layer8.tilePositionX -= 2.7;
    background.layer7.tilePositionX -= 2.5;
    background.layer6.tilePositionX -= 1.7;
    background.layer5.tilePositionX -= 2.1;
    background.layer4.tilePositionX -= 1.9;
    background.layer3.tilePositionX -= 2.3;
    background.layer2.tilePositionX -= 1.5;
    background.layer1.tilePositionX -= 2.9;
    background.layer0.tilePositionX -= 3.5;
}

function moveRight() {
    player.anims.play('walk', true); // play walk animatio
    player.flipX = false; // use the original sprite looking to the right
    moveBackgroundRight();
    movePlatforms(-5);
    enemies.forEach(function (enemy) {
        enemyMovement(enemy, -3.5)
    });


}

function moveBackgroundRight() {
    background.layer10.tilePositionX += 3;
    background.layer9.tilePositionX += 1.3;
    background.layer8.tilePositionX += 2.7;
    background.layer7.tilePositionX += 2.5;
    background.layer6.tilePositionX += 1.7;
    background.layer5.tilePositionX += 2.1;
    background.layer4.tilePositionX += 1.9;
    background.layer3.tilePositionX += 2.3;
    background.layer2.tilePositionX += 1.5;
    background.layer1.tilePositionX += 2.9;
    background.layer0.tilePositionX += 3.5;
}

function sanityStuff() {
    increaseSanity();
    decreaseSanity();
    sanityText.setText("Sanity: " + playerSanity);
    if(playerSanity <= 0)
    {
        player.isDead = true;
    }
}

function increaseSanity() {
    if (playerSanity < startingSanity) {
        playerSanity++;
    }
}

function decreaseSanity() {
    enemies.forEach(function (enemy) {
        //console.log(Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y));
        let distance = distanceBetween(player, enemy);
        if(enemy.name==="wraith" && distance<40)
        {
            player.isDead =true;
        }else if(enemy.name==="slime" && distance<70)
        {
            player.isDead = true;
        }
        if (distance < 225) {
            playerSanity -= 2;

            //console.log(playerSanity)
        }

    })
}

function enemyMovement(enemy, number) {
    enemy.x += number;

}

function distanceBetween(one, two) {
    return Phaser.Math.Distance.Between(one.x, one.y, two.x, two.y)
}

function createSlime() {
    let enemy = thing.physics.add.sprite(800, 520, "slime");
    enemy.setCollideWorldBounds(false);
    enemy.setScale(0.5);
    enemy.anims.play("slime");
    enemy.name = "slime";
    enemy.body.allowGravity = false;
    enemies.push(enemy);
}

function createWraith() {
    let enemy;
    if((Math.round(Math.random())===0)) {
        enemy = thing.physics.add.sprite(800, 300, "wraith");
    }else
    {
        enemy = thing.physics.add.sprite(800, 100, "wraith");
    }
    enemy.setCollideWorldBounds(false);
    enemy.setScale(2);
    enemy.anims.play("wraith");
    enemy.body.allowGravity = false;
    enemy.name = "wraith";
    enemies.push(enemy);

}

function loadIt() {
    thing.load.spritesheet("part1", "assets/sprites/it/1_magicspell_spritesheet.png", {
        frameWidth: 100,
        frameHeight: 100
    });
    thing.load.spritesheet("part2", "assets/sprites/it/2_magic8_spritesheet.png", {frameWidth: 100, frameHeight: 100});
    thing.load.spritesheet("part3", "assets/sprites/it/3_bluefire_spritesheet.png", {
        frameWidth: 100,
        frameHeight: 100
    });
    thing.load.spritesheet("part4", "assets/sprites/it/4_casting_spritesheet.png", {frameWidth: 100, frameHeight: 100});
    thing.load.spritesheet("part5", "assets/sprites/it/5_magickahit_spritesheet.png", {
        frameWidth: 100,
        frameHeight: 100
    });
    thing.load.spritesheet("part6", "assets/sprites/it/6_flamelash_spritesheet.png", {
        frameWidth: 100,
        frameHeight: 100
    });
    thing.load.spritesheet("part7", "assets/sprites/it/7_firespin_spritesheet.png", {
        frameWidth: 100,
        frameHeight: 100
    });
    thing.load.spritesheet("part8", "assets/sprites/it/8_protectioncircle_spritesheet.png", {
        frameWidth: 100,
        frameHeight: 100
    });
    thing.load.spritesheet("part10", "assets/sprites/it/10_weaponhit_spritesheet.png", {
        frameWidth: 100,
        frameHeight: 100
    });
    thing.load.spritesheet("part12", "assets/sprites/it/12_nebula_spritesheet.png", {
        frameWidth: 100,
        frameHeight: 100
    });
    thing.load.spritesheet("part13", "assets/sprites/it/13_vortex_spritesheet.png", {
        frameWidth: 100,
        frameHeight: 100
    });
    thing.load.spritesheet("part14", "assets/sprites/it/14_phantom_spritesheet.png", {
        frameWidth: 100,
        frameHeight: 100
    });
    thing.load.spritesheet("part15", "assets/sprites/it/15_loading_spritesheet.png", {
        frameWidth: 100,
        frameHeight: 100
    });
    thing.load.spritesheet("part16", "assets/sprites/it/16_sunburn_spritesheet.png", {
        frameWidth: 100,
        frameHeight: 100
    });
    thing.load.spritesheet("part17", "assets/sprites/it/17_felspell_spritesheet.png", {
        frameWidth: 100,
        frameHeight: 100
    });
    thing.load.spritesheet("part18", "assets/sprites/it/18_midnight_spritesheet.png", {
        frameWidth: 100,
        frameHeight: 100
    });
    thing.load.spritesheet("part19", "assets/sprites/it/19_freezing_spritesheet.png", {
        frameWidth: 100,
        frameHeight: 100
    });
    thing.load.spritesheet("part20", "assets/sprites/it/20_magicbubbles_spritesheet.png", {
        frameWidth: 100,
        frameHeight: 100
    });

}

function createIt() {
    parts.forEach(function (part) {
        //console.log(part);
        thing.anims.create({
            key: part,
            frames: thing.anims.generateFrameNumbers(part, {start: 0, end: 60}),
            frameRate: 15,
            repeat: -1
        });
    });
    newLayerToIt();
    itWidth += 25;


}

function moveItCloser() {
    let newLayer = false;
    it.forEach(function (part) {
        part.x += 1;
        if (part.x > itWidth) {
            itWidth += 25;
            newLayer = true;
        }
    });

    if (newLayer) {
        newLayerToIt();
    }
}

function newLayerToIt() {
    let height = 540;

    for (let i = 0; i < 60; i++) {

        let selectedPart = parts[Math.floor((Math.random() * parts.length))];
        let part = thing.physics.add.sprite(itWidth + Math.floor((Math.random() * 50) - 25), height, selectedPart);
        it.push(part);
        //console.log(i % 10);
        part.anims.play(selectedPart);
        part.body.allowGravity = false;
        part.setScale(2);

        if (i % 5 === 0 && i !== 0) {
            height -= 50;
        }

    }
    console.log(itWidth);
    if(itWidth>=340)
    {
        player.isDead = true;
    }
}

function moveEnemies() {
    enemies.forEach(function (enemy) {
        enemyMovement(enemy, -1);
        if (enemy.x < itWidth+20) {
            enemy.destroy();
            enemies.splice(enemies.indexOf(enemy),1);
        }

    })
}

function movePlatforms(amount) {
    platforms.children.entries.forEach(function (platform) {
        platform.x += amount;
        platform.body.position.x += amount;
        if (platform.x < itWidth+20) {
            platform.destroy();

        }
    })
}

function createPlatform(height) {
    platforms.create(800, height, "platforms").setScale(0.03).refreshBody();
    //console.log(platforms.children.entries)
}

function spawnPlatform() {
    if (Math.floor((Math.random() * 60) + 1) < 2) {
        if((Math.round(Math.random())===0))
        {
            createPlatform(400);
        }else
        {
            createPlatform(200)
        }
    }
}

function spawnEnemy() {
    if (Math.floor((Math.random() * 75)) < 1 && enemies.length<5) {
        switch (spawns[Math.floor(Math.random() * spawns.length)]) {
            case "slime":
                createSlime();
                break;
            case "wraith":
                createWraith();
                break;
        }
    }
}

function gameOver() {
    paused = true;
    pause = "";
    triggered = true;
    localforage.getItem("highscore").then(function (value) {
        if(value === null || value<score)
        {
            localforage.setItem("highscore",score)
        }

    }).then(function () {
        setTimeout(function(){location.reload()},5000);
    });

}

