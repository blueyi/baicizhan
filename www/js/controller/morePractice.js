/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

md.controller('morePracticeCtrl', function ($scope, $timeout, snd, db, $ionicLoading, $stateParams, $ionicModal, $rootScope, $sce) {
    $scope.ui = {
        imgs:[
            {url:"headphone.svg",title:"听音识词",level:3},
            {url:"microphone.svg",title:"语音填空",level:4},
            {url:"abc.svg",title:"单词拼写",level:5}],
        lines:["大侠您真想试试吧","我们有三种加强记忆的方法","想试试吗"]
    };
    
    ImgCache.cacheFile('img/headphone.svg');
    ImgCache.cacheFile('img/microphone.svg');
    ImgCache.cacheFile('img/abc.svg');
 
});
