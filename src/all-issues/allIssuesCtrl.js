App.filter('trust', function($sce) {
    return function(text) {
        return $sce.trustAsHtml(text);
    };
});

/**
 * @description Controller for the all issues page.
 * @namespace allIssuesCtrl 
 * @param {Object} $scope  dcgfdfh
 * @param {Object} HebUtill
 * @param {Object} commentsHandler
 * @param {Object} $window
 * @param {Object} arrayUtill
 * @param {Object} $http
 * @param {Object} $routeParams
 */
App.controller('allIssuesCtrl', function($scope, HebUtill, commentsHandler, $window, arrayUtill, $http, $routeParams) {

    $scope.relativizePath = $window.CONFIG.relativizePath;

    $scope.selectedLabels = new Array();
    $scope.stateControls = {
        showIssuesWithComments: true,
        showIssuesWithOutComments: true
    };

    document.title = "הסדנא לידע ציבורי";

    var http_request = $http({
        method: 'GET',
        url: "https://api.github.com/search/issues?per_page=100&sort=created&q=user:hasadna"
    });

    //http_request.error(function(data, status, headers, config) {});
    http_request.success(function(data, status, headers, config) {
        var labels = new Array();

        commentsHandler.treatComments(data.items);
        // Add title/body_lang  attribute  with hebrew Or english values - for text alignment.

        commentsHandler.addRapoAttribute(data.items);

        for (var i = 0; i < data.items.length; i ++) {// Collect the labels
            data.items[i].textLimit = 30;
            for (var j = 0; j < data.items[i].labels.length; j ++) {
                labels.push(data.items[i].labels[j]);
            }
        }

        $scope.issues = data.items;
        $scope.total_count = data.total_count;

        //        window.console.log(JSON.stringify(data));

        // Count labels and remove duplicates
        $scope.labels = arrayUtill.clusterNcount(labels, 'name');

        $scope.updateState = function() {
            //debugger;$scope.stateControls = $scope.stateControls;
            $scope.$apply();
        };

        $scope.setSelectedLabels = function() {
            var name = this.lbl.name;
            if (_.contains($scope.selectedLabels, name))
                $scope.selectedLabels = _.without($scope.selectedLabels, name);
            else
                $scope.selectedLabels.push(name);

            return false;
        };

        $scope.isChecked = function(name) {
            if (_.contains($scope.selectedLabels, name))
                return 'fa-check';
            return false;
        };
        /**
         * @description Load comments for issue
         * @param {MouseEvent} evt <a href="https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent">Mouse event</a>
         * @param {Object} issue <a href="https://developer.github.com/v3/issues/">Issue</a> object
         * @memberOf allIssuesCtrl
         */
        $scope.loadComments = function(evt, issue) {

            $scope.readMore(evt, issue);
            var http_request = $http({
                method: 'GET',
                url: issue.comments_url
            });
            http_request.success(function(data, status, headers, config) {
                var comments_list = new Array();

                /**
                 * @param {number} i
                 * @inner
                 */
                function loadComments(i) {
                    if (i === - 1){
                        commentsHandler.treatComments(comments_list);
                        //  window.console.clear();
                        // window.console.log(JSON.stringify(comments_list));
                        issue.comments_list = comments_list;
                        return;
                    }
                    var comment_request = $http({
                        method: 'GET',
                        url: data[i].url
                    });
                    comment_request.success(function(comment, status, headers, config) {
                        comments_list.push(comment);
                        i --;
                        loadComments(i);
                    });
                }

                loadComments(data.length - 1);
            });
        };
        /**
         * @description Show all the text of issue.
         * @param {MouseEvent} evt <a href="https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent">Mouse event</a>
         * @param {Object} issue <a href="https://developer.github.com/v3/issues/">Issue</a> object
         * @memberOf allIssuesCtrl
         */
        $scope.readMore = function(evt, issue) {
            issue.textLimit = 1000000;
        };

    });
});
