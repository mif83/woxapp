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

    $scope.search = function (searchValue) {
        var reg = new RegExp(searchValue, "gim");

        $scope.currentDataList = getPageLists(0, dataList.filter(function(item){
            return item.toString().search(reg) !== -1;
        }));
        $scope.row = "";
    };
    

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
    function getPageLists(num, filterData){
        var num = num || 0,
            first = itemsPerPage * num,
            last = first + itemsPerPage,
            data = filterData || dataList;
        currentPage = num;

        last = last > data.length? (data.length -1) : last;
        $scope.paginationList = getPaginationList(data);
        return data.slice(first, last);
    }
    function getPaginationList(filterData) {
        var data = filterData || dataList;
            pagesNum = Math.ceil(data.length / itemsPerPage),
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
            scope.radioName = "data-" + Math.random().toString().slice(2);
        }
    };
});