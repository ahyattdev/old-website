var menuState = {
    preload: function () {
        
    },
    
    create: function () {
        // Resize the game world
        game.world.width = gameSize.width;
        game.world.height = gameSize.height;
        
        var nameLabel = game.add.text(game.world.centerX, -50, "Zombie Party", { font: '70px Geo', fill: '#ffffff' });
        nameLabel.anchor.setTo(0.5, 0.5);
        game.add.tween(nameLabel).to({y: 80}, 1000).easing(Phaser.Easing.Bounce.Out).start();
     
        if (this.game.device.desktop) {
            var text = 'press the up key to start';
        }
        else {
            var text = 'touch the screen to start';
            game.input.onDown.add(this.start, this);
        }

        var startLabel = game.add.text(game.world.centerX, game.world.height-80, text, { font: '25px Arial', fill: '#ffffff' });
        startLabel.anchor.setTo(0.5, 0.5);
        game.add.tween(startLabel).to({angle: -2}, 500).to({angle: 2}, 500).loop().start();
        this.muteButton = game.add.button(20, 20, "mute", this.toggleSound, this);
        
        this.versionLabel = this.game.add.text(20, this.game.height-20, "Version 1.2", { font: '18px Arial', fill: '#ffffff' });
        this.versionLabel.anchor.setTo(0, 1);
        
        this.creatorsLabel = this.game.add.text(this.game.width-20, this.game.height-20, "Andy Hyatt, Taimoor Qureshi", { font: '18px Arial', fill: '#ffffff' });
        this.creatorsLabel.anchor.setTo(1, 1);
        
        this.muteButtonSize = {
            x: 20,
            y: 20,
            h: 28,
            w: 28
        };
    
        //this.muteButton.input.useHandCursor = true;
        if (game.sound.mute) {
            this.muteButton.frame = 1;
        }
        
        var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        upKey.onDown.addOnce(this.start, this);
    },
    
    toggleSound: function() {
        game.sound.mute = ! game.sound.mute; this.muteButton.frame = game.sound.mute ? 1 : 0;
    },
     
    start: function() {
        if (!this.pointerInRect(this.muteButtonSize)) {
            game.state.start("selectLevel");
        }
    },
    
    pointerInRect: function (size) {
        var x = this.game.input.activePointer.x;
        var y = this.game.input.activePointer.y;
        return Phaser.Rectangle.containsRaw(size.x, size.y, size.w, size.h, x, y);
    }
};