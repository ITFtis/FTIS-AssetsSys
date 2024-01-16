/***** jquery templete new *****/
(function ($) {
    'use strict';
    var pluginName = 'temp__';
    var pluginclass = function (element, e) {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        this.$element = $(element);
        this.settings = {};
    };
    pluginclass.prototype = {
        constructor: pluginclass,
        init: function (options) {
            $.extend(this.settings, options);
            console.log(pluginName + ' init');
        }
    }; 
    $.fn[pluginName] = function (arg) {
        this.each(function () {
            var args, instance = $(this).data(pluginName);
            if (!instance) { //object options
                $(this).data(pluginName, new pluginclass(this));
                instance = $(this).data(pluginName);
            }
            if (typeof arg === 'undefined' || typeof arg === 'object') {

                if (typeof instance.init === 'function') {
                    instance.init(arg);
                }

            } else if (typeof arg === 'string' && typeof instance[arg] === 'function') {

                args = Array.prototype.slice.call(arguments, 1);

                return instance[arg].apply(instance, args);

            } else {

                $.error('Method ' + arg + ' does not exist on jQuery.' + pluginName);

            }

        });
    };
})(jQuery);

var whatMap = function (_map) {
    if (_map == undefined)
        alert('map is null at whatMap');
    if (_map.overlayMapTypes) //google
        return "google";
    else if(_map.hasOwnProperty('_leaflet_id'))
        return 'leaflet';
    else if(_map.hasOwnProperty('dragRotate'))
        return 'golife';
    else
        return "arcgis";
};

