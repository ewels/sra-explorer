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
    $scope.searchResults = 0;
    $scope.sortType = '';
    
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
				var retmax = 100;
				var resultsURL = 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=sra&retmode=json&query_key='+querykey+'&WebEnv='+webenv+'&retstart='+retstart+'&retmax='+retmax;
				$scope.summaryURL = resultsURL;
				$http.get(resultsURL).success(function(response) {
					$scope.loadingSpinner = 0;
          $scope.searchResults = 1;
          $scope.results = [];
					// Parse the stupid embedded XML
					angular.forEach(response.result, function(value, key) {
						// Exp XML
						expXMLraw = $('<div/>').html(value.expxml).text();
						parser = new DOMParser();
						expXML = parser.parseFromString(expXMLraw,"text/xml");
						expJSON = xmlToJson(expXML);
						if(expJSON.Summary){
							exp = expJSON.Summary;
							value.expxml = exp;
						}
						
						// Runs
						runsXMLraw = $('<div/>').html(value.runs).text();
						parser = new DOMParser();
						runsXML = parser.parseFromString(runsXMLraw,"text/xml");
						runsJSON = xmlToJson(runsXML);
						if(runsJSON.Run){
							runs = runsJSON.Run.attributes;
							value.runs = runs;
						}
            
            // Add results to scope
            try {
              $scope.results.push({
                'title': value.expxml.Title.text,
                'accession': value.runs.acc,
                'platform': value.expxml.Platform.attributes.instrument_model,
                'total_bases': Math.round(value.runs.total_bases / 100000),
                'createdate': value.createdate,
              });
            } catch(e){
              console.log(e);
              console.log({key: value});
            }
            
					});
          
          // console.log(response.result);
          
				});
			});
		}
    
    // Toggle row selection checkboxes
    $scope.toggleRow = function($event, obj) {
      $event.stopPropagation();
      obj.selected = !obj.selected;
    }
    $scope.rowClicked = function(obj) {
      obj.selected = !obj.selected;
    };
    $scope.checkAll = function () {
      angular.forEach($scope.filteredResults, function (item) {
        item.selected = $scope.selectAll;
      });
    };
		
});


// Stolen frmo http://davidwalsh.name/convert-xml-json
// Changes XML to JSON
function xmlToJson(xml) {
	
	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["attributes"][attribute.nodeName] = attribute.value;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName.replace('#','');
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};