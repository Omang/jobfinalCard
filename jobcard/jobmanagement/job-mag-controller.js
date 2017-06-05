(function(){
    'use strict';
    angular.module("JobCard")
        .service('jobMan', jobMan).controller('jobmanagement', jobmanagement)
        .directive('showCard', showCard).directive('cvReview', cvReview);
    jobMan.$inject = ['$http'];
    
    function jobMan ($http){
            this.SendCall = function(request){
                return $http.post('api/send/call', request);
            }
            this.getjob = function(request, callback){
                $http.post('api/getjobs/getjobs', request).then(function(response){
                    console.log('getting there');
                    return callback(response);
                }).catch(function(error){
                    return callback(error);
                });
            }
            this.cvreview = function(request, callback){
                $http.post('api/latereview/review', request).then(function(response){
                    return callback(response);
                }).catch(function(error){
                    return callback(error);
                });
            }
            this.reviewCheck = function(request, callback){
                $http.post('api/check/review', request).then(function(response){
                    return callback(response);
                }).catch(function(error){
                    return callback(error);
                   // console.log(error);
                });
            }
       
        
        
    }
    
    
    jobmanagement.$inject = ['$scope', 'jobMan'];
   
     function jobmanagement ($scope, jobMan){
             if(localStorage['User-Data'] !== undefined){
            var user = JSON.parse(localStorage['User-Data']);
            var user_id = user.userid;
            var vm = this;
            vm.userid = user_id;
                 jobget(user_id);
                 function jobget(user_id){
                     var request ={
                   jobid: user_id  
                 };
                 
                 jobMan.getjob(request, function(results){
                     //console.log(results);
                     if(results.data !== null || results.data !== undefined){
                         var card = results.data;
                         for(var i = 0; i < card.length; i++){
                            vm.job_id = card[i]._id;
                             var boxcv = card[i].cvbox;
                             if(boxcv){
                                vm.stuffout = boxcv; 
                                 for(var i = 0; i < boxcv.length; i++){
                                     console.log(boxcv[i].review);
                                     var cvforr = boxcv[i].review;
                                     if(cvforr !== undefined){
                                     for(var j = 0; j < cvforr.length; j++){
                                          if(cvforr[j].jobid){
                                            vm.stuffin = boxcv;
                                            console.log(vm.stuffin);
                                            
                                          }
                                     }
                                     }
                                     
                                 }
                                vm.dropcvlength = boxcv.length;
                             }else{
                                 vm.dropnull = false;
                             }
                         }
                     }
                 });
                 }
               
                 
             }
        
    }
    
    function showCard (){
             var directive = {
               restrict : 'A',
                 scope : {
                     applycard : '=',
                     jobid: '=',
                 },
               link: link,
               controller : controller,
               controllerAs : 'vd',
               bindToController : true,
               transclude: true,
               replace : true,
               templateUrl: 'jobcard/templates/dirtemplates/applications.html'
             };
        return directive;
        
            function link(scope, element, attrs, ctrl){ 
               // var checkcvsaved;
                var job_id = scope.vd.jobid;
                console.log("card id:"+job_id);
            var cvowner = scope.vd.applycard.userid;
            var cvcon = scope.vd.applycard;
          checkreview(cvcon);
            function checkreview(dropcv){
                var recItems = dropcv.review.length;
                if(recItems > 0){
                    scope.vd.savedcv = true;
                    console.log('waiting for review');
                }else{
                   scope.vd.savedcv = false;
                    console.log('still for review');
                }
            }
            
             var getDetails = function(job_id, cvowner){
                 if(job_id && cvowner){
                     var request = {
                        jobid: job_id,
                        cvdata: cvowner
                     };
                     return request;
                 }else{
                     return false;
                 }
             }
                scope.cvSaved = function(){
                    console.log("i was clicked");
                    var items = getDetails(scope.vd.jobid , scope.vd.applycard.userid);
                   // console.log(items);
                    scope.vd.cvSave(items);
                }     
            scope.viewmore = function(cvowner){
                scope.vd.viewcv(cvowner);
            }
        }
         controller.$inject = ['$scope', 'jobMan', '$uibModal'];  
        function controller($scope, jobMan, $uibModal){
            var vd = this;
            vd.viewcv = function(cv){
                console.log("view more just been clicked");
               // vd.cvman = cvowner;
                $uibModal.open({
                    templateUrl: 'jobcard/templates/dirtemplates/viewmore.html',
                    controller: function($scope, $uibModalInstance){
                        $scope.cvname = cv.fname;
                        $scope.cvlname = cv.lname;
                        $scope.cvgender = cv.gender;
                        $scope.cvexp =  cv.experince;
                        $scope.cvskill = cv.skill;
                        $scope.closeview = function(event){
                            $uibModalInstance.close('cancel');
                        }
                    }
                });
            }
            //console.log(vd.jobid);
            //checkreview($scope.vd.jobid);
            var checksaved = function(Isadded){
                var readlength = Isadded.length;
                readlength = parseInt(readlength);
                console.log(readlength);
                if(readlength > 0){
                    return true;
                }else{
                    return false;
                }
            }
            vd.cvSave = function(request){
                 console.log("shit have just been clicked");
                 if(request){
                   console.log(request);
                 jobMan.cvreview(request, function(results){
                     console.log(results);
                     vd.savedcv = true;
                 });
                     
                 }
                 
                }
       
        }
    }
    function cvReview(){
        var directive = {
          restrict : 'A',
          scope : {
              cvs : '=',
              jobid : '='
          },transclude : true,
            replace : true,
            templateUrl: 'jobcard/templates/dirtemplates/cvnxtstep.html',
            controller: controller,
            controllerAs: 'iv',
            bindToController: true,
            link : link
         
        };
        return directive; 
        
        function link(scope, element, attrs, ctrl){
            var cvs = scope.iv.cvs;
            checkreview(cvs);
            function checkreview(dropcv){
                var recItems = dropcv.review.length;
                if(recItems > 0){
                    scope.iv.realdata = cvs;
                    //console.log('waiting for review');
                }
                var recdata = dropcv.interview;
                if(recdata){
                  scope.userCalled = true;  
                }
            }
            scope.UserCall = function(){
                scope.userCalled = true;
                var job_id = scope.iv.jobid;
                var cv_id = scope.iv.realdata._id;
                var cvowner_id = scope.iv.realdata.cvid;
                var request = {
                    jobid : job_id,
                    cvid : cv_id,
                    cvowner : cvowner_id
                };
             scope.iv.CallUser(request, function(response){
                  console.log(response);
              });
            }
        }
        
        controller.$inject = ['$scope', 'jobMan', '$uibModal'];
        function controller($scope, jobMan, $uibModal){
            var iv = this;
            iv.CallUser = function(request, callback){
                if(request){
                    jobMan.SendCall(request).then(function(response){
                        return callback(response.data);
                    }).catch(function(error){
                        return callback(error);
                    });
                }
            }
            iv.viewItem = function(realdata){
                console.log("view more just been clicked");
               // vd.cvman = cvowner;
                $uibModal.open({
                    templateUrl: 'jobcard/templates/dirtemplates/viewmore.html',
                    controller: function($scope, $uibModalInstance){
                        $scope.cvname = realdata.fname;
                        $scope.cvlname = realdata.lname;
                        $scope.cvgender = realdata.gender;
                        $scope.cvexp =  realdata.experince;
                        $scope.cvskill = realdata.skill;
                        $scope.closeview = function(event){
                            $uibModalInstance.close('cancel');
                        }
                    }
                });
            }
            
        }
        
        
    }
    
}())