md.factory('db', function($q,$timeout) {
    var fct = {};
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'db/JiongDaily.sqlite', true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function (e) {
        var uInt8Array = new Uint8Array(this.response);
        fct.db = new SQL.Database(uInt8Array);
        //var contents = fct.db.exec("SELECT * FROM ts_topic_data_info_1 ORDER BY RANDOM()  limit 5");
        // contents is now [{columns:['col1','col2',...], values:[[first row], [second row], ...]}]
    };
    xhr.send();
    
    
    fct.getRandomTest = function()
    {
     if(fct.db && fct.db.exec)
     {
            var contents = fct.db.exec("SELECT * FROM ts_topic_data_info_1 ORDER BY RANDOM()  limit 4");
                            
            return contents[0].values;
        }
        
        return [];
     
        
    };
    
    
    
    return fct;
});