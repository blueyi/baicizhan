/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

md.controller('testCtrl', function($scope,$timeout,snd,db,$ionicLoading) {
    
    $scope.change = function()
    {
       $scope.data = db.getRandomTest(); 
    }
    $scope.change();
    
    $ionicLoading.hide();
    
    
    
    
    
});
