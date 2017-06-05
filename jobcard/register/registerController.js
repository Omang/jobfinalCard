(function(){
    angular.module("JobCard").service('Uregister',uregister).controller('registerController', registerController);
    
    registerController.$inject = ['$scope','$location','$window','Uregister'];
    function registerController($scope,$location, $window, Uregister){
        $scope.checkemail = function(){
                console.log("blur working");
                var email = $scope.email;
               Uregister.realcheck(email).then(function(response){
                    console.log(response);
                   var recdata = response.data.msg;
                    if(recdata == 'mail found'){
                        $scope.errmsg = true;
                    }else{
                        $scope.errmsg = false;
                    }
                }).catch(function(error){
                   console.log(error); 
                });
            }
        
        $scope.registerUser = function(){
            var request = {
                username: $scope.username,
                password: $scope.password,
                email: $scope.email
            };
            
            Uregister.register(request, function(results){
                if(results.data !== undefined){
                $scope.usersaved = true;
                    
                }
            });
        }
    }
    
    uregister.$inject = ['$http'];
    function uregister($http){
        this.register = function(request, callback){
            $http.post('api/register/register', request).then(function(response){
                return callback(response);
            }).catch(function(error){
                return callback(error);
            })
        }
       this.realcheck = function(request){
           var request = {
               email: request
           };
           return $http.post('api/check/mail', request);
       }
        
    }
}())