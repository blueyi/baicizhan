md.factory('snd', function() {
    var fct = {};
    fct.audio = new Audio();
    
    fct.chop = function()
    {
        fct.audio.src = "snd/chop.mp3";
        fct.audio.play();
    }
    
    
    
    
    
    
    return fct;
});