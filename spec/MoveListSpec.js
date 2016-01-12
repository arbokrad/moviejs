describe( "MovieList", function(){
  var Movie = require("../js/movie.js");
  var MovieList = require("../js/movielist.js");
  var movieList;

  describe( "mutators", function(){

    beforeEach( function(){
      movieList = new MovieList();

      var movie = new Movie();
      movieList.addMovie( movie );
    });

    it( "should be able to have one or more movies added to it", function(){
      var movie = new Movie();
      movieList.addMovie( movie );
      expect( movieList.movies.length ).toEqual( 2 );

      movieList.addMovie( movie );
      expect( movieList.movies.length ).toEqual( 3 );
    });

    it( "should be able have its movie list cleared", function(){
      movieList.clearMovies();
      expect( movieList.movies.length ).toEqual( 0 );
    });

    it("should be able to have its genre options cleared", function(){
      movieList.clearGenres();
      expect( movieList.genreOptions.length ).toEqual( 0 );
    });

    it("should be able to have its rating options cleared", function(){
      movieList.clearRatings();
      expect( movieList.ratingOptions.length ).toEqual( 0 );
    });

    it("should be able to have all its data cleared", function(){
      movieList.clear();
      expect( movieList.movies.length ).toEqual( 0 );
      expect( movieList.genreOptions.length ).toEqual( 0 );
      expect( movieList.ratingOptions.length ).toEqual( 0 );
    });
  });

  describe( "metadata", function(){
    beforeEach( function(){
      movieList = new MovieList();

      var movie1 = new Movie();
      movie1.rating = '4.5';
      movie1.genre = 'Action';
      movieList.addMovie( movie1 );

      var movie2 = new Movie();
      movie2.rating = '3.0';
      movie2.genre = 'Adventure';
      movieList.addMovie( movie2 );

      var movie3 = new Movie();
      movie3.rating = '3.0';
      movie3.genre = 'Comedy';
      movieList.addMovie( movie3 );

      var movie4 = new Movie();
      movie4.rating = '1.0';
      movie4.genre = 'Comedy';
      movieList.addMovie( movie4 );

      movieList.loadRatingOptions();
      movieList.loadGenreOptions();
    });

    it("should generate a distinct list of ratings from its current list of movies and a 'show all' option", function(){

      // account for the 'show all' option
      expect( movieList.ratingOptions.length ).toEqual( 4 );
    });

    it( "should generate a correct list of ratings", function(){
      var ratings = [];
      for( var i = 0; i < movieList.ratingOptions.length; i++ ) {
        if( ratings.indexOf( movieList.ratingOptions[i].id) == -1 ) {
          ratings.push( movieList.ratingOptions[i].id );
        }
      }

      expect( ratings ).toContain( '3.0' );
      expect( ratings ).toContain( '4.5' );
      expect( ratings ).toContain( '1.0' );
      expect( ratings ).toContain( 'ANY' );
      expect( ratings ).not.toContain( '-1.0' );
    });

    it("should generate a distinct list of genres from its current list of movies and a 'show all' option", function(){
      // account for the 'show all' option
      expect( movieList.genreOptions.length ).toEqual( 4 );
    });

    it("should generate a correct list of genres", function(){
      var genres = [];
      for( var i = 0; i < movieList.genreOptions.length; i++ ) {
        if( genres.indexOf( movieList.genreOptions[i].id) == -1 ) {
          genres.push( movieList.genreOptions[i].id );
        }
      }

      expect( genres ).toContain( 'Action' );
      expect( genres ).toContain( 'Comedy' );
      expect( genres ).toContain( 'Adventure' );
      expect( genres ).toContain( 'ALL' );
      expect( genres ).not.toContain( 'Samoflange' );
    });
  });
});
