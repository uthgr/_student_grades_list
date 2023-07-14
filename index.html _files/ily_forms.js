var IlyForms = {};

IlyForms.actions = {
    deleteEntityForm: function (options) {
        var formId = "entityForm";
        try {
            formId = options.formFields.formId;
        } catch (e) {
        }

        var url = (typeof options.baseApiUrl === "function") ? options.baseApiUrl(formId, options) : options.baseApiUrl;

        if (typeof options.entityId === "undefined" || options.entityId === null) {
            options.entityId = options.data[options.formFields.entityId];
        }
        var alert = {
            title: IlyLocales.general.confirm,
            message: IlyLocales.general.delete.confirm,
            buttonText: IlyLocales.general.yes
        };

        if (options.alertConfirm !== null && options.alertConfirm !== "" && typeof options.alertConfirm !== 'undefined') {
            if (options.alertConfirm.title !== null && options.alertConfirm.title !== "" && typeof options.alertConfirm.title !== 'undefined') {
                alert.title = options.alertConfirm.title;
            }
            if (options.alertConfirm.message !== null && options.alertConfirm.message !== "" && typeof options.alertConfirm.message !== 'undefined') {
                alert.message = options.alertConfirm.message;
            }
            if (options.alertConfirm.buttonText !== null && options.alertConfirm.buttonText !== "" && typeof options.alertConfirm.buttonText !== 'undefined') {
                alert.buttonText = options.alertConfirm.buttonText;
            }
        }

        var alertConfirm = {
            title: alert.title,
            message: alert.message,
            buttonText: alert.buttonText,
            btnConfirmAction: function () {
                var ajaxObj = {
                    type: "DELETE",
                    url: url + "/" + options.entityId,
                    dataType: "json"
                };

                $.blockUI({"message": IlyLocales.general.please_wait});

                var promise = RSVP.all([rsvpCall(ajaxObj)]);

                promise["then"](function (results) {
                    // success
                    $.growl.notice({message: IlyLocales.general.entity.delete.complete});
                    setTimeout(function () {
                        if (options.formFields.modal) {
                            $(options.selector).data('kendoGrid').dataSource.read();
                            $(options.selector).data('kendoGrid').refresh();
                        }
                        try {
                            options.afterComplete(results, options.action, options);
                        } catch (err) {
                            // afterComplete not defined
                        }
                    }, 1500);
                });

                promise["catch"](function (e) {
                    // fail
                    var msg = null;
                    try {
                        msg = e.responseJSON.message;
                    } catch (e) {

                    }
                    if (typeof msg === "undefined" || msg === null) {
                        msg = e.responseJSON;
                    }
                    if (typeof msg === "undefined" || msg === null) {
                        msg = IlyLocales.general.error.try_again;
                    }
                    console.log("Promised failed for reason:", e);
                    var alertMsg = msg;
                    $.growl.error({message: alertMsg});
                });

                promise["finally"](function (e) {
                    $.unblockUI();
                });
            }
        };
        alertConfirmModal(alertConfirm);
    },
    findFieldInEntityForm: function (fields, code) {
        var foundField;
        if (!fields || !code) {
            return;
        }
        if (fields.length === 0) {
            return;
        }
        for (var idx in fields) {
            var field = fields[idx];
            if (field.type === "field" || field.type === "input_group") {
                if (field.code === code) {
                    foundField = field;
                    break;
                }
            }
            if (field.type === "group") {
                var children = field.children;
                foundField = IlyForms.actions.findFieldInEntityForm(children, code);
                if (foundField) {
                    break;
                }
            }
        }
        return foundField;
    },
    generic_handle_jqerror: function (jqerror) {
        var jqXHR = jqerror.jqXHR;
        var errorThrown = jqerror.errorThrown;

        if (jqXHR.status === 0) {
            console.log('Not connected.\nPlease verify your network connection.');
        } else if (jqXHR.status === 401) {
            console.log('Unauthorized [401].');
            return;
        } else if (jqXHR.status === 403) {
            console.log('Forbidden. [403]');
        } else if (jqXHR.status === 404) {
            console.log('The requested page not found. [404]');
        } else if (jqXHR.status === 500) {
            console.log('Internal Server Error [500].');
        } else if (errorThrown === 'parsererror') {
            console.log('Requested JSON parse failed.');
        } else if (errorThrown === 'timeout') {
            console.log('Time out error.');
        } else if (errorThrown === 'abort') {
            console.log('Ajax request aborted.');
        } else {
            console.log('Uncaught Error.\n' + jqXHR.responseText);
        }
    },
    getDateFromField: function (value) {
        if (value === undefined || value === null || value === "") {
            return value;
        }
        var datePartsId = value.split("/");
        var date = new Date(datePartsId[2], (datePartsId[1] - 1), datePartsId[0]);
        return "" + date.getTime() + "";
    },
    getFormDataDatatypes: function (data) {
        var datatypes = {};

        $.each(data, function (i, field) {
            if (field.type === "field") {
                datatypes[field.code] = field.datatype;
            } else if (field.type === "group") {
                $.each(field.children, function (j, child) {
                    if (child.type === "field") {
                        datatypes[child.code] = child.datatype;
                    }
                });
            }
        });

        return datatypes;
    },
    saveEntityForm: function (options) {
        var formId = "entityForm";
        try {
            formId = options.formFields.formId;
        } catch (e) {
        }

        var url = (typeof options.baseApiUrl === "function") ? options.baseApiUrl(formId, options) : options.baseApiUrl;

        if (typeof url === "undefined" || url === null) {
            return false;
        }

        var form = $("#" + formId);

        if (!form.valid()) {
            return false;
        }

        var formData = form.serializeObject();

        formData = IlyLib.ilyJSON.removeEmptyStringsFromJSONObject(formData);

        try {
            if (options.parseData) {
                formData = options.parseData(options, formData);
            }
        } catch (err) {
            // parseData not defined
        }

        if (typeof formData === "undefined" || formData === null) {
            return false;
        }

        if (typeof options.beforeSaveActions === 'function') {
            options.beforeSaveActions(formData);
        }

        $.blockUI({"message": IlyLocales.general.please_wait});

        var promise;

        var containsFiles = options.formFields.containsFile;

        if (typeof containsFiles !== "undefined" && containsFiles !== null && containsFiles) {
            var formDataTypes = IlyForms.actions.getFormDataDatatypes(options.formFields.fields);
            var formDataWithFiles = new FormData();
            $.each(formData, function (key, value) {
                if (value !== null) {
                    if (formDataTypes[key] === "date") {
                        formDataWithFiles.append(key, new Date(parseInt(value)));
                    } else {
                        formDataWithFiles.append(key, value);
                    }
                }
            });

            var filesInput = $('#' + formId + ' input[type=file]').not("#files");
            if (typeof filesInput !== "undefined" && filesInput !== null && !$.isEmptyObject(filesInput) && filesInput.length > 0) {
                $.each(filesInput, function (i, fileInput) {
                    formDataWithFiles.append($(filesInput).attr("name"), $(fileInput)[0].files[0]);
                });
            }

            formData = formDataWithFiles;
            var ajaxObj = {
                type: "POST",
                url: url,
                data: formData,
                cache: false,
                contentType: false,
                processData: false
            };
            promise = RSVP.all([rsvpCallMultipart(ajaxObj)]);
        } else {
            var ajaxObj = {
                type: options.action === "new" ? "POST" : "PUT",
                data: JSON.stringify(formData),
                url: url,
                dataType: "json"
            };
            promise = RSVP.all([rsvpCall(ajaxObj)]);
        }

        promise["then"](function (results) {
            // success
            var entity = results[0];

            // Option to hide growl if procedure progress modal is shown
            if (typeof options.ignoreGrowl === "undefined" || !options.ignoreGrowl) {
                $.growl.notice({message: IlyLocales.general.entity.update.complete});
            }
            setTimeout(function () {
                if (options.formFields.modal) {
                    var selectorModal = options.formFields.modalSelector ? options.formFields.modalSelector : "#formCrudModal";
                    var grid = $(options.selector).data('kendoGrid');
                    if (grid) {
                        grid.dataSource.read();
                        grid.refresh();
                    }
                    $(selectorModal).modal("hide");
                }
                try {
                    options.afterComplete(entity, options.action, options);
                } catch (err) {
                    // afterComplete not defined
                }
            }, 1500);
        });

        try {
            options.postCall(options);
        } catch (err) {
            // postCall not defined
        }

        promise["catch"](function (e) {
            // fail
            var msg = null, growlMsg = IlyLocales.general.error.try_again;
            try {
                msg = e.responseJSON.message;
            } catch (e) {

            }
            if (typeof msg === "undefined" || msg === null) {
                msg = e.responseJSON;
            }
            if (typeof msg === "undefined" || msg === null) {
                msg = growlMsg;
            }
            try {
                options.afterFailure(e, options.action);
            } catch (err) {
                // afterComplete not defined
            }
            var alertMsg = msg;
            $(form).find(".form-errors").text(alertMsg);
            $(form).find(".form-errors").show();

            if (typeof options.showErrorGrowl !== "undefined" && options.showErrorGrowl) {
                $.growl.error({message: growlMsg});
            }
        });

        promise["finally"](function (e) {
            $.unblockUI();
        });
    }
};
IlyForms.formFieldsUpdateButtonGroups = function (editButton, saveButton, cancelButton, field, url, initData, dataObj, mode, initFunction, newDataObj) {
    $(saveButton).hide();
    $(cancelButton).hide();
    $(field).prop("disabled", true);
    $(editButton + " > button").on("click", function (e) {
        $(editButton).hide();
        $(saveButton).show();
        $(cancelButton).show();
        $(field).prop("disabled", false);

        $(saveButton + " > button").unbind().on("click", function (e) {
            var apiCallUrl = url;
            var newData;
            if (typeof newDataObj === "undefined") {
                newData = JSON.stringify($(field).val().toString());
            } else {
                newDataObj.fieldValue = $(field).val().toString();
                newData = JSON.stringify(newDataObj);
            }
            IlyForms.ajaxCallUpdateFormField(apiCallUrl, newData, initFunction, initData, mode);
        });

        $(cancelButton + " > button").unbind().on("click", function (e) {
            $(field).val(dataObj !== null && typeof dataObj !== "undefined" && typeof dataObj.id !== "undefined" ? dataObj.id : dataObj);
            $(editButton).show();
            $(saveButton).hide();
            $(cancelButton).hide();
            $(field).prop("disabled", true);
        });
    });
};
IlyForms.ajaxCallUpdateFormField = function (url, newData, initFunction, initData, mode) {
    $.blockUI({"message": IlyLocales.general.please_wait});
    $.ajax({
        type: "PUT",
        url: url,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: newData
    }).done(function (results) {
        $.growl.notice({
            message: IlyLocales.general.entity.update.complete,
            timeout: 1500
        });
        initFunction(results, mode);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        var message = jqXHR.responseText ? jqXHR.responseText : IlyLocales.general.error.try_again;
        $.growl.error({
            message: message,
            timeout: 1500
        });
        initFunction(initData, mode);
    }).always(function (jqXHR, textStatus, errorThrown) {
        $.unblockUI();
    });
};

