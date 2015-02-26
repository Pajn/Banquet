'use strict';

class PlaceDetail {
	constructor(gourmet) {
    this.place = {
      // NOTE: U+2007 Figure space to make element take correct size until data is ready
      name: ' ',
      description: ' ',
      rating: ' ',
      street: ' ',
    };
    gourmet.place(this.id)
      .then(place => this.place = place);
  }
}

export default angular.module('placeDetail', ['yaru22.angular-timeago'])
	.directive('placeDetail', function() {
		return {
			templateUrl: 'components/place-detail/place-detail.html',
			restrict: 'E',
			scope: {
				// Specify attributes where parents can pass and receive data here
				// Syntax name: 'FLAG'
				// FLAGS:
				// = Two way data binding
				// @ One way incoming expression (like placeholder)
				// & One way outgoing behaviour (like ng-click)
        id: '@'
			},
			bindToController: true,
			controller: PlaceDetail ,
			controllerAs: 'ctrl'
		};
	});