(function() {
	angular.module( 'movieApp' ).factory('dataService', function($http){
    var DATA_URL = 'https://spreadsheets.google.com/feeds/list/1WfPJ5pDCYsh8wq0f3so7kFtbW3UT4-OpSvI2t027zXk/o1a66w7/public/basic?alt=json';

    function getData(){
      return $http.get( DATA_URL ).then( function( res ) {
				return res.data;
			});
    }

    return {
      getData: getData
    }
  });

})();
