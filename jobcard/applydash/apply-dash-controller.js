(function(){
    angular.module("JobCard").service('apply', apply)
        .controller('applydash',applydash)
        .directive('applyDash', applyDash).directive('applyRes', applyRes);
    
    apply.$inject = ['$http'];
    
     function apply($http){
        this.getuser = function(request, callback){
            $http.post('api/getuser/data', request).then(function(response){
                if(response.data !== undefined){
                    //console.log(response);  
                    var addedcard = response.data;
                    if(addedcard){
                       return callback(addedcard); 
                    }else{
                        return callback('no apps');
                    }
                
                }
            }).catch(function(error){
                return callback(error);
            });
        }
        this.getcv = function(request, callback){
            $http.post('api/getcv/getcv', request).then(function(response){
                return callback(response);
                console.log(response);
            }).catch(function(error){
                return callback("error encounted");
                console.log(error);
            });
        }
        this.postcv = function(request, callback){
            $http.post('api/postcv/postcv', request).then(function(response){
                return callback(response);
            }).catch(function(error){
                return callback(error);
            });
        }
        this.checkpost = function(request, callback){
            $http.post('api/checkpost/checkpost', request).then(function(response){
                return callback(response);
            }).catch(function(error){
                return callback(error);
            });
        }      
    }
    applydash.$inject = ['$timeout', '$scope', 'apply'];
     function applydash($timeout, $scope, apply){
        
        if(localStorage['User-Data'] !== undefined){
            var user = JSON.parse(localStorage['User-Data']);
            var user_id = user.userid;
            $scope.userid = user_id;
            
            userdata(user_id);
            
            function userdata(user_id){
               
               var request = {
                   userid: user_id
               };
              apply.getuser(request, function(results){ 
                     if(results !== undefined){
                         console.log(results.addedcards);
                         $scope.showresults = results.addedcards;
                          
                     }
              });
            }
    
            }
        }
    applyDash.$inject = ['apply'];
    
     function applyDash(service){
        return {
            restrict: 'A',
               scope: {
              job: '=',
              userid: '='
          },
            transclude: true,
        replace: true,
            templateUrl: 'jobcard/templates/dirtemplates/apply.html',
            link: function(scope, element, attrs){
                var job_id = scope.job.jobid;
                var user_id = scope.userid;
                
                checkcv(user_id);
                checkpost(job_id);
                function checkcv(user_id){
                    var request = {
                      userid: user_id  
                    };
                    service.getcv(request, function(results){
                        if(results.data !== undefined){
                            scope.cvid = results.data._id;
                           // scope.cvsendok = true;
                        }
                    });
                }
                scope.dropcv = function (){
                    var jobid = scope.job.jobid;
                    var user_id = scope.userid;
                    var request  = {
                      userid : user_id  
                    };
                    service.getcv(request, function(response){
                        console.log(response);
                        if(response.data !== undefined){
                           var request = {
                              job_id : jobid,
                              cvid : response.data._id,
                              userid : response.data.userid,
                              fname: response.data.firstName,
                              lname : response.data.lastName,
                              gender: response.data.gender,
                              profession: response.data.proffesion,
                              skills: response.data.skilldes,
                              experince: response.data.expedes
                           };
                            service.postcv(request, function(results){
                              if(results.data.card == "successfully saved"){
                                  scope.cvid = results.data.cvid;
                                  scope.cvsendok = true;
                              } 
                            });
                           
                        }
                    });
                    
                    
                }
                function checkpost(job_id){
                    var request = {
                        jobid: job_id
                    };
                    service.checkpost(request, function(results){
                        if(results.data !== undefined){
                            var cvs = results.data.cvbox;
                            console.log(cvs);
                            for(var i = 0; i < cvs.length; i++){
                                if(cvs[i].cvid == scope.cvid){
                                    scope.cvsendok = true;
                                    console.log(scope.cvsendok);
                                }
                            }
                        }
                    });
                }
            }
        };
    }
    
    function applyRes(){
        var directive = {
            restrict: 'A',
            scope : {
                userid : '='
            },
            controller : controller,
            controllerAs : 'ap',
            bindToController: true,
            transclude : true,
            templateUrl: 'jobcard/templates/dirtemplates/applyStas.html',
            link: link
        }
        return directive;
        function link(scope, element, attrs){
           console.log(scope.ap.userid);
            scope.ap.appRes(scope.ap.userid);
        }
        controller.$inject = ['$scope', 'apply'];
        function controller($scope, apply){
           var ap = this;
           ap.appRes = function(userid){
               var request = {
                 userid : userid  
               };
               apply.getuser(request, function(results){
                   if(results){
                       var adds = results.addedcards;
                      ap.appcards = adds;
                       console.log(adds);
                       for(var i = 0; i < adds.length; i++){
                          var replydata = adds[i].reply; 
                           var datad = replydata;
                           if(datad){
                             for(var j = 0; j < datad.length; j++){
                               if(datad[i].replyok == "on the second step"){
                                  ap.replycard = true;
                                  ap.appcards = adds; 
                                  ap.replysms = "on to the next step";
                               }else{
                                   ap.replycard = false;
                                   ap.appcards = adds;
                                   ap.replysms = "still on the queue"; 
                               }
                            }  
                           }
                           // for(var j = 0; j < datad.length; j++){
                            //    console.log(datad[j]);
                           // }
                           //
                            // console.log("on to the next step");
                               //
                           
                               ap.replycard = false;
                               ap.appcards = adds;
                               ap.replysms = "still on the queue";
                              // console.log("still on the queue");
                           
                          }
                       }
               });
           }
            
        }
    }
    
}())