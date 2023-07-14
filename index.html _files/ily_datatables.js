/* =========================================================
 * ily_datatables.js
 * =========================================================
 * Datatables jQuery Plugin
 */

(function ($) {

    $.fn.createDataTable = function (options) {
        var res;
        this.each(function () {

            // Enrich DataTables div 
            $(this).addClass("table table-striped table-responsive table-bordered dataTable no-footer");

            // Functionality
            if (typeof options === "object" && options !== null) {
                if (typeof options.hidden !== "undefined" && options.hidden) {
                    return;
                }

                // Set Language
                var dtLangPath = "resources/vendor/datatables/i18n/";
                var selectedLang;

                if (typeof header_locale === "undefined" || header_locale === null || header_locale === "" || header_locale === "el_GR") {
                    selectedLang = "el";
                } else {
                    selectedLang = header_locale;
                }

                if (typeof options.language !== "undefined" && options.language !== null) {
                    // If specific language has been chosen fot this datatable, override global app lang
                    selectedLang = options.language;
                }

                var dataTableLang = dtLangPath + "datatables." + selectedLang + ".json";
                options.oLanguage = {
                    sUrl: dataTableLang
                };

                options.pageLength = 50;
                var pageAll = IlyLocales.general.paging.all;
                options.lengthMenu = [[50, 100, 200, 500, -1], [50, 100, 200, 500, pageAll]];

                if (!options.ignoreColVis) {
                    if (typeof options.dom === "undefined") {
                        options.dom = '<"top"Bf><"clear"><"top"l>rt<"bottom"ip><"clear">';
                    }
                    var colVisBtn = {
                        extend: 'colvis',
                        text: '<i class="fa fa-columns" style="margin-right: 2px;"></i> ' + IlyLocales.general.datatable.columns.prompt.choose + '',
                        columns: ':not(.noVis)'
                    };
                    if (typeof options.buttons === "undefined") {
                        options.buttons = [colVisBtn];
                    } else if ($.isArray(options.buttons)) {
                        options.buttons.unshift(colVisBtn);
                    }
                }
                
                var tableSelectorId = $(this).attr("id");
                
                // Filtering
                if (options.initComplete && typeof options.initComplete === 'function') {
                    // Extend already defined initComplete
                    var foo = options.initComplete;
                    options.initComplete = function (e) {
                        foo.apply(this, e);
                        initFilterRowForDatatable("#" + tableSelectorId, options.ignoreFiltering);
                    };
                } else {
                    options.initComplete = function () {
                        initFilterRowForDatatable("#" + tableSelectorId, options.ignoreFiltering);
                    };
                }
                
                var dateFormats = [
                    'DD/MM/YYYY',
                    'DD/MM/YYYY, HH:mm'
                ];
                dateFormats.forEach(function (format) {
                    $.fn.dataTable.moment(format);
                });
                
                var collator = new window.Intl.Collator();
                var types = $.fn.dataTable.ext.type;

                delete types.order['string-pre'];
                types.order['string-asc'] = collator.compare;
                types.order['string-desc'] = function ( a, b ) {
                    return collator.compare( a, b ) * - 1;
                };
                
                res = $(this).DataTable(options);               

                res.on("draw", function (e) {
                    makeValueHoverOnDatatable(tableSelectorId, options.columns);
                });
                
                $("#" + tableSelectorId).on('column-visibility.dt', function (e, settings, column, state) {
                    var idx = $(res.column(column).header()).index();
                    $("#" + tableSelectorId + ' thead tr:eq(' + idx + ') th:eq(1) input').val('');
                    res.columns(column).search('').draw();
                    $("#" + tableSelectorId + ' thead tr:eq(1)').remove();
                    
                    initFilterRowForDatatable("#" + tableSelectorId, options.ignoreFiltering);
                });
            }

        });
        return res;
    };

})(jQuery);

function makeValueHoverOnDatatable(tableSelectorId, columns) {
    $("#" + tableSelectorId + " tbody").find("td").each(function () {
        $(this).prop("title", $(this).text());
    });
    $("#" + tableSelectorId + " thead").find("th").each(function () {
        $(this).prop("title", $(this).text());
    });
    $.each(columns, function (i, column) {
        if (typeof column.description !== "undefined" && column.description) {
            $('[title="' + column.title + '"]').closest("th").children("span.form-helper-text").remove();
            $('[title="' + column.title + '"]').closest("th").append("<span class='form-helper-text' data-toggle='tooltip' data-placement='right' title='" + column.description + "'><i class='glyphicon glyphicon-info-sign' style='top: 0px;'></i></span>");
        }
    });
}

function initFilterRowForDatatable(selectorEl, ignoreFiltering) {
    
    var ignoreFilterColumns = [IlyLocales.general.details, IlyLocales.general.actions];
    
    if (typeof ignoreFiltering !== "undefined" && ignoreFiltering !== null && typeof ignoreFiltering === 'object'){
        if (ignoreFiltering.length > 0) {
            $.each(ignoreFiltering, function (i, columnName) {
                if (columnName) {
                    ignoreFilterColumns.push(columnName);
                }
            });
        }
    }
    
    $(selectorEl + ' thead tr')
            .clone(true)
            .appendTo(selectorEl + ' thead');
    
    var table = $(selectorEl).DataTable();
    $(selectorEl + ' thead tr:eq(1) th').each(function (i) {
        $(selectorEl + ' thead tr:eq(1) th').off();

        var title = $(this).text();
        if (!ignoreFilterColumns || !ignoreFilterColumns.includes(title)) {
            $(this).html('<input type="text" style="width: 100%" placeholder="' + IlyLocales.general.search + ' ' + title + '" value="' + table.column(i + ':visible').search() + '" />');

            $('input', this).on('keyup change', function () {
                if (table.column($(this).parent().index() + ':visible').search() !== this.value) {
                    table
                            .column($(this).parent().index() + ':visible')
                            .search(this.value)
                            .draw();
                }
            });
        } else {
            $(this).empty();
        }
    });
}