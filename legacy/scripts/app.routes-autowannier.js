            .state("main.discover.autowannier", {
                url: "^/autowannier",
                templateUrl: "views/discover/scdm/scdm.html",
                redirectTo: "main.discover.autowannier.dashboard",
                ncyBreadcrumb: {
                    label: "Automated Wannierisation"
                },
                resolve: {
                    $title: function() { return 'Automated Wannierisation'; },
                    loadMyService: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(['scripts/services/discover/scdmservice.js']); // Resolve promise and load before view
                    }]
                }
            })
            .state("main.discover.autowannier.dashboard", {
                url: "/dashboard",
                templateUrl: "views/discover/scdm/dashboard.html",
                redirectTo: "main.discover.autowannier.dashboard.ptable",
                controller: function ($scope, SCDMService) {
                    $scope.compoundsRestUrl = SCDMService.getCompoundsRestURL();
                },
                ncyBreadcrumb: {
                    //label: "Dashboard"
                    skip: true
                },
                resolve: {
                    $title: function() { return 'Automated Wannierisation'; },
                    loadMyCtrl: ['loadMyService','$ocLazyLoad', function(loadMyService, $ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name : 'SCDMSelection',
                            files: [
                                'scripts/services/graphservice.js',
                                'scripts/controllers/discover/scdm/structureselection.js'],
                            serie: true
                        }]); // Resolve promise and load before view
                    }]
                }
            })
            .state("main.discover.autowannier.dashboard.ptable", {
                url: "/ptable",
                templateUrl: "views/discover/scdm/ptable.html",
                controller: "SCDMSelectionCtrl",
                ncyBreadcrumb: {
                    //label: "Select using periodic table"
                    skip: true
                },
                resolve: {
                    $title: function() { return 'Automated Wannierisation'; },
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(['scripts/directives/periodictable.js']); // Resolve promise and load before view
                    }]
                }
            })
            .state("main.discover.autowannier.dashboard.list", {
                url: "/list",
                templateUrl: "views/discover/scdm/selectionlist.html",
                controller: "SCDMSelectionCtrl",
                ncyBreadcrumb: {
                    //label: "Select using list"
                    skip: true
                },
                resolve: {
                    $title: function() { return 'Automated Wannierisation'; }
                }
            })
            .state("main.discover.autowannier.dashboard.plot", {
                url: "/plot",
                templateUrl: "views/discover/scdm/selectionplot.html",
                controller: "SCDMSelectionCtrl",
                ncyBreadcrumb: {
                    //label: "Select using plot"
                    skip: true
                },
                resolve: {
                    $title: function() { return 'Automated Wannierisation'; },
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(['scripts/external/highstock.min.js']); // Resolve promise and load before view
                    }]
                }
            })
            .state("main.discover.autowannier.details", {
                url: "/details/:compound",
                templateUrl: "views/discover/scdm/structuredetails.html",
                controller: "SCDMDetailsCtrl",
                ncyBreadcrumb: {
                    label: "{{selectedCompound}}"
                },
                resolve: {
                    getCompound: ['$stateParams', function($stateParams) {
                        return { compound: $stateParams.compound };
                    }],
                    // Dynamic title appending to parent state's title
                    $title: ['getCompound', function(getCompound) {
                        return "Automated Wannierisation - " + getCompound.compound ;
                    }],
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                name : 'SCDMDetails',
                                files: [
                                    'scripts/external/jsmol/JSmol.min.nojq.js',
                                    'scripts/services/nodeservice.js',
                                    'scripts/services/nodevisualization.js',
                                    'scripts/controllers/filedialog.js',
                                    'scripts/controllers/discover/scdm/structuredetails.js',
                                    '/discover/node_modules/bands-widget/dist/bandstructure.min.js',
                                    'scripts/directives/bindHtmlCompile.js',
                                    'scripts/directives/jsmolviz.js'],
                                serie: true
                            }
                        ]); // Resolve promise and load before view
                    }]
                }
            })
            .state("main.discover.cofs", {
