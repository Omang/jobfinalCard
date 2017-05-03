(function(){
    'use strict';
    angular.module("JobCard")
        .service('jobMan', jobMan).controller('jobmanagement', jobmanagement)
        .directive('showCard', showCard).directive('cvReview', cvReview);
    jobMan.$inject = ['$http'];
    
    function jobMan ($http){
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
                                     if(cvforr != undefined){
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
                //scope.vd.savedcv = false;
                var job_id = scope.vd.jobid;
            var cvowner = scope.vd.userid;
           scope.vd.checkreview(job_id, cvowner);
                var savebtn = angular.element("#lateR");
                var viewbtn = angular.element("#viewmore");
                savebtn.on('click', function(event){
                    scope.vd.cvSave();
                });
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
            vd.checkreview = function(job_id, cvowner){
                    var request = {
                      jobid : job_id  
                    };
                        jobMan.reviewCheck(request, function(results){
                        //console.log(results.data.cvbox);
                        if(results.data.cvbox !== null || results.data.cvbox !== undefined){
                            var cvdata = results.data.cvbox;
                           console.log(cvdata);
                             //var data = [];
                            for(var i = 0; i < cvdata.length; i++){
                                if(cvdata[i].review){
                                   //  vd.savedcv = true;
                                   
                                    var reviewdata = cvdata[i].review;
                                    //for(var j = 0; j < reviewdata.length; j++){
                                       // console.log(reviewdata.length);
                                    vd.reviewlength = reviewdata.length;
                                       // console.log(reviewlength);
                                    var itemNum = parseInt(reviewlength);
                                     console.log(itemNum);
                                        //if(itemNum){
                                           // console.log(reviewdata[j].reviewone);
                                           vd.savedcv = true;  
                                        //}else{
                                       // vd.savedcv = false;
                                   // }
                                    
                                //}
                               // vd.savedcv = false;
                            }
                        }
                        }
                    });
                }
            vd.cvSave = function(){
                 console.log("shit have just been clicked");
                 var request = {
                     cvdata : vd.applycard.userid,
                     job_id : vd.jobid
                 }
                 console.log(request);
                 jobMan.cvreview(request, function(results){
                     //console.log(results);
                     vd.savedcv = true;
                 });
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
            link : link
         
        };
        return directive; 
        
        function link(scope, element, attrs){
            
        }
        
    }
    
}())