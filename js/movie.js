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

Movie.prototype.toggleFavorite = function(){
	this.favorite = !this.favorite;
};
