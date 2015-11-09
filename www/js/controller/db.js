md.factory('db', function ($timeout, $rootScope,$q) {
    var fct = {};

    
    
    fct.init = function ()
    {
        var deferred = $q.defer();
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'db/JiongDaily.sqlite', true);
        xhr.responseType = 'arraybuffer';

        xhr.onload = function (e) {
            var uInt8Array = new Uint8Array(this.response);
            fct.db = new SQL.Database(uInt8Array);
            deferred.resolve("ok");
        };
        xhr.send();
        
        xhr.onerror = function(e)
        {
            deferred.reject("failed");
        };


        var xhr1 = new XMLHttpRequest();
        xhr1.open('GET', 'db/jiongji100_dictionary.sqlite', true);
        xhr1.responseType = 'arraybuffer';

        xhr1.onload = function (e) {
            var uInt8Array = new Uint8Array(this.response);
            fct.wd = new SQL.Database(uInt8Array);
            //var contents = fct.db.exec("SELECT * FROM ts_topic_data_info_1 ORDER BY RANDOM()  limit 5");
            // contents is now [{columns:['col1','col2',...], values:[[first row], [second row], ...]}]
        };
        xhr1.send();
        
        
        return deferred.promise;
    };
    
    fct.init();

    fct.getWord = function (word)
    {
        try
        {
            var res = fct.wd.exec("Select * from dictionary where topic_word like '" + word.replace(",", "").replace(".", "").trim().replace("\"", "") + "'");

            if (res[0].values)
                return res[0].values[0];
            else
                return [];
        }
        catch (e) {
            return [];
        }
    };

    fct.getWordAsync = function (word)
    {
        var deferred = $q.defer();
        setTimeout(function(){
        try
        {
            var res = fct.wd.exec("Select * from dictionary where topic_word like '" + word.replace(",", "").replace(".", "").trim().replace("\"", "") + "'");

            if (res[0].values)
                deferred.resolve(res[0].values[0]);
            else
                deferred.reject("no data");
        }
        catch (e) {
            deferred.reject("no data");
        }},10);
        
        
        return deferred.promise;
    };
    fct.getRandomTest = function ()
    {
        if (fct.db && fct.db.exec)
        {
            var contents = fct.db.exec("SELECT * FROM ts_topic_data_info_1 ORDER BY RANDOM()  limit 40");

            return contents[0].values;
        }

        return [];


    };
    
    fct.getRandomTestAsync = function ()
    {
        //var def
        var deferred = $q.defer();
        setTimeout(
                function(){
                    try
                    {
                        var res = fct.getRandomTest();
                        
                        deferred.resolve(res);
                    }
                    catch(e)
                    {
                        deferred.reject();
                    }
                    
                    
                },
        10
                );
        
        
        return deferred.promise;

    };
    
    

    fct.downloadImage = function (path, $scope)
    {

        var xhr = new XMLHttpRequest();
        xhr.open('GET', "http://baicizhan.qiniucdn.com" + path, true);
        xhr.responseType = 'arraybuffer';

        xhr.onload = function (e) {
            var u8 = new Uint8Array(this.response);
            var b64encoded = btoa(String.fromCharCode.apply(null, u8));
            console.log("download" + $scope.downloadpath[0]);
            $scope.cache[120 - $scope.downloadpath.length] = "data:image/jpg;base64," + b64encoded;
            $scope.downloadpath.shift();
            if ($scope.downloadpath.length > 0)
            {
                $scope.downloadImage($scope.downloadpath[0]);
            } else
            {
                $ionicLoading.hide();
            }

        };
        xhr.send();
    };



    return fct;
});