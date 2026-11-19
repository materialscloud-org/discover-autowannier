"use strict";

/**
 * @ngdoc controller
 * @name materialsCloudApp.controller:SCDMSelectionCtrl
 * @description
 *
 * It is the controller for the discover section: SCDM
 *
 * #### File location: app/scripts/controllers/discover/scdm/structureselection.js
 *
 * @requires $scope : scope object for this page.
 * @requires $state : to get the state (url) details.
 * @requires CONFIG : materials cloud configuration file.
 * @requires SCDMService : service to get data from the server.
 * @requires messageService : message service to update status/error messages.
 * Here util function is used to create windows/panels to display 2D/3D structures.
 * Here node service is used to get visualization data from server for selected element.
 * formats. Here it is used to visualize structure data in 2D and 3D formats.
 *
 */

angular.module("materialsCloudApp").controller("SCDMSelectionCtrl",
    ["$scope", "$state", "CONFIG", "SCDMService", "utils",
        "messageService", "graphService",
        function ($scope, $state, CONFIG, SCDMService, utils,
                  messageService, graphService) {

            var currentState = $state.current.name;

            if (currentState.indexOf("main.discover.scdm.dashboard.ptable") >= 0){
                $scope.$parent.selectedView = "ptableView";
            }

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:SCDMSelectionCtrl#compoundsJSON
             * @propertyOf materialsCloudApp.controller:SCDMSelectionCtrl
             *
             * @description
             *  json of all compounds received from server
             */
            $scope.compoundsJSON = null;

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:SCDMSelectionCtrl#selectedCompound
             * @propertyOf materialsCloudApp.controller:SCDMSelectionCtrl
             *
             * @description
             *  name of the selected compound.
             */
            $scope.selectedCompound = "";

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:SCDMSelectionCtrl#displayAll
             * @propertyOf materialsCloudApp.controller:SCDMSelectionCtrl
             *
             * @description
             *  boolean stating if the template will show all compounds in the selection list.
             */
             $scope.displayAll = true;

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:SCDMSelectionCtrl#getActiveCompounds
             * @methodOf materialsCloudApp.controller:SCDMSelectionCtrl
             *
             * @description
             * This function is used to extract only the names of active compounds
             * (keys of the dictionary) from its json. (works as dict.keys() function in python)
             *
             * @returns {object} list of names of active compounds.
             */
            function getActiveCompounds() {
                var compounds = [];
                if($scope.compoundsJSON.compounds){
                    $.each($scope.compoundsJSON.compounds, function (idx, cname) {
                        compounds.push(cname);
                    });
                }
                return compounds
            }

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:SCDMSelectionCtrl#displayPlot
             * @methodOf materialsCloudApp.controller:SCDMSelectionCtrl
             *
             * @description
             * This function defines and formats the compounds data required to display
             * in scatter plot.
             *
             * @returns {undefined} It doesn't return.
             */
            function displayPlot() {

                var plot_data_isolated = []; //BLUE
                var plot_data_entangled = []; // RED
                var parsed_data_isolated = [];
                var parsed_data_entangled = [];
                var series = [];
                var pointDisplayStr, displyName, xValue, yValue, thisParsedData;

                var xAxisInfo = {
                    "label": "&Delta;&Omega;/&Omega;<sub>MLWF</sub> (%)",
                    "min": 0,
                    "max": 100
                };

                var yAxisInfo = {
                    "label": "&Delta;&eta; (meV)",
                    "min": -10,
                    "max": 10
                };

                $.each($scope.compoundsJSON.table_data, function (idx, data) {

                    displyName = utils.getCompoundNamesWithSubscripts(data[0]);

                    xValue = 100. * (data[4] - data[7]) / data[7];
                    if (xValue === undefined)
                        xValue = NaN;

                    yValue = (data[5] - data[2]) * 1000.;
                    if (yValue === undefined)
                        yValue = NaN;

                    pointDisplayStr = "<b>Compound</b>: " + displyName +
                        "<br><b>Relative change in spread (%)</b>: " + parseFloat(xValue.toFixed(1)) +
                        "<br><b>Change in bands distance (meV)</b>: " + parseFloat(yValue.toFixed(2)) +
                        "<br><b>SCDM+MLWF &eta; (meV)</b>: " + parseFloat((data[5] * 1000).toFixed(2)) +
                        "<br><b>SCDM+MLWF &eta;<sub>max</sub> (meV)</b>: " + parseFloat((data[6] * 1000).toFixed(2)) +
                        "<br><b>SCDM+MLWF &Omega; (&#8491;<sup>2</sup>)</b>: " + parseFloat(data[7].toFixed(2)) +
                        "<br>Click to go to the detail page";


                    if (data[1] == "Isolated") {
                        plot_data_isolated.push([xValue, yValue]);
                        parsed_data_isolated.push({
                            "key": data[0],
                            "pointDisplayStr": pointDisplayStr
                        });
                    }
                    if (data[1] == "Entangled") {
                        plot_data_entangled.push([xValue, yValue]);
                        parsed_data_entangled.push({
                            "key": data[0],
                            "pointDisplayStr": pointDisplayStr
                        });
                    }
                });

                series = [
                    {
                        "name": "Isolated",
                        "color": "#7070F9",
                        "marker": { radius: 5, symbol: "circle"},
                        "data": plot_data_isolated
                    },
                    {
                        "name": "Entangled",
                        "color": "#FA775B",
                        "marker": { radius: 5, symbol: "circle"},
                        "data": plot_data_entangled
                    }
                ];

                var parsed_data = [parsed_data_isolated, parsed_data_entangled];

                var click_event = function(event) {
                    var pointIndex = event.point.index;
                    var seriesIndex = event.point.series.index;
                    var data = parsed_data[seriesIndex][pointIndex];
                    $scope.displayAvailableCompound(data.key);
                };

                var scatterPlot = graphService.highchartScatterPlot("scatterPlot", "", xAxisInfo,
                    yAxisInfo, series, parsed_data, click_event, true);
            }

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:SCDMSelectionCtrl#displayGrid
             * @methodOf materialsCloudApp.controller:SCDMSelectionCtrl
             *
             * @description
             * This function defines and formats the compounds data required to display
             * in table format.
             *
             * @returns {undefined} It doesn't return.
             */
            function displayGrid() {

                var data= [], row;

                $.each($scope.compoundsJSON.table_data, function (ridx, rdata) {
                    row = {};
                    row.key = rdata[0];
                    row['formula'] = utils.getCompoundNamesWithSubscripts(rdata[0]);
                    row['manifold_name'] = rdata[1];

                    row['SCDM_only_eta'] = parseFloat((rdata[2] * 1000).toFixed(1));
                    row['SCDM_only_eta_max'] = parseFloat((rdata[3] * 1000).toFixed(1));
                    row['SCDM_only_total_spread'] = parseFloat((rdata[4]).toFixed(2));

                    row['SCDM_MLWF_eta'] = parseFloat((rdata[5] * 1000).toFixed(1));
                    row['SCDM_MLWF_eta_max'] = parseFloat((rdata[6] * 1000).toFixed(1));
                    row['SCDM_MLWF_total_spread'] = parseFloat((rdata[7]).toFixed(2));

                    data.push(row);
                });

                $scope.gridData = data;

                if ( $.fn.dataTable.isDataTable( '#detailsTable' ) ) {
                    $scope.dataTableStructures = $('#detailsTable').DataTable();
                }
                else {
                    $scope.dataTableStructures = $('#detailsTable').DataTable({
                        data: data,
                        columns: [
                            {"data": "formula"},
                            {"data": "manifold_name"},
                            {"data": "SCDM_only_eta"},
                            {"data": "SCDM_only_eta_max"},
                            {"data": "SCDM_only_total_spread"},
                            {"data": "SCDM_MLWF_eta"},
                            {"data": "SCDM_MLWF_eta_max"},
                            {"data": "SCDM_MLWF_total_spread"}
                        ],
                        columnDefs: [
                            {
                                targets: [0, 1],
                                className: 'mdl-data-table__cell--non-numeric'
                            },
                            {"searchable": false, "targets": [1, 2, 3, 4, 5, 6, 7]}
                        ],
                        language: {search: "Search formula"}
                    });
                }

                $('#detailsTable tbody').on( 'click', 'tr', function () {
                    var selectedStructureData = $scope.dataTableStructures.row($(this)).data();
                    $scope.displayAvailableCompound(selectedStructureData.key);
                } );

            }

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:SCDMSelectionCtrl#displayAvailableCompound
             * @methodOf materialsCloudApp.controller:SCDMSelectionCtrl
             *
             * @description
             * When the compound is selected in list or table, this function is called
             * to go to its plotting state.
             *
             * @param {string} compound selected compound in list or table
             *
             * @returns {undefined} It doesn't return.
             */
            $scope.displayAvailableCompound = function (compound) {
                $state.go("main.discover.autowannier.details", {compound: compound});
            };

            /**
             * updates $scope.$parent.selectedView
             * in this way when hitting back button the variable is updated
             * and the behaviour of SCDMService.getcompounds() is correct
             *
             */
            var currentState = $state.current.name;
            if (currentState === "main.discover.autowannier.dashboard.plot"){
                $scope.$parent.selectedView = "plotView";
                $state.go("main.discover.autowannier.dashboard.plot");
            }
            else if (currentState.indexOf("main.discover.autowannier.dashboard.list") >= 0){
                $scope.$parent.selectedView = "listView";
                $state.go("main.discover.autowannier.dashboard.list");
            }
            else if (currentState.indexOf("main.discover.autowannier.dashboard.ptable") >= 0 ||
                currentState === "main.discover.2dtopo.dashboard"){
                $scope.$parent.selectedView = "ptableView";
                $state.go("main.discover.autowannier.dashboard.ptable");
            }

            /**
             * getcompounds method from SCDMService is called to get
             * list of all available compounds from server
             */

            $scope.dataLoading = true;

            SCDMService.getcompounds().then(
                // handle success
                function (response) {
                    $scope.compoundsJSON = response.data.data;
                    $scope.activeCompounds = getActiveCompounds();
                    $scope.dataLoading = false;

                    if($scope.$parent.selectedView == "listView")
                        displayGrid();
                    else if ($scope.$parent.selectedView == "plotView")
                        displayPlot();
                },
                // handle error
                function (response) {
                    messageService.updateMessage("Error while connecting to server!", CONFIG.MESSAGE_TYPE.ERROR, response);
                }
            );

        }

    ]
);