(function() {
	angular.module( 'movieApp' ).directive( 'controlPanel', function() {
		return {
			restrict: 'E',
			templateUrl: 'template/control-panel.html'
		}
	});
	
	angular.module( 'movieApp' ).directive( 'movieActions', function() {
		return {
			restrict: 'E',
			templateUrl: 'template/actions.html'
		}
	});
	
})();