var playState = {
    create: function () {
        // Set up controls
        this.cursor = game.input.keyboard.createCursorKeys();
        game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]);
        // Use WASD for controls too
        this.wasd = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            down: game.input.keyboard.addKey(Phaser.Keyboard.S),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D)
        };
        
        // Set up physics
        game.physics.startSystem(Phaser.Physics.Arcade);
        var spawnPoint = this.game.global.levelData[this.game.global.level].spawnPoint;
        this.player = game.add.sprite(spawnPoint.x*32, spawnPoint.y*32, "martin");
        game.physics.arcade.enable(this.player);
        this.player.anchor.setTo(0.5, 0.5);
        
        // Load the world
        this.createWorld();
        
        // Make it so the player can't leave the world
        this.player.body.collideWorldBounds = true;
        
        // Set up the camera
        game.camera.follow(this.player);
        
        // Spawn the zombies
        this.spawnZombies();
        
        this.player.moveUp();
        
        this.createBullets();
        // Level label
        this.levelLabel = game.add.text(32, 32, this.game.global.levelData[this.game.global.level].displayName, { font: "25px Arial", fill: "#ffffff", align: "left" });
        this.levelLabel.anchor.setTo(0, 0);
        this.levelLabel.fixedToCamera = true;
        
        // Add the player health label
        this.healthLabel = game.add.text(32, 64, "", { font: "25px Arial", fill: "#ffffff", align: "left" });
        this.healthLabel.anchor.setTo(0, 0);
        this.healthLabel.fixedToCamera = true;
        
        // Add the quit instructions label
        this.quitLabel = this.game.add.text(this.game.world.width-32, 32, "Press Escape to quit", {
            font: "25px Arial",
            fill: "#ffffff",
            align: "right"
        });
        this.quitLabel.anchor.setTo(1, 0);
        
        // Configure firearms
        this.fireRate = 500;
        this.nextFire = 0;
        
        this.movementSpeed = 200;
        
        // Labels
        this.scoreLabel = this.game.add.text(32, 96, "", { font: "25px Arial", fill: "#ffffff", align: "left" });
        this.scoreLabel.anchor.setTo(0, 0);
        this.scoreLabel.fixedToCamera = true;
        
        this.ammoLabel = this.game.add.text(32, 128, "", { font: "25px Arial", fill: "#ffffff", align: "left" });
        this.ammoLabel.anchor.setTo(0, 0);
        this.ammoLabel.fixedToCamera = true;
        
        // Add audio
        this.sounds = {
            laser: this.game.add.audio("laser"),
            teleport: this.game.add.audio("teleport"),
            reload: this.game.add.audio("reload"),
            clipEmpty: this.game.add.audio("clipempty"),
            playerDie: this.game.add.audio("playerdie"),
            zombieDie: this.game.add.audio("zombiedie"),
            itemPickup: this.game.add.audio("itempickup")
        };
        
        // Add mobile inputs if applicable
        if (!this.game.device.desktop) {
            this.addMobileInput();
            this.controlSize = {
                x: 0,
                y: this.game.height-130,
                w: 225,
                h: 130
            }
        }
        
        if (this.game.global.clip <= 0) {
            this.reload();
        }
        
        // Quit when escape is pressed
        this.game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.addOnce(function() {
            this.game.state.start("menu");
        });
    },
    
    update: function () {
        // Check if the player is in water or lava
        if (this.indexOfTileAtPlayer() == 4) {
            this.movementSpeed = 50;
        } else if (this.indexOfTileAtPlayer() == 5) {
            this.movementSpeed = 50;
            this.game.global.health -= 0.25;
        } else {
            this.movementSpeed = 200;
        }
        // Update player position
        this.movePlayer();
        
        this.game.physics.arcade.overlap(this.bullets, this.zombies, this.bulletHitZombie, null, this);
        
        this.game.physics.arcade.overlap(this.bullets, this.layer, this.bulletHitBlock, null, this);
        
        // Overlay the player and the map
        this.game.physics.arcade.collide(this.player, this.zombies);
        this.game.physics.arcade.collide(this.zombies, this.zombies);
        this.game.physics.arcade.collide(this.zombies, this.layer);
        this.game.physics.arcade.collide(this.player, this.layer);
        
        // Run zombie AI
        this.updateZombies();
        
        // See if the player should die
        if (this.game.global.health <= 0) {
            this.killPlayer();
        }
        
        // Update health label
        this.healthLabel.text = "Health: "+Math.floor(this.game.global.health);
        
        this.scoreLabel.text = "Score: "+this.game.global.score;
        this.ammoLabel.text = "Ammo: "+this.game.global.clip+" / "+this.game.global.ammo;
        
        var pointerInControlRect = false;
        
        if (!this.game.device.desktop) {
            pointerInControlRect = this.pointerInRect(this.controlSize);
        }
        
        // Check if mouse pointer is down
        if (this.game.input.activePointer.isDown && !pointerInControlRect) {
        //  Boom!
            this.fire();
        }
        
        // Check if the player is standing on the teleporter
        if (this.indexOfTileAtPlayer() == 9) {
            this.nextLevel();
        } else if (this.indexOfTileAtPlayer() == 17) {
            // Player is on a health pack
            this.game.global.health+=25;
            if (this.game.global.health>100) {
                this.game.global.health-=this.game.global.health%100;
            }
            
            // Add 50 to the score
            this.game.global.score+=50;
            
            // Remove the health pack
            this.map.removeTileWorldXY(this.player.x, this.player.y, 32, 32, this.layer);
            
            // Play the item pickup sound
            this.sounds.itemPickup.play();
            
        } else if (this.indexOfTileAtPlayer() == 18) {
            // Player is on an ammo pack
            
            // Add 50 to the score
            this.game.global.score+=50;
            
            
            // Remove the ammo pack
            this.map.removeTileWorldXY(this.player.x, this.player.y, 32, 32, this.layer);
            
            // Add ammo
            this.game.global.ammo += 10;
            
            // Reload the clip if it is currently empty
            if (this.game.global.clip <= 0) {
                this.game.time.events.add(2000, this.reload, this);
            }
            
            // Play the item pickup sound
            this.sounds.itemPickup.play();
        }
    },
    
    updateZombies: function () {
        // Get the players coords
        var playerCoords = {
            x: this.player.x,
            y: this.player.y
        }
        // This code runs for every zombie
        for (var i = 0; i < this.zombies.length; i ++) {
            // Make a var for the zombie
            var zombie = this.zombies.children[i];
            if (zombie.alive) {
                // Make a var for the zombie coords
                var zombieCoords = {
                    x: zombie.x,
                    y: zombie.y
                }
            
                var lookRadius = 16;
                // Test if the player is within the zombie sight radius
                if (this.coordsInCircle(zombieCoords.x, zombieCoords.y, lookRadius*32, playerCoords.x, playerCoords.y)) {
                    // Zombie can see the player
                    // Test if there is a line of sight between the zombie and the player
                    zombie.rotation = this.game.physics.arcade.angleToXY(zombie, playerCoords.x, playerCoords.y);
                
                    // Move the zombie
                    var zombieMoveDistance = 50;
                    
                    if (this.indexOfTileAtZombie(zombie) == 4 || this.indexOfTileAtZombie(zombie) == 5) {
                        this.movementSpeed = 15;
                    }
                
                    var velocity = this.velocityForPointDownLineWithEndpoints(zombieCoords.x, zombieCoords.y, playerCoords.x, playerCoords.y, zombieMoveDistance);
                    // Apply them as velocity
                    zombie.body.velocity.x = velocity.x;
                    zombie.body.velocity.y = velocity.y;
                
                    // Test if the player should take damage from the zombie
                    var zombieDamageRadius = 48;
                    var zombieDamage = 0.1;
                
                    // This is running 60 times a second
                    if (this.coordsInCircle(playerCoords.x, playerCoords.y, zombieDamageRadius, zombieCoords.x, zombieCoords.y)) {
                        // Damage the player
                        this.game.global.health-=zombieDamage;
                    }
                } else {
                    // Zombie can not see the player, reset its velocity
                    zombie.body.velocity.x = 0;
                    zombie.body.velocity.y = 0;
                }
            }
        }
    },
    
    movePlayer: function () {
        var keystroke = false;
        if (this.cursor.left.isDown || this.wasd.left.isDown || this.moveWest) {
            keystroke = true;
            // Move left
            this.player.body.velocity.x = -1 * this.movementSpeed;
            this.player.body.velocity.y = 0;
            this.player.rotation = 3*3.14/2;
            return;
        }
        
        if (this.cursor.right.isDown || this.wasd.right.isDown || this.moveEast) {
            keystroke = true;
            // Move right
            this.player.body.velocity.x = this.movementSpeed;
            this.player.body.velocity.y = 0;
            this.player.rotation = 3.14/2;
            return;
        }
        
        if (this.cursor.up.isDown || this.wasd.up.isDown || this.moveNorth) {
            keystroke = true;
            // Move up
            this.player.body.velocity.y = -1 * this.movementSpeed;
            this.player.body.velocity.x = 0;
            this.player.rotation = 0;
            return;
        }
        
        if (this.cursor.down.isDown || this.wasd.down.isDown || this.moveSouth) {
            keystroke = true;
            // Move down
            this.player.body.velocity.y = this.movementSpeed;
            this.player.body.velocity.x = 0;
            this.player.rotation = 3.14;
            return;
        }
        
        if (!keystroke) {
            // No keys down, stop moving
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;
            this.player.frame = 0;
        }
    },
    
    createWorld: function () {
        // Load the level
        this.map = this.game.add.tilemap(this.game.global.levelData[this.game.global.level].name);
        
        // Asscociate the tileset with the layer
        this.map.addTilesetImage("tileset", "tileset");
        
        // Load the layer
        this.layer = this.map.createLayer("level");
        this.layer.resizeWorld();
        
        // Make it so the player can pass through certain tiles
        var transparentTiles = [4, 5, 9, 17, 18];
        this.map.setCollisionByExclusion(transparentTiles, true, this.layer, true);
    },

    spawnZombies: function () {
        this.zombies = this.game.add.group();
        this.zombies.enableBody = true;
        this.zombies.createMultiple(game.global.levelData[game.global.level].zombiesToSpawn, 'zombie');
        
        
        //this.zombies.anchor.setTo(0.5, 1);
        
        for (var i = 0; i < this.zombies.children.length; i ++) {
            var zombie = this.zombies.children[i];
            var randCoords = this.randCoords();
            while (this.map.hasTile(randCoords[0]/32, randCoords[1]/32, this.layer)) {
                randCoords = this.randCoords();
            }
            zombie.reset(randCoords[0]+16, randCoords[1]+16);
            zombie.anchor.setTo(0.5, 0.5);
            zombie.body.allowRotation = true;
        } 
        this.zombies.checkWorldBounds = true;
    },
    
    randCoords: function () {
        var x = this.randInt(0, this.map.width*32-32);
        var y = this.randInt(0, this.map.height*32-32);
        x-=x%32;
        y-=y%32;
        return [x, y];
    },
    
    randInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    render: function () {
        //game.debug.spriteInfo(this.player, 32, 32);
    }, 
    
    coordsInCircle: function (cx, cy, r, x, y) {
        // cx and cy are the points for the center of the circle
        // r is the radius
        // x and y is the point to test
        
        return (Math.pow(x - cx, 2) + Math.pow(y - cy, 2) < Math.pow(r, 2))
    },
    
    killPlayer: function () {
        this.sounds.playerDie.play();
        
        this.game.state.start("end");
    },
    
    velocityForPointDownLineWithEndpoints: function (x1, y1, x2, y2, distanceDownLine) {   
        // Get the distance of the line between the player and the zombie
        var lineDistance = Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
        
        // Get the segment ratio
        var segRatio = distanceDownLine / lineDistance;
        
        // Find the point that divides the segment
        var pointDownLine = {
            x: segRatio * x2 + (1 - segRatio) * x1,
            y: segRatio * y2 + (1 - segRatio) * y1
        }
                
        // Get the legs of the right triangle formed
        var dx = pointDownLine.x-x1;
        var dy = pointDownLine.y-y1;
        return {x: dx, y: dy};
    },
    
    createBullets: function () {
        this.bullets = this.game.add.group();
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.enableBody = true;
        this.bullets.createMultiple(100, "bullet", 0, false);
        this.bullets.setAll("anchor.x", 0.5);
        this.bullets.setAll("anchor.y", 0.5);
        this.bullets.setAll("outOfBoundsKill", true);
        this.bullets.setAll("checkWorldBounds", true);
    },
    
    bulletHitZombie: function (zombie, bullet) {
        bullet.kill();
        zombie.kill();
        this.sounds.zombieDie.play();
        this.game.global.score+=10;
    },
    
    bulletHitBlock: function (bullet, block) {
        bullet.kill();
    },
    
    fire: function () {
        if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0 && this.game.global.clip > 0) {
            this.nextFire = this.game.time.now + this.fireRate;

            var bullet = this.bullets.getFirstExists(false);

            bullet.reset(this.player.x, this.player.y);

            bullet.rotation = this.game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer);
            
            this.game.global.clip -= 1;
            
            if (this.game.global.clip < 1) {
                // Clip is out of ammo, reload
                // Must be dispatched after a few seconds
                this.game.time.events.add(2000, this.reload, this);
            }
            
            // Play the laser sound
            this.sounds.laser.play();
        } else if (this.game.global.clip <= 0 && !this.sounds.clipEmpty.isPlaying) {
            this.sounds.clipEmpty.play();
        }
    },
    
    reload: function () {
        if (this.game.global.ammo < 5 && this.game.global.ammo > 0) {
            this.game.global.clip = this.game.global.ammo;
            this.game.global.ammo = 0;
            this.sounds.reload.play();
        } else if (this.game.global.ammo >= 5) {
            this.game.global.clip = 5;
            this.game.global.ammo -= 5;
            this.sounds.reload.play();
        }
    },
    
    nextLevel: function () {
        if (this.game.global.level < 9) {
            // Play teleport sound
            this.sounds.teleport.play();
            
            // Increment the global level var
            this.game.global.level+=1;
            
            // Add 100 to the score
            this.game.global.score+=100;
            
            // Go to next level after one second
            this.game.state.restart()
        } else {
            // They beat the game
            this.game.global.won = true;
            this.game.state.start("end");
        }
    },
    
    indexOfTileAtPlayer: function () {
        var tile = this.map.getTile(Math.floor(this.player.x/32), Math.floor(this.player.y/32), this.layer);
        if (tile) {
            return tile.index;
        } else {
            return -1;
        }
    },
    
    indexOfTileAtZombie: function(zombie) {
        var tile = this.map.getTile(Math.floor(zombie.x/32), Math.floor(zombie.y/32), this.layer);
        if (tile) {
            return tile.index;
        } else {
            return -1;
        }
    },
    
    addMobileInput: function () {
        this.moveNorth = false;
        this.moveWest = false; 
        this.moveEast = false;
        this.moveSouth = false;
        
        var northStartFunction = function () {
            this.moveNorth = true;
        }
        var northEndFunction = function () {
            this.moveNorth = false;
        }
        var southStartFunction = function () {
            this.moveSouth = true;
        }
        var southEndFunction = function () {
            this.moveSouth = false;
        }
        var westStartFunction = function () {
            this.moveWest = true;
        }
        var westEndFunction = function () {
            this.moveWest = false;
        }
        var eastStartFunction = function () {
            this.moveEast = true;
        }
        var eastEndFunction = function () {
            this.moveEast = false;
        }
        
        this.northButton = this.game.add.sprite(70, gameSize.height-140, "northbutton");
        this.northButton.inputEnabled = true;
        this.northButton.fixedToCamera = true;
        this.northButton.events.onInputOver.add(northStartFunction, this);
        this.northButton.events.onInputOut.add(northEndFunction, this);
        this.northButton.events.onInputDown.add(northStartFunction, this);
        this.northButton.events.onInputUp.add(northEndFunction, this);
        
        this.southButton = this.game.add.sprite(70, gameSize.height-80, "southbutton");
        this.southButton.inputEnabled = true;
        this.southButton.fixedToCamera = true;
        this.southButton.events.onInputOver.add(southStartFunction, this);
        this.southButton.events.onInputOut.add(southEndFunction, this);
        this.southButton.events.onInputDown.add(southStartFunction, this);
        this.southButton.events.onInputUp.add(southEndFunction, this);
        
        this.westButton = this.game.add.sprite(10, gameSize.height-115, "westbutton");
        this.westButton.inputEnabled = true;
        this.westButton.fixedToCamera = true;
        this.westButton.events.onInputOver.add(westStartFunction, this);
        this.westButton.events.onInputOut.add(westEndFunction, this);
        this.westButton.events.onInputDown.add(westStartFunction, this);
        this.westButton.events.onInputUp.add(westEndFunction, this);
        
        this.eastButton = this.game.add.sprite(130, gameSize.height-115, "eastbutton");
        this.eastButton.inputEnabled = true;
        this.eastButton.fixedToCamera = true;
        this.eastButton.events.onInputOver.add(eastStartFunction, this);
        this.eastButton.events.onInputOut.add(eastEndFunction, this);
        this.eastButton.events.onInputDown.add(eastStartFunction, this);
        this.eastButton.events.onInputUp.add(eastEndFunction, this);
    },
    
    pointerInRect: function(size) {
        var x = this.game.input.activePointer.x;
        var y = this.game.input.activePointer.y;
        return Phaser.Rectangle.containsRaw(size.x, size.y, size.w, size.h, x, y);
    }
};