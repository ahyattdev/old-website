var load = {
    
    preload: function() {
        
    },
    
    create: function() {
        document.getElementById("game").children[0].style.border = "0px";
        game.state.start("menu");
    }
    
}
