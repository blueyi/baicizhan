/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

md.controller('testCtrl', function ($scope, $timeout, snd, db, $ionicLoading, $stateParams, $ionicModal, $rootScope,$sce) {


    $ionicModal.fromTemplateUrl('templates/test-model.html', {
        scope: $scope, animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.playVideo = function ()
    {
        $("#myVideo").get(0).play();
    }

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };



    $scope.randId = $stateParams.randid;
    $scope.cache = {};



    $scope.downloadImage = function (path)
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

    $scope.change = function ()
    {
        $scope.data = db.getRandomTest();


        $ionicLoading.hide();


    }
    $scope.change();


    $scope.cells = [];
    var text = "She wanted to write a letter but her hand was injured, so I took her dictation.";
    var cells = text.split(" ");
    var newText = "";

    for (var i = 0; i < cells.length; i++)
    {



        $scope.cells.push(cells[i] + " ");

    }

    if(!$scope.answer)
    $scope.answer = {
        isAnswer: false,
        correctId: Math.floor(Math.random() * 4),
        selectId: -1,
        word: "",
        isHint: false,
        pageIndex: 0,
        hint: {content: '', val: 0},
        video: false,
        videoUrl:"",
    };
    $scope.playSound = function ()
    {
        snd.playSound("http://baicizhan.qiniucdn.com" + $scope.data[$scope.answer.pageIndex * 4 + $scope.answer.correctId][8]);
        
    }

    $scope.reset = function ()
    {
        //The abandoned house looks so terrifying.
        try
        {
            $scope.answer.isHint = false;
            
            if($("#myVideo") &&$("#myVideo").get(0))
            {$("#myVideo").get(0).pause();
                $("#myVideo").get(0).src ="";
            }
            $scope.answer.video = false;
            $scope.answer.videoUrl = "";
            
            $scope.answer.hint = {content: "", val: 0};
            $scope.answer.correctId = Math.floor(Math.random() * 4);
            var text = $scope.data[$scope.answer.pageIndex * 4 + $scope.answer.correctId][4];

            //$rootScope.tvs
            if($rootScope.tvs[$scope.answer.word] && $rootScope.tvs[$scope.answer.word].real == true)
            {
                $scope.answer.video = true;
                $scope.answer.videoUrl = $sce.trustAsResourceUrl("http://baicizhan2.qiniucdn.com/word_tv/real_"+ $scope.answer.word +".mp4");
                
                
            }


            var cells = text.split(" ");


            $scope.cells = [];
            $scope.answer.word = $scope.data[$scope.answer.pageIndex * 4 + $scope.answer.correctId][15];

            var wordCells = $scope.answer.word.trim().split(" ");




            for (var i = 0; i < cells.length; i++)
            {
                if (wordCells.length > 1)
                {
                    var count = 0;
                    for (var j = 0; j < wordCells.length && j + i < cells.length; j++)
                    {
                        if (wordCells[j] == $scope.cells[i + j])
                        {
                            count++;
                        } else
                        {
                            break;
                        }
                    }

                    if (count == wordCells.length)
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
            snd.playSound("http://baicizhan.qiniucdn.com" + $scope.data[$scope.answer.pageIndex * 4 + $scope.answer.correctId][7], true, true);
            snd.playSound("http://baicizhan.qiniucdn.com" + $scope.data[$scope.answer.pageIndex * 4 + $scope.answer.correctId][8], true);


        } catch (e)
        {
        }
    };
    $scope.reset();

    $("#option-word span").click(function () {
        console.log($(this).text().trim());

    });


    $scope.swipe = function (direction)
    {
        console.log("swipe " + direction);
    }

    $scope.imgClick = function (index)
    {
        if ($scope.answer.isAnswer == false)
        {
            $scope.answer.selectId = index;
            $scope.answer.isAnswer = true;
            var right = ($scope.answer.selectId == $scope.answer.correctId);
            if (right)
            {
                snd.right();
            } else
            {
                snd.wrong();
            }

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


    }

    $scope.wordClick = function (word)
    {
        if (word.indexOf($scope.answer.word) >= 0)
        {
            snd.playSound("http://baicizhan.qiniucdn.com" + $scope.data[$scope.answer.pageIndex * 4 + $scope.answer.correctId][7]);
        }


        console.log(word.trim());
    };

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
            if (val == 1)
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


            if (val == 2)
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


            if (val == 3)
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
