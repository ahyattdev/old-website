var endState = {
    create: function () {
        game.world.width = gameSize.width;
        game.world.height = gameSize.height;
        
        var endText = "";
        if (game.global.won) {
            endText = "You beat the game with a score of "+game.global.score;
        } else {
            endText = "You died with a score of "+game.global.score+" on level "+Math.floor(game.global.level+1);
        }
        var endLabel = game.add.text(game.world.centerX, game.world.height/5, endText, { font: '25px Arial', fill: '#ffffff' });
        endLabel.anchor.setTo(0.5, 0.5);
        
        var continueText = "";
        if (this.game.device.desktop) {
            continueText = "press the up key to continue";
        } else {
            continueText = "touch the screen to continue";
            game.input.onDown.add(this.goToMenu, this);
        }
        
        var continueLabel = game.add.text(game.world.centerX, game.world.height/1.2, continueText, { font: '25px Arial', fill: '#ffffff' });
        continueLabel.anchor.setTo(0.5, 0.5);
        
        var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        upKey.onDown.addOnce(this.goToMenu, this);
    },
    
    goToMenu: function () {
        game.state.start("menu");
    }
};
