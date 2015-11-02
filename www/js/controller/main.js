/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

md.controller('mainCtrl', function($scope,$timeout,snd,$ionicHistory, $ionicLoading) {
    $scope.btns = [{isClick:false}];
    

    
    $scope.btn0_click = function ()
    {
         snd.chop();
        $ionicLoading.show({
            template: '数据读取中...'
        });

        $timeout(function(){
           
        window.document.location.href += "/test";
        },20);
        


    };
    
});
