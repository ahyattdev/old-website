var loadState = {
    preload: function () {
        // Load all the game assets
        
        game.load.image("background", "assets/sprites/background.png");
        game.load.image("zombie", "assets/sprites/zombie.png");
        game.load.image("bullet", "assets/sprites/bullet.png");
        
        game.load.image("northbutton", "assets/sprites/northbutton.png");
        game.load.image("southbutton", "assets/sprites/southbutton.png");
        game.load.image("westbutton", "assets/sprites/westbutton.png");
        game.load.image("eastbutton", "assets/sprites/eastbutton.png");
        
        // Load the tileset
        game.load.image("tileset", "assets/sprites/tileset.png");
        
        // Load character sprites
        game.load.spritesheet("martin", "assets/sprites/martin.png", 32, 32);
        
        game.load.spritesheet("mute", "assets/sprites/mute.png", 28, 22);
        
        // Load the levels
        for (var a = 1; a <= 10; a ++) {
            var assetname = "level"+a;
            var fileName = "level-"+a;
            game.load.tilemap(assetname, "assets/levels/"+fileName+".json", null, Phaser.Tilemap.TILED_JSON);
        }
        
        // Sounds
        game.load.audio("laser", "assets/sounds/laser.mp3", true);
        game.load.audio("teleport", "assets/sounds/teleport.mp3", true);
        game.load.audio("reload", "assets/sounds/reload.mp3", true);
        game.load.audio("clipempty", "assets/sounds/clipempty.mp3", true);
        game.load.audio("playerdie", "assets/sounds/playerdie.mp3", true);
        game.load.audio("zombiedie", "assets/sounds/zombiedie.mp3", true);
        game.load.audio("itempickup", "assets/sounds/itempickup.mp3", true);
    },
    
    create: function () {
        // Advance to the next state
        game.state.start("menu");
    }
};