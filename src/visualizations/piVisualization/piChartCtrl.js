

/***
 * 
 * @param {type} param1
 * @param {type} param2
 */
App.controller('piChartCtrl', function($scope, $routeParams) {

    $scope.eKnight = _.filter(eKnightsData, function(eKnight) {
        return eKnight.slug === $routeParams.eKnight;
    });

});