(function ($) {
    $.fn.clearForm = function () {
        //Internal $.validator is exposed through $(form).validate()
        var validator = $(this).validate();
        //Iterate through named elements inside of the form, and mark them as error free
        $('[name]', this).each(function () {
            validator.successList.push(this);//mark as error free
            validator.showErrors();//remove error messages if present
        });
        validator.resetForm();//remove error class on name elements and clear history
        validator.reset();//remove all error and success data

        var errors = $(this).find(".has-error");
        $.each(errors, function (i, err) {
            $(err).removeClass("has-error");
        });

        return this.each(function () {
            var type = this.type, tag = this.tagName.toLowerCase();
            if (tag === 'form')
                return $(':input', this).clearForm();
            if (type === 'text' || type === 'hidden' || type === 'password' || type === 'email' || tag === 'textarea')
                this.value = '';
            else if (type === 'checkbox' || type === 'radio')
                $(this).prop("checked", false);
            else if (tag === 'select')
                this.selectedIndex = 0;
        });
    },
            $.fn.createForm = function (options) {
                var formFields = options.formFields;
                formFields.action = options.action;
                var formHTML = formConstructor(formFields);
                var selectorEl = options.selectorEl;
                if (typeof selectorEl === "undefined" || selectorEl === null && $.isEmptyObject(selectorEl)) {
                    return;
                }

                $(selectorEl).empty();
                $(selectorEl).append(formHTML);

                $(selectorEl).find('[data-toggle="tooltip"]').tooltip();
                $(selectorEl).find('form :input:visible:enabled:first').focus();

                if (options.formFields.modal) {
                    //        var selectorModal = "#formCrudModal";
                    var selectorModal = options.formFields.modalSelector ? options.formFields.modalSelector : "#formCrudModal";
                    var title = IlyLocales.general.edit;
                    if (options.action === "new") {
                        title = IlyLocales.general.create;
                    } else if (options.action === "delete") {
                        title = IlyLocales.general.delete.title;
                    }
                    $(selectorModal).find(".modal-title").text(title);
                }

                var formId = options.formFields.formId;
                var data = options.data;

                var form = $("#" + formId);

                $(form).find(".form-errors").hide();
                $(form).clearForm();
                $(form).populateForm(data);

                $(form).validate({});

                $(form).find(".calendar.date input").each(function () {
                    $(this).rules("add", {
                        dateITA: true
                    });
                });

                $(form).find(".calendar.date input").datepicker({
                    format: "dd/mm/yyyy",
                    language: "el"
                });

                try {
                    options.initEntityForm(options);
                } catch (e) {
                    // no initEntityForm exists
                }

                if (options.formFields.modal) {
                    $(selectorModal).modal("show");
                    $(selectorModal).on('shown.bs.modal', function () {
                        $(selectorModal).find('form :input:visible:enabled:first').focus();
                    });
                }
                if (options.action === "delete") {
                    $(selectorEl).off("click", ".btn-deleteEntity");
                    $(selectorEl).on("click", ".btn-deleteEntity", function () {
                        IlyForms.actions.deleteEntityForm(options);
                    });
                } else {
                    if (!options.formFields.modal) {
                        $(selectorEl).off("click", ".btn-saveEntity");
                        $(selectorEl).on("click", ".btn-saveEntity", function () {
                            IlyForms.actions.saveEntityForm(options);
                        });
                    } else {
                        $(selectorModal).off("click", ".btn-saveEntity");
                        $(selectorModal).on("click", ".btn-saveEntity", function () {
                            IlyForms.actions.saveEntityForm(options);
                        });
                    }
                }
                if (options.action === "view" || options.action === "delete") {
                    enableViewMode(options);
                }
            },
            $.fn.populateForm = function (data) {
                var form = this;
                form.clearForm();

                if (typeof data === "undefined" || data === null) {
                    data = [];
                }

                $.each(data, function (key, value) {

                    var d = $('[name=\'' + key + '\']', form);

                    if (typeof d.attr("data-from-field") !== "undefined" && d.attr("data-from-field") !== null && d.attr("data-from-field") !== "") {
                        value = value === null ? null : value[d.attr("data-from-field")];
                    }

                    switch (d.attr("type"))
                    {
                        case "text" :
                        case "number":
                        case "hidden":
                        case "email":
                        case "textarea":
                            if (d.hasClass("date-field")) {
                                if (value !== undefined && value !== null && value !== "") {
                                    var date = $.isNumeric(value) ? new Date(parseInt(value)) : new Date(value);
                                    $(d).datepicker({
                                        format: "dd/mm/yyyy",
                                        language: "el"
                                    });
                                    $(d).datepicker("setDate", date);
                                    $(d).val($.datepicker.formatDate("dd/mm/yy", date));
                                    //                        $(d).datepicker("update");
                                }
                            } else {
                                d.val(value);
                            }
                            break;
                        case "htmlArea":
                            $(d).html(value);
                            break;
                        case "select" :
                            d.each(function () {
                                $(this).find("option").each(function () {
                                    if (typeof value === "object" && $(this).attr('value') !== "" && value !== null) {
                                        var entityId = null;
                                        if ($(this).attr("data-entityId") !== "undefined" && $(this).attr("data-entityId") !== null && $(this).attr("data-entityId") !== "") {
                                            entityId = $(this).attr("data-entityId");
                                        }
                                        if (entityId !== null) {
                                            value = value[entityId];
                                        }
                                    }
                                    if (value !== null && $(this).attr('value') === value.toString()) {
                                        $(this).prop("selected", true);
                                    }
                                });
                            });
                            break;
                        case "radio" :
                            d.each(function () {
                                if (value !== null && $(this).attr('value') === value.toString()) {
                                    $(this).prop("checked", value);
                                }
                            });
                            break;
                        case "checkbox":
                            d.each(function () {
                                $(this).prop("checked", value === true || value === "true");
                            });
                            break;
                        case "img":
                            if ($(d).is("img")) {
                                d.attr("src", "data:image/png;base64," + value);
                            } else {
                                // Not an image
                                d.val(value);
                            }
                            break;
                        case "htmlText":
                            if(typeof value !== "undefined" && value !== null){
                                var htmlParsed=$.parseHTML(htmlDecode(value));
                                $(htmlParsed).insertAfter(d);
                                d.remove();
                            }
                            break;
                        default:
                            d.val(value);
                            break;
                    }
                });
            },
            $.fn.serializeForm = function (tf) {
                var serialized = [];
                var targetFields = jQuery.extend(true, {}, tf);
                var form = this;

                if (targetFields === undefined || targetFields === null) {
                    console.log("TargetFields are not defined!");
                    return serialized;
                }

                var initGroup = {
                    group_id: "initial",
                    group_description: "",
                    title: "Initial Fields",
                    fields: [
                        {
                            field: "email",
                            type: "string",
                            required: true
                        },
                        {
                            field: "password",
                            type: "string",
                            required: true
                        }
                    ]
                };

                var groups = targetFields.groups;

                if (groups === undefined || groups === null) {
                    console.log("Groups are not defined!");
                    return serialized;
                }

                groups.unshift(initGroup);

                $.each(groups, function (i, group) {
                    var group_id = group.group_id;

                    var serializedGroup = {};
                    serializedGroup.group_id = group_id;

                    var serializedGroupFields = [];

                    var fields = group.fields;

                    if (fields === undefined || fields === null) {
                        console.log("Fields are not defined!");
                        return;
                    }

                    var groupFieldsFromHTML = form.find("#custom-group-" + group_id + " .group-field");

                    if (groupFieldsFromHTML === undefined || groupFieldsFromHTML === null) {
                        console.log("GroupFieldsFromHTML do not exist!");
                        return;
                    }

                    $.each(fields, function (i, f) {

                        var field = f.field;
                        var type = f.type;
                        var value = null;

                        var serializedGroupField = {};
                        serializedGroupField.field = field;

                        var fieldFromHTML = groupFieldsFromHTML.find("[name='" + field + "']");

                        switch (type) {
                            case "string" :
                                value = fieldFromHTML.val();
                                break;
                            case "date" :
                                value = fieldFromHTML.val();
                                if (value === undefined || value === null || value === "") {
                                    value = null;
                                } else {
                                    value = fieldFromHTML.datepicker("getDate").getTime();
                                }
                                break;
                            case "text" :
                                value = fieldFromHTML.val();
                                break;
                            case "number" :
                                value = fieldFromHTML.val();

                                if (value === undefined || value === null || value === "") {
                                    value = null;
                                } else {
                                    value = parseFloat(fieldFromHTML.val());
                                }
                                break;
                            case "boolean" :
                                value = fieldFromHTML.prop("checked");
                                break;
                            case "radio" :
                                value = fieldFromHTML.prop("checked");
                                break;
                            case "select" :
                                var selected = fieldFromHTML.find("option:selected");
                                if (selected === undefined || selected === null || $.isEmptyObject(selected) || selected.length === 0) {
                                    value = null;
                                } else {
                                    value = selected.val();
                                }
                                break;
                        }
                        serializedGroupField.value = value;

                        serializedGroupFields.push(serializedGroupField);
                    });

                    serializedGroup.fields = serializedGroupFields;

                    serialized.push(serializedGroup);
                });
                return serialized;
            },
            $.fn.serializeNestedList = function () {
                var o = {};
                var a = this.serializeArray();
                console.log(this);
                console.log(a);
                $.each(a, function () {
                    if (o[this.name] !== undefined) {
                        console.log(o[this.name]);
                        if (!o[this.name].push) {
                            o[this.name] = [o[this.name]];
                        }
                        o[this.name].push(this.value || '');
                    } else {
                        console.log("else:", o[this.name]);
                        if ($("[name=" + this.name + "]").hasClass("nestedList")) {
                            console.log("else if:", o[this.name]);
                            o[this.name] = this.value || '';
                        }
                    }
                });
                console.log(o);
                return o;
            },
            $.fn.serializeObject = function () {
                var o = {};

                var element = this;

                var disabled = this.find(':input:disabled').removeAttr('disabled');

                var a = this.serializeArray();
                $.each(a, function () {

                    /* Group by data-group */
                    var group = null;
                    try {
                        group = $(element).find("[name='" + this.name + "']").attr("data-group-map");
                    } catch (e) {
                        group = null;
                    }

                    if (group !== undefined && group !== null) {
                        if (o[group] === undefined || o[group] === null) {
                            o[group] = {};
                        }
                        o[group][this.name] = this.value;
                    } else {
                        if (o[this.name] !== undefined) {
                            if (!o[this.name].push) {
                                o[this.name] = [o[this.name]];
                            }
                            o[this.name].push(this.value || '');
                        } else {
                            o[this.name] = this.value || '';
                        }
                    }
                });

                $(this).find("input:checkbox").each(function () {
                    var group = null;
                    try {
                        group = $(element).find("[name='" + this.name + "']").attr("data-group-map");
                    } catch (e) {
                        group = null;
                    }
                    if (group !== undefined && group !== null) {
                        if (o[group] !== undefined || o[group] !== null) {
                            o[group][this.name] = "" + this.checked + "";
                        }
                    } else {
                        o[this.name] = "" + this.checked + "";
                    }
                });

                $(this).find(".date-field").each(function () {
                    var group = null;
                    try {
                        group = $(element).find("[name='" + this.name + "']").attr("data-group-map");
                    } catch (e) {
                        group = null;
                    }
                    if (group !== undefined && group !== null) {
                        if (o[group] !== undefined || o[group] !== null) {
                            if (o[group][this.name] !== undefined) {
                                o[group][this.name] = IlyForms.actions.getDateFromField(this.value);
                            }
                        }
                    } else {
                        if (o[this.name] !== undefined) {
                            o[this.name] = IlyForms.actions.getDateFromField(this.value);
                        }
                    }
                });

                $(this).find("img[type='img']").each(function () {
                    setPreviewImage(this.name);
                    var group = null;
                    try {
                        group = $(element).find("[name='" + this.name + "']").attr("data-group-map");
                    } catch (e) {
                        group = null;
                    }
                    if (group !== undefined && group !== null) {
                        if (o[group] !== undefined || o[group] !== null) {
                            o[group][this.name] = "" + $("#preview-" + this.name).attr("src").replace(/^data:image\/(png|jpg);base64,/, "") + "";
                        }
                    } else if (typeof $("#preview-" + this.name).attr("src") !== "undefined") {
                        o[this.name] = "" + $("#preview-" + this.name).attr("src").replace(/^data:image\/(png|jpg);base64,/, "") + "";
                    }
                });

                disabled.attr('disabled', 'disabled');

                return o;
            };
})(jQuery);


