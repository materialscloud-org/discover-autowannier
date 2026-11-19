"use strict";

/**
 * @ngdoc service
 * @name materialsCloudApp.SCDMService
 * @description
 *
 * It is the service used to get SCDM data from server.
 *
 * #### File location: app/scripts/services/discover/scdmservice.js
 *
 * @requires $http : to read data from remote server
 * @requires $rootScope : root scope to broadcast message
 * @requires $q : to defer server response
 * @requires ENV : ENV variables
 * @requires CONFIG : materials cloud configuration file
 *
 */

angular.module("materialsCloudApp").factory("SCDMService",
    ["$http", "$rootScope", "$q", "ENV", "CONFIG",

        function ($http, $rootScope, $q, ENV, CONFIG) {

            var RESTENDPOINT = ENV['discoverRestEndPoint'];

            /**
             * @ngdoc
             * @name materialsCloudApp.SCDMService#SCDM_BASE_URL
             * @propertyOf materialsCloudApp.SCDMService
             *
             * @description
             *  base url to request SCDM data from server.
             */
            var SCDM_BASE_URL = CONFIG.REST_API.SCDM.BASE;

            var myService = {

                /**
                 * @ngdoc
                 * @name materialsCloudApp.SCDMService#getCompoundsRestURL
                 * @methodOf materialsCloudApp.SCDMService
                 *
                 * @description
                 *  It returns the REST API URL used to get list of all compounds from server.
                 *
                 * @returns {string} Rest url.
                 */
                getCompoundsRestURL: function () {
                    return RESTENDPOINT + SCDM_BASE_URL + CONFIG.REST_API.SCDM.COMPOUNDS_LIST;
                },

                /**
                 * @ngdoc
                 * @name materialsCloudApp.SCDMService#getCompoundDetailsRestURL
                 * @methodOf materialsCloudApp.SCDMService
                 *
                 * @description
                 *  It returns the REST API URL used to get details of single compound.
                 *
                 * @returns {string} Rest url.
                 */
                getCompoundDetailsRestURL: function (compound) {
                    return RESTENDPOINT + SCDM_BASE_URL +
                        CONFIG.REST_API.SCDM.COMPOUND_DATA + "/" + compound;
                },

                /**
                 * @ngdoc
                 * @name materialsCloudApp.SCDMService#getcompounds
                 * @methodOf materialsCloudApp.SCDMService
                 *
                 * @description
                 *  Get the list of all compounds from the server.
                 *
                 * @returns {object} deferred promise with server's response.
                 */
                getcompounds: function() {

                    var deferred = $q.defer();

                    // send a post request to the server
                    $http.get(RESTENDPOINT + SCDM_BASE_URL +
                        CONFIG.REST_API.SCDM.COMPOUNDS_LIST)

                    // handle success
                        .then(function successCallback(response) {
                                deferred.resolve(response);
                            },

                            // handle error
                            function errorCallback(response) {
                                $rootScope.$broadcast(CONFIG.EVENT_TYPE.SCDM.HTTP_FAILURE);
                                deferred.reject(response);
                            });

                    // return promise object
                    return deferred.promise;
                },

                /**
                 * @ngdoc
                 * @name materialsCloudApp.SCDMService#getCompoundData
                 * @methodOf materialsCloudApp.SCDMService
                 *
                 * @description
                 *  Get the compound data from the server.
                 *
                 * @param {string} compound compound name
                 *
                 * @returns {object} deferred promise with server's response.
                 */
                getCompoundData: function(compound) {

                    var deferred = $q.defer();

                    // send a post request to the server
                    $http.get(RESTENDPOINT + SCDM_BASE_URL +
                        CONFIG.REST_API.SCDM.COMPOUND_DATA + "/" + compound)

                    // handle success
                        .then(function successCallback(response) {
                                deferred.resolve(response);
                            },

                            // handle error
                            function errorCallback(response) {
                                $rootScope.$broadcast(CONFIG.EVENT_TYPE.SCDM.HTTP_FAILURE);
                                deferred.reject(response);
                            });

                    // return promise object
                    return deferred.promise;
                }

            };

            return myService;
        }
    ]);