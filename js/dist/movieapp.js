(function() {
	angular.module( 'movieApp', ['ui.bootstrap','angularUtils.directives.dirPagination'] );
})();

(function() {
	angular.module( 'movieApp' ).controller('movieCtrl', ['$scope', '$filter', '$http', MovieController]);

	function MovieController( $scope, $filter, $http ) {

		var dataURL = 'https://spreadsheets.google.com/feeds/list/1WfPJ5pDCYsh8wq0f3so7kFtbW3UT4-OpSvI2t027zXk/o1a66w7/public/basic?alt=json';
		var orderBy = $filter('orderBy');
		var favCount = 0;

		$scope.movieList = {};
		$scope.showDetails = false;
		$scope.showFavoritesOnly = false;
		$scope.filterRating = 'ANY';
		$scope.filterGenre = 'ALL';
		$scope.searchQuery = '';

		// load data from the provided URL
		$scope.refresh = function() {
			$http.get( dataURL )
				.success( function(response) {
					$scope.movieList = movieUtil.parse(response);

					$scope.loaded = true;
				});
		};

		$scope.search = function(movie) {
			var q = $scope.searchQuery.toLowerCase();

			if( movie.name.toLowerCase().indexOf(q) > -1 ) {
				return true;
			}

			return false;
		};

		$scope.order = function( column ) {
			// if the same column is being re-sorted, reverse the sort order
			// otherwise, reset back to ascending sort order
			$scope.sortReverse = ($scope.sortColumn === column) ? !$scope.sortReverse : false;

			// perform the sort
			$scope.movieList.movies = orderBy(  $scope.movieList.movies, column, $scope.sortReverse );

			// persist the specified sort column
			$scope.sortColumn = column;
		};

		$scope.toggleDetails = function() {
			$scope.showDetails = !$scope.showDetails;
		};

		$scope.clearQuery = function() {
			$scope.searchQuery = '';
		};

		$scope.setFilterRating = function(val) {
			$scope.filterRating = val;
		};

		$scope.setFilterGenre = function(val) {
			$scope.filterGenre = val;
		};

		// set a movie as a favorite
		$scope.toggleFavorite = function(movie) {

			// toggle the value
			movie.toggleFavorite();

			// keep track of the number of movies that have been favorited or un-favorited
			favCount = movie.favorite === true ? favCount + 1 : favCount - 1;

			// if there are no more favorites, and we are showing only favorites, show the full list instead
			if( favCount <= 0 && $scope.showFavoritesOnly ) {
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

		// searches IMDB with the provided movie title
		$scope.searchIMDB = function(term) {
			var baseURL = 'http://www.imdb.com/find?ref_=nv_sr_fn&q=%SEARCH_TERM%&s=all';

			var win = window.open( baseURL.replace( '%SEARCH_TERM%', term), '_blank' );
			win.focus();
		};

		// init function
		$scope.init = function() {
			// populate data
			$scope.refresh();

			// set the proper ordering
			$scope.order( 'date', false );
		};
		$scope.init();
	}
})();

(function() {
	angular.module( 'movieApp' ).directive( 'movieNav', function() {
		return {
			restrict: 'E',
			templateUrl: 'template/nav.html'
		};
	});

	angular.module( 'movieApp' ).directive( 'movieActions', function() {
		return {
			restrict: 'E',
			templateUrl: 'template/actions.html'
		};
	});

	angular.module( 'movieApp' ).directive( 'pageHeader', function() {
		return {
			restrict: 'E',
			templateUrl: 'template/header.html'
		};
	});

	angular.module( 'movieApp' ).directive( 'pageFooter', function(){
		return {
			restrict: 'E',
			templateUrl: 'template/footer.html'
		};
	});

})();

(function() {
	angular.module( 'movieApp' ).filter( 'favorite' , function(){
		// when used with ng-repeat, the input parameter is implicitly passed in
		return function(input, showFavoritesOnly) {

			// if we arent showing only favorites, return everything
			if( !showFavoritesOnly ) {
				return input;
			} else {
				var results = [];

				// if the movie is a favorite, add it to the resultset
				angular.forEach( input, function( movie ) {
					if( movie.favorite ) {
						results.push( movie );
					}
				});

				return results;
			}
		};
	});

	angular.module( 'movieApp' ).filter( 'rating' , function(){
		return function(input, rating) {

			if( rating == 'ANY' ) {
				return input;
			} else {
				var results = [];

				angular.forEach( input, function(movie) {
					if( movie.rating == rating ) {
						results.push( movie );
					}
				});

				return results;
			}
		};
	});

	angular.module( 'movieApp' ).filter( 'genre' , function(){
		return function(input, genre) {

			if( genre == 'ALL' ) {
				return input;
			} else {
				var results = [];

				angular.forEach( input, function(movie) {
					if( movie.genre == genre ) {
						results.push( movie );
					}
				});

				return results;
			}
		};
	});

})();

// create the movieUtil module
// hides the private constants
// exposes the external functions while hiding the "private" internal functions
var movieUtil = function() {
	var DATE_CONST = 'date:';
	var MOVIE_CONST = 'movie_2:';
	var RATING_CONST = 'rating0-5:';
	var IMDB_CONST = 'imdb0-5:';
	var RUNTIME_CONST = 'runtime:';
	var YEAR_CONST = 'year:';
	var CATEGORY_CONST = 'category:';
	var VIEWED_ON_CONST = 'viewedon:';

	var DEFAULT_RATING_OPTION = {id:'ANY', label:'Any Rating'};

	// parse the given response
	function parse( response ) {

		var movieList = new MovieList();
		var entries = response.feed.entry;

		// grab each line, parse it, and push it into the master data array
		for( var i = 0; i < entries.length; i++ ) {
			var movieLine = entries[i].content.$t;
			var movie = parseMovieLine( movieLine );
			movie.id = i + 1;

			movieList.addMovie( movie );
		}

		movieList.loadRatingOptions();
		movieList.loadGenreOptions();

		return movieList;
	}

	// gross string parsing to create a movie object
	function parseMovieLine( movieLine ){
		var movie = new Movie();
		var start, end;

		// date
		start = movieLine.indexOf( DATE_CONST ) + 6;
		end = movieLine.indexOf( MOVIE_CONST ) - 2;

		// to make sure the parser gets the correct dates, extract the individual components
		var dateString = movieLine.substring( start, end );
		movie.date = new Date(dateString.substring( 0, 4 ), dateString.substring( 5, 7 ) -1, dateString.substring( 8, 10 ) );

		// name
		start = movieLine.indexOf( MOVIE_CONST ) + 9;
		end = movieLine.indexOf( RATING_CONST ) - 2;
		movie.name = movieLine.substring( start, end );

		// my rating
		start = movieLine.indexOf( RATING_CONST ) + 11;
		end = movieLine.indexOf( IMDB_CONST ) - 2;
		movie.rating = movieLine.substring( start, end );

		// imdb rating
		start = movieLine.indexOf( IMDB_CONST ) + 9;
		end = movieLine.indexOf( RUNTIME_CONST ) - 2;
		movie.imdb = movieLine.substring( start, end );

		// runtime
		start = movieLine.indexOf( RUNTIME_CONST ) + 9;
		end = movieLine.indexOf( YEAR_CONST ) - 2;
		movie.runtime = parseInt(movieLine.substring( start, end ));

		// release year
		start = movieLine.indexOf( YEAR_CONST ) + 6;
		end = movieLine.indexOf( CATEGORY_CONST ) - 2;
		movie.year = movieLine.substring( start, end );

		// genre
		start = movieLine.indexOf( CATEGORY_CONST ) + 10;
		end = movieLine.indexOf( VIEWED_ON_CONST ) - 2;
		movie.genre = movieLine.substring( start, end );

		// medium
		// if there are any further commas, we want to stop and leave any bogus extra data on some lines
		// otherwise just take the rest of the string
		start = movieLine.indexOf( VIEWED_ON_CONST ) + 10;
		if( movieLine.substring(start).indexOf(',') == -1 )  {
			movie.medium = movieLine.substring( start );
		} else {
			// grab the relevant string
			var mediumSnippet = movieLine.substring(start);
			movie.medium = mediumSnippet.substring( 0, mediumSnippet.indexOf( ',' ) );
		}

		return movie;
	}

	// expose the public functions and attributes
	return {
		parse: parse
	};
}();

function Movie() {
	this.id = -1;
	this.name = '';
	this.date = new Date();
	this.rating = '0.0';
	this.imdb =  '0.00';
	this.runtime = -1;
	this.year = '9999';
	this.genre = '';
	this.medium = '';
	this.favorite = false;
}

Movie.prototype.toggleFavorite = function() {
	this.favorite = !this.favorite;
};

try{
	module.exports = Movie;
} catch( e ){
	// do nothing
}

function MovieList() {
	this.movies = [];
	this.ratingOptions = [];
	this.genreOptions = [];
}

MovieList.prototype.addMovie = function(movie) {
	this.movies.push( movie );
};

MovieList.prototype.clear = function() {
	this.clearMovies();
	this.clearRatings();
	this.clearGenres();
};

MovieList.prototype.clearMovies = function() {
	this.movies = [];
};

MovieList.prototype.clearRatings = function() {
	this.ratingOptions = [];
};

MovieList.prototype.clearGenres = function() {
	this.genreOptions = [];
};


MovieList.prototype.getDefaultRatingOption = function() {
	return {id:'ANY', label:'Any Rating'};
};

MovieList.prototype.loadRatingOptions = function() {
	this.clearRatings();

	var rawRatings = [];
	var rawRatingCounts = [];

	// create the raw list of options and their counts
	for( var i = 0; i < this.movies.length; i++ ) {
		if( rawRatings.indexOf( this.movies[i].rating ) == -1 ) {
			rawRatings.push( this.movies[i].rating );
		}

		rawRatingCounts[this.movies[i].rating] = rawRatingCounts[this.movies[i].rating] ? rawRatingCounts[this.movies[i].rating] + 1 : 1;
	}

	// put the ratings in order from best to worst
	rawRatings.sort().reverse();

	// create the real ratings objects
	for( var j = 0; j < rawRatings.length; j++ ) {
		var rating = {id:rawRatings[j], label: rawRatings[j] + ' Stars (' + rawRatingCounts[rawRatings[j]] + ')' };
		this.ratingOptions.push( rating );
	}

	// add the default "show all" option
	this.ratingOptions.unshift( this.getDefaultRatingOption() );
};

MovieList.prototype.getDefaultGenreOption = function() {
	return {id:'ALL', label:'All'};
};

MovieList.prototype.loadGenreOptions = function() {
	this.clearGenres();

	var rawGenres = [];
	var rawGenreCounts = [];

	for( var i = 0; i < this.movies.length; i++ ) {
		if( rawGenres.indexOf( this.movies[i].genre ) == -1 ) {
			rawGenres.push( this.movies[i].genre );
		}

		rawGenreCounts[this.movies[i].genre] = rawGenreCounts[this.movies[i].genre] ? rawGenreCounts[this.movies[i].genre] + 1 : 1;
	}

	rawGenres.sort();

	for( var j = 0; j < rawGenres.length; j++ ) {
		var genre = {id:rawGenres[j], label: rawGenres[j] + ' (' + rawGenreCounts[rawGenres[j]] + ')' };
		this.genreOptions.push( genre );
	}

	this.genreOptions.unshift( this.getDefaultGenreOption() );
};

try{
	module.exports = MovieList;
} catch( e ){
	// do nothing
}
