/**
 * Main Controller for the Search Manager.
 * Provides a search function with input a search query.
 */
(function () {

    var searchmodule = angular.module('pcApp.search.controllers', ['pcApp.search.services.search', 'pcApp.config']);

    var searchMainController = function ($scope, $location, searchclient, esFactory, API_CONF, $routeParams, $timeout) {
        //Init Selectable number of items per page
        $scope.itemsPerPageChoices = [
            { id: 10, name: '10'},
            { id: 20, name: '20'},
            { id: 30, name: '30'}
        ];

        //Init Sort Options
        $scope.sortOptions = [
            { id: 'Relevance', name: 'Relevance'},
            { id: 'Title', name: 'Title'},
            { id: 'Date', name: 'Date Created'}
        ];


        // Set Search Fire Event
        goSearch = function () {
            if ((typeof $scope.searchQuery == "undefined") || ($scope.searchQuery == "")) {
                searchText = ""
            }
            else {
                searchText = $scope.searchQuery
            }
            $scope.search(searchText);
        };

        //Define function that fires search when page changes
        $scope.pageChanged = function () {
            goSearch();
        };

        //Define function that fires search when Items Per Page selection box changes
        $scope.itemsPerPageChanged = function () {
            $scope.itemsperPage = $scope.selectedItemPerPage.id;
            goSearch();
        };

        //Define function that fires search when Sort By selection box changes
        $scope.sortItemsChanged = function () {
            $scope.sortByItem = $scope.selectedSortItem.id;
            goSearch();
        };


        //Define function that fires when Item Type is filtered (Metrics,Visualization, Events of Fuzzy Maps)
        $scope.filterSearchType = function (searchItemType) {
            $scope.searchItemType = searchItemType;
            switch (searchItemType) {
                case 'metric,visualization,event,fuzzymap':
                    $scope.searchItemTypeInfo = 'Search for metrics, visualizations,FCM models, events';
                    $scope.searchItemTypeInfoDropDown = 'All';
                    break;
                case 'metric':
                    $scope.searchItemTypeInfo = 'Search for metrics';
                    $scope.searchItemTypeInfoDropDown = 'Metrics';
                    break;
                case 'visualization':
                    $scope.searchItemTypeInfo = 'Search for visualizations';
                    $scope.searchItemTypeInfoDropDown = 'Visualizations';
                    break;
                case 'event':
                    $scope.searchItemTypeInfo = 'Search for events';
                    $scope.searchItemTypeInfoDropDown = 'Events';
                    break;
                case 'fuzzymap':
                    $scope.searchItemTypeInfo = 'Search for fuzzy maps';
                    $scope.searchItemTypeInfoDropDown = 'Fuzzy Maps';
                    break;
                case 'dataset':
                    $scope.searchItemTypeInfo = 'Search for datasets';
                    $scope.searchItemTypeInfoDropDown = 'Datasets';
                    break;
                default:
                    $scope.searchItemTypeInfo = 'Search for metrics, visualizations, FCM models, events, datasets';
            }
            //Perform search based on new Item Type
            //goSearch();
        };

        //Define Main search function
        $scope.search = function (searchQuery) {

            if (typeof searchQuery == 'undefined') {
                searchQuery = ""
            }
            ;
            //Get current result item offset depending on current page
            itemOffset = ($scope.currentPage - 1) * $scope.itemsperPage
            //Build Sort
            if ($scope.sortByItem == 'Relevance') {
                var sort = ["_score"];
            }
            else if ($scope.sortByItem == 'Title') {
                var sort = ["title.lower_case_sort"];
            }
            else {
                var sort = [
                    {"id": {"order": "desc"}},
                    "_score"
                ];
            }
            //Build query
            if (searchQuery != "") {
                var query = {
                    match: {
                        _all: searchQuery
                    }
                };
            }
            else {
                var query = {
                    match_all: {
                    }
                }
            }
            ;
            //Perform search through client and get a search Promise
            searchclient.search({
                index: API_CONF.ELASTIC_INDEX_NAME,
                type: $scope.searchItemType,
                body: {
                    size: $scope.itemsperPage,
                    from: itemOffset,
                    sort: sort,
                    query: query
                }
            }).then(function (resp) {
                //If search is successfull return results in searchResults objects
                $scope.searchResults = resp.hits.hits;
                $scope.searchResultsCount = resp.hits.total;
                $scope.totalItems = $scope.searchResultsCount;
            }, function (err) {
                console.trace(err.message);
            });

        };

        $scope.init = function () {
            //Set Pagination defaults
            //Default value for how many pages to show in the page navigation control
            $scope.paginationSize = 5;
            //Default values for how many items per page
            $scope.itemsperPage = 10;
            //Default sort
            $scope.sortByItem = 'Relevance';
            //Default current page
            $scope.currentPage = 1;


            var type = $routeParams.type;
            if (type) {
                $scope.filterSearchType(type);
            } else {
                //Default search item type
                $scope.searchItemType = 'metric,visualization,event,fuzzymap,dataset';
                $scope.searchItemTypeInfo = 'Search for metrics, visualizations, FCM models, events, datasets';
                $scope.searchItemTypeInfoDropDown = 'All';
            }

            //Default search query
            searchQuery = "";

            //Search for first time
            $scope.search(searchQuery);


        };
        // runs once per controller instantiation
        $scope.init();
    };


    searchmodule.controller("searchMainController", searchMainController);

}());
