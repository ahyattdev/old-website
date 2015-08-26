var selectLevelState = {
    create: function () {
        this.label = game.add.text(game.world.centerX, game.world.height/5, "Select Level", { font: '25px Arial', fill: '#ffffff'});
        this.label.anchor.setTo(0.5, 0.5);
        
        this.levelNumber = 0;
        this.levelLabel = game.add.text(game.world.centerX, game.world.height/3, null, { font: '25px Arial', fill: '#ffffff'});
        this.levelLabel.anchor.setTo(0.5, 0.5);
        
        this.continueLabel = game.add.text(game.world.centerX, game.world.height/1.2, null, { font: '25px Arial', fill: '#ffffff'});
        this.continueLabel.anchor.setTo(0.5, 0.5);
        if (!this.game.device.desktop) {
            // Customize the controls for mobile
            this.continueLabel.text = "touch the screen to play";
            game.input.onDown.add(this.upKeyPress, this);
            
            // Add left and right arrows
            this.leftButton = this.game.add.sprite(game.world.centerX-60, game.world.height/2.5, "westbutton");
            this.leftButton.inputEnabled = true;
            this.leftButton.events.onInputDown.add(this.leftArrowPress, this);
            this.leftButton.anchor.setTo(0.5, 0);
            
            this.rightButton = this.game.add.sprite(game.world.centerX+60, game.world.height/2.5, "eastbutton");
            this.rightButton.inputEnabled = true;
            this.rightButton.events.onInputDown.add(this.rightArrowPress, this);
            this.rightButton.anchor.setTo(0.5, 0);
            
            this.controlSizes = {
                x: this.game.world.centerX-80,
                y: this.game.world.height/2.5,
                w: 120,
                h: this.game.world.height/2.5+80
            };
        } else {
            // Customize the controls for desktop
            this.continueLabel.text = "press the up key to play";
        }
        
        
        
        game.input.keyboard.onDownCallback = this.keyPress;
        
        var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        upKey.onDown.addOnce(this.upKeyPress, this);
    },
    
    update: function () {
        // Update level label
        this.levelLabel.text = "Level "+(this.levelNumber+1);
    },
    
    keyPress: function (event) {
        if (event.keyCode == 39) {
            selectLevelState.rightArrowPress();
        } else if (event.keyCode == 37) {
            selectLevelState.leftArrowPress();
        }
    },
    
    upKeyPress: function () {
        var clickInControlArea = false;
        if (!this.game.device.desktop) {
            clickInControlArea = this.pointerInRect(this.controlSizes);
        }
        if (!clickInControlArea) {
            game.global.level = this.levelNumber;
        
            // Reset globals
            game.global.health = 100;
            game.global.clip = 5;
            game.global.ammo = 25;
            game.global.score = 0;
            game.global.won = false;
            
            game.state.start("play");
        }
    },
    
    rightArrowPress: function () {
        this.levelNumber+=1;
        //this.levelNumber+=10;
        this.levelNumber%=10;
    },
    
    leftArrowPress: function () {
        this.levelNumber-=1;
        this.levelNumber+=10;
        this.levelNumber%=10;
    },
    
    pointerInRect: function(size) {
        var x = this.game.input.activePointer.x;
        var y = this.game.input.activePointer.y;
        return Phaser.Rectangle.containsRaw(size.x, size.y, size.w, size.h, x, y);
    }
}