var app = angular.module("tableApp", []);
// обьявляем это  контроллер чтобы мы потом могли создавать дополнительные экземпляры
app.controller("mainCtrl", function($scope){
    $scope.instanse = [{}];

    $scope.createInstanse = function () {
        $scope.instanse.push({});
    }
});

app.controller("myCtrl", function($scope, $http){
    var currentPage = 0,
        itemsPerPage = 50,
        dataList = [],
        dataListFilter = [],
        direction = {
            0:true,
            1:false,
            2:false,
            3:false,
            current:0
        };
    $scope.isClick = false;
    $scope.getData = getData;
    $scope.showPage = showPage;
    $scope.getCurrentPageNum = getCurrentPageNum;
    $scope.sort = sort;
    $scope.showRow = showRow;
    $scope.getMyFile = getMyFile;
    $scope.search = search;

    // через file api получаем файл и записываем в переменные, после запускаем рендер страницы
    function getMyFile(){
        var input = document.getElementById($scope.radioName);
        input.onchange = function(){
            var reader = new FileReader;
            reader.onload = function(e){

                try {
                    dataList = JSON.parse(e.target.result);
                }
                catch(err){
                    alert("Произошла ошибка при обработке файла, это не json");
                }
                $scope.header = dataList[0];
                dataList = dataList.slice(1);
                dataListFilter = dataList.slice();
                $scope.currentDataList = getPageLists();
                $scope.row = "";
                $scope.$apply();
            };
            reader.readAsText(this.files[0]);
        };
        input.click();
       
    }
    // получаем ключевую фразу и по ней ищем значения
    function search(searchValue) {
        var reg = new RegExp(searchValue, "gim");
        dataListFilter = dataList.filter(function(item){
            return item.toString().search(reg) !== -1;
        });
        $scope.currentDataList = getPageLists();
        $scope.row = "";
    }
    // записываем в скоуп значение строки таблицы
    function showRow(e) {
        $scope.row = e.currentTarget.innerText;
    }
    // делаем переход в блоке пагинации получаем в аргументах номер страницы таблицы
    function showPage(page) {
        $scope.currentDataList = getPageLists(page);
    }
    // делаем AJAX запрос на сервер для получания JSON данных
    function getData(url){
        $http.get("db/"+ url).then(function(res) {

            dataList = res.data;
            $scope.header = dataList[0];
            dataList = dataList.slice(1);
            dataListFilter = dataList.slice();
            $scope.row = "";
            $scope.currentDataList = getPageLists();
        }).catch(function() {
            alert("Ошибка загрузки данных");
        });
    }
    // считаем общее количесвто страниц в таблице, вызываем функцию каждый раз
    // когда обновляем фильтрованные данные
    function getPageLists(num){
        num = num || 0;
        var   first = itemsPerPage * num,
            last = first + itemsPerPage;
        currentPage = num;

        last = last > dataListFilter.length? dataListFilter.length : last;
        $scope.paginationList = getPaginationList();
 
        return dataListFilter.slice(first, last);
    }
    // формируем массив с номерами страниц таблыцы для блока пагинации
    function getPaginationList() {
        var pagesNum = Math.ceil(dataListFilter.length / itemsPerPage),
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
    // Возвращаем текущий номер страницы для задания элементы класса .active
    function getCurrentPageNum() {
        return currentPage;
    }
    // сотрируем таблицу по переданному номеру столбца
    function sort(column) {
        col = column;
        if (direction[col]){
            dataListFilter.sort(sortArrDown);
        } else{
            dataListFilter.sort(sortArrUp);
        }
        direction[col] = !direction[col];
        direction.current = col;
        $scope.isClick = true;
        $scope.direction = direction;
        $scope.currentDataList = getPageLists();
    }
    // сортируем по возрастанию
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
    //сортируем по убыванию
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
    // проверяем число ли передано
    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
});

app.directive('data', function () {
    return {
        restrict: 'EA',
        controller:'myCtrl',
        templateUrl: "data-component.html",
        link: function (scope, element, attrs) {
            scope.radioName = "data-" + Math.random().toString().slice(2);
        }
    };
});
