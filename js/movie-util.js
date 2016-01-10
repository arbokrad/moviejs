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
