var app = angular.module("tableApp", []);

app.controller("mainCtrl", function($scope){
    $scope.instanse = [1];

    $scope.createInstanse = function () {
        $scope.instanse.push(Math.random());
    }
});

app.controller("myCtrl", function($scope, $http){
    var currentPage = 0,
        itemsPerPage = 20,
        col,
        dataList = [],
        direction = {
            0:true,
            1:false,
            2:false,
            3:false,
            current:0
        };
    $scope.isClick = false;
    $scope.myData = getData;
    $scope.showPage = showPage;
    $scope.getCurrentPageNum = getCurrentPageNum;
    $scope.sort = sort;
    $scope.showRow = showRow;

    
    function showRow(e) {
        $scope.row = e.currentTarget.innerText;
    }
    function showPage(page) {
        $scope.currentDataList = getPageLists(page);
    }
    function getData(url){
        $http.get("db/"+ url).then(function(res) {

            dataList = res.data;
            $scope.header = dataList[0];
            dataList = dataList.slice(1);
            $scope.currentDataList = getPageLists();
        }).catch(function() {
            alert("Ошибка загрузки данных");
        });
    };
    function getPageLists(num){
        var num = num || 0,
            first = itemsPerPage * num,
            last = first + itemsPerPage;
        currentPage = num;

        last = last > dataList.length? (dataList.length -1) : last;
        $scope.paginationList = getPaginationList();
        return dataList.slice(first, last);
    }
    function getTotalPageNum() {
        return Math.ceil(dataList.length / itemsPerPage);
    }
    function getPaginationList() {
        var pagesNum = getTotalPageNum(),
            paginationList =[];
        for(var i =0; i < pagesNum; i++){
            paginationList.push({
                pageText:i+1,
                pageLink:i
            });
        }
        if(pagesNum > 1) {
            return paginationList;
        }
    }
    function getCurrentPageNum() {
        return currentPage;
    }
    function sort(column) {
        col = column;
        if (direction[col]){
            dataList.sort(sortArrDown, col);
        } else{
            dataList.sort(sortArrUp, col);
        }
        direction[col] = !direction[col];
        direction.current = col;
        $scope.isClick = true;
        $scope.direction = direction;
        $scope.currentDataList = getPageLists();
    }
    function sortArrUp(a , b){
        a = a[col];
        b = b[col];
        if (isNumeric(a)){
            a = +a;
            b = +b;
        } else{
            a = a.toLowerCase();
            b = b.toLowerCase();
        }
        if(a > b) {
            return +1;
        }
        return -1;
    }
    function sortArrDown(a ,b){
        a = a[col];
        b = b[col];
        if (isNumeric(a)){
            a = +a;
            b = +b;
        } else{
            a = a.toLowerCase();
            b = b.toLowerCase();
        }
        if(a < b) {
            return +1;
        }
        return -1;
    }
    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
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