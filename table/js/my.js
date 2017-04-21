var app = angular.module("tableApp", []);

app.directive('data', function () {
    return {
        restrict: 'EA',
        templateUrl: "data-component.html",
        link: function (scope, element, attrs) {
            console.log('directive')
        }
    };
});