IlyForms.getCourseSyllabusExamFormFields = function (isStudent) {
    return {
        formId: "courseSyllabusExamEntityForm",
        fields: [
            {type: "group", groupClass: "col-md-12 col-sm-12 col-xs-12", children: [
                    {type: "field", datatype: "string", code: "courseSyllabusTitle", title: IlyLocales.entity.all.courseSyllabusId},
                    {type: "field", datatype: "string", code: "courseCode", title: IlyLocales.entity.all.courseCode},
                    {type: "field", datatype: "string", code: "examPeriodTitle", title: IlyLocales.entity.all.examPeriodId},
                    {type: "field", datatype: "date", code: "dateExam", title: IlyLocales.entity.courseSyllabusExam.dateExam},
                    {type: "field", datatype: "string", code: "hoursExamParsed", title: IlyLocales.entity.courseSyllabusExam.hoursExam},
                    {type: "field", datatype: "date", code: "dateGradesAnnouncement", title: IlyLocales.entity.courseSyllabusExam.dateGradesAnnouncement},
                    {type: "field", datatype: "date", code: "webSubmissionDateFrom", title: IlyLocales.entity.courseSyllabusExam.webSubmissionDateFrom, hidden: isStudent},
                    {type: "field", datatype: "date", code: "webSubmissionDateTo", title: IlyLocales.entity.courseSyllabusExam.webSubmissionDateTo, hidden: isStudent},
                    {type: "field", datatype: "date", code: "studentPreferenceDateFrom", title: IlyLocales.entity.courseSyllabusExam.studentPreferenceDateFrom},
                    {type: "field", datatype: "date", code: "studentPreferenceDateTo", title: IlyLocales.entity.courseSyllabusExam.studentPreferenceDateTo}
                ]
            }
        ]
    };
};

