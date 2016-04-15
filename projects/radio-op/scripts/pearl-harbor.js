function PearlHarbor() {
    
    Object.assign(this, gameSceneTemplate);
    
    this.TIME = "11 AM Pacific Time, 8 AM Hawaii Time"
    this.transcriptData = [
        ["Air raid Pearl Harbor", this.TIME],
        ["This is not a drill", this.TIME],
        ["The Japanese have attacked", this.TIME],
        ["Alert the president", this.TIME],
        ["This is not a drill", this.TIME],
        ["Get this to Washington", this.TIME]
    ];
    
    this.sucess = "Congratulations, you have sucessfully simulated the experience of\na radio operator during the attack on Pearl Harbor"
}
