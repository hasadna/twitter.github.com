App.service("pieChartService",function($rootScope,$http,$window){var cache=null;this.getJSON=function(eKnight,cb){if(null!==cache)return void cb(cache);var req=$http.get($window.CONFIG.PATH+"data/"+eKnight.slug+"-pi.json");req.success(function(data){cache=data,cb(data)}),req.error(function(data,status){alert(status+" | bad")})}});