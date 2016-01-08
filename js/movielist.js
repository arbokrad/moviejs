function MovieList() {
	this.movies = [];
}

MovieList.prototype.addMovie = function(movie){
	this.movies.push( movie );
};

MovieList.prototype.clearMovies = function() {
	this.movies = [];
};

MovieList.prototype.getDefaultRatingOption = function() {
	return {id:'ANY', label:'Any Rating'};
};

MovieList.prototype.getRatingOptions = function(){
	var rawRatings = [];
	var rawRatingCounts = [];

	// create the raw list of options and their counts
	for( var i = 0; i < this.movies.length; i++ ) {
		if( rawRatings.indexOf( this.movies[i].rating ) == -1 ) {
			rawRatings.push( this.movies[i].rating );
		}

		rawRatingCounts[this.movies[i].rating] = rawRatingCounts[this.movies[i].rating] ? rawRatingCounts[this.movies[i].rating]+1 : 1;
	}

	// put the ratings in order from best to worst
	rawRatings.sort().reverse();

	// create the real ratings object
	var finalRatings = [];
	for( var j = 0; j < rawRatings.length; j++ ) {
		var rating = {id:rawRatings[j], label: rawRatings[j] + ' Stars (' + rawRatingCounts[rawRatings[j]] + ')' };
		finalRatings.push( rating );
	}

	// add the default "show all" option
	finalRatings.unshift( this.getDefaultRatingOption() );

	return finalRatings;
};
