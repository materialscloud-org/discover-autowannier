"use strict";

/**
 * @ngdoc controller
 * @name materialsCloudApp.controller:SCDMDetailsCtrl
 * @description
 *
 * It is the controller for the discover section: SCDM
 *
 * #### File location: app/scripts/controllers/discover/scdm/structuredetails.js
 *
 * @requires $scope : scope object for this page.
 * @requires $state : to get the state (url) details.
 * @requires $timeout : used to add delay.
 * @requires CONFIG : materials cloud configuration file.
 * @requires SCDMService : service to get data from the server.
 * @requires messageService : message service to update status/error messages.
 * @requires utils : it contains all the helper functions required in materials cloud app.
 * Here util function is used to get processed formula.
 * @requires nodeService : it provides the service to get node data from server.
 * Here node service is used to get visualization data from server for selected element.
 * @requires nodeVisualization : it provides the service to visualize node data in different
 * formats. Here it is used to visualize structure data in 2D and 3D formats.
 * @requires $window : the resize event of $window is used to bind resizing of 2D, 3D structure visualizations.
 * @requires ENV: to get "rest end point" environment variable
 * @requires $location: page location handler
 * @requires $anchorScroll: to scroll the anchor to the specific page location
 *
 */

angular.module("materialsCloudApp").controller("SCDMDetailsCtrl",
    ["$scope", "$state", "$timeout", "CONFIG", "SCDMService",
        "messageService", "utils", "nodeService", "nodeVisualization", "$window", "ENV",
        '$location', '$anchorScroll',
        function ($scope, $state, $timeout, CONFIG, SCDMService,
                  messageService, utils, nodeService, nodeVisualization, $window, ENV,
                  $location, $anchorScroll) {

            $scope.MANIFOLD_NAME_MAPPING = {
                'valence_only': 'Isolated',
                'with_conduction': 'Entangled'
            };

            var KPOINT_MESH = '0.2';

            var METADATA = [
                {
                    "key": "eta",
                    "label": "average bands distance &eta; (meV)",
                    "multiplier": 1000,
                    "noOfDigits": 1
                },
                {
                    "key": "eta_max",
                    "label": "max bands distance &eta;<sub>max</sub> (meV)",
                    "multiplier": 1000,
                    "noOfDigits": 1
                },
                {
                    "key": "total_spread",
                    "label": "total spread &Omega; (&#8491;<sup>2</sup>)",
                    "multiplier": 1,
                    "noOfDigits": 2
                }

            ];

            $scope.METHODS = [
                {
                    "key": "SCDM_only",
                    "label": "SCDM only"},
                {
                    "key": "SCDM+MLWF",
                    "label": "SCDM+MLWF"
                },
                {
                    "key": "random+MLWF",
                    "label": "random+MLWF"
                }
            ];

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:SCDMDetailsCtrl#selectedCompound
             * @propertyOf materialsCloudApp.controller:SCDMDetailsCtrl
             *
             * @description
             *  selected compound: name of the compound passed as a parameter in state url
             */
            $scope.selectedCompound = $state.params.compound;

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:SCDMDetailsCtrl#compoundDisplayName
             * @propertyOf materialsCloudApp.controller:SCDMDetailsCtrl
             *
             * @description
             *  display name of the selected compound
             */
            $scope.compoundDisplayName = "";

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:SCDMDetailsCtrl#selectedCompoundJson
             * @propertyOf materialsCloudApp.controller:SCDMDetailsCtrl
             *
             * @description
             *  it is a list of all info dicts of the selected compound. It is possible
             *  to have more than 1 info dicts for selected compound in current scenario.
             */
            $scope.selectedCompoundJson = [];

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:SCDMDetailsCtrl#displayedCompoundJson
             * @propertyOf materialsCloudApp.controller:SCDMDetailsCtrl
             *
             * @description
             *  json of the selected/displayed compound. It is possible to have more
             *  than 1 info dicts for selected compound. So currently we are always
             *  displaying the first entry.
             */
            $scope.displayedCompoundJson = {};

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:SCDMDetailsCtrl#compoundDataLoading
             * @propertyOf materialsCloudApp.controller:SCDMDetailsCtrl
             *
             * @description
             *  A boolean value to tell if compound data is fully loaded
             */
            $scope.compoundDataLoading = true;


            /**
             * @ngdoc
             * @name materialsCloudApp.controller:SCDMDetailsCtrl#compoundInfo
             * @propertyOf materialsCloudApp.controller:SCDMDetailsCtrl
             *
             * @description
             *  It contains the displayed compound information processed/defined in this file
             */
            $scope.compoundInfo = {};

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:SCDMDetailsCtrl#structure2dInfo
             * @propertyOf materialsCloudApp.controller:Topo2SCDMDetailsCtrlDDetailsCtrl
             *
             * @description
             *  It contains the information for 2d structure
             */
            $scope.structure2dInfo = {};

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:SCDMDetailsCtrl#structure2dAttributesLoading
             * @propertyOf materialsCloudApp.controller:SCDMDetailsCtrl
             *
             * @description
             *  A boolean value to tell if 2D structure attributes data is fully loaded
             */
            $scope.structure2dAttributesLoading = true;

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:SCDMDetailsCtrl#uuidTooltipText
             * @propertyOf materialsCloudApp.controller:SCDMDetailsCtrl
             *
             * @description
             *  It is the starting message of the uuid tooltip:
             *
             *  Message that will shown on tooltip is:
             *  "Browse provenance <br> " + uuid
             */
            $scope.uuidTooltipText = "Browse provenance <br> ";

            var endPointKey = CONFIG.REST_API.EXPLORE_PROFILES["scdm"]["ENV_KEY"];
            $scope.ProfileRestEndPoint = ENV[endPointKey];
            $scope.restApiVersion = "V4";

            $scope.getDictLength = function (dictObj) {
                if(dictObj !== undefined)
                    return Object.keys(dictObj).length;
                return -1;
            };

            /**
             * Toggle the interaction of visualizer on double click event
             * @param divId: Html id of visualizer div
             * @param overlayId: Html id of overlay div
             * @param assignedFlag: Boolean value used to toggle
             * @returns {*}: updated boolean value used for toggle
             */
            function toggleInteraction(divId, overlayId, assignedFlag) {
                if (assignedFlag){
                    // enable interaction here
                    $("#"+overlayId).css("display", "none");
                    $("#"+divId).css('pointer-events', 'auto');
                    assignedFlag = false;
                }
                else{
                    // disable interaction here
                    $("#"+overlayId).css("display", "table");
                    $("#"+divId).css('pointer-events', 'none');
                    assignedFlag = true;
                }
                return assignedFlag;
            }

            $scope.structureViewer = null;
            $scope.jsmolAppletName = "jmolApplet2d";
            $scope.crystalXsf = "";
            $scope.supercell = [2, 2, 2];

            /**
             * Toggle the interaction of structure visualizer on double click event
             */
            $scope.enableStrInteraction = true;
            $scope.toggleStrVisInteraction = function(){
                $scope.enableStrInteraction = toggleInteraction("crystal2d", "str-overlay", $scope.enableStrInteraction);
            };

            $scope.toggleImageTab = function (method, tabId, methodNo, meshNo) {
                var bandUuid;

                for (var i = 0; i < $scope.bandTabJson[method]["tabJson"].length; i++) {
                    if (methodNo == i) {
                        $scope.bandTabJson[method]["tabJson"][i]["isDisplay"] = true;

                        for (var j = 0; j < $scope.bandTabJson[method]["tabJson"][i].children.length; j++) {
                            if(meshNo == j) {
                                $scope.bandTabJson[method]["tabJson"][i]["children"][j]["isDisplay"] = true;
                                $scope.bandTabJson[method]["defaultMeshIdx"][methodNo] = meshNo;
                                bandUuid = $scope.bandTabJson[method]["tabJson"][i]["children"][j]["uuid"];
                                displayBandPlot(method, methodNo, meshNo);
                            }
                            else
                                $scope.bandTabJson[method]["tabJson"][i]["children"][j]["isDisplay"] = false;
                        }
                    }
                    else
                        $scope.bandTabJson[method]["tabJson"][i]["isDisplay"] = false;
                }

            };

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:SCDMDetailsCtrl#changeBandPath
             * @methodOf materialsCloudApp.controller:SCDMDetailsCtrl
             *
             * @description
             * It updates the band graph for user input.
             *
             * @returns {undefined} It doesn't return.
             */
            $scope.changeBandPath = function(bandType, methodIdx, meshIdx, objName) {

                var plotInfo = $scope.bandTabJson[bandType].tabJson[methodIdx].children[meshIdx][objName];
                var textBoxId = plotInfo.pathTextBoxId;
                var theTextBox = document.getElementById(textBoxId);
                var string = theTextBox.value;
                var finalPath = getPathArrayFromPathString(string);
                plotInfo.plotObj.updateBandPlot(finalPath);
            };

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:SCDMDetailsCtrl#resetDefaultBandPath
             * @methodOf materialsCloudApp.controller:SCDMDetailsCtrl
             *
             * @description
             * It updates the band graph for to its default path.
             *
             * @returns {undefined} It doesn't return.
             */
            $scope.resetDefaultBandPath = function(bandType, methodIdx, meshIdx, objName) {
                var plotInfo = $scope.bandTabJson[bandType].tabJson[methodIdx].children[meshIdx][objName];
                var textBoxId = plotInfo.pathTextBoxId;
                var theTextBox = document.getElementById(textBoxId);
                theTextBox.value = getPathStringFromPathArray(plotInfo.jsondata.path);
                plotInfo.plotObj.updateBandPlot(plotInfo.jsondata.path, true);
            };

            //It updates the band graph for to its default path.
            $scope.resetZoomPan = function(bandType, methodIdx, meshIdx, objName) {
                var plotInfo = $scope.bandTabJson[bandType].tabJson[methodIdx].children[meshIdx][objName];
                // Note: call the resetZoom of he plotObj, not directly the call of the plotObj.myChart
                plotInfo.plotObj.resetZoom();
            };

            // Swiches to drag-to-zoom mode
            $scope.dragToZoom = function(bandType, methodIdx, meshIdx, objName) {
                var zoombtnId = bandType + "_" + methodIdx + "_" + meshIdx + "_zoombtn";
                var panbtnId = bandType + "_" + methodIdx + "_" + meshIdx + "_panbtn";

                $("#"+zoombtnId).addClass('btn-primary');
                $("#"+zoombtnId).removeClass('btn-default');
                $("#"+panbtnId).addClass('btn-default');
                $("#"+panbtnId).removeClass('btn-primary');

                var plotInfo = $scope.bandTabJson[bandType].tabJson[methodIdx].children[meshIdx][objName];
                plotInfo.plotObj.myChart.options.pan = {
                    enabled: false,
                    mode: "y"
                };
                plotInfo.plotObj.myChart.options.zoom = {
                    enabled: true,
                    mode: "y",
                    drag: true
                };
                plotInfo.plotObj.myChart.update();
            };

            // Swiches to drag-to-zoom mode
            $scope.dragToPan = function (bandType, methodIdx, meshIdx, objName) {
                var zoombtnId = bandType + "_" + methodIdx + "_" + meshIdx + "_zoombtn";
                var panbtnId = bandType + "_" + methodIdx + "_" + meshIdx + "_panbtn";

                $("#"+panbtnId).addClass('btn-primary');
                $("#"+panbtnId).removeClass('btn-default');
                $("#"+zoombtnId).addClass('btn-default');
                $("#"+zoombtnId).removeClass('btn-primary');

                var plotInfo = $scope.bandTabJson[bandType].tabJson[methodIdx].children[meshIdx][objName];
                plotInfo.plotObj.myChart.options.pan = {
                    enabled: true,
                    mode: "y"
                };
                plotInfo.plotObj.myChart.options.zoom = {
                    enabled: false,
                    mode: "y",
                    drag: true
                };
                plotInfo.plotObj.myChart.update();
            };


            $scope.displaywithConductionBandPlots = null;
            $scope.displayValenceOnlyBandPlots = null;

            $scope.DFTUuid = null;
            $scope.DFTBandLinkTooltip = null;
            $scope.DFTBandLink = null;
            $scope.DFTBandData = null;

            $scope.bandInfoValenceOnlyLink = null;
            $scope.bandInfoValenceOnlyLinkTooltip = null;
            $scope.bandInfoValenceOnlySubTitle = null;

            $scope.bandInfoWithConductionLink = null;
            $scope.bandInfoWithConductionLinkTooltip = null;
            $scope.bandInfoWithConductionSubTitle = null;

            $scope.withcDFTBandPlotLoading = true;
            $scope.valenceOnlyBandDataLoading = true;
            $scope.withConductionBandDataLoading = true;
            $scope.plots = {};

            function displayBandPlot(bandType, methodIdx, meshIdx) {

                var bandInfo = {};
                var prefix = methodIdx + "_" + meshIdx + "_";
                bandInfo.meta = $scope.bandTabJson[bandType].tabJson[methodIdx].children[meshIdx];
                var subTitle = "";

                // create plot subtitle
                subTitle = "&eta;: ";
                if (bandInfo.meta.eta != undefined)
                    subTitle += parseFloat((bandInfo.meta.eta * METADATA[0].multiplier).toFixed(METADATA[0].noOfDigits)) + " meV;";
                else
                    subTitle += "N/A";
                subTitle += " &eta;<sub>max</sub>: ";
                if (bandInfo.meta.eta_max != undefined)
                    subTitle += parseFloat((bandInfo.meta.eta_max * METADATA[1].multiplier).toFixed(METADATA[1].noOfDigits)) + " meV;";
                else
                    subTitle += "N/A";
                subTitle += " &Omega;: ";
                if (bandInfo.meta.total_spread != undefined)
                    subTitle += parseFloat((bandInfo.meta.total_spread * METADATA[2].multiplier).toFixed(METADATA[2].noOfDigits)) + " &#8491;<sup>2</sup>.";
                else
                    subTitle += "N/A.";

                if (bandType == "valence_only") {
                    $scope.valenceOnlyBandDataLoading = true;
                    bandInfo.plotDivId = prefix + "vonlyBand";
                    bandInfo.pathTextBoxId = prefix + "vonlyBandPathTextBox";
                    $scope.bandInfoValenceOnlyLink = utils.getExploreUrl("autowannier", bandInfo.meta.uuid, 'NODE');
                    $scope.bandInfoValenceOnlyLinkTooltip = $scope.uuidTooltipText + bandInfo.meta.uuid;
                    $scope.bandInfoValenceOnlySubTitle = subTitle;
                }

                else if (bandType == "with_conduction") {
                    $scope.withConductionBandDataLoading = true;
                    bandInfo.plotDivId = prefix + "withcBand";
                    bandInfo.pathTextBoxId = prefix + "withcBandPathTextBox";
                    $scope.bandInfoWithConductionLink = utils.getExploreUrl("autowannier", bandInfo.meta.uuid, 'NODE');
                    $scope.bandInfoWithConductionLinkTooltip = $scope.uuidTooltipText + bandInfo.meta.uuid;
                    $scope.bandInfoWithConductionSubTitle = subTitle;
                }

                // get band data for given uuid from aiida using rest api endpoint
                nodeService.getMetadata("NODE", bandInfo.meta.uuid, "DERIVED_PROPERTIES", $scope.ProfileRestEndPoint)
                    .then(
                        // handle success
                        function (response) {

                            //change the corresponding flag once data is available
                            if (bandType == "valence_only")
                                $scope.valenceOnlyBandDataLoading = false;
                            else if (bandType == "with_conduction")
                                $scope.withConductionBandDataLoading = false;

                            bandInfo.jsondata = response.data.data[CONFIG.DATA_PATH[$scope.restApiVersion]["DERIVED_PROPERTIES"]].bands;


                            // display band graph
                            $timeout(function () {

                                bandInfo.yLimits = getYLimits(bandInfo.jsondata.paths);

                                var theBandPlot = new BandPlot(bandInfo.plotDivId, $scope.fermiEnergy, {ymin: bandInfo.yLimits.ymin - 1, ymax: bandInfo.yLimits.ymax + 1});

                                theBandPlot.addBandStructure(bandInfo.jsondata, ['#B2182B', '#B2182B', '#B2182B']);
                                theBandPlot.addBandStructure($scope.DFTBandData, ['#444444', '#444444', '#444444']);

                                theBandPlot.updateBandPlot();

                                var theTextBox = document.getElementById(bandInfo.pathTextBoxId);
                                theTextBox.value = getPathStringFromPathArray(theBandPlot.getDefaultPath());

                                var helperString = "Use - to define a segment<br>Use | to split the path.<br>Valid point names:<br>";
                                var validPoints = getValidPointNames(theBandPlot.allData);
                                helperString += validPoints.join(', ');

                                $(theTextBox).data('bs.tooltip', false).tooltip({title: helperString, html: true})
                                    .tooltip('show'); // Open the tooltip

                                bandInfo.plotObj = theBandPlot;

                                $scope.bandTabJson[bandType].tabJson[methodIdx].children[meshIdx].bandInfo = bandInfo;
                            });

                        },
                        // handle error
                        function (response) {
                            messageService.updateMessage("Error while connecting to server!", CONFIG.MESSAGE_TYPE.ERROR, response);
                            return {};
                        });

                function getYLimits(data){

                    var ymin, ymax, currentMin, currentMax, segmentValues, tmp;

                    $.each(data, function (segmentIdx, segment) {
                        segmentValues = segment.values;
                        $.each(segmentValues, function (bandIdx, band) {

                            // subtract fermi energy
                            if($scope.fermiEnergy){
                                tmp = band.map( function(value) {
                                    return value - $scope.fermiEnergy;
                                } );
                                band = tmp;
                            }

                            currentMin = Math.min.apply(Math, band);
                            currentMax = Math.max.apply(Math, band);

                            if (ymin === undefined)
                                ymin = currentMin;
                            else if (ymin > currentMin)
                                ymin = currentMin;

                            if (ymax === undefined)
                                ymax = currentMax;
                            else if (ymax < currentMax)
                                ymax = currentMax;
                        });
                    });

                    return { ymin: Math.round(ymin), ymax: Math.round(ymax)};
                }

            }
            function getTabJson(data) {
                var tabJson = [], displayedBandPlot = [], defaultMeshIdx=[];
                var methodTab, meshTab, metadataTab, methodCounter = 0, meshCounter = 0;

                // create tabs
                $.each($scope.METHODS, function (methodIdx, methodInfo) {
                    if (data[methodInfo.key] !== undefined){

                        meshCounter = 0;

                        methodTab = {};
                        methodTab.id = methodCounter;
                        methodTab.key = methodInfo.key.replace("+","_");
                        methodTab.label = methodInfo.label;
                        methodTab.children = [];

                        if (methodInfo.key == "SCDM+MLWF") {
                            methodTab.isDisplay = true;
                            displayedBandPlot.push(methodCounter)
                        }
                        else
                            methodTab.isDisplay = false;

                        $.each(data[methodInfo.key], function (meshId, meshInfo) {
                            meshTab = {};
                            meshTab.id = meshCounter;
                            meshTab.key = meshId;
                            meshTab.label = meshId;
                            meshTab.uuid = meshInfo["bands_node_uuid"];
                            meshTab.eta = meshInfo.eta;
                            meshTab["eta_max"] = meshInfo["eta_max"];
                            meshTab["total_spread"] = meshInfo["total_spread"];
                            meshTab.children = [];
                            meshTab.bandPlot = "";

                            if(meshId == KPOINT_MESH) {
                                defaultMeshIdx.push(meshCounter);
                                meshTab.isDisplay = true;

                                if(methodTab.isDisplay)
                                    displayedBandPlot.push(meshCounter);
                            }
                            else
                                meshTab.isDisplay = false;

                            methodTab.children.push(meshTab);
                            meshCounter += 1;
                        });

                        tabJson.push(methodTab);
                        methodCounter += 1;
                    }
                });
                return {tabJson : tabJson, defaultMeshIdx: defaultMeshIdx, displayedBandPlot: displayedBandPlot};
            }

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:SCDMDetailsCtrl#createBandTabMenu
             * @methodOf materialsCloudApp.controller:SCDMDetailsCtrl
             *
             * @description
             * It creates the tab view for every manifold option and displays band plot
             *
             * @returns {undefined} It doesn't return.
             */
            function createBandTabMenu() {

                $scope.bandTabJson = {};

                if ($scope.displayedCompoundJson["bands"]["Wannier"]["valence_only"] !== undefined){
                    $scope.displayValenceOnlyBandPlots = true;
                    $scope.bandTabJson["valence_only"] = getTabJson($scope.displayedCompoundJson["bands"]["Wannier"]["valence_only"]);
                }
                else
                    $scope.displayValenceOnlyBandPlots = false;

                if ($scope.displayedCompoundJson["bands"]["Wannier"]["with_conduction"] !== undefined) {
                    $scope.displaywithConductionBandPlots = true;
                    $scope.bandTabJson["with_conduction"] = getTabJson($scope.displayedCompoundJson["bands"]["Wannier"]["with_conduction"]);
                }
                else
                    $scope.displaywithConductionBandPlots = false;
            }

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:SCDMDetailsCtrl#display2dStructure
             * @methodOf materialsCloudApp.controller:SCDMDetailsCtrl
             *
             * @description
             * It gets the metadata (visualization data and node attributes) for 2d structure
             * and display it using respective handlers
             *
             * @returns {undefined} It doesn't return.
             */
            function display2dStructure() {
                // request data to display 2d structure
                $scope.structure2dInfo.uuid = $scope.displayedCompoundJson.structure_uuid;
                $scope.structure2dInfo.link = utils.getExploreUrl("autowannier", $scope.structure2dInfo.uuid, 'NODE');
                $scope.structure2dInfo.linkTooltip = $scope.uuidTooltipText + $scope.structure2dInfo.uuid;

                nodeService.getMetadata("NODE", $scope.structure2dInfo.uuid, "VISUALIZATION_XSF", $scope.ProfileRestEndPoint)
                    .then(function (response) {

                            $scope.structure2dVisDataLoading = false;

                            //get metadata
                            $timeout(function () {
                                $scope.crystalXsf = response.data.data[CONFIG.DATA_PATH[$scope.restApiVersion].VISUALIZATION]["data"];
                            });

                        },
                        // handle error
                        function (response) {
                            messageService.updateMessage("Error while connecting to server!", CONFIG.MESSAGE_TYPE.ERROR, response);
                            return {};
                        });

                /**
                * Get structure download options from the server using nodeService.
                */
                nodeService.getDownloadFormats("DATA", $scope.ProfileRestEndPoint)
                    .then(function (response) {
                            response = response.data.data['data.core.structure.StructureData.|'];
                            // download options
                            var base = $scope.ProfileRestEndPoint + CONFIG.REST_API.NODE.V4.DATA + "/"
                            + $scope.structure2dInfo.uuid + CONFIG.REST_API.NODE.V4.DOWNLOAD + "?download_format=";
                            $scope.downloadOptions = [];
                            angular.forEach(response, function (value) {
                                $scope.downloadOptions.push({"name": value.toUpperCase(), link: base + value});
                            });
                    });

                /**
                 * Get structure attributes from the server using nodeService.
                 */
                nodeService.getMetadata("NODE", $scope.structure2dInfo.uuid, "ATTRIBUTES", $scope.ProfileRestEndPoint)
                    .then(function (response) {
                            $scope.structure2dAttributesLoading = false;
                            //get metadata
                            $scope.structure2dInfo.attributes = response.data.data[CONFIG.DATA_PATH[$scope.restApiVersion].ATTRIBUTES];
                        },
                        // handle error
                        function (response) {
                            messageService.updateMessage("Error while connecting to server!", CONFIG.MESSAGE_TYPE.ERROR, response);
                            return {};
                        });
            }

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:SCDMDetailsCtrl#displayCompoundInfo
             * @methodOf materialsCloudApp.controller:SCDMDetailsCtrl
             *
             * @description
             *  It constructs the dictionary of compound information that will be
             *  display on the details page.
             *
             * @returns {undefined} It doesn't return.
             */
            function displayCompoundInfo() {

                $scope.withConduction = {};
                $scope.valenceOnly = {};
                var methodTitle, nodeUuid, nodeTooltip;


                if ($scope.displayedCompoundJson["bands"]["Wannier"]["with_conduction"] !== undefined){
                    var withConductionJson = $scope.displayedCompoundJson["bands"]["Wannier"]["with_conduction"];
                    $scope.withConduction["key"] = "Band manifold";
                    $scope.withConduction["value"] = $scope.MANIFOLD_NAME_MAPPING["with_conduction"];
                    $scope.withConduction["children"] = [];

                    var methodDetails, metadataDetails, val;

                    $.each($scope.METHODS, function (methodIdx, methodInfo) {
                        if (withConductionJson[methodInfo.key] !== undefined){
                            methodDetails = {};
                            methodDetails["key"] = "Method";

                            // create aiida logo + explore link + tooltip
                            nodeUuid = withConductionJson[methodInfo.key]["0.2"]["bands_node_uuid"];
                            nodeTooltip = $scope.uuidTooltipText + nodeUuid;
                            methodDetails["value"] = getAiiDALink(methodInfo.label, nodeUuid, nodeTooltip);

                            methodDetails["children"] = [];

                            $.each(METADATA, function (metadataIdx, metadataInfo) {
                                metadataDetails = {};
                                metadataDetails["key"] = metadataInfo.label;
                                val = withConductionJson[methodInfo.key][KPOINT_MESH][metadataInfo.key];
                                if (val != undefined)
                                    metadataDetails["value"] = parseFloat((val * metadataInfo.multiplier).toFixed(metadataInfo.noOfDigits));
                                else
                                    metadataDetails["value"] = "N/A";
                                methodDetails["children"].push(metadataDetails);
                            });

                            $scope.withConduction["children"].push(methodDetails);
                        }
                    });
                }

                if ($scope.displayedCompoundJson["bands"]["Wannier"]["valence_only"] !== undefined){
                    var valenceOnlyJson = $scope.displayedCompoundJson["bands"]["Wannier"]["valence_only"];
                    $scope.valenceOnly["key"] = "Band manifold";
                    $scope.valenceOnly["value"] = $scope.MANIFOLD_NAME_MAPPING["valence_only"];
                    $scope.valenceOnly["children"] = [];

                    var methodDetails, metadataDetails;

                    $.each($scope.METHODS, function (methodIdx, methodInfo) {

                        if (valenceOnlyJson[methodInfo.key] !== undefined){
                            methodDetails = {};
                            methodDetails["key"] = "Method";

                            // create aiida logo + explore link + tooltip
                            nodeUuid = valenceOnlyJson[methodInfo.key]["0.2"]["bands_node_uuid"];
                            nodeTooltip = $scope.uuidTooltipText + nodeUuid;
                            methodDetails["value"] = getAiiDALink(methodInfo.label, nodeUuid, nodeTooltip);

                            methodDetails["children"] = [];

                            $.each(METADATA, function (metadataIdx, metadataInfo) {
                                metadataDetails = {};
                                metadataDetails["key"] = metadataInfo.label;
                                val = valenceOnlyJson[methodInfo.key][KPOINT_MESH][metadataInfo.key];
                                if (val != undefined)
                                    metadataDetails["value"] = parseFloat((val * metadataInfo.multiplier).toFixed(metadataInfo.noOfDigits));
                                else
                                    metadataDetails["value"] = "N/A";
                                methodDetails["children"].push(metadataDetails);
                            });

                            $scope.valenceOnly["children"].push(methodDetails);
                        }
                    });
                }

                function getAiiDALink(mlabel, nuuid, ntooltip) {
                    return "<span>" + mlabel + " </span>" +
                        "<div style='display: inline-block'>" +
                        "<a href='" + utils.getExploreUrl("autowannier", nuuid, 'NODE') + "'>" +
                        "<div class=\"aiidalogo\"></div>" +
                        "<md-tooltip md-direction=\"'right'\" class='tooltip-multiline'>" + ntooltip +
                        "</md-tooltip>" +
                        "</a>" +
                        "</div>";
                }
            }

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:SCDMDetailsCtrl#getCompoundData
             * @methodOf materialsCloudApp.controller:SCDMDetailsCtrl
             *
             * @description
             * This method requests data from server for selected compound using
             * SCDMService service and calls display* method
             * to show its properties.
             *
             * @param {string} compound name of the selected compound
             *
             * @returns {undefined} It doesn't return.
             */
            function getCompoundData (compound) {
                var startTime = window.performance.now();

                SCDMService.getCompoundData(compound).then(
                    // handle success
                    function (response) {
                        $scope.compoundDataLoading = false;

                        if(response.data.data[compound]) {

                            // Contains all the response data received from server
                            $scope.selectedCompoundJson = response.data.data;

                            // In current json format there should not be more than one entry for 1
                            // compound but always take first entry
                            $scope.displayedCompoundJson = response.data.data[compound];
                            $scope.DFTUuid = $scope.displayedCompoundJson["bands"]["DFT_uuid"];
                            $scope.DFTBandLink = utils.getExploreUrl("autowannier", $scope.DFTUuid, 'NODE');
                            $scope.DFTBandLinkTooltip = $scope.uuidTooltipText + $scope.DFTUuid;
                            $scope.fermiEnergy = $scope.displayedCompoundJson["fermi_energy"];


                            // get DFT band data using nodeService
                            nodeService.getMetadata("NODE", $scope.DFTUuid, "DERIVED_PROPERTIES", $scope.ProfileRestEndPoint)
                                .then(
                                    // handle success
                                    function (response) {

                                        $scope.DFTBandData = response.data.data[CONFIG.DATA_PATH[$scope.restApiVersion]["DERIVED_PROPERTIES"]].bands;

                                        // display band plots
                                        createBandTabMenu();

                                        // display band structure
                                        if ($scope.bandTabJson["valence_only"] !== undefined)
                                            displayBandPlot("valence_only", $scope.bandTabJson["valence_only"]["displayedBandPlot"][0],
                                                $scope.bandTabJson["valence_only"]["displayedBandPlot"][1]);

                                        if ($scope.bandTabJson["with_conduction"] !== undefined)
                                            displayBandPlot("with_conduction", $scope.bandTabJson["with_conduction"]["displayedBandPlot"][0],
                                                $scope.bandTabJson["with_conduction"]["displayedBandPlot"][1]);

                                    },
                                    // handle error
                                    function (response) {
                                        messageService.updateMessage("Error while connecting to server!", CONFIG.MESSAGE_TYPE.ERROR, response);
                                        return {};
                                    });

                            // display 2d structures
                            display2dStructure();

                            // display compound infomation
                            displayCompoundInfo();
                        }
                        else {
                            Alert("Data is not available for selected compound");
                        }
                    },
                    // handle error
                    function (response) {
                        messageService.updateMessage("Error while connecting to server!", CONFIG.MESSAGE_TYPE.ERROR, response);
                    }
                );
            }

            /**
             * If state url contains the compound name, then it is a "details" state url.
             * Call the getCompoundData(compound) function is display compound properties.
             */
            if($scope.selectedCompound !== ""){

                $scope.compoundDisplayName = utils.getCompoundNamesWithSubscripts($scope.selectedCompound);
                $scope.compoundDetailsRestUrl = SCDMService.getCompoundDetailsRestURL($scope.selectedCompound);
                getCompoundData($scope.selectedCompound);

            }
            else {
                $state.go("main.discover.autowannier.dashboard.ptable");
            }

            $scope.scrollTop = function () {
                // set the location.hash to the id of
                // the element you wish to scroll to.
                $location.hash('mcloudHeader');

                // call $anchorScroll()
                $anchorScroll();
            };

        }
    ]);