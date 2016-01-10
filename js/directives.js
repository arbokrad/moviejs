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

})();
