/*
SRA-Explorer
Angular JS Search Controller
Phil Ewels, 2014
*/


app.controller("searchCtrl", function($scope, $http) {
    $scope.searchText = "";
		$scope.numSearchResults = 0;
		$scope.summaryURL = 0;
		$scope.loadingSpinner = 0;
    $scope.search  = function() { searchSRA($scope.searchText); };
		
		/* Search Function */
		function searchSRA (string) {
			$scope.loadingSpinner = 1;
			var searchURL = 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=sra&usehistory=y&retmode=json&term='+string;
		  $http.get(searchURL).success(function(s_response) {
				$scope.numSearchResults = s_response.esearchresult.count;
				if(s_response.esearchresult.querytranslation){
					$scope.searchText = s_response.esearchresult.querytranslation;
				}
				var webenv = s_response.esearchresult.webenv;
				var querykey = s_response.esearchresult.querykey;
				var retstart = 0;
				var retmax = 10;
				var resultsURL = 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=sra&retmode=json&query_key='+querykey+'&WebEnv='+webenv+'"&retstart='+retstart+'&retmax='+retmax;
				$scope.summaryURL = resultsURL;
				$http.get(resultsURL).success(function(response) {
					$scope.loadingSpinner = 0;
					console.log(response);
					$scope.results = response;
				});
			});
		}
		
});