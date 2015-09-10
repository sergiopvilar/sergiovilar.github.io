window.App.controller('SearchController', function($scope) {

  $scope.query = '';
  $scope.results = [];

  var loaded_data;
  var idx = lunr(function () {
    this.field('id');
    this.field('title', { boost: 10 });
    this.field('keywords');
    this.field('category');
  });

  var data = $.getJSON('/search_data.json');
  data.then(function(_data){
    loaded_data = _data;
    $.each(loaded_data, function(index, value){
      idx.add(
        $.extend({ "id": index }, value)
      );
    });
  });

  $scope.$watch('query', function() {
    var items = idx.search($scope.query);
    var res = [];
    items.forEach(function(item) {
      res.push(loaded_data[item.ref]);
    });
    $scope.results = res;
  });

  $scope.$watch('results', function() {
    console.log($scope.results);
  });

});
