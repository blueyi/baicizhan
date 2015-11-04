/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

md.controller('testCtrl', function($scope,$timeout,snd,db,$ionicLoading,$stateParams) {
    
    $scope.randId = $stateParams.randid;
    $scope.cache ={};
    
    
    
        $scope.downloadImage = function (path)
        {

            var xhr = new XMLHttpRequest();
            xhr.open('GET', "http://baicizhan.qiniucdn.com" +path, true);
            xhr.responseType = 'arraybuffer';

            xhr.onload = function (e) {
                var u8 = new Uint8Array(this.response);
                var b64encoded = btoa(String.fromCharCode.apply(null, u8));
                console.log("download" +$scope.downloadpath[0] );
                $scope.cache[120 - $scope.downloadpath.length] = "data:image/jpg;base64," + b64encoded;
                $scope.downloadpath.shift();
                if($scope.downloadpath.length >0)
                {
                    $scope.downloadImage($scope.downloadpath[0]);
                }
                else
                {
                    $ionicLoading.hide();
                }
                
            };
            xhr.send();
        };
    
    $scope.change = function()
    {
       $scope.data = db.getRandomTest(); 
       $scope.downloadpath = [];
       
       $ionicLoading.hide();
       
       
    }
    $scope.change();
    
    
    $scope.cells = [];
    var text = "She wanted to write a letter but her hand was injured, so I took her dictation.";
    var cells = text.split(" ");
    var newText = "";
    
    for(var i=0; i<cells.length;i++)
    {
        
        
        
        $scope.cells.push(cells[i] + " ");
        
    }
    
    
    $scope.answer = {
        isAnswer: false,
        correctId :2,
        selectId :-1,
        word:"",
        isHint:false,
        pageIndex:0,
    };
    $scope.playSound = function()
    {
           snd.playSound("http://baicizhan.qiniucdn.com" + $scope.data[$scope.answer.pageIndex*4+$scope.answer.correctId][8]);
    
    }
    
    $scope.reset = function()
    {
        //The abandoned house looks so terrifying.
        try
        {
        $scope.answer.correctId = Math.floor(Math.random() * 4);
        var text = $scope.data[$scope.answer.pageIndex * 4 + $scope.answer.correctId][4];



        var cells = text.split(" ");
        
            
        $scope.cells = [];
        $scope.answer.word = $scope.data[$scope.answer.pageIndex * 4 + $scope.answer.correctId][15];
        
        var wordCells = $scope.answer.word.trim().split(" ");
        
        
            
            
        for (var i = 0; i < cells.length; i++)
        {
            if(wordCells.length >1)
            {
                var count =0;
                for(var j=0; j<wordCells.length&&j+i<cells.length; j++)
                {
                    if(wordCells[j] == $scope.cells[i+j])
                    {
                        count++;
                    }
                    else
                    {
                        break;
                    }
                }
                
                if(count == wordCells.length)
                {
                    $scope.cells.push($scope.answer.word.trim() + " ");
                    i = i+j;
                    
                }
                else
                {
                    $scope.cells.push(cells[i] + " ");
                }
            }
            else
            {
                $scope.cells.push(cells[i] + " ");
            }
        }   
         snd.playSound("http://baicizhan.qiniucdn.com" + $scope.data[$scope.answer.pageIndex*4+$scope.answer.correctId][7],true,true);
         snd.playSound("http://baicizhan.qiniucdn.com" + $scope.data[$scope.answer.pageIndex*4+$scope.answer.correctId][8],true);
    
         
    }
    catch(e)
    {}
    };
    $scope.reset();
    
    $("#option-word span").click(function(){
       console.log($(this).text().trim());
        
    });
    
    
    $scope.swipe = function(direction)
    {
        console.log("swipe " + direction);
    }
    
    $scope.imgClick = function(index)
    {
        if($scope.answer.isAnswer == false)
        {
            $scope.answer.selectId = index;
            $scope.answer.isAnswer = true;
            var right = ($scope.answer.selectId == $scope.answer.correctId);
            if(right)
            {
                snd.right();
            }
            else
            {
               snd.wrong(); 
            }
            
            $timeout(function(){
                
                
                $scope.answer.selectId = -1;
                $scope.answer.isAnswer = false;
                if(right)
                {
                    $scope.answer.pageIndex = ($scope.answer.pageIndex+1)%30;
                    $scope.reset();
                    //snd.playSound("http://baicizhan.qiniucdn.com" + $scope.data[$scope.answer.pageIndex*4+$scope.answer.correctId][7]);
                    
                }
                //7 8
                
                
            },right?1000:500);
        }
        
        
    }
    
    $scope.wordClick = function(word)
    {
        if(word.indexOf($scope.answer.word) >=0)
        {
            snd.playSound("http://baicizhan.qiniucdn.com" + $scope.data[$scope.answer.pageIndex*4+$scope.answer.correctId][7]);                   
        }
        
        
        console.log(word.trim());
    }
    
    
    
});
