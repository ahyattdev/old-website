function PearlHarbor() {
    
    Object.assign(this, gameSceneTemplate);
    
    this.TIME = "11 AM Pacific Time, 8 AM Hawaii Time"
    this.transcriptData = [
        ["Air raid Pearl Harbor", this.time],
        ["This is not drill", this.time],
        ["The Japanese have attacked", this.time],
        ["Alert the president", this.time],
        ["This is not drill", this.time],
        ["Get this to Washington", this.time]
    ];
    
    this.sucess = "Congratulations, you have sucessfully simulated the experience of a radio operator during the attack on Pearl Harbor"
}
