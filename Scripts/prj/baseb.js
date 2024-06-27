function GetDefaultColors() {
    var colors = [
        "#ff0000", "#ffff00", "#00ff00", "#00ffff", "#0000ff",
        "#ff00ff", "#808080", "#008000", "#800000", "#000080",
        "#808000", "#800080", "#c0c0c0", "#008080", "#7b68ee",
        "#1e90ff", "#f08080", "#ffe4c4", "#b8860b", "#00ced1",
        "#556b2f", "#4b0082", "#d8bfd8", 
    ];

    return colors;
}

function GetFilterParams($_MasterTable) {
    var _fielter = [];
    var current = this;
    $.each($('.filter-toolbar-plus').find("[data-fn]"), function () {
        var _fn = $(this).attr("data-fn");
        var _filed = douHelper.getField($_MasterTable.instance.settings.fields, _fn);
        var obj = _filed.editFormtter.getValue.call(_filed, $(this));
        _fielter.push({ key: _fn, value: $.isArray(obj) ? obj.join(',') : obj.split(',').join(',') });
    });

    return _fielter;
}

//colspan固定為1
//datas資料, field 合併的欄位名稱
function MergeTableRows($container, datas, field) {
    //$container.bootstrapTable('mergeCells', { index: 0, field: 'CheckItemTitel', colspan: 1, rowspan: 2 });

    if (datas.length > 0) {
        var aryMergeCells = [];
        var sRow;        //開始列
        var ptext;       //前1個
        var rMerge = 0;  //rowspan
        $.each(datas, function (index, value) {            
            var text = this[field];
            if (ptext == null) {
                //default
                sRow = index;
                rMerge = 1;
                ptext = text;
            }
            else if (ptext != text) {

                aryMergeCells.push({ index: sRow, field: field, colspan: 1, rowspan: rMerge });

                //reset
                sRow = index;
                rMerge = 1;
                ptext = text;
            }
            else {
                //合併rowspan
                rMerge++;
            }
        });
        //最後
        aryMergeCells.push({ index: sRow, field: field, colspan: 1, rowspan: rMerge });

        $.each(aryMergeCells, function (index, value) {
            $container.bootstrapTable('mergeCells', this);
        })
    }
}

//下拉選單Null或空值預設挑選(afterCreateEditDataForm)
function EditDataFormSelectDefault() {    
    $('.data-edit-form-group .field-content .form-select').each(function () {
        if ($(this).val() == null) {
            $(this).val('');
        }
    });
}

//表單驗證(dou)
function ValidateFrom(current) {
    $('.modal-dialog .errormsg').empty();
    $('.modal-dialog .errormsg').hide();

    var rdata = {};
    var errors = [];


    //將資料組成新資料
    $.each(current.settings._dataFields, function (idx, f) {
        //if (idx == current.settings.fields.length - 1) //ctrl 編輯、刪除
        if (f.visibleEdit === false) {
            //rdata[f.field] = row[f.field];
            return true;
        }
        var $_del = $(".field-container[data-field=" + f.field + "]", current.$___currentEditFormWindow).find(".field-content").children().first();
        if ($_del.length > 0) {
            var v = f.editFormtter.getValue.call(f, $_del, rdata);
            rdata[f.field] = v;
        }
    });
    var errors = [];
    var firstErrorField;
    //驗證
    $.each(current.settings._dataFields, function (idx, f) {
        if (f.visibleEdit === false)
            return true;
        var $_del = $(".field-container[data-field=" + f.field + "]", current.$___currentEditFormWindow).find(".field-content").children().first();
        var oer;
        if ($_del.length > 0) {
            if (f.validate && (oer = f.validate(rdata[f.field], rdata)) !== true)
                errors.push(f.title + ":" + f.validate(rdata[f.field], rdata));
            else if ($_del[0].validationMessage)
                errors.push(f.title + ":" + $_del[0].validationMessage);
            if (errors.length == 1)
                firstErrorField = firstErrorField ? firstErrorField : this;
        }
    });

    if (errors && errors.length > 0) {
        errors = $.isArray(errors) ? errors : [errors];
        current.$___currentEditFormWindow.trigger("set-error-message", '<span class="' + current.settings.buttonClasses.error_message + '" aria-hidden="true"></span>&nbsp; ' + errors.join('<br><span class="' + current.settings.buttonClasses.error_message + '" aria-hidden="true"></span>&nbsp; '));
        return false;
    }

    return true;
}