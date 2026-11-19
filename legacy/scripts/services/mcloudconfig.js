"use strict";

/**
 * @ngdoc service
 * @name materialsCloudApp.CONFIG
 * @description
 *
 * It stores all the constants used in materials cloud application.
 *
 * #### File location: app/scripts/services/mcloudconfig.js
 *
 */

app.constant("CONFIG", (function() {
    return {
        SECTION_URLS: {
            "EXPLORE": {"ENV_KEY": "exploreUrl"}
        },
        MESSAGE_TYPE: {
            SUCCESS: "alert-success",
            INFO: "alert-info",
            WARNING: "alert-warning",
            ERROR: "alert-danger"
        },
        EVENT_TYPE: {
            AUTH: {
                SIGNIN_SUCCESS: "auth:signin:success",
                SIGNIN_FAILURE: "auth:signin:failure",
                SIGNUP_SUCCESS: "auth:signup:success",
                SIGNUP_FAILURE: "auth:signup:failure",
                SIGNOUT_SUCCESS: "auth:signout:success",
                SIGNOUT_FAILURE: "auth:signout:failure",
                TOKEN_EXPIRED: "auth:token:expired"
            },
            NODE: {
                HTTP_FAILURE: "node:http:failure"
            },
            SSSP: {
                HTTP_FAILURE: "sssp:http:failure"
            },
            THERMOCHEMICALS: {
                HTTP_FAILURE: "thermochemicals:http:failure"
            },
            SCDM: {
                HTTP_FAILURE: "scdm:http:failure"
            },
            STRUCTURES2D: {
                HTTP_FAILURE: "mc2d:http:failure"
            }
        },
        CONSTANT: {
            AUTH: {
                TOKEN: "auth-token",
                EXPIRY_HOURS: 1,
                REST_SERVER_KEY: "user-server-end-point"
            },
            SSSP: {
                DISPLAY_NAME: {
                    "pressure" : "Pressure",
                    "pressure_percentage": "Pressure (%)",
                    "cohesive_energy": "Cohesive Energy",
                    "cohesive_energy_percentage": "Cohesive Energy (%)",
                    "V0": "V0 ",
                    "V0_percentage": "V0 (%)",
                    "phonons": "Phonons",
                    "phonons_percentage": "Phonons (%)",
                    "B0": "B0",
                    "B0_percentage": "B0 (%)",
                    "B1": "B1",
                    "B1_percentage": "B1 (%)",
                    "delta": "Delta",
                    "delta_percentage": "Delta (%)",
                    "custom": "Custom plot",
                    "4.0": "dual=4",
                    "8.0": "dual=8",
                    "12.0": "dual=12",
                    "16.0": "dual=16",
                    "RE-Wentzcovitch": "RE Wentzcovitch",
                    "pslib.1.0.0_PBE_US": "pslibrary.1.0.0 US (high acc.)",
                    "pslib.1.0.0_PBE_PAW": "pslibrary.1.0.0 PAW (high acc.)",
                    "pslib.0.3.1_PBE_US": "pslibrary.0.3.1 US (high acc.)",
                    "pslib.0.3.1_PBE_PAW": "pslibrary.0.3.1 PAW (high acc.)",
                    "GBRV_1.2": "GBRV-1.2 (US)",
                    "GBRV_1.4": "GBRV-1.4 (US)",
                    "GBRV_1.5": "GBRV-1.5 (US)",
                    "SG15": "SG15 (NC)",
                    "SG15_1.1": "SG15-1.1 (NC)",
                    "Goedecker": "Goedecker",
                    "THEOS": "THEOS",
                    "Dojo":"PseudoDojo",
                    "RE_Wentz": "RE Wentzcovitch",
                    "031US": "pslibrary.0.3.1 US (high acc.)",
                    "031PAW": "pslibrary.0.3.1 PAW (high acc.)",
                    "100US": "pslibrary.1.0.0 US (high acc.)",
                    "100PAW": "pslibrary.1.0.0 PAW (high acc.)",
                    "GBRV-1.2": "GBRV-1.2 (US)",
                    "GBRV-1.4": "GBRV-1.4 (US)",
                    "GBRV-1.5": "GBRV-1.5 (US)",
                    "SG15-1.1": "SG15-1.1 (NC)",
                    "RE_Wentz_plus_nitrogen": "RE Wentzcovitch",
                    "RE_pslib.1.0.0_PBE_US_plus_nitrogen": "pslibrary.1.0.0 US (high acc.)",
                    "RE_pslib.1.0.0_PBE_PAW_plus_nitrogen": "pslibrary.1.0.0 PAW (high acc.)",
                    "100PAW-low": "pslibrary.1.0.0 PAW (low acc.)",
                    "MalteSachs": "Actinides MalteSachs"
                },
                PLOT_SETTINGS: {
                    "pslib.1.0.0_PBE_US": {"line": {"stroke": "#FF0000", "stroke-dasharray": 4}},
                    "pslib.1.0.0_PBE_PAW": {"line": {"stroke": "#008B00", "stroke-dasharray": 4}},
                    "pslib.0.3.1_PBE_US": {"line": {"stroke": "#0000FF", "stroke-dasharray": 4}},
                    "pslib.0.3.1_PBE_PAW": {"line": {"stroke": "#FF00FF", "stroke-dasharray": 4}},

                    "GBRV_1.2": {"line": {"stroke": "#00CDCD", "stroke-dasharray": 4}},
                    "GBRV_1.4": {"line": {"stroke": "#4682B4", "stroke-dasharray": 4}},
                    "GBRV_1.5": {"line": {"stroke": "#B8860B", "stroke-dasharray": 4}},

                    "SG15": {"line": {"stroke": "#000000", "stroke-dasharray": 4}},
                    "SG15-1.1": {"line": {"stroke": "#708090", "stroke-dasharray": 4}},

                    "Goedecker": {"line": {"stroke": "#808000", "stroke-dasharray": 4}},

                    "THEOS": {"line": {"stroke": "#D7DF01", "stroke-dasharray": 4}},
                    "THEOS2": {"line": {"stroke": "#F0F000", "stroke-dasharray": 4}},
                    "RE_Wentz": {"line": {"stroke": "#610B5E", "stroke-dasharray": 4}},
                    "Dojo": {"line": {"stroke": "#FFA500", "stroke-dasharray": 4}},
                    "Vanderbilt": {"line": {"stroke": "#8FBC8F", "stroke-dasharray": 4}},

                    "BM": {"line": {"stroke": "#A5FF00", "stroke-dasharray": 4}},
                    "GIPAW": {"line": {"stroke": "#B44682", "stroke-dasharray": 4}},
                    "psorigPAW": {"line": {"stroke": "#CD00CD", "stroke-dasharray": 4}},
                    "psorigUS": {"line": {"stroke": "#86B80B", "stroke-dasharray": 4}}
                },
                LIBRARY_CODES: {
                    "100US" : "u100",
                    "100PAW" : "p100",
                    "031US" : "u031",
                    "031PAW" : "p031",
                    "GBRV-1.2" : "gbrv",
                    "GBRV-1.4" : "gbrv14",
                    "GBRV-1.5" : "gbrv15",
                    "SG15" : "oncv",
                    "SG15-1.1" : "oncv11",
                    "Dojo" : "dojo",
                    "Goedecker" : "goedeck",
                    "THEOS" : "ivca",
                    "Wentzcovitch" : "wentz",
                    "100PAW-low" : "p100low",
                    "MalteSachs" : "maltesachs"
                }
            }
        },
        REST_API: {
            //BASE_URL: "http://192.168.99.100/api/v2",
            EXPLORE_PROFILES: {
                "sssp": { "ENV_KEY": "exploreSsspRestEndpoint", "DISPLAY_NAME": "SSSP"},
                "mc2d": { "ENV_KEY": "exploreMC2DRestEndPoint", "DISPLAY_NAME": "Materials Cloud 2D database"},
                "2dtopo": { "ENV_KEY": "explore2dtopoRestEndPoint", "DISPLAY_NAME": "2D topological insulators"},
                "mc3d": { "ENV_KEY": "exploreMC3DRestEndPoint", "DISPLAY_NAME": "Materials Cloud 3D database"},
                "scdm": { "ENV_KEY": "exploreSCDMRestEndPoint", "DISPLAY_NAME": "Automated Wannierisation"},
                "stcp": { "ENV_KEY": "exploreStcpRestEndPoint", "DISPLAY_NAME": "ThermoChemicals"},
                "cofs": { "ENV_KEY": "exploreCofsRestEndPoint", "DISPLAY_NAME": "COFs"}
            },
            SERVER: {
                BASE: "/server",
                ENDPOINTS: "/endpoints"
            },
            AUTH: {
                TOKEN: "/mcloud/token/",
                SIGNIN: "/mcloud/token/",
                SIGNOUT: "/api/logout",
                SIGNUP: "/mcloud/user/"
            },
            MENU: {
                ENDPOINT: "/discover/menu/",
                LOGOS: "/discover/logos/"
            },
            NODE: {
                V2: {
                    CALCULATION: "/calculations",
                    DATA: "/data",
                    CODE: "/codes",
                    COMPUTER: "/computers",
                    NODE: "/nodes",
                    USER: "/users",
                    SCHEMA: "/schema",
                    STATISTICS: "/statistics",
                    NODE_TYPES: "/types",
                    INPUTS: "/io/inputs",
                    OUTPUTS: "/io/outputs",
                    ATTRIBUTES: "/content/attributes",
                    EXTRAS: "/content/extras",
                    VISUALIZATION: "/content/visualization",
                    VISUALIZATION_XSF: "/content/visualization?visformat=xsf",
                    DOWNLOAD: "/content/download",
                    IO_TREE: "/io/tree",
                    RETRIEVED_INPUTS: "/io/retrieved_inputs",
                    RETRIEVED_OUTPUTS: "/io/retrieved_outputs"
                },
                V3: {
                    CALCULATION: "/calculations",
                    CALCJOB: "/calculations",
                    DATA: "/data",
                    CODE: "/nodes",
                    COMPUTER: "/computers",
                    NODE: "/nodes",
                    USER: "/users",

                    SCHEMA: "/schema",
                    STATISTICS: "/statistics",
                    NODE_TYPES: "/types",
                    INPUTS: "/io/inputs",
                    OUTPUTS: "/io/outputs",
                    ATTRIBUTES: "/content/attributes",
                    EXTRAS: "/content/extras",
                    VISUALIZATION: "/content/visualization",
                    VISUALIZATION_XSF: "/content/visualization?visformat=xsf",
                    DOWNLOAD: "/content/download",
                    IO_TREE: "/io/tree",
                    RETRIEVED_INPUTS: "/io/retrieved_inputs",
                    RETRIEVED_OUTPUTS: "/io/retrieved_outputs"
                },
                V4: {
                    CALCULATION: "/nodes",
                    CALCJOB: "/calcjobs",
                    DATA: "/nodes",
                    CODE: "/nodes",
                    COMPUTER: "/computers",
                    NODE: "/nodes",
                    USER: "/users",
                    SCHEMA: "/projectable_properties",
                    STATISTICS: "/statistics",
                    NODE_TYPES: "/full_types",
                    INPUTS: "/links/incoming",
                    OUTPUTS: "/links/outgoing",
                    ATTRIBUTES: "/contents/attributes",
                    EXTRAS: "/contents/extras",
                    DOWNLOAD_FORMATS: "/download_formats",
                    VISUALIZATION_XSF: "/download?download_format=xsf&download=False",
                    DERIVED_PROPERTIES: "/contents/derived_properties",
                    DOWNLOAD: "/download",
                    IO_TREE: "/links/tree",
                    RETRIEVED_INPUTS: "/input_files",
                    RETRIEVED_OUTPUTS: "/output_files",
                    REPO_CONTENTS: "/repo/contents"
                }
            },
            THERMOCHEMICALS: {
                "BASE": "/discover/thermochemicals",
                "MATERIALS_LIST": "/materials",
                "MATERIALS_DATA": "/material"
            },
            STRUCTURES2D: {
                "BASE": "/discover/mc2d",
                "COMPOUNDS_LIST": "/compounds",
                "COMPOUND_DATA": "/compound"
            },
            TOPO2D: {
                "BASE": "/discover/2dtopo",
                "COMPOUNDS_LIST": "/compounds",
                "COMPOUND_DATA": "/compounds",
                "HWCC_PLOT": "/hwcc_plot"
            },
            DATABASE3D: {
                "BASE": "/discover/mc3d",
                "COMPOUNDS_LIST": "/compounds",
                "COMPOUND_DATA": "/compounds"
            },
            SCDM: {
                "BASE": "/discover/scdm",
                "COMPOUNDS_LIST": "/compounds",
                "COMPOUND_DATA": "/compounds"
            },
            SSSP: {
                "BASE": "/discover/sssp",
                "ELEMENT": "/elements",
                "CUTOFF_PREC": "/precision_cutoffs",
                "CUTOFF_EFF": "/efficiency_cutoffs"
            }
        },
        GRID: {
            FILTER_OPERATOR_MAPPER: {
                STRING: {
                    IS_EQUAL_TO: {display_name: "Is equal to", mapper: "="},
                    IS_NOT_EQUAL_TO: {display_name: "Is not equal to", mapper: "!="},
                    STARTSWITH: {display_name: "Starts with", mapper: '=like="VALUE%"'},
                    CONTAINS: {display_name: "Contains", mapper: '=like="%VALUE%"'},
                    DOES_NOT_CONTAIN: {display_name: "Does not contain", mapper: ""},
                    ENDSWITH: {display_name: "Ends with", mapper: '=like="%VALUE"'}
                },
                NUMBER: {
                    IS_EQUAL_TO: {display_name: "==", mapper: "="},
                    IS_NOT_EQUAL_TO: {display_name: "!=", mapper: "!="},
                    IS_GREATER_THAN_OR_EQUAL_TO: {display_name: ">=", mapper: ">="},
                    IS_GREATER_THAN: {display_name: ">", mapper: ">"},
                    IS_LESS_THAN_OR_EQUAL_TO: {display_name: "<=", mapper: "<="},
                    IS_LESS_THAN: {display_name: "<", mapper: "<"},
                    IS_NULL: {display_name: "Is null", mapper: ""},
                    IS_NOT_NULL: {display_name: "Is not null", mapper: ""}
                },
                DATE: {
                    IS_EQUAL_TO: {display_name: "==", mapper: "="},
                    IS_NOT_EQUAL_TO: {display_name: "!=", mapper: "!="},
                    IS_GREATER_THAN_OR_EQUAL_TO: {display_name: ">=", mapper: ">="},
                    IS_GREATER_THAN: {display_name: ">", mapper: ">"},
                    IS_LESS_THAN_OR_EQUAL_TO: {display_name: "<=", mapper: "<="},
                    IS_LESS_THAN: {display_name: "<", mapper: "<"}
                }
            },
            FILTERS: {
                // calculations
                QUANTUMESPRESSOPW: {field:"type", fieldType:"STRING", operator:"STARTSWITH",value:"calculation.job.quantumespresso.pw."},
                QUANTUMESPRESSOPH: {field:"type", fieldType:"STRING", operator:"STARTSWITH",value:"calculation.job.quantumespresso.ph."},
                INLINE: {field:"type", fieldType:"STRING", operator:"STARTSWITH",value:"calculation.inline."},
                WANNIER90: {field:"type", fieldType:"STRING", operator:"STARTSWITH", value:"calculation.job.wannier90"},
                EXCITING: {field:"type", fieldType:"STRING", operator:"STARTSWITH", value:"calculation.job.exciting"},
                CP2K: {field:"type", fieldType:"STRING", operator:"STARTSWITH", value:"calculation.job.cp2k"},
                SIESTA: {field:"type", fieldType:"STRING", operator:"STARTSWITH", value:"calculation.job.siesta"},
                YAMBO: {field:"type", fieldType:"STRING", operator:"STARTSWITH", value:"calculation.job.yambo"},
                CODTOOLS: {field:"type", fieldType:"STRING", operator:"STARTSWITH", value:"calculation.job.codtools"},

                // data nodes
                STRUCTURES: {field:"type", fieldType:"STRING", operator:"STARTSWITH", value:"data.core.structure.StructureData."},
                CIF: {field:"type", fieldType:"STRING", operator:"STARTSWITH", value:"data.core.cif.CifData."},
                PARAMETERS: {field:"type", fieldType:"STRING", operator:"STARTSWITH", value:"data.core.parameter.ParameterData."},
                KPOINTS: {field:"type", fieldType:"STRING", operator:"STARTSWITH", value:"data.core.array.kpoints.KpointsData."},
                UPF: {field:"type", fieldType:"STRING", operator:"STARTSWITH", value:"data.core.upf.UpfData."},
                REMOTE: {field:"type", fieldType:"STRING", operator:"STARTSWITH", value:"data.core.remote.RemoteData."},
                TRAJECTORY: {field:"type", fieldType:"STRING", operator:"STARTSWITH", value:"data.core.array.trajectory.TrajectoryData."},
                BANDS: {field:"type", fieldType:"STRING", operator:"STARTSWITH", value:"data.core.array.bands.BandsData."},
                ARRAY: {field:"type", fieldType:"STRING", operator:"STARTSWITH", value:"data.core.array."},

                // computers
                EPFL: {field:"hostname", fieldType:"STRING", operator:"ENDSWITH", value:"epfl.ch"},
                CSCS: {field:"hostname", fieldType:"STRING", operator:"ENDSWITH", value:"cscs.ch"},
            },
            DEFAULT_ORDER: {
                CALCULATION: "-ctime",
                DATA: "-ctime",
                CODE: "-ctime"
            },
            COLUMN_WIDTHS: {
                ID: "80px",
                COMMAND: "100px"
            }
        },
        DATA_PATH: {
            V2: {
                CALCULATION: "calculations",
                DATA: "data",
                CODE: "codes",
                COMPUTER: "computers",
                NODE: "nodes",
                VISUALIZATION: "visualization",
                DERIVED_PROPERTIES: "visualization",
                ATTRIBUTES: "attributes",
                RETRIEVED_INPUTS: "retrieved_inputs",
                RETRIEVED_OUTPUTS: "retrieved_outputs"
            },
            V3: {
                CALCULATION: "calculations",
                DATA: "data",
                CODE: "codes",
                COMPUTER: "computers",
                NODE: "nodes",
                VISUALIZATION: "visualization",
                DERIVED_PROPERTIES: "visualization",
                ATTRIBUTES: "attributes",
                RETRIEVED_INPUTS: "retrieved_inputs",
                RETRIEVED_OUTPUTS: "retrieved_outputs"
            },
            V4: {
                CALCULATION: "nodes",
                DATA: "nodes",
                CODE: "nodes",
                COMPUTER: "computers",
                NODE: "nodes",
                VISUALIZATION: "download",
                DERIVED_PROPERTIES: "derived_properties",
                ATTRIBUTES: "attributes",
                RETRIEVED_INPUTS: "data",
                RETRIEVED_OUTPUTS: "data",
                INCOMING: "incoming",
                OUTGOING: "outgoing"
            }
        },
        DISPLAY_NAMES: {
            // calculations
            "calculation.job.quantumespresso.matdyn.MatdynCalculation.": "Matdyn",
            "calculation.job.quantumespresso.pw.PwCalculation.": "Quantum ESPRESSO-PW",
            "calculation.job.quantumespresso.ph.PhCalculation.": "Quantum ESPRESSO-PH",
            "calculation.job.codtools.ciffilter.CiffilterCalculation.": "Codtools-ciffilter",
            "calculation.inline.InlineCalculation.": "Inline calculation",
            "calculation.job.wannier90.Wannier90Calculation.": "Wannier90",

            // data nodes
            "data.core.structure.StructureData.": "Structure",
            "data.core.parameter.ParameterData.": "Parameter",
            "data.core.array.ArrayData.": "Array",
            "data.core.array.kpoints.KpointsData.": "Kpoints",
            "data.core.array.trajectory.TrajectoryData.": "Trajectory",
            "data.core.orbital.OrbitalData.": "Orbital",
            "data.core.upf.UpfData.": "Upf",
            "data.core.remote.RemoteData.": "Remote",
            "data.core.cif.CifData.": "Cif",
            "data.core.folder.FolderData.": "Folder",
            "data.core.array.bands.BandsData.": "Bands",
            "data.core.singlefile.SinglefileData.": "Singlefile",
            "CALCULATION": "Calculation",
            "DATA": "Data",
            "CODE": "Code",
            "code.Code.": "Code",
            "COMPUTER": "Computer"
        },
        DATA: {
            DISCOVER: {
                SSSP: {
                    EFFICIENCY_PLOTS : "data/discover/sssp/convergences_efficiency/",
                    PRECISION_PLOTS : "data/discover/sssp/convergences_precision/",
                    CHESSBOARDS_PLOTS : "data/discover/sssp/chessboards/",
                    EOS_PLOTS : "data/discover/sssp/eos/",
                    BANDS_PLOTS : "data/discover/sssp/band_structures/",
                    PSEUDOS: "data/discover/sssp/pseudos/",
                    DOWNLOADS: "data/discover/sssp/downloads/",
                    DOWNLOADS_ARCHIVE: "https://archive.materialscloud.org/record/file?record_id=1732",
                    UPDATES: "data/discover/sssp/updates/"
                },
                KPCOVR: {
                    ARGININE: "https://archive.materialscloud.org/record/file/swift?file_id=fd83321d-1b1a-47c5-b580-4904bb07291b&record_id=458&filename=arginine-kpcovr-0.55.json.gz",
                    AZAPHENACENES: "https://archive.materialscloud.org/record/file/swift?file_id=5e5be597-893f-4b94-a02c-65d67d582f62&record_id=458&filename=azaphenacenes-kpcovr-0.65.json.gz",
                    CARBONS_00: "https://archive.materialscloud.org/record/file/swift?file_id=58139a6f-1543-4693-b4e8-47ff0e3e85ab&record_id=458&filename=C-VII-kpcovr-0.0.json.gz",
                    CARBONS_05: "https://archive.materialscloud.org/record/file/swift?file_id=588eaf0e-0c47-4b03-807a-03880c5acb49&record_id=458&filename=C-VII-kpcovr-0.5.json.gz",
                    CARBONS_10: "https://archive.materialscloud.org/record/file/swift?file_id=d17cd010-f4b7-4902-8133-7705df908786&record_id=458&filename=C-VII-kpcovr-1.0.json.gz",
                    CSD: "https://archive.materialscloud.org/record/file/swift?file_id=db6d1c96-5dfe-43d5-a157-d803cf7c6d8b&record_id=458&filename=CSD-1000R-kpcovr-0.5.json.gz",
                    DEEM_LOCAL: "https://archive.materialscloud.org/record/file/swift?file_id=f5552446-ecd5-4e9f-8a7e-dc725f6ea20d&record_id=458&filename=DEEM-local-kpcovr-0.5.json.gz",
                    DEEM_GLOBAL: "https://archive.materialscloud.org/record/file/swift?file_id=0520b742-a758-44d0-86df-fc00a7fba1b8&record_id=458&filename=DEEM-global-kpcovr-0.5.json.gz",
                    QM9_05: "https://archive.materialscloud.org/record/file/swift?file_id=f37cd921-2aa7-46ca-a71a-f99ff5109985&record_id=458&filename=qm9-12PC-kpcovr-0.5.json.gz",
                    QM9_10: "https://archive.materialscloud.org/record/file/swift?file_id=ce43ce5a-0a1c-4990-9685-d1efaec3e50d&record_id=458&filename=qm9-12PC-kpcovr-1.0.json.gz",
                }
            }
        }
    };
})());
{}
