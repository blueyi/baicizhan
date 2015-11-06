/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

md.controller('testCtrl', function ($scope, $timeout, snd, db, $ionicLoading, $stateParams, $ionicModal, $rootScope, $sce) {

    $scope.dict = [];
    
    $scope.randId = $stateParams.randid;

    
    $ionicModal.fromTemplateUrl('templates/test-model.html', {
        scope: $scope, animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.playVideo = function ()
    {
        if ($("#myVideo") && $("#myVideo").get(0))
        {
            $("#myVideo").get(0).play();
        }

    };

    $scope.pauseVideo = function ()
    {
        if ($("#myVideo") && $("#myVideo").get(0))
        {
            $("#myVideo").get(0).pause();
        }

    };

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
        $scope.pauseVideo();
    };

    $scope.swipeAnimation = function(id)
    {
        
        //$("#test-model").transition({ rotate: '45deg' });
        $( "#test-model" ).animate({
    transform:'translateX(200px)'
    
    
  }, 300 );
  
    };

    // Open the login modal
    $scope.login = function (isHistory, isModal) {
        if (isHistory &&$scope.answer.history.length >0)
        {
            var index = $scope.answer.history[$scope.answer.history.length - 1].id;
            var historyId = $scope.answer.history.length - 1;
            if (( isModal === 1 || isModal === -1))
            {
                historyId = $scope.curAnswer.historyId - isModal;
                if (historyId < 0) {
                    $(".notice").removeClass("ng-leave");                   
                    $(".notice").removeClass("ng-enter");
                    $(".notice").addClass("ng-enter");
                    if($scope.noticeTimeout)
                    {
                        $timeout.cancel($scope.noticeTimeout);
                    }
                    
                    $scope.noticeTimeout = $timeout(function(){
                        $(".notice").removeClass("ng-enter");
                        $(".notice").addClass("ng-leave");
                        
                    },1000);
                    
                    return;};
                
               
                if(historyId >= $scope.answer.history.length)
                {
                    $scope.modal.hide();
                    return;
                }
                else
                {index = $scope.answer.history[historyId].id;}
                
                
            }   
            
                
            $scope.curAnswer = $scope.getDetailInfoByIndex(index);
            $scope.curAnswer.historyId = historyId;
            
            if(isModal === 1 || isModal === -1)
            {                
                var classes = ["slide-in-right","slide-in-left","slide-in-up","ng-enter","slide-in-up","active","ng-enter-active"];
                
                for(var i =0; i<classes.length; i++)
                    $('#test-model').removeClass(classes[i]);
                
                $('#test-model').addClass(isModal==1&&(historyId<($scope.answer.history.length -1))?"slide-in-right":"slide-in-left");
                $('#test-model').addClass("ng-leave");                
                $timeout(function(){$scope.modal.show();},100);                
            }
            else
            {
                $scope.modal.show();
            }
        }
        else
        {
            $scope.curAnswer = $scope.getDetailInfoByIndex($scope.answer.pageIndex * 4 + $scope.answer.correctId);
            $scope.curAnswer.historyId = $scope.answer.history.length;
            $scope.modal.show();
        }
    };

    $scope.modalSwipeLeft = function ()
    {
        $scope.login(true, 1);
    }
    $scope.modalSwipeRight= function ()
    {
        $scope.login(true, -1);
    }


    $scope.downloadImage = function (path)
    {
        db.downloadImage(path, $scope);

    };

    $scope.initdata = function ()
    {
        $scope.data = db.getRandomTest();
        $ionicLoading.hide();
    };
    $scope.initdata();


    $scope.cells = [];

    if (!$scope.answer)
        $scope.answer = {
            isAnswer: false,
            correctId: Math.floor(Math.random() * 4),
            selectId: -1,
            word: "",
            isHint: false,
            pageIndex: 0,
            hint: {content: '', val: 0},
            video: false,
            videoUrl: "",
            history: [],
            value:2
        };
    $scope.playSound = function ()
    {
        snd.playSound("http://baicizhan.qiniucdn.com" + $scope.data[$scope.answer.pageIndex * 4 + $scope.answer.correctId][8]);

    };

    $scope.updateWordText = function (text)
    {
        var cells = text.split(" ");
        var wordCells = $scope.answer.word.trim().split(" ");
        $scope.cells = [];
        for (var i = 0; i < cells.length; i++)
        {
            if (wordCells.length > 1)
            {
                var count = 0;
                for (var j = 0; j < wordCells.length && j + i < cells.length; j++)
                {
                    if (wordCells[j] === $scope.cells[i + j])
                    {
                        count++;
                    } else
                    {
                        break;
                    }
                }

                if (count === wordCells.length)
                {
                    $scope.cells.push($scope.answer.word.trim() + " ");
                    i = i + j;

                } else
                {
                    $scope.cells.push(cells[i] + " ");
                }
            } else
            {
                $scope.cells.push(cells[i] + " ");
            }
        }

    };

    $scope.updateVideo = function ()
    {
        $scope.answer.video = false;
        $scope.answer.videoUrl = "";
        var path = "http://baicizhan2.qiniucdn.com/word_tv/";
        if ($rootScope.tvs[$scope.answer.word] && ($rootScope.tvs[$scope.answer.word].real === true || $rootScope.tvs[$scope.answer.word].leng === true || $rootScope.tvs[$scope.answer.word].animate === true))
        {
            $scope.answer.video = true;
            var word = $rootScope.tvs[$scope.answer.word];
            var nail = ["real_", "leng_", "animate_"];

            if (word.real === true)
            {
                path = path + nail[0];
            }
            else if (word.leng === true)
            {
                path = path + nail[1];
            }
            else if (word.animate === true)
            {
                path = path + nail[2];
            }
            $scope.answer.videoUrl = $sce.trustAsResourceUrl(path + $scope.answer.word + ".mp4");
        }
    };

    $scope.reset = function ()
    {
        //The abandoned house looks so terrifying.
        try
        {
            $scope.answer.isHint = false;

            if ($("#myVideo") && $("#myVideo").get(0))
            {
                $("#myVideo").get(0).pause();
                $("#myVideo").get(0).src = "";
            }


            $scope.answer.hint = {content: "", val: 0};
            $scope.answer.correctId = Math.floor(Math.random() * 4);

            var index = $scope.answer.pageIndex * 4 + $scope.answer.correctId;
            var mainPath = "http://baicizhan.qiniucdn.com";
            $scope.answer.word = $scope.data[index][15];
            $scope.updateVideo();
            $scope.updateWordText($scope.data[index][4]);
            snd.playSound(mainPath + $scope.data[index][7], true, true);
            snd.playSound(mainPath + $scope.data[index][8], true);



        }
        catch (e)
        {
        }
    };

    $scope.getDetailInfoByIndex = function (index)
    {
        var data = $scope.data[index];

        var detail = {};
        detail.word = $scope.data[index][15];
        detail.id = index;


        detail.video = false;
        detail.videoUrl = "";
        var path = "http://baicizhan2.qiniucdn.com/word_tv/";
        if ($rootScope.tvs[detail.word] && ($rootScope.tvs[detail.word].real === true || $rootScope.tvs[detail.word].leng === true || $rootScope.tvs[detail.word].animate === true))
        {
            detail.video = true;
            var word = $rootScope.tvs[detail.word];
            var nail = ["real_", "leng_", "animate_"];

            if (word.real === true)
            {
                path = path + nail[0];
            }
            else if (word.leng === true)
            {
                path = path + nail[1];
            }
            else if (word.animate === true)
            {
                path = path + nail[2];
            }
            detail.videoUrl = $sce.trustAsResourceUrl(path + detail.word + ".mp4");
        }
        
        var data = {right:0,wrong:0};
        for(var i=0; i< $scope.answer.history.length; i++)
        {
            
            if($scope.answer.history[i].id == index)
            {
                if($scope.answer.history[i].result == true && $scope.answer.history[i].value > 0)
                {
                    data.right++;
                }
                else
                {
                    data.wrong++;
                }
            }
        }
        detail.resultData = data;
        return detail;
    };

    $scope.onSwipeLeft = function ()
    {
        if ($scope.answer.history.length > 0)
        {
            console.log("swipe left");
            $scope.modal.animation = "slide-in-left";
            $('#test-model').removeClass("slide-in-up");
            $('#test-model').addClass("slide-in-left");

            $scope.login(true);
        }
    };



    $scope.reset();

    $scope.imgClick = function (index, isKan)
    {
        if ($scope.answer.isAnswer === false)
        {
            $scope.answer.selectId = index;
            $scope.answer.isAnswer = true;
            var right = ($scope.answer.selectId === $scope.answer.correctId);
            if (isKan)
            {
                snd.chop();
                $scope.answer.value = 1;
            }
            else
            {
                snd.right(right);
                
                if(right == false)
                    $scope.answer.value = ($scope.answer.value -1)>=0 ? $scope.answer.value : 0;
            }
            $scope.answer.history.push({id: $scope.answer.pageIndex * 4 + $scope.answer.selectId, result: right, value:right?$scope.answer.value:0});
            $timeout(function () {


                $scope.answer.selectId = -1;
                $scope.answer.isAnswer = false;
                if (right)
                {
                    $scope.answer.pageIndex = ($scope.answer.pageIndex + 1) % 30;
                    $scope.reset();
                    //snd.playSound("http://baicizhan.qiniucdn.com" + $scope.data[$scope.answer.pageIndex*4+$scope.answer.correctId][7]);

                }
                //7 8


            }, right ? 1000 : 500);
        }
    };

    $scope.kan = function ()
    {
        $scope.closeLogin();
        $scope.imgClick($scope.answer.correctId, true);
    };


    $scope.wordClick = function (word)
    {
        if (word.indexOf($scope.answer.word) >= 0)
        {
            snd.playSound("http://baicizhan.qiniucdn.com" + $scope.data[$scope.answer.pageIndex * 4 + $scope.answer.correctId][7]);
        }
        else
        {
            var dict = db.getWord(word.toLowerCase());
            $scope.dict = dict;
            
            if(dict.length >0)
            {
                $(".dictDiv").removeClass("ng-leave");   
                $(".dictDiv").removeClass("ng-enter-active");   
                    $(".dictDiv").removeClass("ng-enter");
                    $(".dictDiv").addClass("ng-enter");
                    
                    /*
                       $(".dictDiv").removeClass("ng-enter");
                        $(".dictDiv").addClass("ng-leave");
                      */  
                    $timeout(function(){
                        $(".dictDiv").addClass("ng-enter-active");
                    },
                    300);
                
            }
            
            
        }

        console.log(word.trim());
    };

    $scope.pageClick = function()
    {
        console.log("page click");
        if($(".dictDiv").hasClass("ng-enter-active"))
        {
             $(".dictDiv").removeClass("ng-enter-active");
             $(".dictDiv").removeClass("ng-enter");
                        $(".dictDiv").addClass("ng-leave");
        }
        
    }

    $scope.playWord = function ()
    {

        snd.playSound("http://baicizhan.qiniucdn.com" + $scope.data[$scope.answer.pageIndex * 4 + $scope.answer.correctId][7]);




    };

    $scope.changeHint = function ()
    {
        var val = ($scope.answer.hint.val + 1) % 5;
        if (val > 0)
        {
            $scope.answer.hint.val = 0;
            if (val === 1)
            {
                if (($scope.data[$scope.answer.pageIndex * 4 + $scope.answer.correctId][4] + $scope.data[$scope.answer.pageIndex * 4 + $scope.answer.correctId][5]).trim().length > 0)
                {
                    $scope.answer.hint.content = $scope.data[$scope.answer.pageIndex * 4 + $scope.answer.correctId][4] +
                            "<br>" + $scope.data[$scope.answer.pageIndex * 4 + $scope.answer.correctId][5];

                    $timeout(function () {
                        $scope.answer.hint.val = 1;
                    }, 10);
                } else
                {
                    val = 2;
                }
            }


            if (val === 2)
            {
                if ($scope.data[$scope.answer.pageIndex * 4 + $scope.answer.correctId][11].trim().length > 0)
                {
                    $scope.answer.hint.content = "<span class='blue'><blue>" + $scope.answer.word + "</blue></span> = " + $scope.data[$scope.answer.pageIndex * 4 + $scope.answer.correctId][11];
                    $timeout(function () {
                        $scope.answer.hint.val = 2;
                    }, 10);
                } else
                {
                    val = 3;
                }
            }


            if (val === 3)
            {
                if (($scope.data[$scope.answer.pageIndex * 4 + $scope.answer.correctId][3]).length > 0)
                {
                    $scope.answer.hint.content = "<span class='blue'><blue>" + $scope.answer.word + "</blue></span> = " + $scope.data[$scope.answer.pageIndex * 4 + $scope.answer.correctId][3];
                    $timeout(function () {
                        $scope.answer.hint.val = 3;
                    }, 10);
                } else
                {
                    val = 4;
                }
            } else if (val > 3)
            {


                $('#test-model').removeClass("slide-in-left");
                $('#test-model').addClass("slide-in-up");

                $scope.login();
                $timeout(function () {
                    $scope.answer.hint.content = "";
                    $scope.answer.isHint = false;
                    $scope.answer.hint.val = 0;
                }, 100);
            }


            $scope.answer.isHint = true;

            return;
        } else
        {
            $scope.answer.hint.content = "";
            $scope.answer.isHint = false;
            $scope.answer.hint.val = 0;
        }


    };



});