IlyForms.getThesisFormFields = function () {
    return {
        formId: "thesisEntityForm",
        fields: [
            {type: "group", groupClass: "col-md-12 col-sm-12 col-xs-12", children: [
                    {type: "field", datatype: "string", code: "title", title: IlyLocales.entity.all.title},
                    {type: "field", datatype: "string", code: "departmentTitle", title: IlyLocales.entity.all.departmentId},
                    {type: "field", datatype: "number", code: "code", title: IlyLocales.entity.thesis.code},
                    {type: "field", datatype: "string", code: "supervisorName", title: IlyLocales.entity.thesis.supervisorId},
                    {type: "field", datatype: "string", code: "summary", title: IlyLocales.entity.thesis.summary},
                    {type: "field", datatype: "string", code: "thesisStatusTitle", title: IlyLocales.entity.all.status},
                    {type: "field", datatype: "string", code: "thesisTypeTitle", title: IlyLocales.entity.thesis.thesisTypeId},
                    {type: "field", datatype: "string", code: "gradingScaleTitle", title: IlyLocales.entity.all.gradingScaleId},
                    {type: "field", datatype: "date", code: "dateStart", title: IlyLocales.entity.thesis.dateStart},
                    {type: "field", datatype: "date", code: "dateEnd", title: IlyLocales.entity.thesis.dateEnd},
                    {type: "field", datatype: "date", code: "dateExam", title: IlyLocales.entity.thesis.dateExam},
                    {type: "field", datatype: "number", code: "maxStudents", title: IlyLocales.entity.thesis.maxStudents},
                    {type: "field", datatype: "string", code: "authoringLanguageTitle", title: IlyLocales.entity.thesis.authoringLanguageId},
                    {type: "field", datatype: "string", code: "carrierTitle", title: IlyLocales.entity.thesis.carrierId}
                ]
            }
        ]
    };
};

