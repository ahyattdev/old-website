var morseCell = {
    
    pattern: "",
    
    patternVisible: true,
    
    character: "",
    
    characterVisible: true,
    
    getLabel: function() {
        var label = "";
        if (this.patternVisible) {
            label += this.pattern;
        }
        label += "\n";
        if (this.characterVisible) {
            label += this.character;
        }
        return label;
    }
    
}

var gameSceneTemplate = {
    
    quitLabel: null,
    
    detailLabel: null,
    
    transcriptData: null,
    
    morseLabels: [],
    
    displayedMorseText: "",
    
    transcriptIndex: -1,
    
    guessingCharacters: true,
    
    currentCharacter: 0,
    
    create: function() {
        
        this.transcriptIndex = -1;
        this.currentCharacter = 0;
        this.quitLabel = game.add.text(5, 5, "Press Escape to quit", defaultStyle);
        
        this.detailLabel = game.add.text(game.world.centerX, game.world.height / 5, "", defaultStyle);
        this.detailLabel.anchor.set(0.5, 0.5);
        
        this.game.input.keyboard.addCallbacks(this, null, null, this.handleKeyPress);
        
        if (typeof this.transcriptData == "object") {
            this.displayTranscript();
        }
        
        this.game.input.keyboard.addKey(Phaser.KeyCode.ESC).onDown.addOnce(function() {
            this.game.state.start("menu");
        });
    },
    
    displayMorseText: function(text) {
        this.currentCharacter = 0;
        
        for (var i = 0; i < this.morseLabels.length; i ++) {
            if (typeof this.morseLabels[i] != "undefined") {
                this.game.world.remove(this.morseLabels[i]);
            }
        }
        
        this.displayedMorseText = text;
        this.morseLabels = [];
        
        for (var i = 0; i < text.length; i ++) {
            var cell = Object.create(morseCell);
            var character = text[i];
            
            // Skip spaces
            if (character == " ") {
                continue;
            }
            
            cell.pattern = getPatternString(character)
            cell.character = character;
            cell.characterVisible = false;
            
            var multiple = 150;
            var horizontalOffset = this.game.world.width * 0.05 + (multiple * (i + 1));
            var verticalOffset = 0;
            
            while (horizontalOffset > this.game.world.width * 0.95) {
                horizontalOffset -= this.game.world.width * 0.8;
                verticalOffset += 125;
            }
            
            var label = this.game.add.text(horizontalOffset, game.world.centerY * 0.8 + verticalOffset, cell.getLabel(), defaultStyle);
            label.anchor.set(0.5, 0.5);
            this.morseLabels[i] = label;
            label.data = cell;
            
            if (i == 0) {
                label.setStyle(selectedStyle);
            }
        }
    },
    
    handleKeyPress: function(key) {
        
        if (this.guessingCharacters) {
            if (key.toUpperCase() == this.displayedMorseText[this.currentCharacter].toUpperCase()) {
                var label = this.morseLabels[this.currentCharacter];
                label.data.characterVisible = true;
                label.text = label.data.getLabel();
                this.selectNextCell();
            }
        }
    },
    
    selectNextCell: function() {
        this.morseLabels[this.currentCharacter].setStyle(solvedStyle);
        this.currentCharacter ++;
        
        while (this.displayedMorseText[this.currentCharacter] == " ") {
            this.currentCharacter ++;
        }
        
        if (this.currentCharacter >= this.displayedMorseText.length) {
            this.detailLabel.text = "You have solved this text";
            this.game.time.events.add(2000, this.next, this);
        } else {
            this.morseLabels[this.currentCharacter].setStyle(selectedStyle);
        }
    },
    
    displayTranscript: function() {
        this.next = this.nextTranscriptEntry;
        this.nextTranscriptEntry();
    },
    
    completedTranscript: function() {
        
    },
    
    nextTranscriptEntry: function() {
        this.transcriptIndex ++;
        
        if (this.transcriptIndex >= this.transcriptData.length) {
            this.completedTranscript();
        } else {
            this.displayMorseText(this.transcriptData[this.transcriptIndex][0])
            this.detailLabel.text = this.transcriptData[this.transcriptIndex][1];
        }
    },
    
    next: function() {
        // Placeholder
    }
    
}
