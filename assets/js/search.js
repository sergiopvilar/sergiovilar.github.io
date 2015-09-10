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


jQuery(function() {


  function display_search_results(results) {
    var $search_results = $("#search_results");

    // Wait for data to load
    window.data.then(function(loaded_data) {

      // Are there any results?
      if (results.length) {
        $search_results.empty(); // Clear any old results

        // Iterate over the results
        results.forEach(function(result) {
          var item = loaded_data[result.ref];
          console.log(item);

          // Build a snippet of HTML for this result
          var appendString = '<li><a href="' + item.url + '">' + item.title + '</a></li>';

          // Add it to the results
          $search_results.append(appendString);
        });
      } else {
        $search_results.html('<li>No results found</li>');
      }
    });
  }
});
