var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, "game");

var defaultStyle = {
    font: "24px Arial",
    fill: "#FFFFFF"
};

var selectedStyle = {
    font: "24px Arial",
    fill: "#FF0000"
}

var solvedStyle = {
    font: "24px Arial",
    fill: "#00FF00"
}

game.state.add("load", load);
game.state.add("menu", menu);
game.state.add("titanic", titanic);

game.state.start("load");
