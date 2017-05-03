(function(){
    angular.module("JobCard").service('login',login)
        .controller('loginController', loginController);
    
    loginController.$inject = ['$scope','$window','$location', '$interpolate' ,'login'];
    
     function loginController($scope, $window, $location, $interpolate, login){
        $scope.loading = false;
        $scope.logUser = function(){
            var request = {
                username: $scope.username,
                password: $scope.password
            }
            login.logIn(request, function(results){
                console.log(results);
                var token = results.data.msg;
                $scope.loading = true;
                if(token == "wrong password" || token == "user not found"){
                    $scope.ermess = 'wrong details try again';
                }else{
                    $scope.loading = true;
                   var paywox = results.data;
                    $scope.a = paywox;
                    var url = $interpolate('dashboard/{{a}}')($scope);
                    console.log(url);
                    login.saveToken(paywox, function(res){
                        console.log(res);
                        localStorage.setItem('User-Data', JSON.stringify(res));
                       $location.path(url);
                    });
                }
            });
        }
    }
        
    login.$inject =['$http','$window'];
     function login($http, $window){
        this.logIn = function(request, callback){
            $http.post('api/login/login', request).then(function(response){
                return callback(response);
            }).catch(function(error){
                return callback(error);
            });
        } 
        this.saveToken = function(token, callback){
              var payload = token.split('.')[1];
              payload = $window.atob(payload);
              payload = JSON.parse(payload);
              
              return callback(payload);
        };
        
        
        
        
    }
    
    
    
    
}())