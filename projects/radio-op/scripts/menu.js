var menu = {
    
    selectedButton: 0,
    
    selectedButtonStyle: {
        font: "24px Arial",
        fill: "#FFFFFF"
    },
    
    normalButtonStyle: {
        font: "24px Arial",
        fill: "#888888"
    },
    
    menuButtons: [
        {
            name: "Scenario: Titanic",
            state: "titanic"
        }, {
            name: "Scenario: Pearl Harbor",
            state: "pearlharbor"
        }
    ],
    
    create: function() {
        var title = game.add.text(game.world.centerX, game.world.height / 4, "Radio Operator Simulator\nBy Andrew Hyatt from Acalanes High School", {
            font: "36px Arial",
            fill: "#FFFFFF",
            align: "center"
        });
        title.anchor.set(0.5, 0.5);
        
        var instructions = this.game.add.text(this.game.world.centerX, this.game.world.height / 4 + (this.game.world.height / 8), "Press enter to play the game.\nThen, enter in the character of the morse code in red.\nUse the arrow keys to change menu options.", {
            font: "18px Arial",
            fill: "#FFFFFF",
            align: "center"
        });
        instructions.anchor.set(0.5, 0.5);
        
        for (var i = 0; i < this.menuButtons.length; i ++) {
            var data = this.menuButtons[i];
            var button = game.add.text(game.world.centerX, 5 * game.world.height / 8 + (game.world.height / 10 * i), data.name, this.normalButtonStyle);
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
        this.menuButtons[this.selectedButton].button.setStyle(this.normalButtonStyle);
        this.selectedButton ++;
        if (this.selectedButton >= this.menuButtons.length) {
            this.selectedButton = 0;
        }
        this.menuButtons[this.selectedButton].button.setStyle(this.selectedButtonStyle);
    },
    
    select: function() {
        game.state.start(this.menuButtons[this.selectedButton].state);
    }
    
}
