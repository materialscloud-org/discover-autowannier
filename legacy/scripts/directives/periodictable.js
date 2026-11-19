"use strict";

/**
 * @ngdoc directive
 * @name materialsCloudApp.directive:periodicTable
 * @restrict A
 *
 * @scope
 * @param {object} activeCompounds It is double-binded and stores an array of active compounds.
 * @param {bool} displayAll It is a boolean: whether to display all compounds in the selection list.
 * @param {object} displayCompound It is a function to display properties of selected compound.
 *
 * @description
 * This directive is used to display periodic table and side menu/list with search option.
 *
 * #### File location: app/scripts/directives/periodictable.js
 * #### Templete URL: app/views/discover/periodictable.html
 *
 * @requires $scope : scope object for this page
 * @requires $sce : used to return names of the compound by converting to subscript form
 */

angular.module("materialsCloudApp").directive('periodicTable', function () {
    return {
        templateUrl: "views/discover/periodictable.html",
        restrict: 'A',
        scope: {
            "activeCompounds": "=",
            "displayAll": "=",
            "displayCompound": "&"
        },
        controller: ["$scope", "$sce",
            function($scope, $sce) {

                /**
                 * @ngdoc
                 * @name materialsCloudApp.directive:periodicTable#periodic_json
                 * @propertyOf materialsCloudApp.directive:periodicTable
                 *
                 * @description
                 *  array of periodic table elements.
                 */
                $scope.periodic_json = [
                    ["H", "", "", "", "", "", "", "", "","", "", "", "", "", "", "", "", "He"],
                    ["Li", "Be", "", "", "", "", "", "", "","", "", "", "B", "C", "N", "O", "F", "Ne"],
                    ["Na", "Mg", "", "", "", "", "", "", "","", "", "", "Al", "Si", "P", "S", "Cl", "Ar"],
                    ["K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co","Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr"],
                    ["Rb", "Sr", "Y", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh","Pd", "Ag", "Cd", "In", "Sn", "Sb", "Te", "I", "Xe"],
                    ["Cs", "Ba", "La", "Hf", "Ta", "W", "Re", "Os", "Ir","Pt", "Au", "Hg", "Tl", "Pb", "Bi", "Po", "At", "Rn"],
                    ["Fr", "Ra", "Ac", "Rf", "Db", "Sg", "Bh", "Hs", "Mt","Ds", "Rg", "Cn", "Nh", "Fi", "Mc", "Lv", "Ts", "Og"],
                    ["", "", "", "", "", "", "", "", "","", "", "", "", "", "", "", "", ""],
                    ["", "", "", "La", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu","Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu"],
                    ["", "", "", "Ac", "Th", "Pa", "U", "Np", "Pu", "Am","Cm", "Bk", "Cf", "Es", "Fm", "Md", "No", "Lr"]

                ];

                /**
                 * @ngdoc
                 * @name materialsCloudApp.directive:periodicTable#limit
                 * @propertyOf materialsCloudApp.directive:periodicTable
                 *
                 * @description
                 *  positive integer limiting the number of compounds in the selection list.
                 */
                $scope.limit = 100;

                /**
                 * @ngdoc
                 * @name materialsCloudApp.directive:periodicTable#selectedElements
                 * @propertyOf materialsCloudApp.directive:periodicTable
                 *
                 * @description
                 *  array of selected elements on periodic table.
                 */
                $scope.selectedElements = [];

                /**
                 * @ngdoc
                 * @name materialsCloudApp.directive:periodicTable#activeElementsClasses
                 * @propertyOf materialsCloudApp.directive:periodicTable
                 *
                 * @description
                 *  It is a dictionary containing style information to display
                 *  active elements on periodic table.
                 */
                $scope.activeElementsClasses = {};

                /**
                 * @ngdoc
                 * @name materialsCloudApp.directive:periodicTable#searchMatchingCompounds
                 * @propertyOf materialsCloudApp.directive:periodicTable
                 *
                 * @description
                 *  list of matching compounds to the search input with its subscript form.
                 */
                $scope.searchMatchingCompounds = [];

                /**
                 * @ngdoc
                 * @name materialsCloudApp.directive:periodicTable#displayMatchingCompounds
                 * @propertyOf materialsCloudApp.directive:periodicTable
                 *
                 * @description
                 *  list of matching compounds displayed to the search input with its subscript form.
                 */
                 $scope.displayMatchingCompounds = [];

                /**
                 * @ngdoc
                 * @name materialsCloudApp.directive:periodicTable#searchCompoundName
                 * @propertyOf materialsCloudApp.directive:periodicTable
                 *
                 * @description
                 *  search string to filter compounds list.
                 */
                $scope.searchCompoundName = "";

                /**
                 * @ngdoc
                 * @name materialsCloudApp.directive:periodicTable#selectedCompoundName
                 * @propertyOf materialsCloudApp.directive:periodicTable
                 *
                 * @description
                 *  name of the selected compound.
                 */
                $scope.selectedCompoundName = "";

                // when compounds are updated in parent scope from service, update all derived values
                $scope.$watchCollection("activeCompounds", function(newValue, oldValue) {
                    $scope.activeCompounds = newValue;
                    $scope.activeElements = getactivePeriodicElements($scope.activeCompounds);
                    $scope.searchMatchingCompounds = getCompoundNamesWithSubscripts($scope.activeCompounds);
                    $scope.displayMatchingCompounds = firstN($scope.searchMatchingCompounds, $scope.limit);
                    $scope.lenMatchingCompounds = Object.keys($scope.searchMatchingCompounds).length;

                    // re-calculate css classes
                    $.each($scope.activeElements, function(index, element) {
                        $scope.activeElementsClasses[element] = {cellClass: "active", elementClass: "active-color"};
                    });
                });

                function firstN(obj, n) {
                    return Object.keys(obj) //get the keys out
                      .sort() //this will ensure consistent ordering of what you will get back
                      .slice(0, n) //get the first N
                      .reduce(function(memo, current) { //generate a new object out of them
                        memo[current] = obj[current]
                        return memo;
                      }, {})
                  }

                /**
                 * @ngdoc
                 * @name materialsCloudApp.directive:periodicTable#getCompoundNamesWithSubscripts
                 * @methodOf materialsCloudApp.directive:periodicTable
                 *
                 * @description
                 * For every compound in list, if it contains any number,
                 * this method replaces it with its subscript form
                 *
                 * @param {object} compounds compounds list
                 *
                 * @returns {object} returns names of compounds by converting it to subscript form
                 */
                function getCompoundNamesWithSubscripts(compounds) {

                    function is_numeric(str){
                        return /^\d+$/.test(str);
                    }

                    var elements = {};

                    $.each(compounds, function(index, compound) {

                        // remove suffix if present
                        var splitIdx, formula, suffix;

                        splitIdx = compound.indexOf('-');
                        if(splitIdx > 0) {
                            formula = compound.substring(0, splitIdx);
                            suffix = compound.substring(splitIdx + 1);
                        }
                        else {
                            formula = compound;
                            suffix = "";
                        }

                        var chars = formula.split('');
                        var result = "";

                        $.each(chars, function(id, char) {
                            if(is_numeric(char)) {
                                result = result + "<sub>" + char + "</sub>";
                            } else {
                                result = result + char;
                            }
                        });

                        if (suffix != "")
                            var compoundDisplayName = $sce.trustAsHtml(result) + " [" + suffix + "]";
                        else
                            var compoundDisplayName = $sce.trustAsHtml(result);

                        elements[compound] = compoundDisplayName;
                    });
                    return elements;
                }

                /**
                 * @ngdoc
                 * @name materialsCloudApp.directive:periodicTable#getactivePeriodicElements
                 * @methodOf materialsCloudApp.directive:periodicTable
                 *
                 * @description
                 * It parse the list of available compounds for active elements and
                 * returns it.
                 *
                 * @param {object} compounds list of available compounds.
                 *
                 * @returns {object} list of active elements.
                 */
                function getactivePeriodicElements(compounds) {
                    var elements = [];

                    // for every compound, find elements
                    $.each(compounds, function (index, compound) {

                        // remove suffix if present
                        var splitIdx, formula, suffix;

                        splitIdx = compound.indexOf('-');
                        if(splitIdx > 0) {
                            formula = compound.substring(0, splitIdx);
                            suffix = compound.substring(splitIdx + 1);
                        }
                        else {
                            formula = compound;
                            suffix = "";
                        }

                        // split compound into its elements
                        var result = formula.match(/[A-Z][a-z]?\d*/g);

                        // iterate over element and push new elements to result
                        $.each(result, function(index, element) {

                            // remove digits at the end of element name because we dont display it in periodic table
                            element = element.replace(/[_0-9]+$/, '');

                            // insert if not previously exist
                            if($.inArray(element, elements) == -1) {
                                elements.push(element);
                            }
                        });
                    });
                    return elements;
                }


                /**
                 * @ngdoc
                 * @name materialsCloudApp.directive:periodicTable#getRegexForElements
                 * @methodOf materialsCloudApp.directive:periodicTable
                 *
                 * @description
                 * It generates the regular expression from selected elements.
                 *
                 * @param {object} elements list of selected elements
                 *
                 * @returns {string} regex sting generated from selected elements
                 */
                function getRegexForElements(elements) {
                    var regexString = "";

                    $.each(elements, function(index, element) {
                        regexString = regexString + element + "\\d*(?![a-z])";
                    });

                    return regexString;

                }

                /**
                 * @ngdoc
                 * @name materialsCloudApp.directive:periodicTable#getPossibleActiveElements
                 * @methodOf materialsCloudApp.directive:periodicTable
                 *
                 * @description
                 * This method returns the list of compounds who contains the selected elements in its formula.
                 *
                 * @param {object} selectedElements list of selected elements
                 * @param {object} compounds list of available compounds
                 *
                 * @returns {object} returns list of possible matching compounds for the given
                 * selection of elements
                 */
                function getPossibleActiveElements(selectedElements, compounds) {

                    var matchingCompounds = [];
                    var regexString, regex, matchingElements;

                    $.each(compounds, function(index, compound) {

                        matchingElements = [];

                        // remove suffix if present
                        var splitIdx, formula, suffix;

                        splitIdx = compound.indexOf('-');
                        if(splitIdx > 0) {
                            formula = compound.substring(0, splitIdx);
                            suffix = compound.substring(splitIdx + 1);
                        }
                        else {
                            formula = compound;
                            suffix = "";
                        }

                        $.each(selectedElements, function(index, element) {
                            regexString = element + "\\d*(?![a-z])";
                            regex = new RegExp(regexString);

                            if(!!formula.match(regex)) {
                                matchingElements.push(element);
                            }
                        });

                        if(matchingElements.length === selectedElements.length)
                            matchingCompounds.push(compound);
                    });

                    return matchingCompounds;
                }

                /**
                 * @ngdoc
                 * @name materialsCloudApp.directive:periodicTable#getCellClass
                 * @methodOf materialsCloudApp.directive:periodicTable
                 *
                 * @description
                 * This method is used to assign styles for cells in the periodic table.
                 *
                 * @param {string} element periodic table element
                 *
                 * @returns {string} styles for the cell
                 */
                $scope.getCellClass = function(element){
                    if(element !== ""){
                        var ele = $scope.activeElementsClasses[element];
                        if(ele !== undefined){
                            return ele.cellClass;
                        }
                    }
                    return "";
                };

                /**
                 * @ngdoc
                 * @name materialsCloudApp.directive:periodicTable#getElementClass
                 * @methodOf materialsCloudApp.directive:periodicTable
                 *
                 * @description
                 * This method is used to assign styles for elements in the periodic table.
                 *
                 * @param {string} element periodic table element
                 *
                 * @returns {string} styles for the element
                 */
                $scope.getElementClass = function(element){
                    if(element !== ""){
                        var ele = $scope.activeElementsClasses[element];
                        if(ele !== undefined){
                            return ele.elementClass;
                        }
                    }
                    return "";
                };

                /**
                 * @ngdoc
                 * @name materialsCloudApp.directive:periodicTable#updateSearchCompoundList
                 * @methodOf materialsCloudApp.directive:periodicTable
                 *
                 * @description
                 * It updates the compounds list for user input in list search box.
                 *
                 * @param {string} searchRegex user input in list search box
                 *
                 * @returns {undefined} It doesn't return.
                 */
                function updateSearchCompoundList(searchRegex) {
                    var results = [];

                    $.each($scope.activeCompounds, function(index, compound) {
                        if(!!compound.match(searchRegex)) {
                            results.push(compound);
                        }
                    });

                    $scope.searchMatchingCompounds = getCompoundNamesWithSubscripts(results);
                    $scope.displayMatchingCompounds = firstN($scope.searchMatchingCompounds, $scope.limit);
                    $scope.lenMatchingCompounds = Object.keys($scope.searchMatchingCompounds).length;
                }

                /**
                 * @ngdoc
                 * @name materialsCloudApp.directive:periodicTable#updateSearch
                 * @methodOf materialsCloudApp.directive:periodicTable
                 *
                 * @description
                 * It is the onclick event called for input in list search box.
                 * It calls the updateSearchCompoundList(searchstring) method
                 * to update compounds list.
                 *
                 * @returns {undefined} It doesn't return.
                 */
                $scope.updateSearch = function() {
                    updateSearchCompoundList($scope.searchCompoundName);
                };

                /**
                 * @ngdoc
                 * @name materialsCloudApp.directive:periodicTable#elementSelected
                 * @methodOf materialsCloudApp.directive:periodicTable
                 *
                 * @description
                 * It is the onclick event for every element in periodic table.
                 * It works on:
                 *  - if element is not selectable, return.
                 *  - if element is already selected then unselect it and update styles.
                 *  - if above 2 cases are false then add element in selected elements
                 *  list, update styles and search list.
                 *
                 * @param {string} element selected element from periodic table.
                 *
                 * @returns {undefined} It doesn't return.
                 *
                 */
                $scope.elementSelected = function(element) {

                    // if element is not selectable, return without doing anything
                    if($.inArray(element, $scope.activeElements) < 0){
                        return;
                    }

                    // check if element is already selected
                    if($.inArray(element, $scope.selectedElements) >= 0){
                        $scope.selectedElements = jQuery.grep($scope.selectedElements, function(value) {
                            return value != element;
                        });
                    }
                    else {
                        $scope.selectedElements.push(element);
                    }


                    var matchingCompounds = getPossibleActiveElements($scope.selectedElements, $scope.activeCompounds);
                    var currentActiveElements = getactivePeriodicElements(matchingCompounds);

                    // update the search list
                    $scope.searchMatchingCompounds = getCompoundNamesWithSubscripts(matchingCompounds);
                    $scope.displayMatchingCompounds = firstN($scope.searchMatchingCompounds, $scope.limit);
                    $scope.lenMatchingCompounds = Object.keys($scope.searchMatchingCompounds).length;

                    $.each($scope.activeElements, function(index, ele){
                        if($.inArray(ele, currentActiveElements) >= 0 || $.inArray(ele, $scope.selectedElements) >= 0){

                            $scope.activeElementsClasses[ele].cellClass = "active";

                            if($.inArray(ele, $scope.selectedElements) >= 0) {
                                $scope.activeElementsClasses[ele].elementClass = "selected-color";
                            }
                            else{
                                $scope.activeElementsClasses[ele].elementClass = "active-color";
                            }
                        }
                        else{
                            $scope.activeElementsClasses[ele].elementClass = "";
                            $scope.activeElementsClasses[ele].cellClass = "";
                        }
                    });
                };

                $scope.loadMore = function(index) {

                    $scope.limit += 100;
                    $scope.displayMatchingCompounds = firstN($scope.searchMatchingCompounds, $scope.limit);
                    $scope.lenMatchingCompounds = Object.keys($scope.searchMatchingCompounds).length;
                }

                /**
                 * @ngdoc
                 * @name materialsCloudApp.directive:periodicTable#checkifActive
                 * @methodOf materialsCloudApp.directive:periodicTable
                 *
                 * @description
                 * This method is used to assign styles for selected compound(s)
                 * in compounds list.
                 *
                 * @param {string} compound compound name
                 *
                 * @returns {boolean} It returns true if compound is equal to the
                 * selected compound else false.
                 */
                $scope.checkifActive = function(compound) {
                    if(compound == $scope.selectedCompoundName) {
                        return true;
                    } else {
                        return false;
                    }
                };

                /**
                 * @ngdoc
                 * @name materialsCloudApp.directive:periodicTable#selectCompound
                 * @methodOf materialsCloudApp.directive:periodicTable
                 *
                 * @description
                 * This function is called when compound is selected in a list.
                 * It resets the selectedCompoundName variable and calls displayCompound
                 * function to display its properties.
                 *
                 * @returns {undefined} It doesn't return.
                 */
                $scope.selectCompound = function(selectedCompound) {
                    $scope.selectedCompoundName = selectedCompound;
                    $scope.displayCompound({compound: selectedCompound});
                }

            }]
    };
});
