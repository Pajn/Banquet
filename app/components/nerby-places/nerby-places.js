'use strict';

import HeroOnClick from '../../scripts/directives/hero-on-click.js';
import Gourmet from '../../scripts/services/gourmet.js';

class NerbyPlaces {
	constructor(gourmet, observeOnScope, $scope) {
    this.gourmet = gourmet;
    this.places = [];
    this.search = '';

    observeOnScope($scope, 'ctrl.search')
      .debounce(250)
      .subscribe(this.filter.bind(this));

    navigator.geolocation.getCurrentPosition(position => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.filter();
    });
  }

  filter() {
    if (!this.latitude || !this.longitude) return;

    return this.gourmet.placesNear(this.latitude, this.longitude, this.search)
      .then(places => this.places = places);
  }
}

export default angular.module('nerbyPlaces', [
  'ngMaterial', 'rx', 'ui.router',
  Gourmet.name, HeroOnClick.name
])
	.directive('nerbyPlaces', function() {
		return {
			templateUrl: 'components/nerby-places/nerby-places.html',
			restrict: 'E',
			scope: {
				// Specify attributes where parents can pass and receive data here
				// Syntax name: 'FLAG'
				// FLAGS:
				// = Two way data binding
				// @ One way incoming expression (like placeholder)
				// & One way outgoing behaviour (like ng-click)
        test: '@'
			},
			bindToController: true,
			controller: NerbyPlaces ,
			controllerAs: 'ctrl'
		};
	});
