// Main JS file
// This one is always run last

// We need this because for some reason the JS standard library array lacks this function...
Array.prototype.contains = function (item) {
    for (var a = 0; a < this.length; a ++) {
        var compareItem = this[a];
        if (compareItem === item) {
            return true;
        }
    }
    return false;
}

// Define size
var gameSize = {
    width: window.innerWidth,
    height: window.innerHeight
};

// Define a global game variable
var game = new Phaser.Game(gameSize.width, gameSize.height, Phaser.AUTO, "game");

// Set which level the playState load here
game.global = {
    level: 1,
    
    levelData: [{
        name: "level1",
        displayName: "Level 1",
        zombiesToSpawn: 30,
        spawnPoint: {x: 3, y: 3}
    }, {
        name: "level2",
        displayName: "Level 2",
        zombiesToSpawn: 50,
        spawnPoint: {x: 24, y: 14}
    }, {
        name: "level3",
        displayName: "Level 3",
        zombiesToSpawn: 70,
        spawnPoint: {x: 7, y: 5}
    }, {
        name: "level4",
        displayName: "Level 4",
        zombiesToSpawn: 90,
        spawnPoint: {x: 3, y: 3}
    }, {
        name: "level5",
        displayName: "Level 5",
        zombiesToSpawn: 120,
        spawnPoint: {x: 29, y: 29}
    }, {
        name: "level6",
        displayName: "Level 6",
        zombiesToSpawn: 150,
        spawnPoint: {x: 64, y: 62}
    }, {
        name: "level7",
        displayName: "Level 7",
        zombiesToSpawn: 200,
        spawnPoint: {x: 15, y: 7}
    }, {
        name: "level8",
        displayName: "Level 8",
        zombiesToSpawn: 300,
        spawnPoint: {x: 40, y: 67}
    }, {
        name: "level9",
        displayName: "Level 9",
        zombiesToSpawn: 400,
        spawnPoint: {x: 4, y: 4}
    }, {
        name: "level10",
        displayName: "Level 10",
        zombiesToSpawn: 500,
        spawnPoint: {x: 95, y: 8}
    }, ],
    
    health: 100,
    
    clip: 5,
    
    ammo: 25,
    
    score: 0,
    
    won: false
};

// Add the game states
game.state.add("load", loadState);
game.state.add("menu", menuState);
game.state.add("selectLevel", selectLevelState);
game.state.add("play", playState);
game.state.add("end", endState);

// Load the first state
game.state.start("load");
