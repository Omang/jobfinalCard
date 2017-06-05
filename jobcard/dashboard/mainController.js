(function(){
    angular.module("JobCard").filter("cards", cards).service('mainTask', mainTask)
        .controller('main', main).directive('addJob', addJob)
        .directive('allCv', allCv).directive('allJob', allJob)
        .directive('loading', loadIcon);
    loadIcon.$inject = ['$http'];
    function loadIcon($http){
        var directive = {
            restrict : 'E',
            replace: true,
            templateUrl: 'jobcard/templates/dirtemplates/loadingicon.html',
            transclude : true,
            link : link
        }
        return directive;
        function link(scope, attrs, element){
        //  scope.isloading = function(){
             // return $http.pendingRequest.length > 0;
       //   }
          scope.$watch('loading', function(value){
              if(value){
                scope.loadingStatus = true;
              }else{
                scope.loadingStatus = false;
              }
          });
        }
    }
     function cards(){
        return function(jobcards){
          var loc = $scope.cvitems.district;
            for( var i = 0; i<jobcards.length; i++){
                
                if(jobcards[i] == loc){
                         
                         return jobcards[i];
                     }
            }
        };
        
    }
    
    
    mainTask.$inject = ['$http'];
    
     function mainTask($http){
        
        this.Cvone = function(request, callback){
            
            $http.post('api/get/cv', request).then(function(response){
                return callback(response);
            }).catch(function(error){
                return callback(error);
            });
        }
        this.jobCard = function(callback){
            $http.get('api/get/card').then(function(response){
                
                return callback(response.data);
            }).catch(function(error){
                return callback(error);
            });
        }
        this.addjobs = function(request, callback){
            $http.post('api/add/usercard', request).then(function(response){
                return callback(response);
            }).catch(function(error){
                return callback(error);
            });
        }
        this.joBox = function(request, callback){
            $http.post('api/jobox/checkbox', request).then(function(response){
                return callback(response);
            }).catch(function(error){
                console.log(error);
                return callback(error);
            });
        }
        this.likeBox = function(request, callback){
            $http.post('api/addlike/add', request).then(function(response){
               // console.log(response);
                return callback("reciving content");
            }).catch(function(error){
                return callback(error);
            });
        }
        this.Boxlike = function(request, callback){
            $http.post('api/likebox/check', request).then(function(response){
               // console.log(response);
                return callback(response);
            }).catch(function(error){
                return callback(error);
            });
        }
        this.dashrun = function(request, callback){
            $http.post('api/dash/updates', request).then(function(response){
                if(response.data !== undefined){
                    return callback(response.data);
                }else{
                    return callback(undefined);
                }
            }).catch();
        }
        
    }
    
    
    main.$inject  = ['$interval', '$scope', 'mainTask'];
    
     function main($interval, $scope, mainTask){
        if(localStorage['User-Data'] !== undefined){
            var user = JSON.parse(localStorage['User-Data']);
            var user_id = user.userid;
            $scope.userid = user_id;
            
            console.log(user);
            yourCv(user_id);
            rundash(true, user_id);
            Jobcard();
            
            function yourCv(userid){
                var request = {
                  userid: userid
                };
                $scope.loadingStatus = true;
               mainTask.Cvone(request, function(results){
                   var cvs = results.data;
                   $scope.cvdata = cvs;
                   console.log(cvs);
                   $scope.loadingStatus = false;
               }); 
            }
            
            
         function Jobcard(){
         $scope.loadingStatus = true;  
          $scope.alljobs =  mainTask.jobCard(function(result){
              if(result.length > 0){
                  $scope.alljobs = result;
                 console.log($scope.alljobs);
                 $scope.loadingStatus = false;
                  
              }else{
                  $scope.nojobs = true;
              }
              
          });
             
            
             
            }
            
            function rundash(initial, user_id){
                var request ={
                  userid: user_id  
                };
                mainTask.dashrun(request, function(results){
                     var addedjob = results.addedcards;
                    if(initial){
                        $scope.dashresults = addedjob.length;
                        console.log($scope.dashresults);
                    }else{
                        if(addedjob.length > $scope.dashresults){
                            $scope.newdash = addedjob.length;
                            console.log($scope.newdash);
                        }
                    }
                    
                });
            }
            $interval(function(){
                rundash(false, user_id);
                 $scope.difference = $scope.newdash - $scope.dashresults;
                console.log("this is working");
            }, 5000);
            
            
            
           
            
        }
        
    }
    
    function addJob(){
        return {
          restrict: 'A',
          
          scope:{
              job: '='   
          },
            replace: true,
            templateUrl: 'jobcard/templates/dirtemplates/job.html'
        };
    }
    
    function allCv(){
        return {
          restrict: 'A',
        scope: {
            cvdata: '='
        },
            replace: true,
            templateUrl: 'jobcard/templates/dirtemplates/cv.html',
            link: function(scope, element, attrs){
                scope.cvshow = true;
                 scope.editprofile = function(){
                scope.cvshow = false;
                     scope.fname = scope.cvdata.firstName;
               }
            
          }
        };
        
        
    }
    allJob.$inject = ['mainTask', '$uibModal'];
    
    function allJob(service, $uibModal){
        return{
          restrict: 'A',
          scope: {
              jobdata: '=',
              userid: '='
          },
        controller : controller,
         controllerAs : 'vf',
         bindToController : true,
            transclude: true,
        replace: true,
        templateUrl: 'jobcard/templates/dirtemplates/alljob.html',
        link: function(scope, element, attrs, ctrl){
            var datajob = scope.vf.jobdata;
            scope.viewmore = function(datajob){
                scope.vf.viewjob(datajob);
            }
            jobBox(scope.vf.jobdata._id, scope.vf.userid);
            likebox(scope.vf.jobdata._id, scope.vf.userid);
            function jobBox (jobid, userid){
                console.log("my user_id is:" + userid);
                var requestone = {
                    userid: jobid,
                    myId: userid
                };
                scope.$watch(function(){
                   return requestone; 
                }, function(requestone){
                    var request ={
                        userid : requestone.userid
                    }
                    var userid = requestone.myId;
                   service.joBox(request, function(results){
                    console.log(results.data.cardviews);
                    if(results.data !== undefined){
                        var jobview = results.data.cardviews;
                        for(var i=0; i<jobview.length; i++){
                            
                            if( jobview[i].cardview === userid){
                                console.log(jobview[i].cardview);
                                 scope.vf.noresults = true;
                            }else{
                              scope.vf.noresults = false;  
                            }
                    }
                        
                    }
                       
                }); 
                    
                });
               
            }
        function likebox(jobid, userid){
            var request ={
              jobId : jobid  
            };
            scope.$watch(request, function(){
                service.Boxlike(request, function(results){
                    //console.log(results);
                    if(results.data !== undefined){
                        var likesv = results.data.likeusers;
                        //console.log(likesv);
                        if(likesv !== undefined){
                            for(var i = 0; i< likesv.length; i++){
                                if(likesv[i].likes == userid){
                                    scope.vf.liked = true;
                                }else{
                                    scope.vf.liked = false;
                                }
                            }
                        }else{
                            scope.vf.liked = false;
                        }
                    }
                });
            });
        }
        scope.addlike = function(){
            var request = {
              jobid : scope.jobdata._id,
              currentUser: scope.userid
            };
            scope.$watch(function(){
                return request
            }, function(){
                service.likeBox(request, function(results){
                   // console.log(results);
                    scope.liked = true;
                });
            });
        }
            
        scope.addstuff = function(){
             var request = {
              addedCard : scope.jobdata._id,
              usercurrent: scope.userid,
              title: scope.jobdata.title,
              quli: scope.jobdata.qulification,
              des: scope.jobdata.Jdes,
              cloday: scope.jobdata.closing,
              dist: scope.jobdata.district
            };
            
            scope.$watch(function(){
                    return request;
            }, function(){
                 service.addjobs(request, function(results){
                if(results !== undefined){
                    console.log('we on z money');
                    scope.noresults = false;
                   
                }else{
                    console.log('bitch gat a problem');
                }
            });
                
            });
           
            
            
        }
    }
        };
    controller.$inject = ['$scope', '$uibModal'];  
        function controller($scope, $uibModal){
            var vf = this;
            vf.viewjob = function(jobdata){
                console.log("view more just been clicked");
               // vd.cvman = cvowner;
                $uibModal.open({
                    templateUrl: 'jobcard/templates/dirtemplates/viewjob.html',
                    controller: function($scope, $uibModalInstance){
                        $scope.title = jobdata.title;
                        $scope.qulification = jobdata.qulification;
                        $scope.education = jobdata.education;
                        $scope.Jdes = jobdata.Jdes;
                        $scope.district =  jobdata.district;
                        $scope.closeview = function(event){
                            $uibModalInstance.close('cancel');
                        }
                    }
                });
            }
        }
    }
    
}())