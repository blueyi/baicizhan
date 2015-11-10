md.factory('snd', function() {
    var fct = {};
    fct.queue = [];
    
    fct.audio = new Audio();
    
    fct.chop = function()
    {
        fct.playSound("snd/chop.mp3");
    }
    
    fct.clearQueue = function()
    {
       while (fct.queue.length > 0) {
                fct.queue.pop();
            } 
    }
    
    fct.right = function(right)
    {
        if (right)
        {    fct.playSound("snd/right_v6.mp3");}
        else
        {    fct.playSound("snd/wrong_v6.mp3");}
    }
    
    fct.playSound = function(path,isqueue, isclean)
    {
        if(isclean)
        {
            while (fct.queue.length > 0) {
                fct.queue.pop();
            }
            fct.audio.pause();
        }
        
        if(isqueue && !fct.audio.paused)
        {
            fct.queue.push(path);
        }
        else
        {
            fct.audio.src = path;
            fct.audio.play();
        }
        
    }
    
    fct.wrong = function()
    {
        fct.playSound("snd/wrong_v6.mp3");
    }
    
    
    fct.audio.addEventListener("ended", function() { 
//        console.log("ended");
        if(fct.queue.length >0)
        {
            fct.audio.src = fct.queue.shift();
            fct.audio.play();
            
        }
        
    }, false);
    
    
    
    
    return fct;
});