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

})();
