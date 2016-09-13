angular.module('musicEdit', ['ngRoute'])
.config(function($interpolateProvider) {
        $interpolateProvider.startSymbol('((');
        $interpolateProvider.endSymbol('))');
})
.config(($routeProvider) => {

  $routeProvider
  .when('/', {
    controller: 'ViewCtrl',
    templateUrl: 'static/partials/viewEntries.html'
  })
  .when('/new', {
    controller: 'NewCtrl',
    templateUrl: 'static/partials/newEntry.html'
  });
  // .when('/edit', {
  //   controller: 'ViewCtrl',
  //   templateUrl: 'static/partials/editAlbum.html'
  // });
})
.controller('ViewCtrl', function($timeout, $location, $scope, RfidFactory) { 

	$scope.allAlbums =  RfidFactory.getAllAlbums().then(function(dataResponse) {
		// console.log("dataResponse = ", dataResponse);
        $scope.allAlbums = dataResponse.data;
    });

    console.log("Loading me");
    $scope.showAlbums = true;
	$scope.artist = null;
	$scope.albumName = null;
	$scope.playlist = null;
	$scope.rfid = null;

    $scope.editAlbum = function(albumObject) {
    	// $location.path('/edit');
    	$scope.showAlbums = !$scope.showAlbums;
    	console.log("albumObject = ", albumObject);
    	$scope.artist = albumObject.artist;
    	console.log("$scope.artist = ",$scope.artist);
    	$scope.albumName = albumObject.title;
    	$scope.playlist = albumObject.playlist;
    	$scope.rfid = albumObject.rfid;
    	$timeout();
    };
})
.controller('NewCtrl', function($scope, RfidFactory) {

	$scope.lastRfid = RfidFactory.getLastRfid().then(function(lastScan) {
		// console.log("lastScan = ", lastScan);
		$scope.lastRfid = lastScan.data.rfid;
	});

})
// .controller('EditCtrl', function($scope, RfidFactory) {

// })
.factory('RfidFactory', function($http) {

	HOST = 'http://snorebook:8000';

	allAlbums = null;
	return {
	  getAllAlbums: () => {

	  	return $http({
	  	            method: 'GET',
	  	            url: HOST+"/api/albums/"
	  	        });
	  },
	  getLastRfid: () => {

	  	return $http({
	  		method: 'GET',
	  		url: HOST+"/api/currentRfid/1/"
	  	});
	  },
	  postNewAlbum:(albumInfo) => {
	    console.log("albumInfo = ", albumInfo);
	    return $http.post("http://10.0.0.179:8000/api/albums/", albumInfo)
	    .then(
	      res => console.log("res = ", res.data)
	    );
	  },
	};
});