(function ($) {
    'use strict';

    //動態載入java script
    var getJavaScripts = function (_urls, _callback) {
         if (_urls) {
            var _c = 0;
            for (var i = 0; i < _urls.length; i++) {
                //if (window.require) {    //
                //    window.require([_urls[i]], function () { //引用arcgis，若呼叫 $.getScript會有問題>>arcgis加在script 最後即可解決
                //        _c++;
                //        if (_urls.length == _c)
                //            _callback();
                //    });
                //}
                //else {
                    $.getScript(_urls[i], function () {
                        _c++;
                        if (_urls.length == _c) {
                            _callback();
                        }
                    });
                //}
            }
        }
    };
    //取指定script的網址路徑
    function getScriptPath(filename) {
        var scripts = document.getElementsByTagName('script');
        if (scripts && scripts.length > 0) {
            for (var i in scripts) {
                if (scripts[i].src && scripts[i].src.match(new RegExp(filename + '\\.js$'))) {
                    return scripts[i].src.replace(new RegExp('(.*)' + filename + '\\.js$'), '$1');
                }
                else if (scripts[i].src && scripts[i].src.match(new RegExp(filename + '.min\\.js$'))) {
                    return scripts[i].src.replace(new RegExp('(.*)' + filename + '.min\\.js$'), '$1');
                }
            }
        }
    };

    $.AppConfigOptions = $.extend({
        script: {
            //gispath: "Scripts/gis"
        },
        default_loading_icon: undefined
    }, $.AppConfigOptions, true);

    if (!$.AppConfigOptions.script.gispath && getScriptPath("gis/Main"))
        $.AppConfigOptions.script.gispath = getScriptPath("gis/Main") + "gis";
    if (!$.AppConfigOptions.script.gispath && window.app && app.siteRoot)
        $.AppConfigOptions.script.gispath = app.siteRoot + 'Scripts/gis';
    //setTimeout(function () {
    //    var as = window.helper.misc.retrieveScriptPath("gis/Main")+"gis";
    //});

    if (!$.AppConfigOptions.default_loading)
        $.AppConfigOptions.default_loading = { icon: $.AppConfigOptions.script.gispath + "/images/loading/loading_black.gif", size: "0.9em" };
    //console.log("gis script path:" + $.AppConfigOptions.script.gispath);

    /***************plus in 物件定義***************/
    $.AppConfigOptions.def = {};
    $.AppConfigOptions.def.typh = { name: "typh", js: "/ext/typh/Typh.js" };
    $.AppConfigOptions.def.cloud = { name: "cloud", js: "/ext/cloud/Cloud.js" };
    $.AppConfigOptions.def.drawtool = { name: "gisdrawtool", js: "/ext/draw/Drawtool.js" };
    $.AppConfigOptions.def.mapBaseLayer = { name: "MapBaseLayer", js: "/ext/baselayer/MapBaseLayer.js" };
    $.AppConfigOptions.def.coordinateInfo = { name: "CoordinateInfo", js: "/ext/info/CoordinateInfo.js" };
    $.AppConfigOptions.def.export = { name: "ExportMap", js: "/ext/export/ExportMap.js" };
    $.AppConfigOptions.def.basepinctrl = { name: "BasePinCtrl", js: "/ext/meter/BasePinCtrl.js" };
    $.AppConfigOptions.def.pinctrl = { name: "PinCtrl", js: "/ext/meter/PinCtrl.js" };
    $.AppConfigOptions.def.polygonctrl = { name: "PolygonCtrl", js: "/ext/meter/PolygonCtrl.js" };
    $.AppConfigOptions.def.polylinectrl = { name: "PolylineCtrl", js: "/ext/meter/PolylineCtrl.js" };
    $.AppConfigOptions.def.kmlctrl = { name: "KmlCtrl", js: "/ext/meter/KmlCtrl.js" };
    $.AppConfigOptions.def.waterctrl = { name: "WaterCtrl", js: "/ext/meter/WaterCtrl.js" };
    $.AppConfigOptions.def.rainctrl = { name: "RainCtrl", js: "/ext/meter/RainCtrl.js" };
    $.AppConfigOptions.def.cctvctrl = { name: "CctvCtrl", js: "/ext/meter/CctvCtrl.js" };
    $.AppConfigOptions.def.boundary = { name: "Boundary", js: "/ext/boundary/Boundary.js" };
    $.AppConfigOptions.def.boundaryMap = { name: "BoundaryMap", js: "/ext/boundary/BoundaryMap.js" };
    $.AppConfigOptions.def.boundaryLayer = { name: "BoundaryLayer", js: "/ext/boundary/BoundaryLayer.js" };
    $.AppConfigOptions.def.boundaryFeatureLayer = { name: "BoundaryFeatureLayer", js: "/ext/arcgis/BoundaryFeatureLayer.js" };
    $.AppConfigOptions.def.localKml = { name: "LocalKml", js: "/ext/kml/LocalKml.js" };
    $.AppConfigOptions.def.basePosition = { name: "BasePosition", js: "/ext/position/BasePosition.js" };
    $.AppConfigOptions.def.districtPosition = { name: "DistrictPosition", js: "/ext/position/DistrictPosition.js" };
    $.AppConfigOptions.def.addressGeocode = { name: "addressGeocode", js: "/ext/geocode/AddressGeocode.js" };
    

    /********plus in 物件請求載入javascript********/
    $.AppConfigOptions.require = {};
    $.AppConfigOptions.require.request = function (jssp, callback) { //{name, jspath}
        var jss = [];
        var getjs = function () {
            if (jss.length > 0)
                getJavaScripts(jss, callback);
            else
                callback();
        };
        var _basepinctrljs;
       


        $.each(jssp, function () {
            if (this === undefined)
                return;
            if (!$.fn[this.name]) {
                if (this.js === $.AppConfigOptions.def.basepinctrl.js)
                    _basepinctrljs = $.AppConfigOptions.script.gispath + this.js;
                else
                    jss.push($.AppConfigOptions.script.gispath + this.js);
            }
        });

        if (!$.fn.jsPanel) {
            jss.push($.AppConfigOptions.script.gispath + "/jspanel/jquery.jspanel-1.10.0.js");
        }
        if (!window.helper || !window.helper.loaded) {
            jss.push($.AppConfigOptions.script.gispath + "/helper.js");
        }
        if (!window.xmlToJSON)
            jss.push($.AppConfigOptions.script.gispath + "/other/xmlToJSON.js");

        if (!$.colpick) {
            $('<link/>', {
                rel: 'stylesheet',
                type: 'text/css',
                href: $.AppConfigOptions.script.gispath + "/other/colpick.css"
            }).appendTo('head');
            jss.push($.AppConfigOptions.script.gispath + "/other/colpick.js");
        }

        if (_basepinctrljs) { //先確保basepinctrl load完再load其他的pin
            getJavaScripts([_basepinctrljs], getjs);
        }
        else
            getjs();
    };
    
    $.AppConfigOptions.require.all = function (callback) {
        $.AppConfigOptions.def.all = [];
        for (var key in $.AppConfigOptions.def) {
            if (key !== "all") {
                if (key == "boundary") {
                    if (window.boundary && window.boundary.PolygonBoundary)
                        continue;
                }
                $.AppConfigOptions.def.all.push($.AppConfigOptions.def[key]);
            }
        }
        $.AppConfigOptions.require.request($.AppConfigOptions.def.all, callback);
    }; 
    $.MapBaseLayerDefaultSettings = {
        layerid: "basemaplayer",
        tiles: {
            MAP_TYPE_ROADMAP: {
                id: "google_roadmap",
                name: "街圖",
                type: "WebTiledLayer",
                //spatialReference:new esri.SpatialReference({ wkid: 4326 }),
                url:document.location.protocol+"//${subDomain}.googleapis.com/vt?lyrs=m@262000000&src=apiv3&hl=zh-TW&x=${col}&y=${row}&z=${level}&style=47,37%7Csmartmaps",
                options:{ "subDomains":["mt0", "mt1", "mt2", "mt3"]},
            },
            
            MAP_TYPE_SATELLITE_HYBRID: {
                id: "google_hybrid",
                name: "衛星",
                type: "WebTiledLayer",
                url: document.location.protocol + "//${subDomain}.google.com/vt/lyrs=y&hl=zh-TW&x=${col}&y=${row}&z=${level}&s=Galile",
                options: { "subDomains": ["mt0", "mt1", "mt2", "mt3"] }
            },
            MAP_TYPE_PHYSICAL_HYBRID: {
                id: "google_terrain",
                name: "地形",
                type: "WebTiledLayer",
                url: document.location.protocol+"//${subDomain}.google.com.tw/vt/lbw/lyrs=p&hl=zh-TW&x=${col}&y=${row}&z=${level}&s=Gali",
                options: { "subDomains": ["khm0", "khm1", "khm2", "khm3"] }
            }
        },
        ext: {
            TGOS: {
                通用版電子地圖: { //url temp 參考https://gis.sinica.edu.tw/tgos/wmts
                    id: "tgos",
                    name: "通用版電子地圖",
                    type: "WebTiledLayer",
                    url: document.location.protocol + "//wmts.nlsc.gov.tw/wmts/EMAP5/default/GoogleMapsCompatible/${level}/${row}/${col}",///TOGS範例https://api.tgos.tw/TGOS_MAP_API/Docs/Example/94
                    //url: document.location.protocol + "//${subDomain}gis.sinica.edu.tw/tgos/file-exists.php?img=NLSCMAP_W-png-${level}-${col}-${row}",// "https://${subDomain}.tile.opencyclemap.org/cycle/${level}/${col}/${row}.png",
                    options: { subDomains: ["", "", ""] }
                },
                TGOS電子地圖: {
                    id: "TGOSMAP_W",
                    name: "TGOS電子地圖",
                    type: "WebTiledLayer",
                    url: document.location.protocol + "//${subDomain}gis.sinica.edu.tw/tgos/file-exists.php?img=TGOSMAP_W-png-${level}-${col}-${row}",// "https://${subDomain}.tile.opencyclemap.org/cycle/${level}/${col}/${row}.png",
                    options: { subDomains: ["", "", ""] }
                },
                福衛二號混合圖: {
                    id: "ROADMAP_W",
                    name: "福衛二號混合圖",
                    type: "WebTiledLayer",
                    url: document.location.protocol + "//${subDomain}gis.sinica.edu.tw/tgos/file-exists.php?img=ROADMAP_W-png-${level}-${col}-${row}",// "https://${subDomain}.tile.opencyclemap.org/cycle/${level}/${col}/${row}.png",
                    options: { subDomains: ["", "", ""] }
                },
                福衛二號影像: {
                    id: "F2IMAGE_W",
                    name: "福衛二號影像",
                    type: "WebTiledLayer",
                    url: document.location.protocol + "//${subDomain}gis.sinica.edu.tw/tgos/file-exists.php?img=F2IMAGE_W-png-${level}-${col}-${row}",// "https://${subDomain}.tile.opencyclemap.org/cycle/${level}/${col}/${row}.png",
                    options: { subDomains: ["", "", ""] }
                },
                地形暈渲混合圖: {
                    id: "HILLSHADE_W",
                    name: "地形暈渲混合圖",
                    type: "WebTiledLayer",
                    url: document.location.protocol + "//${subDomain}gis.sinica.edu.tw/tgos/file-exists.php?img=HILLSHADEMIX_W-png-${level}-${col}-${row}",// "https://${subDomain}.tile.opencyclemap.org/cycle/${level}/${col}/${row}.png",
                    options: { subDomains: ["", "", ""] }
                },
                地形暈渲圖: {
                    id: "HILLSHADE_W",
                    name: "地形暈渲圖",
                    type: "WebTiledLayer",
                    url: document.location.protocol + "//${subDomain}gis.sinica.edu.tw/tgos/file-exists.php?img=HILLSHADE_W-png-${level}-${col}-${row}",// "https://${subDomain}.tile.opencyclemap.org/cycle/${level}/${col}/${row}.png",
                    options: { subDomains: ["", "", ""] }
                },
                路網數值圖: {
                    id: "MOTCMAP_W",
                    name: "路網數值圖",
                    type: "WebTiledLayer",
                    url: document.location.protocol + "//${subDomain}gis.sinica.edu.tw/tgos/file-exists.php?img=MOTCMAP_W-png-${level}-${col}-${row}",// "https://${subDomain}.tile.opencyclemap.org/cycle/${level}/${col}/${row}.png",
                    options: { subDomains: ["", "", ""] }
                },
                航照影像: {//來源https://api.tgos.tw/TGOS_MAP_API/Docs/Example/94
                    id: "PHOTO2",
                    name: "航照影像",
                    type: "WebTiledLayer",//https://wmts.nlsc.gov.tw/wmts/PHOTO2/default/GoogleMapsCompatible/${level}/${row}/${col}
                    url: document.location.protocol + "//${subDomain}wmts.nlsc.gov.tw/wmts/PHOTO2/default/GoogleMapsCompatible/${level}/${row}/${col}",// "https://${subDomain}.tile.opencyclemap.org/cycle/${level}/${col}/${row}.png",
                    options: { subDomains: ["", "", ""] }
                }
            },
            Google: {
                silver: {
                    id: "sliver-street",
                    name: "銀白",
                    type: "WebTiledLayer",
                    url: document.location.protocol + "//maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i${level}!2i${col}!3i${row}!4i256!2m3!1e0!2sm!3i553276236!3m17!2szh-TW!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2zcy5lOmd8cC5jOiNmZmY1ZjVmNSxzLmU6bC5pfHAudjpvZmYscy5lOmwudC5mfHAuYzojZmY2MTYxNjEscy5lOmwudC5zfHAuYzojZmZmNWY1ZjUscy50OjIxfHMuZTpsLnQuZnxwLmM6I2ZmYmRiZGJkLHMudDoyfHMuZTpnfHAuYzojZmZlZWVlZWUscy50OjJ8cy5lOmwudC5mfHAuYzojZmY3NTc1NzUscy50OjQwfHMuZTpnfHAuYzojZmZlNWU1ZTUscy50OjQwfHMuZTpsLnQuZnxwLmM6I2ZmOWU5ZTllLHMudDozfHMuZTpnfHAuYzojZmZmZmZmZmYscy50OjUwfHMuZTpsLnQuZnxwLmM6I2ZmNzU3NTc1LHMudDo0OXxzLmU6Z3xwLmM6I2ZmZGFkYWRhLHMudDo0OXxzLmU6bC50LmZ8cC5jOiNmZjYxNjE2MSxzLnQ6NTF8cy5lOmwudC5mfHAuYzojZmY5ZTllOWUscy50OjY1fHMuZTpnfHAuYzojZmZlNWU1ZTUscy50OjY2fHMuZTpnfHAuYzojZmZlZWVlZWUscy50OjZ8cy5lOmd8cC5jOiNmZmM5YzljOSxzLnQ6NnxzLmU6bC50LmZ8cC5jOiNmZjllOWU5ZQ!4e0!5m1!5f2",
                    options: { "subDomains": ["", "", "", ""] }
                },
                gray: {
                    id: "ggray-street",
                    name: "灰階",
                    type: "WebTiledLayer",
                    url: document.location.protocol + "//maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i${level}!2i${col}!3i${row}!4i256!2m3!1e0!2sm!3i432136532!3m14!2szh-TW!3sUS!5e18!12m1!1e68!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2sp.s%3A-100!4e0!23i1301875",
                    options: { "subDomains": ["", "", "", ""] }
                },
                retro: {
                    id: "retro-street",
                    name: "復古",
                    type: "WebTiledLayer",
                    url: document.location.protocol + "//maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i${level}!2i${col}!3i${row}!4i256!2m3!1e0!2sm!3i553276248!3m17!2szh-TW!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2zcy5lOmd8cC5jOiNmZmViZTNjZCxzLmU6bC50LmZ8cC5jOiNmZjUyMzczNSxzLmU6bC50LnN8cC5jOiNmZmY1ZjFlNixzLnQ6MXxzLmU6Zy5zfHAuYzojZmZjOWIyYTYscy50OjIxfHMuZTpnLnN8cC5jOiNmZmRjZDJiZSxzLnQ6MjF8cy5lOmwudC5mfHAuYzojZmZhZTllOTAscy50OjgyfHMuZTpnfHAuYzojZmZkZmQyYWUscy50OjJ8cy5lOmd8cC5jOiNmZmRmZDJhZSxzLnQ6MnxzLmU6bC50LmZ8cC5jOiNmZjkzODE3YyxzLnQ6NDB8cy5lOmcuZnxwLmM6I2ZmYTViMDc2LHMudDo0MHxzLmU6bC50LmZ8cC5jOiNmZjQ0NzUzMCxzLnQ6M3xzLmU6Z3xwLmM6I2ZmZjVmMWU2LHMudDo1MHxzLmU6Z3xwLmM6I2ZmZmRmY2Y4LHMudDo0OXxzLmU6Z3xwLmM6I2ZmZjhjOTY3LHMudDo0OXxzLmU6Zy5zfHAuYzojZmZlOWJjNjIscy50Ojc4NXxzLmU6Z3xwLmM6I2ZmZTk4ZDU4LHMudDo3ODV8cy5lOmcuc3xwLmM6I2ZmZGI4NTU1LHMudDo1MXxzLmU6bC50LmZ8cC5jOiNmZjgwNmI2MyxzLnQ6NjV8cy5lOmd8cC5jOiNmZmRmZDJhZSxzLnQ6NjV8cy5lOmwudC5mfHAuYzojZmY4ZjdkNzcscy50OjY1fHMuZTpsLnQuc3xwLmM6I2ZmZWJlM2NkLHMudDo2NnxzLmU6Z3xwLmM6I2ZmZGZkMmFlLHMudDo2fHMuZTpnLmZ8cC5jOiNmZmI5ZDNjMixzLnQ6NnxzLmU6bC50LmZ8cC5jOiNmZjkyOTk4ZA!4e0!5m1!5f2",
                    options: { "subDomains": ["", "", "", ""] }
                },
                dark: {
                    id: "gdark-street",
                    name: "黑階",
                    type: "WebTiledLayer",
                    url: document.location.protocol + "//maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i${level}!2i${col}!3i${row}!4i256!2m3!1e0!2sm!3i480190100!3m14!2szh-TW!3sUS!5e18!12m1!1e68!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2zcy5lOmd8cC5jOiNmZjI0MmYzZSxzLmU6bC50LnN8cC5jOiNmZjI0MmYzZSxzLmU6bC50LmZ8cC5jOiNmZjc0Njg1NSxzLnQ6MTl8cy5lOmwudC5mfHAuYzojZmZkNTk1NjMscy50OjJ8cy5lOmwudC5mfHAuYzojZmZkNTk1NjMscy50OjQwfHMuZTpnfHAuYzojZmYyNjNjM2Yscy50OjQwfHMuZTpsLnQuZnxwLmM6I2ZmNmI5YTc2LHMudDozfHMuZTpnfHAuYzojZmYzODQxNGUscy50OjN8cy5lOmcuc3xwLmM6I2ZmMjEyYTM3LHMudDozfHMuZTpsLnQuZnxwLmM6I2ZmOWNhNWIzLHMudDo0OXxzLmU6Z3xwLmM6I2ZmNzQ2ODU1LHMudDo0OXxzLmU6Zy5zfHAuYzojZmYxZjI4MzUscy50OjQ5fHMuZTpsLnQuZnxwLmM6I2ZmZjNkMTljLHMudDo0fHMuZTpnfHAuYzojZmYyZjM5NDgscy50OjY2fHMuZTpsLnQuZnxwLmM6I2ZmZDU5NTYzLHMudDo2fHMuZTpnfHAuYzojZmYxNzI2M2Mscy50OjZ8cy5lOmwudC5mfHAuYzojZmY1MTVjNmQscy50OjZ8cy5lOmwudC5zfHAuYzojZmYxNzI2M2M!4e0!5m1!5f2",
                    options: { "subDomains": ["", "", "", ""] }
                },
                night_mode: {
                    id: "night-mode-street",
                    name: "夜晚",
                    type: "WebTiledLayer",
                    url: document.location.protocol + "//maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i${level}!2i${col}!3i${row}!4i256!2m3!1e0!2sm!3i553276212!3m17!2szh-TW!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2zcy5lOmd8cC5jOiNmZjI0MmYzZSxzLmU6bC50LnN8cC5jOiNmZjI0MmYzZSxzLmU6bC50LmZ8cC5jOiNmZjc0Njg1NSxzLnQ6MTl8cy5lOmwudC5mfHAuYzojZmZkNTk1NjMscy50OjJ8cy5lOmwudC5mfHAuYzojZmZkNTk1NjMscy50OjQwfHMuZTpnfHAuYzojZmYyNjNjM2Yscy50OjQwfHMuZTpsLnQuZnxwLmM6I2ZmNmI5YTc2LHMudDozfHMuZTpnfHAuYzojZmYzODQxNGUscy50OjN8cy5lOmcuc3xwLmM6I2ZmMjEyYTM3LHMudDozfHMuZTpsLnQuZnxwLmM6I2ZmOWNhNWIzLHMudDo0OXxzLmU6Z3xwLmM6I2ZmNzQ2ODU1LHMudDo0OXxzLmU6Zy5zfHAuYzojZmYxZjI4MzUscy50OjQ5fHMuZTpsLnQuZnxwLmM6I2ZmZjNkMTljLHMudDo0fHMuZTpnfHAuYzojZmYyZjM5NDgscy50OjY2fHMuZTpsLnQuZnxwLmM6I2ZmZDU5NTYzLHMudDo2fHMuZTpnfHAuYzojZmYxNzI2M2Mscy50OjZ8cy5lOmwudC5mfHAuYzojZmY1MTVjNmQscy50OjZ8cy5lOmwudC5zfHAuYzojZmYxNzI2M2M!4e0!5m1!5f2",
                    options: { "subDomains": ["", "", "", ""] }
                },
                hide_featires: {
                    id: "hide-featires-street",
                    name: "精簡街景",
                    type: "WebTiledLayer",
                    url: document.location.protocol + "//maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i${level}!2i${col}!3i${row}!4i256!2m3!1e0!2sm!3i553276236!3m17!2szh-TW!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2zcy50OjMzfHAudjpvZmYscy50OjR8cy5lOmwuaXxwLnY6b2Zm!4e0!5m1!5f2",
                    options: { "subDomains": ["", "", "", ""] }
                },
                g3d: {
                    id: "g3d",
                    name: "3D",
                    type: "WebTiledLayer",
                    url: "https://${subDomain}.googleapis.com/kh?v=134&hl=zh-TW&deg=0&x=${col}&y=${row}&z=${level}",
                    options: { "subDomains": ["khms0"] }
                    //url: document.location.protocol + "//${subDomain}.google.com/vt/lyrs=y&hl=zh-TW&x=${col}&y=${row}&z=${level}&s=Galile",
                    //options: { "subDomains": ["mt0", "mt1", "mt2", "mt3"] }
                },
            }
        },
        defaultSettings: { map: null, ctrlMode: "radio", defaultLayer: "街圖", initEvent: null }
    };

    /**************menuctrl***************/
    $.menuctrl={
        eventKeys: {
            popu_init_before: 'popu-init-event-before', popu_init_after: 'popu-init-event-after', ctrl_show_change: "showchange",
            init_ctrl_menu_completed: "init-menu-init_ctrl_menu_completed"
        }
    };

    $.checkFunctionMenu = function (selector, functions) {
        if (!functions || functions == "*")
            return;
        var $_functionCtrl = $(selector + " [data-function-id]");
        $.each($_functionCtrl, function () {
            var $_cctrl = $(this);
            var fid = $_cctrl.attr("data-function-id");
            var _isAuth = false;
            $_cctrl.addClass("none-auth-function");
            $.each(functions, function () {
                if (fid == this.Id) {
                    $_cctrl.removeClass("none-auth-function");
                    return false;
                }
            });
        })
        //刪除無權限item
        $(selector + " .none-auth-function").remove();
        $.each($(selector + " ul:not(:has(*))"), function () {
            if ($(this).parent("li").length > 0)
                $(this).parent("li").remove();
        });
    }
    $.initGisMenu = function (menu) {
        
        if (window.helper)
            __initGisMenu(menu);
        else {
            loadRequestScript(function () {
                __initGisMenu(menu);
            });
        }
    }
    var __initGisMenu = function (menu) {
        try {
            $('body').addClass('bootstrp-version-' + helper.bootstrap.getversion());
        } catch(e) { }
        //var popu_ctrl_container = $('<div class="popu-ctrl-container"/>');
        var popu_ctrl_container = $('.popu-ctrl-container');
        //$('#' + menuid).parent().append(popu_ctrl_container);
        var zidx = 0; //contrl popu_ctrl's z index
        var mainmenu = menu.indexOf(".") === 0 ? $(menu) : $("#" + menu);
        var mainmenu_height = mainmenu.height() == 0 ? 0 : (mainmenu.outerHeight ? mainmenu.outerHeight() : mainmenu.height());
        $('body')[0].style.setProperty('--mainmenu-height', mainmenu_height + 'px');
        $.each($(".popu-ctrl-menu"),function(){
            popu_ctrl_container.find( $(this).attr("href")).addClass("popu-ctrl-content");
        });

        //群組menu
        var gnToolsGroupCtrl = function () {
            var _$ctrls = $(".tools-group-ctrl", mainmenu);
            $.each(_$ctrls, function () {
                var _$ctrl = $(this).removeClass('dropdown-toggle');
                
                _$ctrl.find(".caret:first").remove();
                var _$ctrlcontainer = $(".popu-ctrl-container");
                //var _$target = $($("+ul", _$ctrl)[0].outerHTML.replace(/\n/g, '').replace(/   /g, '').trim()); //copy
                var _$target = $("+ul", _$ctrl);
                
                _$target.addClass("tools-group-panel");
                _$target.removeClass("dropdown-menu");
                _$target.appendTo(_$ctrlcontainer);

                if (!_$target.attr("id"))
                    _$target.attr("id",'id'+ helper.misc.geguid().replace(/-/g, ''));
                _$ctrl.attr("href", "#" + _$target.attr("id")).addClass("posit-ctrl-menu");
                $.each($(">li>a", _$target), function () {
                    var _$this = $(this);
                    _$this.addClass("tools-member-ctrl");
                    _$this.attr("title", _$this.html());
                    _$this.html("");
                    $('<span class="glyphicon ' + _$this.attr("data-glyphicon") + '"></span>').appendTo(_$this);
                });
            });
        };
       
        gnToolsGroupCtrl();
        var $popuCtrlMenu = $(".popu-ctrl-menu").on('click', function (evt) {
            
            var $current = $(this);
            //var po = $current.position().top;
            evt.preventDefault();
            $('.navbar-collapse', mainmenu).removeClass('in').addClass('collapse'); //3.X
            mainmenu.find('.collapse.show').removeClass('show'); //4.X
            var ctrl_content = $($(this).attr('href'));
            
            ctrl_content.show(); //
            var popu_ctrl;
            if (evt.clientX) {
                setLocalCache($current, { clientX: evt.clientX, clientY: evt.clientY });
            }

            if (ctrl_content.length > 0 && $(this).attr('popu-target') == undefined) {
                //ctrl_content.remove();
                
                //console.log("evt.clientX:" + evt.clientX);
                ctrl_content.show();
                ctrl_content.trigger($.menuctrl.eventKeys.popu_init_before); //觸發init
                //ui-widget-header
                var id = new Date().getTime();

                ctrl_content.css("min-height", "100%");
                var _theme = $current.attr("data-theme") ? $current.attr("data-theme") : "gdark";
                var jpleft = popu_ctrl_container.hasClass('fixed-at-left fixed-single') ? -480 : evt.clientX;
                var jp = $(".popu-ctrl-container").jsPanel({
                    id: id + "",
                    classes: $current.hasClass('tools-member-ctrl')?'jsPanel-window':'', //fixd-at-left用 20190906
                    //title: $(this).context.innerHTML+ ($(this).hasClass("tools-member-ctrl") ?" "+ $(this).attr("title"): "") ,
                    title: this.innerHTML + ($(this).hasClass("tools-member-ctrl") ? " " + $(this).attr("title") : ""),//20181226 query3.0
                    theme: _theme,
                    // contentBG: { "background": "#222222", padding: "0 3px 3px 3px" },
                    contentBG:{ padding: "0 3px 3px 3px" },
                    size: { width: "", height: "auto" },
                    overflow: 'auto',
                    //draggable: { stop: function (event, ui) { $(event.target).css("opacity", ""); }, handle: '.jsPanel-hdr-l' },//拖曳後會被設成1
                    draggable: { stop: function (event, ui) { $(event.target).css("opacity", ""); }, handle: '.jsPanel-hdr' },//20230113 for small panel drag remove
                    position: $.isSupportLocalStorage() ? { top: evt.clientY, left: jpleft } : { top: mainmenu_height, left: isDesktop() ? $(".popu-ctrl-container .jsPanel").length * 15 : "" },// $('#' + menuid).height() },// bottom: 100, right: 70 },
                    controls: { buttons: 'all', iconfont: 'bootstrap' },
                    content: ctrl_content,
                    //draggable: { handle: '.jsPanel-hdr-l' }
                }).addClass("popu-ctrl").on("onjspanelloaded", function (event, id) { //取消col-md-2 20180705
                    if (jp.position().left < 0) jp.css('left', 0);
                    if (jp.position().top < 0) jp.css('top', 0);
                });
                //.addClass("popu-ctrl").addClass("col-md-2").on("onjspanelloaded", function (event, id) {
                //});
                
                if (ctrl_content.attr('id'))
                    jp.addClass("jsPanel-" + ctrl_content.attr('id'));

                jp.on('resizestart', function (e) {
                    window.jspanel_resize_drag = true;
                });
                jp.on('resizestop', function () {
                    setLocalCache($current, { width: jp.width(), height: jp.height() }); //cache size 的狀態 
                    window.jspanel_resize_drag = false;
                });
                jp.on('dragstart', function (e) {
                    window.jspanel_resize_drag = true;
                });
                jp.on('dragstop', function () {
                    jp.attr('data-top',jp.position().top);
                    jp.attr('data-left', jp.position().left);
                    setLocalCache($current, { top: jp.position().top, left: jp.position().left }); //cache size 的狀態 
                    window.jspanel_resize_drag = false;
                });


                if ($(this).attr("data-default-width")) //預設及cache寬度
                    jp.attr("data-width", $(this).attr("data-default-width"));
                if ($(this).attr("data-default-height")) //預設及cache寬度
                    jp.attr("data-height", $(this).attr("data-default-height"));
                if ($(this).attr("data-default-top")) //cache top
                    jp.attr("data-top", $(this).attr("data-default-top"));

                //if (!$(this).attr("data-default-left"))
                //    $(this).attr("data-default-left", $((".popu-ctrl-container .jsPanel").length) * 30);
                if ($(this).attr("data-default-left")) //cache top
                    jp.attr("data-left", $(this).attr("data-default-left"));
                

                $(this).attr('popu-target', id);
                $(".jsPanel-content", jp).css("padding", "0 2px 2px 2px");



                //重新定義click的動作，原本會將整個jspanel 掉
                $(".jsPanel-hdr-r .jsPanel-hdr-r-btn-close", jp).unbind("click").on('click', function () {
                    popuSwitch($current, jp);
                    //jp.toggle('slide', { direction: 'left', duration: 300, easing: "easeOutQuad" }, displayJspanel);//resetAllMinJspanelLocation); //會觸發jqueryj會在dom外包一個<div class="ui-effects-wrapper">所以觸發 DOMNodeRemoved 及 onjspanelclosed event
                });
                //動態決定最大及最小鈕visible
                $(".jsPanel-hdr-r-btn-max", jp).hide();
                $(".jsPanel-hdr-r-btn-min", jp).hide();//20200513拿掉 .on('click',function () { $(".jsPanel-hdr-r-btn-max", jp).show(); $(".jsPanel-hdr-r-btn-min", jp).hide(); $(".jsPanel-hdr-r .jsPanel-hdr-r-btn-close", jp).hide(); });
                $(".jsPanel-hdr-r-btn-max", jp).on('click', function () { $(".jsPanel-hdr-r-btn-max", jp).hide(); $(".jsPanel-hdr-r-btn-min", jp).show(); $(".jsPanel-hdr-r .jsPanel-hdr-r-btn-close", jp).show(); });

                jp.mouseenter(function () { jp.front(); });


                
                //if (!isDesktop() || !$.isSupportLocalStorage())
                    resetAllPopuctrlsPosition();
                //setTimeout(function () {
                    //jp.css("top", "100px").css('left',"300px");
                //});
                ctrl_content.trigger($.menuctrl.eventKeys.popu_init_after); //觸發init
                jp.hide();
            }

            zidx++;

            var ctrl = $('#' + $(this).attr('popu-target'));

            //setLocalCache($current, { show: !ctrl.is(":visible") }); //cache show 的狀態
            popuSwitch($current, ctrl);
            
            ////ctrl.toggle("slide", { direction: 'left', duration: 300, easing: "easeOutQuad" }, displayJspanel);//會觸發jqueryj會在dom外包一個<div class="ui-effects-wrapper">所以觸發 DOMNodeRemoved 及 onjspanelclosed event
            
        }).on("setActive", function (evt, active) { 
            //console.log(evt.target.innerHTML+active);
            var $current = $(evt.target);
            if (active && !$current.hasClass("selected")) {
                $current.trigger("click");
            }
            else if (!active && $current.hasClass("selected")) {
                $current.trigger("click");
            }
        });
        //$("body").on("onjspanelclosed", function (event, id) {
        //    console.log("jspanel closed id:" + id);
        //});
        var $positCtrlMenu = $(".posit-ctrl-menu").on('click', function (evt) {
            var $current = $(this);
            
            var _cache_show = $current.attr("data-cache-show");
            evt.preventDefault();
            $('.navbar-collapse', mainmenu).removeClass('in').addClass('collapse');//3.X
            mainmenu.find('.collapse.show').removeClass('show'); //4.X
            
            var ctrl_content = $($(this).attr('href'));//.toggleClass('selected');
            if (ctrl_content.length > 0 && $(this).attr('popu-target') == undefined) {
                ctrl_content.trigger($.menuctrl.eventKeys.popu_init_before); //觸發init

                ctrl_content.hide();
                $(this).attr('popu-target', new Date().getTime());//.css('top', $('#' + menuid).height());
                ctrl_content.trigger($.menuctrl.eventKeys.popu_init_after); //觸發init
            };
            
            var _dir = ctrl_content.attr('data-display-direction') || $current.attr('data-display-direction') ;
            if (_cache_show != 'false')
                setLocalCache($current, { show: !ctrl_content.is(":visible") }); //cache show 的狀態

            var animationFinish = function () {
                if (ctrl_content.is(":visible"))
                    ctrl_content.addClass("selected");
                else
                    ctrl_content.removeClass("selected");
            }
            if ('up-down' === _dir) {
                if (ctrl_content.is(":hidden"))
                    ctrl_content.slideDown(500, animationFinish);
                else
                    ctrl_content.slideUp(500, animationFinish);
            }
            else
                ctrl_content.toggle('slide', { direction: _dir ? _dir : 'left', easing: "easeInOutBack" }, 500, animationFinish);


            ctrl_content.mouseenter(function () {
                //if (ctrl_content.hasClass('fixed-show'))
                //    return;
                var zi = 0;
                $('.jsPanel').each(function () {
                    if ($(this).zIndex() > zi) {
                        zi = $(this).zIndex();
                    }
                });
                ctrl_content.css('z-index',zi+1);
            });
            
            $current.toggleClass("selected");
           
            $current.trigger($.menuctrl.eventKeys.ctrl_show_change, $current.hasClass("selected"));
        }).on("setActive", function (evt, active) {
            var $current = $(evt.target);
            if (active && !$current.hasClass("selected")) {
                $current.trigger("click");
            }
            else if (!active && $current.hasClass("selected")) {
                $current.trigger("click");
            }
        });

        //隱藏menu功能控制項
        //$('.navbar-header', mainmenu).before($('<div class="close-mainmenu"><span title="隱藏" class=" glyphicon glyphicon-export"></span></div>'));
        //$('.navbar-collapse', mainmenu).before($('<div class="close-mainmenu"><span title="隱藏" class=" glyphicon glyphicon-export"></span></div>'));
        $('<div class="close-mainmenu"><span title="隱藏" class=" glyphicon glyphicon-export"></span></div>').prependTo($('.navbar-collapse', mainmenu));
        var sdfsd = $('.glyphicon.glyphicon-export', mainmenu);

        $('.close-mainmenu', mainmenu).on('click', function () {
            mainmenu.toggle('slide', { direction: 'top', easing: "easeInOutCubic" }, 500);
        });
        mainmenu.after('<div style="right:0px;position: absolute;top:0;z-index:' + ((mainmenu.css('z-index')=='auto' ?950: mainmenu.css('z-index')) - 1) + ';"><button  class=" show-mainmenu" ><span title="功能選單" class="glyphicon glyphicon-align-justify"></span></button></div>');
        $('.show-mainmenu').on('click', function () {
            mainmenu.toggle('slide', { direction: 'top', easing: "easeInOutBack" }, 500);
        });

        var listenFixedLeftAnimationPopu = function ($trigglea, $popu) {
            var isSwitchPopu = isDesktop();
            var animationClass = "ctrl-transition-ing " + (isSwitchPopu ? 'switch' : 'popu-slide');
            $popu.addClass(animationClass);//.toggleClass("selected");;
            //webkit 不用listen webkitTransitionEnd 因會同時觸發 transitionend及webkitTransitionEnd
            $popu.one('transitionend oTransitionEnd otransitionend MSTransitionEnd',
                function (evt) {
                    clearTimeout(_supplementTimer);
                    //console.log(evt.type+" "+ _show+" n top:" + $popu.position().top + " left:" + $popu.position().left);
                    setTimeout(function () {
                        $popu.removeClass(animationClass);
                        if (!$trigglea.hasClass("selected")) { //不能用_show 因連續開及關會有問題
                            $popu.hide();
                        }
                    }, 10);
                });
            var _supplementTimer = setTimeout(function () { //預防如popu-slide在非fixed-show(menu在勾選狀態)，按下menu關掉此控制項transition不會被觸發(left的屬性一樣)
                $popu.removeClass(animationClass);
                if (!$trigglea.hasClass("selected")) {
                    $popu.hide();
                }
            }, 650);
        }

        var _popuNoCacheCount = 0;
        var popuSwitch = function ($trigglea, $popu) {
            $trigglea.toggleClass("selected"); //打勾
            var _show = $trigglea.hasClass("selected");
            var _cache_show = $trigglea.attr("data-cache-show");

            
            var isSwitchPopu = isDesktop();
            var animationClass ="ctrl-transition-ing "+ (isSwitchPopu ? 'switch' : 'popu-slide');
            $popu.show().addClass(animationClass);//.toggleClass("selected");;
            
            setTimeout(function () {
                $popu.toggleClass("selected");//要先加switch 在加 selected才會有效果
                //bootstrap.js jquery $.support.transition.end
                listenFixedLeftAnimationPopu($trigglea, $popu);
               
                if (_cache_show != 'false')
                    setLocalCache($trigglea, { show: _show }); //cache show 的狀態
                $trigglea.trigger($.menuctrl.eventKeys.ctrl_show_change, _show);
            });
            
            //$popu.show();
            if (isSwitchPopu) {
                if ($.isSupportLocalStorage()) {
                    //"jsPanel-min-container"
                    if ($popu.parents("#jsPanel-min-container").length == 0) { //非最小化
                        var po = $popu.position();
                        var datacache = getLocalCache($trigglea);
                        if (_show) {
                            //20220923增加處裡data-default-top
                            var _top = (datacache && datacache.top) || $popu.attr('data-top') || (mainmenu.is(':visible') ? mainmenu_height : 10);
                            var _left = (datacache && datacache.left) || $popu.attr('data-left') || (_popuNoCacheCount++) * 40;
                            $popu.css("top", _top + "px");
                            $popu.css("left", _left + "px");
                            //if (datacache && datacache.top) //cache top
                            //    $popu.css("top", datacache.top + "px");
                            //else
                            //    $popu.css("top", (mainmenu.is(':visible') ? mainmenu_height : 10) + "px");
                            //if (datacache && datacache.left) //cache top
                            //    $popu.css("left", datacache.left + "px");
                            //else
                            //    $popu.css("left", (_popuNoCacheCount++) * 40 + "px");
                        } else {
                            if (datacache && datacache.clientY) //cache top
                                $popu.css("top", datacache.clientY + "px");
                            if (datacache && datacache.clientX) //cache top
                                $popu.css("left", datacache.clientX + "px");
                        }
                    }
                    else  //最小化時trigger("click")，先將jspanel還原
                        $(".jsPanel-hdr-r-btn-max", $popu).trigger("click");
                }
            }

            

            
        };
        $('.posit-ctrl-menu,.popu-ctrl-menu').on($.menuctrl.eventKeys.ctrl_show_change, function (evt, _show) {
            triggerShowGroup.call(this, evt, _show);
        });
        var triggerShowGroup = function (evt, _show) {
            var $triggersource = $(this);
            if ($triggersource.attr('trigger-show-group-form-other')) {
                setTimeout(function () {
                    $triggersource.removeAttr('trigger-show-group-form-other');
                });
                return;
            }
            var _show_group_all = $triggersource.attr("data-show-group-all");
            if (_show_group_all) {
                mainmenu.find('[data-show-group-all="' + _show_group_all + '"]:not([href="' + $triggersource.attr("href") + '"])')
                    .attr('trigger-show-group-form-other', true).trigger('setActive', [_show]);
            }
            var _show_group_single = $triggersource.attr("data-show-group-single");
            if (_show_group_single) {
                mainmenu.find('.selected[data-show-group-single="' + _show_group_single + '"]:not([href="' + $triggersource.attr("href") + '"])')
                    .attr('trigger-show-group-form-other', true).trigger('setActive', [false]);
            }
        }
      
        var resetAllPopuctrlsPosition = function () {
            var popu_ctrl_container = $('.popu-ctrl-container').removeClass('width_100');;
            var popu_ctrls = $('.popu-ctrl-container .popu-ctrl');
            var is_fixed_at_left = $('.popu-ctrl-container.fixed-at-left').length == 1;
            if (popu_ctrls.length > 0) {
                //Andriod已解決(無法關閉是因draggable、resizable問題，已修正draggable、resizable的handle)
                //var isAndriod = window.helper.misc.MobileOperatingSystem.Android == window.helper.misc.getMobileOperatingSystem();
                if (isDesktop()) { //一般layout
                    $.each(popu_ctrls, function (idx, item) {
                        var $item = $(item);
                        $item.css('position', 'absolute');
                        //console.log("$item.attr('data-width'):" + $item.attr('data-width'));
                        if ($item.attr('data-width') && $item.attr('data-width').trim() !="") {
                            $item.css('width', $(item).attr('data-width'));
                            $(item).attr('data-width', ""); //要移除 data-width屬性不然不能 控制resize
                            
                        }
                        if ($item.attr('data-height')) {
                            $item.css('height', $(item).attr('data-height'));
                            $(item).attr('data-height', ""); //要移除 data-width屬性不然不能 控制resize
                        }

                        //if (!$.isSupportLocalStorage()) { //支援localstoeage會在popuSwitch中給top left
                        if ($item.attr('data-top') !== undefined) {
                            var ctop = $(item).attr('data-top').replace("px", "");
                            var cleft = $(item).attr('data-left').replace("px", "");
                            var windowh = $(window).height();//window.outerHeight
                            var windoww = $(window).width();//window.outerWidth
                            if (windowh - ctop < 70) ctop = windowh - 70;
                            if (windoww - cleft < 200) cleft = windoww - 200;
                            $item.css('top', ctop + "px");
                            $item.css('left', cleft + "px");
                        }
                        //以下可左右移出關閉popu關閉
                        if ($("").draggable && $item.hasClass('horizontal-drag-remove')) 
                            $item.draggable("option", "axis", false).off('drag').off('dragstop').removeClass('horizontal-drag-remove');
                        
                    });

                }
                else {// (!isDesktop() && $(popu_ctrls[0]).css('position') != 'relative') { //small 一般layout
                    var top_temp = mainmenu_height;
                    $.each(popu_ctrls, function (idx, item) {
                        
                        var $item = $(item);
                        if ($item.css('position') != 'relative') {
                            $item.attr('data-top', $(item).css('top'));
                            $item.attr('data-left', $(item).css('left'));

                            if (!$item.hasClass('fix-popu-ctrl-toleft') && ($item.attr("style") + "").indexOf("width:") >= 0) { //無width style是用bootstrape的col-md-2
                                $item.attr('data-width', $(item).css('width'));
                                $item.css('width', 'auto');
                            }
                            
                            $item.css('top', top_temp);
                            $item.css('left', '0px');
                            $item.css('position', 'relative');
                            
                            //if (is_fixed_at_left)
                            //    $item.css('width', $(document).width()+'px');
                            //以下可左右移出關閉popu啟用
                            if($("").draggable)
                                $item.draggable("option", "axis", "x");
                            
                            $item.addClass('horizontal-drag-remove');

                            var dragstarttime;
                            $item.off('dragstart').on('dragstart', function () {
                                dragstarttime = Date.now();
                                popu_ctrl_container.addClass('width_100'); //確保有足夠width可drag，fixed_at_left下width是20px
                            }).off('drag').on('drag', function (e) {
                                if ($item.position().left > 0) //只允許往右移除
                                    return false;
                            }).off('dragstop').on('dragstop', function () {
                                var w = $item.width();
                                var p = $item.position().left;
                                 var ct= Date.now() - dragstarttime;
                                if (Math.abs(p / w) > (ct < 360 ? .1 : .25)) {
                                    $item.find('>.jsPanel-hdr > .jsPanel-hdr-r > .jsPanel-hdr-r-btn-close').trigger('click');
                                    setTimeout(function () {popu_ctrl_container.removeClass('width_100');  $item.css('left', '0px'); }, 600);
                                }
                                else {
                                    $item.css('left', '0px');
                                    popu_ctrl_container.removeClass('width_100');
                                }
                            });
                        };
                    });

                }
            }
        };
        var isMobile;
        try {
            isMobile = {
                Android: function () {
                    return navigator.userAgent.match(/Android/i);
                },
                BlackBerry: function () {
                    return navigator.userAgent.match(/BlackBerry/i);
                },
                iOS: function () {
                    return navigator.userAgent.match(/iPhone|iPod/i);//iPhone|iPad|iPod/i
                },
                Opera: function () {
                    return navigator.userAgent.match(/Opera Mini/i);
                },
                Windows: function () {
                    return navigator.userAgent.match(/IEMobile/i);
                },
                any: function () {
                    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
                }
            };
        } catch (ex) { }

        var isDesktop = function () {
            //20220825
            //return $('.navbar-header .navbar-toggle,.navbar-toggler', mainmenu).is(':hidden') && (isMobile ? !isMobile.any() : false);
            return isMobile ? !isMobile.any() : false;
        };
        //window size change--改變 popu-ctrl的相關屬性
        var currentIsDesktop = isDesktop();
        $(window).resize(function () {
            setTimeout(function () {
                var tempIsDesktop = isDesktop();
                if (currentIsDesktop != tempIsDesktop || !window.jspanel_resize_drag) { //jspanel resize、drag會觸發window.resize
                    resetAllPopuctrlsPosition();
                    //popuCtrlFixedatLeft();
                }
                currentIsDesktop = tempIsDesktop;
            }, 50);
        });

        var displayJspanel = function () {
            if ($(this).hasClass("minimized")) {
                $(this).css("display", "block");
                $(".jsPanel-hdr-r-btn-max", $(this)).trigger("click");
            }
            $(".jsPanel-hdr-r-btn-max", $(this)).hide();
            resetAllMinJspanelLocation();
        };
        var resetAllMinJspanelLocation = function (evt, asdsad) {
            var items = [];
            $.each($('.jsPanel.minimized'), function (idx, item) {
                if($(item).css("display")!=="none")
                    items.push(item);
            });
            for (var i = 0; i < items.length; i++) {
                var left = (i * 150) + 'px';
                $(items[i]).animate({ left: left });
            }
        };
        var setLocalCache = function (jquerytarget, cvalue) { //jquerytarget是選單功能的<a>
            $.localCache.set(jquerytarget.text() ? jquerytarget.text() : jquerytarget.attr('title'), $.extend(getLocalCache(jquerytarget), cvalue));
        };
        var getLocalCache = function (jquerytarget) {
            return $.localCache.get(jquerytarget.text() ? jquerytarget.text() : jquerytarget.attr('title')); //tools-member-ctrl 沒有text只有title
        };

        //將popuctrl預設固定在右邊由上而下排列
        //var $popuCtrlFixedContainer;
        var popuCtrlFixedatLeft = function () {
            if (!popu_ctrl_container.hasClass('fixed-at-left'))
                return;
            var isFixedSingle = popu_ctrl_container.hasClass('fixed-single');
            mainmenu.find('.popu-ctrl-menu').each(function(){
                //var $_mctrl = $(this).off($.menuctrl.eventKeys.ctrl_show_change).on($.menuctrl.eventKeys.ctrl_show_change, function (evt, _show) {//會關掉呼叫triggerShowGroup，造成無Sigle show
                var $_mctrl = $(this).on($.menuctrl.eventKeys.ctrl_show_change, function (evt, _show) {
                    var $ctrl = $('#' + $(this).attr('popu-target'));
                    var sdd = $(this).attr('popu-target');//
                    if (!isFixedSingle) {
                        $ctrl.prependTo(popu_ctrl_container);
                        if(_show)
                            popu_ctrl_container.animate({ scrollTop: 0 }, 500);
                        popu_ctrl_container.attr('data-fixed-count', popu_ctrl_container.find('.popu-ctrl.selected:not(.jsPanel-window)').length);
                    }
                    else {
                        //$ctrl.css('z-index', 999);
                        _show ? $ctrl.addClass('fixed-show') : $ctrl.removeClass('fixed-show');
                        _show ? popu_ctrl_container.addClass('has-fixed-show') : popu_ctrl_container.removeClass('has-fixed-show');
                        var sadd = $ctrl.width();
                        if(currentIsDesktop)
                            $ctrl[0].style.setProperty('--adj-width', -$ctrl.width() + 'px');
                    }
                });
                //$($_mctrl.attr('href')).off($.menuctrl.eventKeys.popu_init_after).on($.menuctrl.eventKeys.popu_init_after, function () { //off???20230211
                $($_mctrl.attr('href')).on($.menuctrl.eventKeys.popu_init_after, function () {
                    var $_that = $(this);
                    var $_jp= $_that.parents('.popu-ctrl').addClass('fix-popu-ctrl-toleft');
                    //內容視窗縮放
                    $('<div class="jsPanel-hdr-r-btn-content"><span class="glyphicon glyphicon-play"></span></div>').appendTo($_that.parents('.popu-ctrl').find('.jsPanel-hdr-r')).find('.glyphicon').on('click', function () {
                        $_jp.find('.jsPanel-content').toggleClass('offdisplay');
                        $(this).parent().toggleClass('ctrl-content-display');
                    });
                    //浮動視窗
                    $('<div class="jsPanel-hdr-r-btn-modal"><span class="glyphicon glyphicon-modal-window"></span></div>').appendTo($_that.parents('.popu-ctrl').find('.jsPanel-hdr-r')).find('.glyphicon').on('click', function () {
                        $(this).toggleClass('glyphicon-modal-window');
                        $(this).toggleClass('glyphicon-pushpin');
                        $_jp.toggleClass('jsPanel-window');
                        $_jp[0].style.left = (popu_ctrl_container.width()+6 )+ 'px';
                        $_jp[0].style.top = mainmenu_height + 'px';// '55px'; 
                        popu_ctrl_container.attr('data-fixed-count', popu_ctrl_container.find('.popu-ctrl.selected:not(.jsPanel-window)').length);
                    });
                    //釘固單一視窗縮放
                    
                    if (isFixedSingle) {
                        $_mctrl.attr('data-show-group-single', 'fixed-left-single');
                        $('<div class="jsPanel-hdr-r-btn-collapse"><span class="glyphicon glyphicon-chevron-right to-show"></span><span class="glyphicon glyphicon-chevron-left to-collapse"></span></div>').appendTo($_that.parents('.popu-ctrl').find('.jsPanel-hdr-r')).on('click', function () {
                            $_jp.toggleClass('fixed-show');
                            popu_ctrl_container.toggleClass('has-fixed-show');
                            $_jp.show(); //有時手機板會被hidden??
                            listenFixedLeftAnimationPopu($_mctrl, $_jp);
                        });
                        var jphs = getComputedStyle($_jp.find('> .jsPanel-hdr')[0]);
                        if (jphs.backgroundColor == 'transparent' || jphs.backgroundColor == 'rgba(0, 0, 0, 0)') //20230218 ???
                            $_jp.find('> .jsPanel-hdr')[0].style.backgroundColor = 'white';
                        if (!helper.misc.detect.isIE) {
                            $('<div class="resizer"><div class="size-icon"></div></div>').appendTo($_jp);
                            makeResizableCtrlPanel($_jp);
                        }
                    }
                    $_jp.width(''); //清除寬度，jp 產生後會給一個width
                    $_jp.attr('data-width', '');
                });
                if (isFixedSingle) {
                    $_mctrl.attr('data-show-group-single', 'fixed-left-single');
                }
            });
            $('.posit-ctrl-menu').each(function () {
                var $_content = $($(this).attr('href'));
                if ($_content.parent().hasClass('fixed-at-left')) {
                    $_content.css('position', 'fixed');
                    //IE parent{position:absolute, overflow-y:auto} 如child{position:fixed}當child在parent.container外匯看不到
                    if (window.navigator.userAgent.indexOf('MSIE ') >= 0 || window.navigator.userAgent.indexOf('Trident/') >= 0) {
                        $_content.css('overflow', 'hidden');
                    }
                }
            });

            //調整fixed at left 大小
            function makeResizableCtrlPanel($_e) {
                //div = popu_ctrl_container[0];//.attr('class');
                var _appendw = $_e.hasClass('jsPanel') ? 30 : 0;
                var element = $_e[0];// document.querySelector(div);
                var resizers = $_e.find('.resizer');//  document.querySelectorAll(div + ' .resizer')
                for (var i = 0; i < resizers.length; i++) {
                    var currentResizer = resizers[i];
                    currentResizer.addEventListener('mousedown', function (e) {
                        if (e.button != undefined && e.button == 2)
                            return;
                        e.preventDefault()
                        window.addEventListener('mousemove', resizeCtrlPanel)
                        window.addEventListener('mouseup', stopResizeCtrlPanel)
                    })
                }
                var _mousemovetimerflag;
                var _jspanelresizestoptimerflag;
                function resizeCtrlPanel(e) {
                    clearTimeout(_mousemovetimerflag);
                    if (element.style.maxWidth != 'none')
                        element.style.maxWidth = 'none';

                    _mousemovetimerflag = setTimeout(function () {
                        //element.style.setProperty('width', (e.pageX - element.getBoundingClientRect().left + _appendw) + 'px', 'important')
                        var _w =  e.pageX - element.getBoundingClientRect().left + _appendw;
                        element.style.setProperty('width', _w + 'px')
                        element.style.setProperty('--adj-width', -(_w - _appendw) + 'px');
                        popu_ctrl_container[0].style.setProperty('--adj-popu-width', -(_w - _appendw) + 'px');
                        clearTimeout(_jspanelresizestoptimerflag);
                        _jspanelresizestoptimerflag = setTimeout(function () { //如$_e有包含jsPanel則觸發resizestop
                            if ($_e.hasClass('jsPanel')) $_e.trigger('resizestop');
                            $_e.find('.jsPanel').trigger('resizestop');
                        }, 100);
                    }, 20);
                }

                function stopResizeCtrlPanel() {
                    window.removeEventListener('mousemove', resizeCtrlPanel)
                }
            }

            if (!isFixedSingle) {
                $('<div class="resizer"><div class="size-icon"></div></div>').appendTo(popu_ctrl_container);
                makeResizableCtrlPanel(popu_ctrl_container);
            }
        }

        setTimeout(function () {
            popuCtrlFixedatLeft();
            if (mainmenu.attr("data-ctrl-cache") === "true") {
                //還原cache
                $.each($(".popu-ctrl-menu,.posit-ctrl-menu "), function () {
                    var cache = getLocalCache($(this));
                    if (cache) {
                        for (var k in cache) {
                            if (cache[k] !== undefined)
                                $(this).attr("data-default-" + k, cache[k]);
                        }
                    }
                });
            }
            try{ //IE 再display:none 下會有error
                $(".popu-ctrl-menu[data-default-show=true],.posit-ctrl-menu[data-default-show=true]", mainmenu).trigger("setActive", [true]).blur(); //呼叫blur，在chrome 'tools-group-ctrl'會focus
                $(".tools-group-panel .popu-ctrl-menu[data-default-show=true],.tools-group-panel .posit-ctrl-menu[data-default-show=true]").trigger("setActive", [true]).blur();
            }catch(ex){
                console.log(ex);
            }
            
            mainmenu.trigger($.menuctrl.eventKeys.init_ctrl_menu_completed);
        },800);
       
        return this;
    };

    ///gis////////////////////////
    $.kmlhelper = function (options) { // arcgis kml最大限制10M options:{map,kmlurl, layerid, onLoaded,autoPolygonIndextoLower}
        var settings = { autoPolygonIndextoLower: true, onLoaded: undefined };
        $.extend(settings, options);

        if (settings.map != undefined) {
            require(['esri/layers/KMLLayer'], function (KMLLayer) {
                var kml = new KMLLayer(encodeURI(options.kmlurl), { id: settings.layerid });

                settings.map.addLayer(kml);
                if (settings.autoPolygonIndextoLower === true) {
                    $.setPolygonIndextoLower(settings.map, kml, settings.onLoaded);
                }
                else if (settings.onLoaded) {
                    kml.on("load", function (evt) { if (settings.onLoaded) settings.onLoaded(kml); });
                }
            });
        }
    };

    //解新kml description to object (str:string;pSplit:屬性間分割符號字串(<BR>);kvSplit:屬性明稱及值分割符號字串(:))
    $.parserStringToObject = function (str, pSplit, kvSplit) {
        var desc = {};
        if (str) {
            $.each(str.split(pSplit), function (didx, item) {
                if (!item || !item.trim())
                    return;

                var attrs = item.split(kvSplit);
                if (attrs.length == 0)
                    return;
                if (attrs.length == 1)
                    desc[attrs[0].trim()] = attrs[0].trim();
                else
                    desc[attrs[0].trim()] = attrs[1].trim();

            });
        }
        return desc;
    };
    //將kmllayer中polygon移至底層
    var polygon_lower_index = 0;
    $.setPolygonIndextoLower = function (map, layer, callback) {
        require(["dojo/_base/connect", "esri/symbols/SimpleMarkerSymbol"], function (connect, SimpleMarkerSymbol) {
            var layer_declaredClass = layer.__proto__ ? layer.__proto__.declaredClass : layer.declaredClass;

            if (layer_declaredClass === "esri.layers.KMLLayer") { //每一kmllayer會包含featureLayer或kmllayer(kml包kml)
                layer.on("load", function (evt) { //包kmz的kml load
                    var lyrs = evt.layer.getLayers();

                    var _update_count = 0;
                    $.each(lyrs, function (idx, la) {
                        $.setPolygonIndextoLower(map, la, function () {
                            _update_count++;
                            if (_update_count === lyrs.length && callback) {
                                callback(layer);
                            }
                        });

                    });
                });
                layer.on("error", function (evt) {
                    callback(layer, evt, "error");
                });
            }
            else if (layer_declaredClass === "esri.layers.FeatureLayer") {
                var obj = $.parseJSON(layer._json);
                if (obj.featureSet.features.length > 0) {
                    var _visibility = Boolean(obj.featureSet.features[0].attributes.visibility);
                    if (_visibility) {
                        var firstGraphicsUpdate = connect.connect(layer, "onUpdate", function () {
                            connect.disconnect(firstGraphicsUpdate); //移除 onUpdate listen，不然每次zoom的圖有變化都會觸發
                            if (layer.graphics.length > 0 && layer.graphics[0].geometry.type === "polygon") { //Polygon 往下移
                                //var sdsdsd = esri.geometry.webMercatorToGeographic(layer.graphics[0].geometry); //esri.graphicsExtent(layer.graphics)//Mercator to WGS84
                                map.reorderLayer(layer, polygon_lower_index);
                                polygon_lower_index++;
                                //layer.setScaleRange(0,12);
                            }

                            if (callback)
                                callback(layer);

                            console.log(layer.id + ">>onload>");
                        });

                    }
                    else {
                        if (callback)
                            callback(layer);
                    }
                }
                else {
                    if (callback)
                        callback(layer);
                }

            }
            else if (layer_declaredClass === "esri.layers.MapImageLayer") {
                if (callback)
                    callback(layer);
            }

        });
    };

 

    //載入kml圖層，並儲存localStorage(只針對FeatureLayer會cache) ***callbackc回傳參數是FeatureLayer 或  ps:此功能僅針對kml包一種layer
    $.loadKmllayer = function (map, kmlurl, kmllayerid, uselocalStorage, kmlversion, callback) {
        var featrueCollection = null;
        var localStorageKey = kmlurl;
        try {
            if (localStorage && uselocalStorage) { //從localStorage取資料
                var storageData = JSON.parse(localStorage.getItem(localStorageKey));
                if (storageData) {
                    if (storageData.version == kmlversion)
                        featrueCollection = storageData.data;
                    else { //舊版本>>移除
                        localStorage.removeItem(localStorageKey);
                        console.log(kmllayerid + " reomve old localStorage ;old version:" + storageData.version + "  new version:" + kmlversion);
                    }
                }
            }
            if (localStorage && !uselocalStorage) { //不用localStorage>>移除
                localStorage.removeItem(localStorageKey);
                console.log(kmllayerid + " not use localStorage ;");
            }
        } catch (ex) { }
        if (featrueCollection) {
            require(["esri/layers/FeatureLayer"], function (FeatureLayer) {
                /* code goes here */
                var fl = new FeatureLayer(featrueCollection, { id: kmllayerid + "_0" });
                map.addLayer(fl);
                callback(fl);
            });
            console.log(kmllayerid + " use localStorage ;version:" + kmlversion);
        }
        else {
            $.kmlhelper({
                map: map, layerid: kmllayerid,
                kmlurl: kmlurl,
                onLoaded: function (l) {
                    var fl = l.getLayers()[0];//map.getLayer(kmllayerid + "_0");

                    if (!dojo.isAndroid && !dojo.isIos && localStorage && uselocalStorage && fl.toJson) {
                        try {
                            //寫入localStorage
                            var jsondata = fl.toJson();

                            localStorage.setItem(localStorageKey, JSON.stringify({ "version": kmlversion, "data-size": JSON.stringify(jsondata).length, "data": jsondata }));
                        } catch (ex) { console.log(ex); }
                    }
                    callback(fl);
                }
            });
            console.log(kmllayerid + " use kml");
        }
    };

    $.autoOrderLayer = function (map) {
        var _polygon = 0;
        var _line = 0;
        var _point = 0;
        var reorderPolygonLayer = function (layer) {
            //console.log(layer.id+" reorderPolygonLayer index at " + _polygon);
            map.reorderLayer(layer, _polygon);
            _polygon++;
            _line++;
            _point++;
            
        };
        var reorderPolylineLayer = function (layer) {
            //console.log(layer.id + " reorderPolylineLayer index at " + _line);
            map.reorderLayer(layer, _line);
            _line++;
            _point++;
        };
        var reorderPointLayer = function (layer) {
            //console.log(layer.id + " reorderPointLayer index at " + _point);
            map.reorderLayer(layer, _point);
            _point++;
        };
        var checkGeomertyType = function (layer) {
            if ("point|multipoint ".indexOf(layer.graphics[0].geometry.type) >= 0) {
                reorderPointLayer(layer);
            }
            else if ("polyline".indexOf(layer.graphics[0].geometry.type) >= 0) {
                reorderPolylineLayer(layer);
            }
            else if ("polygon|extent".indexOf(layer.graphics[0].geometry.type) >= 0) {
                reorderPolygonLayer(layer);
            }
        };
        map.on("layer-add", function (evt) {
            if (evt.layer.graphics) {
                if (evt.layer.graphics.length > 0) {
                    checkGeomertyType(evt.layer);
                }
                else {
                    var _onevt = evt.layer.on("graphic-add", function (evtg) {
                        checkGeomertyType(evt.layer);
                        _onevt.remove(); //移除listen
                    });
                }
            }
        });
    }
    var isInputSupportRange = function (f) {
        var f = f || 'date';
        var input = document.createElement('input');
        input.setAttribute('type', f);
        //input.setAttribute('data-date-format', 'YYYY/MM/DD');

        var notADateValue = 'not-a-date';
        input.setAttribute('value', notADateValue);

        return (input.value !== notADateValue);
    }
    $.fn.gis_layer_opacity_slider = function (options) {
        var settings = { map: null, layerid: undefined, min: 10, max: 100, value: 95 };
        var current = this;
        var hasLayer = false;
        $.extend(settings, options);
        if (settings.map == null) {
            alert('map is null');
        }
        var $_range;
        if (helper.browser.support.inputRange()) {
            $_range = $('<input type="range" class="range-ctrl" min="' + settings.min + '" max="' + settings.max + '" value="' + settings.value + '">').on('input', function () {
                setOpacity(parseInt(this.value));
            }).css('padding-left', 0).appendTo(this);
        }
        else {
            $_range =current.slider({
                range: "min",
                max: settings.max,
                min: settings.min,
                value: settings.value,
                slide: setOpacity,
                change: setOpacity
            });
        }
        
        if (whatMap(settings.map) === "arcgis") {
            var la = settings.map._layers[settings.layerid];
            if (la) {
                hasLayer = true;
            }
            else {//layer exist?
                var _lis = settings.map.on('layer-add', function (evt) {
                    if (evt.layer.id == settings.layerid) {
                        hasLayer = true; setOpacity();
                    }
                });
            }
        }


        function setOpacity(v) { //google的Opacity由各Overlays，無法由layer統一控制
            if (!$.isNumeric(v))
                v = $_range.val() || $_range.slider("value");
            if (settings.setOpacity)
                settings.setOpacity(v / 100);
            if (hasLayer) {
                settings.map.getLayer(settings.layerid).setOpacity(v / 100);
            }
        };
        setOpacity(settings.value);
        //{max:settings.max, min:settings.min, value:0.9});
        //this.on('change', function () { console.log('slider change'+this.value()); });
        return this;
    };

    /**************系統必要的java script 及 自動初始 initGisMenu****************/
    var autoInitGisMenu = function () {
        setTimeout(function () {
            // $.initGisMenu('.navbar'); //自動初始 initGisMenu會有其他元件尚未載入就觸發開啟的時間差問題
        }, 1);
    };

 
    //20190110 已改於$.AppConfigOptions.require.request
    //var loadRequestScript = function (callback) {
    //    var reqjs = [];
    //    if (!$.fn.jsPanel) {
    //        reqjs.push($.AppConfigOptions.script.gispath + "/jspanel/jquery.jspanel-1.10.0.js");
    //    }
    //    if (!window.helper || !window.helper.loaded) {
    //        reqjs.push($.AppConfigOptions.script.gispath + "/helper.js");
    //    }
    //    if (!window.xmlToJSON)
    //        reqjs.push($.AppConfigOptions.script.gispath + "/other/xmlToJSON.js");

    //    if (reqjs.length > 0) {
    //        //require(reqjs, function () {
    //        getJavaScripts(reqjs, function () {
    //            if ($('.navbar').length > 0) {
    //                autoInitGisMenu();
    //            }
    //        });
    //    }
    //    else {
    //        if ($('.navbar').length > 0) {
    //            autoInitGisMenu();
    //        }
    //    }
    //}
    //loadRequestScript(function () { });

})(jQuery);

(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
                                   || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());


