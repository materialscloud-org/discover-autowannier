"use strict";

/**
 * @ngdoc service
 * @name materialsCloudApp.graphService
 * @description
 *
 * It provides the functionality to show graphs, plots using
 * different JavaScript libraries.
 *
 * #### File location: app/scripts/services/graphservice.js
 *
 * @requires utils : for util functionality
 * @requires $window : to use window resize event and change url
 *
 */


angular.module("materialsCloudApp").service("graphService",["utils", "$window",
    function (utils, $window) {

        var myService = {

            /**
             * @ngdoc
             * @name materialsCloudApp.graphService#highchartTheme
             * @methodOf materialsCloudApp.graphService
             *
             * @description
             *  this method decides the theme for all plots displayed
             *  using Highchart JavaScript library.
             *
             * @returns {undefined} It doesn't return.
             */
            highchartTheme: function () {
                Highcharts.theme = {
                    colors: ["#4286f4", "#ef7151", "#ef9651", "#efd251", "#bdef51",
                        "#58d345", "#45d38a", "#45d3bc", "#3bcced", "#2aa6f9", "#3043f2",
                        "#8029f2", "#b229f2", "#ea46ea", "#ef67ad", "#ef6786"],
                    chart: {
                        backgroundColor: {
                            linearGradient: [0, 0, 500, 500],
                            stops: [
                                [0, 'rgb(255, 255, 255)'],
                                [1, 'rgb(255, 255, 255)']
                            ]
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        style: {
                            color: '#000',
                            font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
                        }
                    },
                    subtitle: {
                        style: {
                            color: '#666666',
                            font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
                        }
                    },

                    legend: {
                        itemStyle: {
                            font: '9pt Trebuchet MS, Verdana, sans-serif',
                            color: 'black'
                        },
                        itemHoverStyle:{
                            color: 'gray'
                        },
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle',
                        borderWidth: 0
                    },
                    xAxis: {
                        minorTickInterval: 'auto',
                        gridLineWidth: 1,
                        lineColor: '#6E6E6E',
                        tickColor: '#000',
                        minorGridLineColor: '#F2F2F2',
                        labels: {
                            style: {
                                color: '#0B3861',
                                font: '12px Trebuchet MS, Verdana, sans-serif'
                            }
                        },
                        title: {
                            style: {
                                color: '#333',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                            }
                        }
                    },
                    yAxis: {
                        minorTickInterval: 'auto',
                        lineColor: '#6E6E6E',
                        lineWidth: 1,
                        tickWidth: 1,
                        tickColor: '#000',
                        minorGridLineColor: '#F2F2F2',
                        labels: {
                            style: {
                                color: '#0B3861',
                                font: '12px Trebuchet MS, Verdana, sans-serif'
                            }
                        },
                        title: {
                            style: {
                                color: '#333',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                            }
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },
                    plotOptions: {
                        area: {
                            fillColor: {
                                linearGradient: {
                                    x1: 0,
                                    y1: 0,
                                    x2: 0,
                                    y2: 1
                                },
                                stops: [
                                    [0, Highcharts.getOptions().colors[0]],
                                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                ]
                            },
                            marker: {
                                radius: 0
                            },
                            lineWidth: 1,
                            states: {
                                hover: {
                                    lineWidth: 1
                                }
                            },
                            threshold: null
                        }
                    }
                };
                // Apply the theme
                Highcharts.setOptions(Highcharts.theme);
            },

            /**
             * @ngdoc
             * @name materialsCloudApp.graphService#highchartScatterPlot
             * @methodOf materialsCloudApp.graphService
             *
             * @description
             *  this method displays scatter plot using Highchart JS library.
             *
             * @param {string} renderDiv html element id where piechart will be displayed.
             * @param {string} title of the chart.
             * @param {object} data data that will be displayed in piechart.
             *
             * @returns {object} scatter plot object
             */
            highchartScatterPlot: function (renderDiv, title, xAxisInfo,
                    yAxisInfo, series, pointDisplayStrings, clickEvent, displayLegend) {

                var chartOptions = {
                    chart: {
                        type: 'scatter',
                        zoomType: 'xy',
                        renderTo: renderDiv
                    },
                    title: { text: title },
                    credits: {
                        enabled: false
                    },
                    xAxis: {
                        plotLines: [],
                        title: {
                            useHTML: true,
                            text: xAxisInfo.label
                        },
                        labels: {
                            style: { fontSize:'14px' }
                        }
                    },
                    yAxis: {
                        plotLines: [],
                        title: {
                            useHTML: true,
                            text: yAxisInfo.label },
                        labels: {
                            style: { fontSize:'14px' }
                        }
                    },
                    tooltip: {
                        useHTML: true,
                        formatter: function(x) {
                            var pointIndex = this.point.index;
                            var seriesIndex= this.series.index;
                            return pointDisplayStrings[seriesIndex][pointIndex]["pointDisplayStr"];
                        }},
                    series: [],
                    plotOptions: {
                        line:   { animation: false },
                        series: {
                            cursor: 'pointer',
                            clip: false,
                            point: {
                                events: {
                                    click: clickEvent
                                }
                            }
                        }
                    }
                };

                // plot legends
                if(displayLegend){
                    chartOptions.legend = {
                        align: 'right',
                        verticalAlign: 'top',
                        layout: 'vertical',
                        x: 0,
                        y: 100
                    }
                }
                else {
                    chartOptions.legend = {"enabled": false};
                }

                // x axis limit
                if(xAxisInfo.min !== undefined)
                    chartOptions.xAxis.min = xAxisInfo.min;
                if(xAxisInfo.max !== undefined)
                    chartOptions.xAxis.max = xAxisInfo.max;

                // y axis limit
                if(yAxisInfo.min !== undefined)
                    chartOptions.yAxis.min = yAxisInfo.min;
                if(yAxisInfo.max !== undefined)
                    chartOptions.yAxis.max = yAxisInfo.max;

                chartOptions.series = series;

                return new Highcharts.chart(chartOptions);

            },

            /**
             * @ngdoc
             * @name materialsCloudApp.graphService#highchartPie
             * @methodOf materialsCloudApp.graphService
             *
             * @description
             *  this method displays piechart using Highchart JS library.
             *
             * @param {string} renderDiv html element id where piechart will be displayed.
             * @param {string} title of the chart.
             * @param {object} data data that will be displayed in piechart.
             * @param {int} total total count to calculate percentage.
             *
             * @returns {object} piechart object
             */
            highchartPie: function (renderDiv, title, data, total) {
                myService.highchartTheme();
                return new Highcharts.Chart({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie',
                        renderTo: renderDiv
                    },
                    title: {
                        text: title
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.y}</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b> <br> {point.percentage:.2f} %',
                                style: {
                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                }
                            }
                        }
                    },
                    series: [{
                        name: 'count',
                        colorByPoint: true,
                        data: processStatistics(data, total)
                    }]
                });

                function processStatistics(dataInfo, total){
                    // calculate percentage
                    var pieData = [];
                    if(Object.keys(dataInfo).length > 0) {
                        $.each(dataInfo, function (dataType, count) {
                            var tmp = {};
                            tmp.name = utils.getDisplayName(dataType);
                            tmp.y = count;
                            tmp.percentage = ((100 * count) / total).toFixed(2);
                            pieData.push(tmp);
                        });
                    }
                    return pieData;
                }
            },

            /**
             * @ngdoc
             * @name materialsCloudApp.graphService#highstockTimeline
             * @methodOf materialsCloudApp.graphService
             *
             * @description
             *  this method displays timeline using Highstock JS library.
             *
             * @param {string} renderDiv html element id where timeline will be displayed.
             * @param {object} dataSeries data series displayed in time line.
             * @param {string} title title of the timeline.
             * @param {string} yaxisLegend Y axis legend.
             *
             * @returns {object} timeline object
             */
            highstockTimeline: function(renderDiv, dataSeries, title, yaxisLegend){

                myService.highchartTheme();

                return Highcharts.StockChart({
                    chart: {
                        renderTo: renderDiv,
                        alignTicks: false
                    },
                    title: {
                        text: title
                    },
                    rangeSelector: {
                        selected: 1
                    },
                    //subtitle: {
                    //    text: document.ontouchstart === undefined ?
                    //        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
                    //},
                    xAxis: {
                        type: 'datetime',
                        dateTimeLabelFormats: {
                            second: '%Y-%m-%d<br/>%H:%M:%S',
                            minute: '%Y-%m-%d<br/>%H:%M',
                            hour: '%Y-%m-%d<br/>%H:%M',
                            day: '%Y-%m-%d',
                            week: '%Y-%m-%d',
                            month: '%Y-%m',
                            year: '%Y'
                        }
                    },
                    yAxis: {
                        min: 0
                    },
                    legend: {
                        enabled: false
                    },
                    series: [
                        {
                            type: 'column',
                            name: 'count',
                            data: processData(dataSeries),
                            groupPadding: 0,
                            pointPadding: 0,
                            states: {
                                hover: {
                                    marker: {enabled: true}
                                }
                            },
                            dataGrouping: {
                                groupPixelWidth: 40,
                                units: [['day', [1]],
                                    [
                                        'week', // unit name
                                        [1] // allowed multiples
                                    ], [
                                        'month',
                                        [1, 4]
                                    ], ['year', [1]]]
                            }
                        }
                    ]
                });

                function processData(unprocessedData){
                    var processedData = [];
                    if(Object.keys(unprocessedData).length > 0) {
                        $.each(unprocessedData, function (dateStr, count) {
                            var dateObj = new Date(dateStr);
                            processedData.push([dateObj.getTime(), count]);
                        });
                    }
                    return processedData;
                }
            },

            /**
             * @ngdoc
             * @name materialsCloudApp.graphService#dimpleJsLine
             * @methodOf materialsCloudApp.graphService
             *
             * @description
             *  this method displays line plot using Dimple JS library.
             *
             * @param {string} renderDiv html element id where line plot will be displayed.
             * @param {string} title title of the line plot.
             * @param {string} xaxisLabel x axis label.
             * @param {string} yaxisLabel y axis label.
             * @param {object} model data displayed in line plot.
             * @param {boolean} showLegend boolean to display legends or not.
             * @param {boolean} showMarker boolean to display markers on line or not.
             * @param {object} plotSettings plot settings.
             *
             * @returns {object} plot information.
             */
            dimpleJsLine: function(renderDiv, title, xaxisLabel, yaxisLabel, model, showLegend, showMarker, plotSettings, selectedProfile) {

                // Event to handle mouse exit
                function markerClick(e) {
                    var i, j;
                    for (i=0; i < model.y.length; i++){
                        if(e.seriesValue[1] === model.y[i].name){
                            for(j=0; j<model.y[i].data.length; j++){
                                if(model.y[i].data[j].x === e.seriesValue[0]){
                                    // go to visualization page\
                                    $window.location.href = utils.getExploreUrl(selectedProfile,  model.y[i].data[j].uuid, 'DATA');
                                }
                            }
                        }
                    }
                }

                function getAxisLimit(model) {
                    var ymin, ymax, xmin, xmax, currentYmin, currentYmax, currentXmin, currentXmax, ydata, xdata;

                    // calc min and max
                    if(model.y.length > 0) {
                        for (var i = 0; i < model.y.length; i++) {
                            ydata = model.y[i].data.map(function (o) {
                                return o.y;
                            });
                            xdata = model.y[i].data.map(function (o) {
                                return o.x;
                            });

                            currentYmin = Math.min.apply(Math, ydata);
                            currentYmax = Math.max.apply(Math, ydata);

                            currentXmin = Math.min.apply(Math, xdata);
                            currentXmax = Math.max.apply(Math, xdata);

                            if (ymin === undefined || ymin > currentYmin) {
                                ymin = currentYmin;
                            }
                            if (ymax === undefined || ymax < currentYmax) {
                                ymax = currentYmax;
                            }

                            if (xmin === undefined || xmin > currentXmin) {
                                xmin = currentXmin;
                            }
                            if (xmax === undefined || xmax < currentXmax) {
                                xmax = currentXmax;
                            }
                        }
                    }
                    else {
                        return null;
                    }

                    var ydiff = ymax - ymin;
                    var xdiff = xmax - xmin;
                    var axisMargin = 0.02;

                    // if any limit is 0 then dont change it
                    if(ymin !== 0){
                        ymin = ymin - (ydiff * axisMargin);
                    }
                    if(ymax !== 0){
                        ymax = ymax + (ydiff * axisMargin);
                    }
                    if(xmin !== 0){
                        xmin = xmin - (xdiff * axisMargin);
                    }
                    if(xmax !== 0){
                        xmax = xmax + (xdiff * axisMargin);
                    }

                    return {
                        ymin: ymin,
                        ymax: ymax,
                        xmin: xmin,
                        xmax: xmax
                    }
                }

                $("#"+renderDiv).empty();

                var e = $('<div style="display:block;float:left;border:1px solid #f5f5f5;"></div>');
                $(renderDiv).append(e);
                e.attr('id', model.name);

                var svgWidth = "100%";
                var svgHeight = "100%";

                var plotx, ploty, plotWidth, plotHeight, titlex, titley, myLegend;
                var seriesDict = {};
                var drawAnimationTime = 10;

                titley = "4%";

                if(showLegend) {

                    titlex = "41.5%";

                    plotx = "14%";
                    ploty = "10%";
                    plotWidth = "31%";
                    plotHeight = "15%";
                }
                else {

                    titlex = "50%";

                    plotx = "20%";
                    ploty = "10%";
                    plotWidth = "20%";
                    plotHeight = "15%";
                }



                var svgContainer = dimple.newSvg("#"+renderDiv, svgWidth, svgHeight);

                var myChart = new dimple.chart(svgContainer, model);

                // Fix the margins
                myChart.setMargins(plotx, ploty, plotWidth, plotHeight);

                var xAxis = myChart.addMeasureAxis("x", "x");
                var yAxis = myChart.addMeasureAxis("y", "y");

                xAxis.showGridlines = true;
                yAxis.showGridlines = true;

                xAxis.fontSize = "12px";
                yAxis.fontSize = "12px";

                // need to check value range. if all < 0 then we should use 2 or 3 decimal
                yAxis.tickFormat = ",.2f";
                xAxis.tickFormat = ",.0f";

                // set min and max axis
                var axisLimit = getAxisLimit(model);

                if(axisLimit !== null){
                    yAxis.overrideMin = axisLimit.ymin;
                    yAxis.overrideMax = axisLimit.ymax;

                    xAxis.overrideMin = axisLimit.xmin;
                    xAxis.overrideMax = axisLimit.xmax;
                }


                for (var i = 0; i < model.y.length; i++) {
                    var s1 = myChart.addSeries(["x", "legend"], dimple.plot.line, [xAxis, yAxis]);
                    s1.data = model.y[i].data;
                    s1.lineWeight = 1.5;

                    if(showMarker){
                        s1.lineMarkers = true;
                    }

                    // tooltip
                    s1.getTooltipText = function (e) {
                        var i, j, tooltip = [];
                        for (i=0; i < model.y.length; i++){
                            if(e.aggField[1] === model.y[i].name){
                                for(j=0; j<model.y[i].data.length; j++){
                                    if(model.y[i].data[j].x === e.cx && model.y[i].data[j].y === e.cy){
                                        tooltip.push("Series: " + model.y[i].name);
                                        tooltip.push("Uuid: " + model.y[i].data[j].uuid);
                                        tooltip.push("X: " + e.cx);
                                        tooltip.push("Y: " + e.cy);
                                    }
                                }
                            }
                        }
                        return tooltip;
                    };

                    // Handle the click event
                    s1.addEventHandler("click", markerClick);

                    seriesDict[model.y[i].name] = {
                        data: model.y[i].data,
                        series: s1,
                        visible: true
                    };

                    if(plotSettings){
                        seriesDict[model.y[i].name].stylekey = model.y[i].stylekey;
                    }

                }

                svgContainer.append("text")
                    .attr("x", titlex)
                    .attr("y", titley)
                    .attr("text-anchor", "middle")
                    .attr("class", "plot-title")
                    .style("font-size", "15px")
                    .style("font-weight", "bold")
                    .text(title);

                var changeStyle = [];
                if(plotSettings){
                    // assign line colors
                    var addedColors = [], styleKey, dash;
                    $.each(seriesDict, function(sname, sinfo){
                        styleKey = sinfo.stylekey;

                        if (styleKey !== undefined && styleKey !== ""){
                            if ($.inArray(styleKey, addedColors) === -1){
                                addedColors.push(styleKey);
                                myChart.assignColor(sname, plotSettings[styleKey].line.stroke);
                            }
                            else{
                                var name = sname.split(" ").join("-")
                                    .split(".").join("-")
                                    .split("(").join("-")
                                    .split(")").join("-")
                                    .split(",").join("-")
                                    .split("=").join("-")
                                    .toLowerCase();

                                dash = plotSettings[styleKey].line["stroke-dasharray"];
                                myChart.assignColor(sname, plotSettings[styleKey].line.stroke);

                                // need better logic
                                if(changeStyle.length === 0)
                                    changeStyle.push([styleKey, name, dash]);
                                else {
                                    for (var k = changeStyle.length - 1; k >= 0; k--) {
                                        if (changeStyle[k][0] == styleKey) {
                                            dash = changeStyle[k][2] + 4;
                                        }
                                        changeStyle.push([styleKey, name, dash]);
                                    }
                                }
                            }
                        }
                    });
                }

                if(showLegend) {

                    var legendx = "73%";
                    var legendy = "15%";
                    var legendWidth = "20%";
                    var legendHeight = "80%";

                    myLegend = myChart.addLegend(legendx, legendy, legendWidth, legendHeight);
                    myLegend.fontSize = "13px";
                    myLegend.fontFamily = "serif";
                }

                myChart.draw(drawAnimationTime);
                for(var k=0; k<changeStyle.length; k++){
                    $("path.dimple-"+changeStyle[k][1]).css("stroke-dasharray", changeStyle[k][2]);
                }

                // Legends hide/show
                if(showLegend) {

                    myChart.legends = [];

                    // onClick event
                    myLegend.shapes.selectAll("rect")
                    // Add a click event to each rectangle
                        .on("click", function (e) {

                            var sname = e.aggField[1];
                            var meta = seriesDict[sname];

                            if (seriesDict[sname].visible) {
                                meta.series.data = [];
                                d3.select(this).style("opacity", 0.4);
                                seriesDict[sname].visible = false;
                            } else {
                                meta.series.data = meta.data;
                                d3.select(this).style("opacity", 1);
                                seriesDict[sname].visible = true;
                            }
                            myChart.draw(drawAnimationTime);
                        });
                }

                // We do this after the .draw() call, using the .titleShape.html()
                // method instead of yAxis.text = '...' because in this way we can
                // also accept SVG code (e.g. for subscripts etc.)
                yAxis.titleShape.html(yaxisLabel);
                xAxis.titleShape.html(xaxisLabel);


                var w = angular.element($window);
                // Add a method to draw the chart on resize of the window
                w.on('resize', function() {
                    // As of 1.1.0 the second parameter here allows you to draw
                    // without reprocessing data.  This saves a lot on performance
                    // when you know the data won't have changed.
                    myChart.draw(0, true);
                    yAxis.titleShape.html(yaxisLabel);
                    xAxis.titleShape.html(xaxisLabel);
                });
                return {
                    svgContainer: svgContainer,
                    myChart: myChart,
                    xAxis: xAxis,
                    yAxis: yAxis,
                    myLegend: myLegend,
                    seriesDict: seriesDict
                };

            },

            /**
             * @ngdoc
             * @name materialsCloudApp.graphService#highchartLine
             * @methodOf materialsCloudApp.graphService
             *
             * @description
             *  this method displays line plot using Highchart JS library.
             *
             * @param {string} renderDiv html element id where line plot will be displayed.
             * @param {string} title title of the line plot.
             * @param {object} xaxisData x axis ticks.
             * @param {string} xaxisLabel x axis label.
             * @param {string} yaxisLabel y axis label.
             * @param {string} yaxisUnits y axis unit to display in tooltip.
             * @param {object} series data displayed in line plot.
             * @param {int} divWidth width of the line plot.
             *
             * @returns {object} line plot object.
             */
            highchartLine: function (renderDiv, title, xaxisData, xaxisLabel, yaxisLabel, yaxisUnits, series, divWidth) {
                myService.highchartTheme();
                return new Highcharts.Chart({
                    chart: {
                        renderTo: renderDiv,
                        type: "line",
                        width: divWidth,
                        marginBottom: 132
                    },
                    title: {
                        text: title,
                        x: -20 //center
                    },
                    xAxis: {
                        categories: xaxisData,
                        title: {
                            text: xaxisLabel
                        }
                    },
                    yAxis: {
                        title: {
                            text: yaxisLabel
                        }
                    },
                    tooltip: {
                        valueSuffix: yaxisUnits
                    },

                    legend: {
                        width: 450,
                        //floating: true,
                        align: 'center',
                        verticalAlign: 'bottom',
                        x: 10, // = marginLeft - default spacingLeft
                        y: 10,
                        //itemWidth: 70,
                        borderWidth: 1
                    },
                    series: series
                });
            },

            /**
             * @ngdoc
             * @name materialsCloudApp.graphService#jsTree
             * @methodOf materialsCloudApp.graphService
             *
             * @description
             *  this method displays tree (like folder structure) using Jstree JS library.
             *  It is used to display pseudopotentials, observables and duals options in SSSP.
             *
             * @param {string} renderDiv html element id where tree will be displayed.
             * @param {object} treeOptions data displayed in tree.
             * @param {object} addFunc function to be called when node is selected in a tree.
             * @param {object} deleteFunc function to be called when node is unselected in a tree.
             * @param {object} onTreeLoad function to be called when tree is loaded.
             *
             * @returns {object} tree object.
             */
            jsTree: function (renderDiv, treeOptions, addFunc, deleteFunc, onTreeLoad) {

                var tree = $('#' + renderDiv).jstree({
                    "core" : {
                        "animation" : 0,
                        "multiple" : true,
                        "check_callback" : false,
                        "themes" : { "responsive": true, "icons": false },
                        "data" : treeOptions,
                        "error": function (err) {
                            console.log("error: "+err);
                        }
                    },
                    "plugins" : ["wholerow", "checkbox", "types"]
                });

                if(tree){
                    tree.bind("loaded.jstree", function (event, data) {
                        // open all tree nodes
                        //$(this).jstree("open_all");
                        onTreeLoad();
                    })
                        .bind("select_node.jstree", function(evt, data){
                                addFunc(data.node.original);
                            }

                        )
                        .bind("deselect_node.jstree", function(evt, data) {
                            console.log("deselected!" + data.node.original);
                            deleteFunc(data.node.original);
                        });
                }
                return tree;
            },

            /**
             * @ngdoc
             * @name materialsCloudApp.graphService#displayExploreStatistics
             * @methodOf materialsCloudApp.graphService
             *
             * @description
             *  this method displays the statistics for explore section using
             *  Highchart/Highstock JS library.
             *  for example,
             *      - total no. of calculations created per month.
             *      - no. of calculations created by logged in user per month.
             *      - no. of calculations per type are stored in database.
             *      - etc.
             *
             * @param {string} nodeType type of the node whose statistics are displayed (e.g. calculation, data).
             * @param {object} response statistics data.
             *
             * @returns {object} chart objects.
             */
            displayExploreStatistics: function(nodeType, response, selectedUser){

                nodeType = nodeType.toLowerCase();
                var charts = {};

                var pieChartTitle = "", linePlotTitle = "";
                if (selectedUser !== "") {
                    pieChartTitle = "Number of nodes created per type by " + selectedUser;
                    linePlotTitle = "Number of nodes created per time period by " + selectedUser;
                }
                else {
                    pieChartTitle = "Number of nodes created per type";
                    linePlotTitle = "Number of nodes created per time period";
                }
                // pie chart: database statistics
                charts.db_node_piechart = myService.highchartPie("db_node_piechart",pieChartTitle,
                    response.data.data.types, response.data.data.total);
                // time line: database statistics
                charts.db_node_ctime_timeline = myService.highstockTimeline("db_node_timeline",
                    response.data.data.ctime_by_day, linePlotTitle, "#"+nodeType);

                return charts;
            },

            /**
             * @ngdoc
             * @name materialsCloudApp.graphService#reloadStatisticsGraphs
             * @methodOf materialsCloudApp.graphService
             *
             * @description
             *  this method reloads the statistics charts again.
             *
             * @param {object} charts statistics charts objects
             *
             * @returns {undefined} It doesn't return.
             */
            reloadStatisticsGraphs: function(charts){
                setTimeout(function () {
                    $.each(charts, function (key, chart) {
                        chart.reflow();
                    });
                }, 0);
            },


            /**
             * @ngdoc
             * @name materialsCloudApp.graphService#visTree
             * @methodOf materialsCloudApp.graphService
             *
             * @description
             *  this method displays node inputs and outputs in tree like structure
             *  using vistree JS library.
             *  On tree node,
             *   - on single click it displays short description of the tree node.
             *   - on double click it goes to the visualization page that tree node.
             *
             * @param {object} treeData node tree data
             * @param {string} container html element id.
             * @param {object} treeDetailFunc function to be called on double click on tree node.
             * @param {object} treeOnClick function to be called on single click on tree node.
             *
             * @returns {object} tree object.
             */
            visTree: function(treeData, container, treeDetailFunc){
                function getTooltipText(node){

                    var title = "";

                    // Link type
                    if(node.linktype !== undefined && node.linktype !== "")
                        title += "Link Type: " + node.linktype + "<br>";

                    // Description
                    if(node.description !== undefined && node.description !== "")
                        title += "Description: " + node.description + "<br>";

                    // UUID
                    title += "UUID: " + node.nodeuuid.split("-")[0] + "<br>";

                    // Node type
                    var type = node.nodetype;
                    if(type.indexOf(".") !== -1){
                        type = type.split(".")[0].toUpperCase();
                    }

                    title += "Type: " + node.displaytype;


                    return title;
                }

                function processIOData(data){

                    if(data.length > 0) {
                        $.each(data, function (index, node) {
                            data[index]["title"] = getTooltipText(node);
                            data[index]["label"] = utils.getDisplayName(node.nodetype);
                        });
                    }
                    return data
                }

                var nodes = processIOData(treeData.data.nodes);
                var edges = treeData.data.edges;

                var data = {
                    nodes: nodes,
                    edges: edges
                };
                var options = {
                    nodes: {
                        shape: 'dot',
                        size: 18,
                        font: {
                            size: 12,
                            color: 'SlateBlue',
                            face: '"Trebuchet MS", Helvetica, sans-serif'
                        },
                        borderWidth: 3
                    },
                    edges: {
                        arrows: {
                            to: {enabled: true, scaleFactor:0.7, type:'arrow'}
                        },
                        width: 2,
                        length: 120,
                        font: {
                            size: 12,
                            color: 'black',
                            align: 'middle'
                        }
                    },
                    groups: {
                        'mainNode': {
                            color:'grey'
                        },
                        'inputs': {
                            color:'#1b9e77'
                        },
                        'ancestors-1': {
                            color:'#cc99ff'
                        },
                        'ancestors-2': {
                            color:'#ff80b3'
                        },
                        'ancestors-3': {
                            color:'#ff9999'
                        },
                        'ancestors-4': {
                            color:'#ff8533'
                        },
                        'outputs': {
                            color:'#d95f02'
                        },
                        'desc-1': {
                            color:'#d5ff80'
                        },
                        'desc-2': {
                            color:'#6b6b47'
                        },
                        'desc-3': {
                            color:'#d2a679'
                        },
                        'desc-4': {
                            color:'#b8b894'
                        }
                    },
                    autoResize: true,
                    interaction: {
                        hover:true
                    },
                    layout: {
                        randomSeed: undefined,
                        improvedLayout:true,
                        hierarchical: {
                            enabled:false,
                            levelSeparation: 150,
                            nodeSpacing: 100,
                            treeSpacing: 200,
                            blockShifting: true,
                            edgeMinimization: true,
                            parentCentralization: true,
                            direction: 'LR',        // UD, DU, LR, RL
                            sortMethod: 'directed'   // hubsize, directed
                        }
                    }
                };
                var network = new vis.Network(container, data, options);
                //var previousSelection = null;

                network.on("click", function (params) {
                    // disable to reload the same (main) node again
                    if(nodes[params.nodes] != undefined && nodes[params.nodes].group != "mainNode") {
                        treeDetailFunc(nodes[params.nodes], true);
                    }
                });

                // change cursor type to pointer on node hover and
                // back to default if in other canvas area
                network.on("hoverNode", function (params) {
                    // Do not change the corsor type if it a main/center node
                    if(nodes[params.node] != undefined && nodes[params.node].group != "mainNode") {
                        network.canvas.body.container.style.cursor = 'pointer';
                    }
                });
                network.on("blurNode", function (params) {
                    network.canvas.body.container.style.cursor = 'default';
                });

                return network;
            }
        };
        return myService;
    }]);
