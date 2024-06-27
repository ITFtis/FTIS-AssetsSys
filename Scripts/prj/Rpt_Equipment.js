$(document).ready(function () {
    var a = {};
    a.item = '<span class="btn btn-success glyphicon glyphicon-download-alt"> 匯出Excel</span>';
    a.event = 'click .glyphicon-download-alt';
    a.callback = function ExportExcel(evt) {

        var conditions = GetFilterParams($_MasterTable)
        if (conditions.length > 0) {
            var paras = { key: 'filter', value: JSON.stringify(conditions) };
        }

        helper.misc.showBusyIndicator();
        $.ajax({
            url: app.siteRoot + 'Audit_ReportMissing_statistics/ExportAudit_ReportMissingstatistics',
            datatype: "json",
            type: "POST",
            data: { paras: [paras] },
            success: function (data) {
                if (data.result) {
                    location.href = app.siteRoot + data.url;
                } else {
                    alert("查詢失敗：\n" + data.errorMessage);
                }
            },
            complete: function () {
                helper.misc.hideBusyIndicator();
            },
            error: function (xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);
                helper.misc.hideBusyIndicator();
            }
        });
    };

    //douoptions.appendCustomToolbars = [a];

    douoptions.tableOptions.onSort = function (a) {
       InsertTotalAfterSorted();
    }

    //douoptions.tableOptions.onPreBody = function (params) {
    //    var obj = params.find(obj => obj.CheckItemTitel == "合計");
    //    if (obj != null) {
    //        var index = params.indexOf(obj);
    //        params.push(params.splice(index, 1)[0]);
    //    }

    //    return false;
    //}

    douoptions.tableOptions.onLoadSuccess = function (datas) {
        InsertTotalAfterSorted();
        //總計
        //if (datas.length > 0) {
        //    var nrow = jQuery.extend(true, {}, datas[1]);

        //    var sumCheckItemCount = 0;
        //    var sumCheckItemErrCount = 0;
        //    $.each(datas, function (index, value) {
        //        sumCheckItemCount += this.CheckItemCount;
        //        sumCheckItemErrCount += this.CheckItemErrCount;
        //    });

        //    nrow.CheckItemTitel = "合計";
        //    nrow.CheckItemCount = sumCheckItemCount;
        //    nrow.CheckItemErrCount = sumCheckItemErrCount;
        //    datas.push(nrow);
        //    $_MasterTable.DouEditableTable("tableReload", datas);
        //}
    }

    douoptions.queryFilter = function (params, callback) {
        //alert("1");
        callback();
    }

    function InsertTotalAfterSorted() {
        var fd2 = new FormData();
        console.log(fd2);
        $.ajax({
            dataType: 'json',
            url: $.AppConfigOptions.baseurl + 'Rpt_Equipment/GetSumData',
            type: "post",
            //data: new FormData($('#adj')['0']),
            data: fd2,
            processData: false,
            contentType: false,
            success: function (data) {
                //alert("儲存成功"); 
                if (data[0] != '' && data[1] != '' && data[2] != '' && data[3] != '' && data[4] != '' && data[5] != '' && data[6] != '') {
                    var $ppp = $('#_table tbody');
                    var content = '<tr data-index="9999"> \
                           <td class="dou-field-CateID">總計：</td> \
                           <td class="dou-field-Counts_Default_Inventory" style="text-align: right; ">'+ data[0] + '</td> \
                           <td class="dou-field-Counts_NewAdd" style="text-align: right; ">'+ data[1] + '</td> \
                           <td class="dou-field-Counts_Disposal" style="text-align: right; ">'+ data[2] + '</td> \
                           <td class="dou-field-Counts_Period" style="text-align: right; ">'+ data[3] + '</td> \
                           <td class="dou-field-Counts_Actual_Inventory" style="text-align: right; ">'+ data[4] + '</td> \
                           <td class="dou-field-Counts_Surplus" style="text-align: right; ">'+ data[5] + '</td> \
                           <td class="dou-field-Counts_Losses" style="text-align: right; ">'+ data[6] + '</td> \
                       </tr>';
                    $(content).appendTo($ppp);
                }
            },
            error: function (request) {
                //alert(request.responseJSON.Message);
                alert("error");
            }
        });
    }

    var $_MasterTable = $("#_table").DouEditableTable(douoptions); //初始dou table
})


