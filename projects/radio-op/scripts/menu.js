var menu = {
    
    selectedButton: 0,
    
    selectedButtonStyle: {
        font: "18px Arial",
        fill: "#FFFFFF"
    },
    
    normalButtonStyle: {
        font: "18px Arial",
        fill: "#888888"
    },
    
    menuButtons: [
        {
            name: "Scenario: Titanic",
            state: "titanic"
        }, {
            name: "Temporary",
            state: "none"
        }
    ],
    
    create: function() {
        var title = game.add.text(game.world.centerX, game.world.height / 4, "Radio Operator Simulator", {
            font: "24px Arial",
            fill: "#FFFFFF"
        });
        title.anchor.set(0.5, 0.5);
        
        for (var i = 0; i < this.menuButtons.length; i ++) {
            var data = this.menuButtons[i];
            var button = game.add.text(game.world.centerX, 3 * game.world.height / 8 + (game.world.height / 10 * i), data.name, this.normalButtonStyle);
            button.anchor.set(0.5, 0.5);
            
            data.button = button;
            
            if (i == 0) {
                button.setStyle(this.selectedButtonStyle);
            }
        }
        
        var cursors = game.input.keyboard.createCursorKeys();
        cursors.enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        cursors.up.onDown.add(this.selectPreviousButton, this);
        cursors.down.onDown.add(this.selectNextButton, this);
        cursors.enter.onDown.add(this.select, this);
    },
    
    selectPreviousButton: function() {
        this.menuButtons[this.selectedButton].button.setStyle(this.normalButtonStyle);
        this.selectedButton --;
        if (this.selectedButton < 0) {
            this.selectedButton = this.menuButtons.length - 1;
        }
        this.menuButtons[this.selectedButton].button.setStyle(this.selectedButtonStyle);
    },
    
    selectNextButton: function() {
        this.menuButtons[this.selectedButton].button.setStyle(this.selectedButtonStyle);
        this.selectedButton ++;
        if (this.selectedButton >= this.menuButtons.length) {
            this.selectedButton = 0;
        }
        this.menuButtons[this.selectedButton].button.setStyle(this.normalButtonStyle);
    },
    
    select: function() {
        game.state.start(this.menuButtons[this.selectedButton].state);
    }
    
}
