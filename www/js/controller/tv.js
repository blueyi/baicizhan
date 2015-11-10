/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

md.controller('tvCtrl', function ($scope, $timeout, snd, db, $ionicLoading, $stateParams, $ionicModal, $rootScope, $sce,$ionicScrollDelegate, $ionicPopover) {
    var tvs = [];

    
    $scope.ui = {
        isShowControl: false,
        selectIndex:2,
        paused:true
        
    };

    $("#tvVideo").on('play', function () {
        //console.log("play");
        $scope.ui.paused = false;
        $scope.$apply();
    });
 $("#tvVideo").on('pause', function () {
        //console.log("pause");
        $scope.ui.paused = true;
        $scope.$apply();
    });
    $scope.showControl = function (event) {
//        console.log(event.pageY);   
        if ($scope.ui.isShowControl == true)
        {
            var e = event;
            var height = $("#tvDiv").height();
            var width = $("#tvDiv").width();

            if (e.pageY > 50 && e.pageY < height - 50 && e.pageX < width * 3 / 4)
            {
                $scope.ui.isShowControl = false;
            }
        }
        else
        {
            $scope.ui.isShowControl = true;
        }


    };

    for (var propertyName in $rootScope.tvs) {
        // propertyName is what you want
        // you can get the value like this: myObject[propertyName]
        var item = $rootScope.tvs[propertyName];

        if (item.real || item.leng || item.animate)
        {
            var ary = ["real", "leng", "animate"];
            var count = 0;
            if (item.real)
            {
                count = 0;
            }
            else if (item.leng)
            {
                count = 1;
            }
            else if (item.animate)
            {
                count = 2;
            }

            var path = $sce.trustAsResourceUrl("http://baicizhan2.qiniucdn.com/word_tv/" + ary[count] + "_" + item.word + ".mp4");
            var tv = {"word": item.word, "url": path};
            tvs.push(tv);
        }
    }
    $scope.mytvs = tvs.sort(function (a, b) {
        if (a.word > b.word)
        {
            return 1;
        }
        return -1;
    });
    $scope.curTv = $scope.mytvs[2];
    var height = $("#tvDiv").height();
    $("#tvList").height(height - 100);

    $scope.ui.isShowControl = false;
    $(window).resize(function () {

        var height = $("#tvDiv").height();
        $("#tvList").height(height - 100);
        console.log(height);
        $scope.$apply(function () {
            //do something to update current scope based on the new innerWidth and let angular update the view.
        });
    });
    $scope.ui.paused = true;
    $scope.pauseVideo = function()
    {
        if($("#tvVideo").get(0).paused)
        {
            $("#tvVideo").get(0).play();
        }
        else
        {
            $("#tvVideo").get(0).pause();
        }
        
    }

    $scope.playVideo = function(index)
    {
        if(index >= 0)
        {
            $scope.ui.selectIndex = index;   
            $("#tvVideo").get(0).src =$scope.mytvs[index].url;
            $("#tvVideo").get(0).play();
        }
    }
    
    $ionicPopover.fromTemplateUrl('templates/popover-info.html', {
        scope: $scope,
    }).then(function (popover) {
        $scope.popover = popover;
    });
    
    $scope.changeVideo = function(value)
    {
        var index = ($scope.ui.selectIndex + value +$scope.mytvs.length-1)% ($scope.mytvs.length);
        $scope.playVideo(($scope.ui.selectIndex + value +$scope.mytvs.length)% ($scope.mytvs.length));
        var view = $ionicScrollDelegate.$getByHandle('tvListScrollHandle').getScrollView();
        var height = view.__contentHeight;
        var cellHeight = height/ $scope.mytvs.length;
        $ionicScrollDelegate.$getByHandle('tvListScrollHandle').scrollTo(0,cellHeight * (index ),true);
        
    }

});
