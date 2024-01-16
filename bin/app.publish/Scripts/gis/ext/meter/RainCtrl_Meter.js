if (!$.BasePinCtrl) {
    alert("未引用(RainCtrl)BasePinCtrl");
}

(function ($) {
    var rainsource = {
        basefunc: function (callback) {
            $.BasePinCtrl.helper.getWraMeterData('RainStations', undefined, 'ArrayOfRainStationBase.RainStationBase', undefined, callback);
        },
        infofunc: function (dt, callback) {
            $.BasePinCtrl.helper.getWraMeterData('wsReportsRain', undefined, 'ArrayOfReportsRainInfo.ReportsRainInfo', undefined, callback);
        },
        hourlyInfofunc: function (data, callback) {
            //data: "{ 'startDate':'" + result.startdt.DateFormat("yyyy/MM/dd HH:mm:ss") + "', 'endDate':'" + result.enddt.DateFormat("yyyy/MM/dd HH:mm:ss") + "','stationNo':'" + data["StationID"] + "' }"
            var startdt = new Date(data["Datetime"]).addHours(-24).DateFormat('yyyy/MM/dd HH:mm:ss');
            var enddt = new Date(data["Datetime"]).DateFormat('yyyy/MM/dd HH:mm:ss');
            $.BasePinCtrl.helper.getWraMeterData('RainInfoSummaryByTime', { 'stationNo': data["StationID"], 'startDate': startdt, 'endDate': enddt }, 'ArrayOfRainStationInfo.RainStationInfo', undefined, callback);
        }
    };

    $.rainFormatter = {
        float: function (value, row) {
            if (value===undefined || parseFloat(value) < -99)
                return '---'
            else return parseFloat(value).toFixed(2);
        },
        datetime: function (value, row, source) {
            if (value) //row物件是清單, row物件是string==InfoWindow
                return (source === undefined || source != "InfoWindow") ? value.DateFormat("dd HH:mm") : value.DateFormat("yyyy/MM/dd HH:mm");
            else
                return '---';
        }
    }

    $.RainCtrl = {

        defaultSettings: {
            name: "雨量站",
            layerid: "rain_", map: undefined,
            pinInfoLabelMinWidth: "75px",
            loadBase: "http://140.112.76.195/Map/WS/Meter.asmx/RainStations",
            loadInfo: "http://140.112.76.195/Map/WS/Meter.asmx/wsReportsRain",
            loadHourlyInfo: "http://140.112.76.195/Map/WS/Meter.asmx/RainInfoSummaryByTime",
            loadBase: rainsource.basefunc,
            loadInfo: rainsource.infofunc,
            loadHourlyInfo: rainsource.hourlyInfofunc,
            hourlyFieldsInfo: {DateTime: "DATE",RQ: "H1"},
            stTitle: function (data) { return data.CName },
            infoFields: [
                {
                    field: 'CName', title: '站 名', formatter: function (v, data) {
                        return v + '(' + data.StationID + ')';
                    }
                },
                { field: 'Datetime', title: '時 間', formatter: $.rainFormatter.datetime },
                { field: 'R10M', title: '最新10分鐘', formatter: $.rainFormatter.float, unit: "毫米", sortable: true },
                { field: 'R1H', title: '時 雨 量', formatter: $.rainFormatter.float, unit: "毫米", sortable: true },
                { field: 'R3H', title: '累計 3小時', formatter: $.rainFormatter.float, unit: "毫米", showInList:false },
                { field: 'R6H', title: '累計 6小時', formatter: $.rainFormatter.float, unit: "毫米", showInList: false },
                { field: 'R12H', title: '累計12小時', formatter: $.rainFormatter.float, unit: "毫米", showInList: false },
                { field: 'R24H', title: '累計24小時', formatter: $.rainFormatter.float, unit: "毫米", showInList: false },
                { field: 'R1D', title: '累計1日', formatter: $.rainFormatter.float, unit: "毫米", showInList: false },
                { field: 'R2D', title: '累計2日', formatter: $.rainFormatter.float, unit: "毫米", showInList: false },
                { field: 'R3D', title: '累計3日', formatter: $.rainFormatter.float, unit: "毫米", showInList: false },
                ],
            legendIcons: [$.BasePinCtrl.pinIcons.rain.normal, $.BasePinCtrl.pinIcons.rain.heavy, $.BasePinCtrl.pinIcons.rain.extremely, $.BasePinCtrl.pinIcons.rain.torrential, $.BasePinCtrl.pinIcons.rain.extremely_torrential, $.BasePinCtrl.pinIcons.rain.noData],
            checkDataStatus: function (data, index) {
                return $.BasePinCtrl.helper.getDataStatusLegendIcon(this.settings.legendIcons, data.Status);
                //return $.BasePinCtrl.helper.getDataStatusLegendIcon($.RainCtrl.defaultSettings.legendIcons, data.Status);
                //return stas;
            },
            transformData: function (_base, _info) {
                var datas = [];
                $.each(_base, function (idxb, b) {
                    var d = $.extend(JSON.parse(JSON.stringify(b)), $.RainCtrl.defaultData);
                    d.CName = b.NAME_C;
                    d.StationID = b.ST_NO;
                    d.X = b.Long;
                    d.Y = b.Lat;
                    d.COUN_ID = b.COUN_ID;
                    d.Status = "無資料";
                    d.Datetime = undefined;
                    $.each(_info, function (idxi, i) {
                        if (d.StationID == i.ST_NO) {
                            d.Datetime = JsonDateStr2Datetime(i.DATE);
                            d.R10M = i.M10;
                            d.R1H = i.H1;
                            d.R3H = i.H3;
                            d.R6H = i.H6;
                            d.R12H = i.H12;
                            d.R24H = i.H24;
                            d.R1D = i.D1;
                            d.R2D = i.D2;
                            d.R3D = i.D3;
                            d.Status = i.Status;
                            if (!d.Status)
                                console.log("d.StationID:" + d.StationID + d.CName);
                            return false;
                        }
                    });
                    datas.push(d);
                });
                //console.log("rainctrl transformData end "+new Date());
                return datas;
            },
            pinInfoContent: function (data, infofields) {
                var current = this;
                var currentsetting = this.settings;
                infofields = this.infoFields;
                var chartOptions, $chartdiv;
                var constr = $.BasePinCtrl.defaultSettings.pinInfoContent.call(this, data);
                var iid = geguid();// sid + "_" + new Date().getTime();

                /*************/
                //carousel
                var $div = $('<div id="carousel_' + iid + '" class="carousel slide meterinfo" data-ride="carousel" data-interval="99999999" style="width:100%;">');// style="width:' + this.cctvSize.width + 'px;height:' + this.cctvSize.height + 'px">');
                var $ol = $('<ol class="carousel-indicators">');
                var $sdiv = $('<div class="carousel-inner">');

                $ol.append(' <li data-target="#carousel_' + iid + '" data-slide-to="0"  class="active"></li>');
                $ol.append(' <li data-target="#carousel_' + iid + '" data-slide-to="1"  class="active"></li>');

                $sdiv.append('<div class="carousel-item item active" style="min-height:150px;">' + constr + '</div>');
                $sdiv.append('<div class="carousel-item item" style="min-height:150px;">24小時雨量資訊<div id="chart_' + iid + '" style="min-height:150px;min-width:1px;width:100%; "></div><div>');

                $div.append($ol);
                $div.append($sdiv);

                $div.append('<a class="left carousel-control carousel-control-prev" href="#carousel_' + iid + '" role="button" data-slide="prev">' +
                        '<span class="glyphicon glyphicon-chevron-left"></span>' +
                    '</a>' +
                    '<a class="right carousel-control carousel-control-next" href="#carousel_' + iid + '" role="button" data-slide="next">' +
                        '<span class="glyphicon glyphicon-chevron-right"></span>' +
                    '</a>');
                if (!this.settings.useTimeSeriesData)
                    $div.find('.carousel-control').hide();
                $ol.hide();

                //chart
                setTimeout(function () {
                    $("#carousel_" + iid).on("slide.bs.carousel", function () {
                        if (!chartOptions) { //chart 參數
                            chartOptions = {
                                grid: {
                                    hoverable: true
                                },
                                tooltip: true,
                                tooltipOpts: {
                                    content: function (x, y, z, o) { var d = new Date(y); d.setHours(d.getHours() - 8); return "時間:" + "/" + (d.getMonth() + 1) + "/" + d.getDate() + " " + d.getHours() + "<br>雨量:" + z },//"%p.0%, %s", // show percentages, rounding to 2 decimal places
                                    shifts: {
                                        x: 20,
                                        y: 0
                                    },
                                    defaultTheme: true
                                },
                                series: { //每一data皆會show此設定的的type
                                    lines: {
                                        show: true
                                    },
                                    points: {
                                        radius: 3,
                                        fill: true,
                                        show: true
                                    },

                                },
                                xaxis: {
                                    mode: "time",
                                    tickSize: [3, "hour"],
                                    timeformat: "%h",
                                },
                                yaxes: [
                                    {
                                        axisLabel: "data1",
                                        axisLabelUseCanvas: true,
                                        axisLabelFontSizePixels: 12,
                                        axisLabelFontFamily: 'Verdana, Arial',
                                        axisLabelPadding: 3,
                                        axisLabel: '累計雨量(mm)'
                                    },
                                {
                                    position: "right",
                                    color: "black",
                                    axisLabelUseCanvas: true,
                                    axisLabelFontSizePixels: 12,
                                    axisLabelFontFamily: 'Verdana, Arial',
                                    axisLabelPadding: 3,
                                    axisLabel: '時雨量(mm)',
                                    transform: function (v) {
                                        return -v;
                                    },
                                    inverseTransform: function (v) {
                                        return -v;
                                    }
                                }
                                ],
                                legend: {
                                    noColumns: 0,
                                    labelBoxBorderColor: "#000000",
                                    position: "nw"
                                },
                                grid: {
                                    hoverable: true,
                                    borderWidth: 2,
                                    borderColor: "#633200",
                                    backgroundColor: { colors: ["#ffffff", "#EDF5FF"] }
                                },
                                colors: ["#FF0000", "#0022FF"]
                            };

                            if (!$chartdiv)
                                $chartdiv = $("#chart_" + iid, this);
                        }
                    });
                    
                    $("#carousel_" + iid).on('slid.bs.carousel', function (df, rwr, qwe) {

                        var activechart = $(".active #" + $chartdiv[0].id).length > 0;
                        //console.log("2" + activechart);
                        if (!activechart)
                            return;
                        $chartdiv.show_busyIndicator();
                        var chartoptions = currentsetting.getDurationOptions.call(current, data);
                        console.log("load flot");
                        helper.misc.getJavaScripts([$.AppConfigOptions.script.gispath + "/flot/jquery.flot.js"], function () {
                        helper.misc.getJavaScripts([$.AppConfigOptions.script.gispath + "/flot/jquery.flot.time.js",
                             $.AppConfigOptions.script.gispath + "/flot/jquery.flot.animator.js", $.AppConfigOptions.script.gispath + "/flot/jquery.flot.symbol.js",
                             $.AppConfigOptions.script.gispath + "/flot/jquery.flot.axislabels.js", $.AppConfigOptions.script.gispath + "/flot/jquery.flot.tooltip.js"], function () {
                                 console.log("load flot end");
                                 var painChart = function (ddatas) {  //畫chart
                                     //劃chart
                                     $chartdiv.show();

                                     if ($chartdiv.parents(".contentPane").length > 0) //arcgis
                                         $chartdiv.parents(".contentPane")[0].scrollTop = $chartdiv[0].offsetTop;

                                     var maxvalue = -9999;
                                     var minvalue = 99999;
                                     var rdatas = [];
                                     var crdatas = [];
                                     var sumvalue = 0;
                                     $.each(ddatas, function (idx, d) {
                                         var dtd;
                                         if (typeof d[current.settings.hourlyFieldsInfo.DateTime] === "string") {
                                             dtd = JsonDateStr2Datetime(d[current.settings.hourlyFieldsInfo.DateTime]);
                                             dtd.setHours(dtd.getHours() + 8); //GMT+0800 chart 會變成UTC時間，所以先加8在讓chart減，這樣呈現的時間才會正確
                                         }
                                         else
                                             dtd = d[current.settings.hourlyFieldsInfo.DateTime];

                                         var v = parseFloat(d[current.settings.hourlyFieldsInfo.RQ]);
                                         if (!currentsetting.filterChartInfo.call(current, d, chartoptions))
                                             return;
                                         
                                         if (v > maxvalue) maxvalue = v;
                                         if (v < minvalue) minvalue = v;
                                         rdatas.push([dtd.getTime(), v]);
                                         sumvalue += v;
                                         
                                         crdatas.push([dtd.getTime(), sumvalue]);
                                     });

                                     if (rdatas.length == 0) {
                                         $chartdiv.hide_busyIndicator();
                                         $.plot($chartdiv, [], chartOptions);
                                         console.log("無資料!!");
                                         return;
                                     }
                                     chartOptions.yaxes[0].max = sumvalue * 2;
                                     chartOptions.yaxes[1].max = maxvalue * 2;

                                     $.plotAnimator($("#" + $chartdiv[0].id), [
                                            {
                                                label: '組體',
                                                data: rdatas,
                                                bars: {
                                                    show: true, barWidth: 24 * 60 * 60 * 30, lineWidth: 1, align: "center"
                                                },
                                                lines: { show: false },
                                                points: { show: false },
                                                yaxis: 2,
                                                //xaxis: { mode: "time", tickSize: [3, "hour"] }
                                                animator: { start: 0, steps: rdatas.length, duration: rdatas.length * 50, direction: 'right' }
                                            },
                                             {
                                                 label: '累積',
                                                 data: crdatas,
                                                 //lines: { show: true, fill: false },//不用設定，直接用options的series
                                                 yaxis: 1,
                                                 animator: { start: 0, steps: rdatas.length, duration: rdatas.length * 50, direction: 'right' }
                                             },
                                     ], chartOptions);
                                     $chartdiv.hide_busyIndicator();
                                 };
                                 //console.log("call chart ajax start");
                                if (typeof chartoptions.getDurationData === 'function')
                                {
                                    chartoptions.getDurationData(data,jQuery.proxy(painChart, current));
                                }
                                else if (typeof chartoptions.getDurationData === 'object') {
                                    $.ajax(chartoptions.getDurationData).done(function (result, status) {

                                        painChart(result.d);

                                    }).fail(function (result, status) {
                                        console.log(result);
                                        $chartdiv.hide_busyIndicator();
                                    });
                                }

                             });
                        });
                    });
                }, 300);

                return $div[0].outerHTML;
                /************/
            },
            getDurationOptions: function (data) {
                //this指的是 current
                var result = {
                    //hourlyFieldsInfo: {
                    //    DateTime: "DATE",
                    //    RQ: "H1",
                    //}
                };
                result.startdt = new Date(data["Datetime"]).addHours(-24);
                result.enddt = new Date(data["Datetime"]);
                if (typeof this.settings.loadHourlyInfo === "function") {
                    result.getDurationData = this.settings.loadHourlyInfo;
                } else {
                    result.getDurationData = {
                        url: this.settings.loadHourlyInfo,
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        type: "POST",
                        data: "{ 'startDate':'" + result.startdt.DateFormat("yyyy/MM/dd HH:mm:ss") + "', 'endDate':'" + result.enddt.DateFormat("yyyy/MM/dd HH:mm:ss") + "','stationNo':'" + data["StationID"] + "' }"
                    };
                }
                return result;
            },
            filterChartInfo: function (info, chartoptions) {
                var dtd = JsonDateStr2Datetime(info[this.settings.hourlyFieldsInfo.DateTime]);
                var v = parseFloat(info[this.settings.hourlyFieldsInfo.RQ]);
                var hhh = dtd.getMinutes();
                if (dtd.getMinutes() != 0 || v < -99)
                    return false;
                else return true;
            }
        },
        defaultData: { CName: '', Datetime: undefined, StationID: "", R10M: -998, R1H: -998, R3H: -998, R6H: -998, R12H: -998, R24H: -998, R1D: -998, R2D: -998, R3D: -998 },
        leaflet: {
            markerCluster_defaultIconCreateFunction : function (markerClusterGroup, mg) { //複寫 for leaflet markerCluster
                var divIcon = markerClusterGroup._defaultIconCreateFunction(mg);
                var _class = $.BasePinCtrl.pinIcons.rain.noData.classes;
                if ($.grep(mg.getAllChildMarkers(), function (r) { return r.pinstatus.classes == $.BasePinCtrl.pinIcons.rain.extremely_torrential.classes }).length > 0)
                    _class = $.BasePinCtrl.pinIcons.rain.extremely_torrential.classes;
                else if ($.grep(mg.getAllChildMarkers(), function (r) { return r.pinstatus.classes == $.BasePinCtrl.pinIcons.rain.torrential.classes }).length > 0)
                    _class = $.BasePinCtrl.pinIcons.rain.torrential.classes;
                else if ($.grep(mg.getAllChildMarkers(), function (r) { return r.pinstatus.classes == $.BasePinCtrl.pinIcons.rain.extremely.classes }).length > 0)
                    _class = $.BasePinCtrl.pinIcons.rain.extremely.classes;
                else if ($.grep(mg.getAllChildMarkers(), function (r) { return r.pinstatus.classes == $.BasePinCtrl.pinIcons.rain.heavy.classes }).length > 0)
                    _class = $.BasePinCtrl.pinIcons.rain.heavy.classes;
                else if ($.grep(mg.getAllChildMarkers(), function (r) { return r.pinstatus.classes == $.BasePinCtrl.pinIcons.rain.normal.classes }).length > 0)
                    _class = $.BasePinCtrl.pinIcons.rain.normal.classes;
                divIcon.options.className += " rain " + _class;
                return divIcon;
            }
        }
    }
    var pluginName = 'RainCtrl'
    var pluginclass = function (element, e) {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        this.$element = $(element);
        this.settings = $.extend({}, $.RainCtrl.defaultSettings);// {map:undefined, width:240};
        this.__pinctrl = undefined;
        this.__baseData = undefined;
        this.__infoData = undefined;
        this.currentDatetime = new Date();
        this.isInitCompleted = false;
    };
    pluginclass.prototype = {
        constructor: pluginclass,
        init: function (options) {
            $.extend(this.settings, options);
            var current = this;
            this.__pinctrl =this.$element.BasePinCtrl(this.settings).on($.BasePinCtrl.eventKeys.initLayer, function (ss) {
                current.isInitCompleted = true;
                current.__pinctrl.instance._mapctrl._defaultIconCreateFunction = $.RainCtrl.leaflet.markerCluster_defaultIconCreateFunction; //複寫 for leaflet markerCluster
                current.reload(current.currentDatetime);
            });
            
        },
        reload: function (dt) {
            this.currentDatetime = dt;
            if (!this.isInitCompleted)
                return;
            $.BasePinCtrl.helper.reload.call(this, dt);
        },
        setFilter: function (filter) {
            this.__pinctrl.instance.setFilter(filter);
        },
        setBoundary: function (inBoundary) {
            this.__pinctrl.instance.setBoundary(inBoundary);
        },
        __loadBaseCompleted: function (results) {
            this.__baseData = results;
            this.refreshData();
        },
        __loadInfoCompleted: function (results) {
            this.__infoData = results;
            this.refreshData();
        },
        refreshData: function () {
            var current = this;
            if (this.__baseData && this.__infoData) {
                current.__pinctrl.instance.setData(this.settings.transformData(this.__baseData, this.__infoData));
            }
        }
    }


    $.fn[pluginName] = function (arg) {

        var args, instance;

        if (!(this.data(pluginName) instanceof pluginclass)) {

            this.data(pluginName, new pluginclass(this[0]));
        }

        instance = this.data(pluginName);


        if (typeof arg === 'undefined' || typeof arg === 'object') {

            if (typeof instance.init === 'function') {
                instance.init(arg);
            }
            this.instance = instance;
            return this;

        } else if (typeof arg === 'string' && typeof instance[arg] === 'function') {

            args = Array.prototype.slice.call(arguments, 1);

            return instance[arg].apply(instance, args);

        } else {

            $.error('Method ' + arg + ' does not exist on jQuery.' + pluginName);

        }
    };
})(jQuery);