IlyForms.getAnnouncementFormFields = function (mode, departments, teachers, announcementTags, scopes, targets) {
    return {
        formId: "announcementEntityForm",
        fields: [
            {type: "group", groupClass: "col-md-12 col-sm-12 col-xs-12", children: [
                    {type: "field", datatype: "string", code: "id", hidden: true},
                    {type: "field", datatype: "string", code: "title", title: IlyLocales.entity.announcement.title, required: true},
                    {type: "field", datatype: "string", code: "titleEn", title: IlyLocales.entity.announcement.titleEn},
                    {type: "field", datatype: "select", code: "scope", title: IlyLocales.entity.announcement.scope.title,
                        options: scopes,
                        readonly: (mode !== "new"), hidden: true
                    },
                    {type: "field", datatype: "select", code: "departmentId", title: IlyLocales.entity.announcement.departmentId, 
                        options: departments,
                        required: true
                    },
                    {type: "field", datatype: "select", code: "target", title: IlyLocales.entity.announcement.target.title,
                        options: targets,
                        required: true
                    },
                    {type: "field", datatype: "select", code: "announcementTagId", title: IlyLocales.entity.announcement.announcementTagTitle, options: announcementTags},
                    {type: "field", datatype: "boolean", code: "isHighImportance", title: IlyLocales.entity.announcement.isHighImportance},
                    {type: "field", datatype: "date", code: "datePublished", title: IlyLocales.entity.announcement.datePublished, required: true},
                    {type: "field", datatype: "boolean", code: "isPublished", title: IlyLocales.entity.announcement.isPublished},
                    {type: "field", datatype: "boolean", code: "isArchive", title: IlyLocales.entity.announcement.isArchive},
                    {type: "field", datatype: "date", code: "startPublishingDate", title: IlyLocales.entity.announcement.startPublishingDate},
                    {type: "field", datatype: "date", code: "endPublishingDate", title: IlyLocales.entity.announcement.endPublishingDate},
                    {type: "input_group", datatype: "select", code: "teacherId", title: IlyLocales.entity.announcement.teacherId, options: teachers, readonly: true, hidden: true},
                    {type: "input_group", datatype: "string", code: "courseSyllabusId", hidden: true},
                    {type: "input_group", datatype: "divArea", code: "courseSyllabusIds", title: IlyLocales.entity.all.courseSyllabusId,
                        buttons_after: [{btnId: "chooseCourseSyllabus"}], hidden: true
                    },
                    {type: "input_group", datatype: "select", code: "courseSyllabusForClassId", title: IlyLocales.entity.all.courseSyllabusId, options: [], readonly: true,
                                    buttons_after: [{btnId: "chooseCourseSyllabusForClass"}]
                    },
                    {type: "input_group", datatype: "string", code: "courseSyllabusClassId", hidden: true},
                    {type: "input_group", datatype: "divArea", code: "courseSyllabusClassIds", title: IlyLocales.entity.all.courseSyllabusClassId,
                        buttons_after: [{btnId: "chooseCourseSyllabusClass"}]
                    },
                    {type: "field", datatype: "textarea", code: "preview", title: IlyLocales.entity.announcement.preview},
                    {type: "field", datatype: "textarea", code: "previewEn", title: IlyLocales.entity.announcement.previewEn},
                    {type: "field", datatype: "kendoEditor", code: "content", title: IlyLocales.entity.announcement.content},
                    {type: "field", datatype: "kendoEditor", code: "contentEn", title: IlyLocales.entity.announcement.contentEn},
                    {type: "field", datatype: "date", code: "dateCreated", title: IlyLocales.entity.announcement.dateCreated, disabled: true, hidden: (mode === "new")},
                    {type: "field", datatype: "string", code: "userCreated", title: IlyLocales.entity.announcement.userCreated, disabled: true, hidden: true},
                    {type: "field", datatype: "date", code: "dateModified", title: IlyLocales.entity.announcement.dateModified, disabled: true, hidden: (mode === "new")},
                    {type: "field", datatype: "string", code: "userModified", title: IlyLocales.entity.announcement.userModified, disabled: true, hidden: true}
                ]
            }
        ]
    };
};
