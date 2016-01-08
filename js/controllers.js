(function() {
	angular.module( 'movieApp' ).controller('movieCtrl', ['$scope', '$filter', '$http', MovieController]);

	function MovieController( $scope, $filter, $http ) {

		var dataURL = 'https://spreadsheets.google.com/feeds/list/1WfPJ5pDCYsh8wq0f3so7kFtbW3UT4-OpSvI2t027zXk/o1a66w7/public/basic?alt=json';
		var orderBy = $filter('orderBy');

		$scope.allMovies = [];
		$scope.ratingOptions = [];
		$scope.favCount = 0;
		$scope.showDetails = false;
		$scope.showFavoritesOnly = false;
		$scope.filterRating = 'ANY';
		$scope.searchQuery = '';

		// load data from the provided URL
		$scope.refresh = function() {
			$http.get( dataURL )
				.success( function(response) {
					var movieList = movieUtil.parse(response);
					$scope.allMovies = movieList.movies;
					$scope.ratingOptions = movieList.getRatingOptions();

					$scope.loaded = true;
				});
		};

		$scope.getMovie = function(id) {
			return $scope.allMovies[id];
		};

		$scope.search = function(movie) {
			var q = $scope.searchQuery.toLowerCase();

			if( movie.name.toLowerCase().indexOf(q) > -1 || movie.genre.toLowerCase().indexOf(q) > -1 ) {
				return true;
			}

			return false;
		};

		$scope.order = function( column ) {
			// if the same column is being re-sorted, reverse the sort order
			// otherwise, reset back to ascending sort order
			$scope.sortReverse = ($scope.sortColumn === column) ? !$scope.sortReverse : false;

			// perform the sort
			$scope.allMovies = orderBy(  $scope.allMovies, column, $scope.sortReverse );

			// persist the specified sort column
			$scope.sortColumn = column;
		};

		$scope.toggleDetails = function() {
			$scope.showDetails = !$scope.showDetails;
		};

		$scope.clearQuery = function() {
			$scope.searchQuery = '';
		};

		// set a movie as a favorite
		$scope.toggleFavorite = function(id) {
			var movie = $scope.getMovie(id);

			// toggle the actual movie
			movie.toggleFavorite();

			// keep track of the number of movies that have been favorited or un-favorited
			$scope.favCount = movie.favorite ? $scope.favCount++ : $scope.favCount--;

			// if there are no more favorites, and we are showing only favorites, show the full list instead
			if( $scope.favCount <= 0 && $scope.showFavoritesOnly ) {
				$scope.showFavoritesOnly = false;
			}
		};

		// show only movies that have been favorited
		$scope.toggleShowFavoritesOnly = function() {
			$scope.showFavoritesOnly = !$scope.showFavoritesOnly;
		};

		$scope.searchRT = function(term) {
			var baseURL = 'http://www.rottentomatoes.com/search/?search=%SEARCH_TERM%';

			var win = window.open( baseURL.replace( '%SEARCH_TERM%', term), '_blank' );
			win.focus();
		};

		$scope.searchIMDB = function(term) {
			var baseURL = 'http://www.imdb.com/find?ref_=nv_sr_fn&q=%SEARCH_TERM%&s=all';

			var win = window.open( baseURL.replace( '%SEARCH_TERM%', term), '_blank' );
			win.focus();
		};

		// init function
		$scope.init = function() {
			// populate data
			$scope.refresh();
			$scope.order( 'date', false );
		};
		$scope.init();
	};
})();
