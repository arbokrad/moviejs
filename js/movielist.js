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
