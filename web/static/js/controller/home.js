/*global ngNice*/
(function () {
    "use strict";

    ngNice.ngApp.controller("home_ctrl", ["$scope", "data", "$http", "$timeout", function ($scope, data, $http, $timeout) {

        $scope.input_keywords = "";

        $scope.js_search = function (keywords) {
            window.open("https://www.google.com/#q=site:ricefun.herokuapp.com+" + keywords);
            window.location.href = "https://www.google.com/#q=site:ricefun.herokuapp.com+" + keywords;
        };
    }]);

})();

