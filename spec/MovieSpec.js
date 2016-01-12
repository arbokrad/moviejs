describe( "Movie", function(){
  var Movie = require("../js/movie.js");
  var movie;

  beforeEach( function(){
    movie = new Movie();
  });

  it("should be able to switch from favorited to normal", function(){
    movie.favorite = true;
    movie.toggleFavorite();
    expect( movie.favorite ).toEqual( false );
  });

  it("should be able to switch from normal to favorited", function(){
    movie.favorite = false;
    movie.toggleFavorite();
    expect( movie.favorite ).toEqual( true );
  });
});
