var app = angular.module("tableApp", []);

app.controller("myCtrl", function($scope, $http){
    $scope.arr = [1];
    $scope.myData = getData;
    function getData(url){
            $http.get("db/"+ url).then(function(res) {
                $scope.items=res.data;
            }).catch(function(err) {
                alert("Ошибка загрузки данных", err);
            });
    }
    $scope.render = function () {
        console.log("add");
        $scope.arr.push(Math.random());
    }
});
app.directive('data', function () {
    return {
        restrict: 'EA',
        templateUrl: "data-component.html",
        link: function (scope, element, attrs) {

        }
    };
});