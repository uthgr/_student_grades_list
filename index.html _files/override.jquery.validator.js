/**
 * Override jQuery Validator.
 */

jQuery.extend(
        jQuery.validator.messages, {
            required: IlyLocales.general.form.validation.field_mandatory,
            remote: "Please fix this field.",
            alphabeticExt: IlyLocales.general.form.validation.name_invalid,
            email: IlyLocales.general.form.validation.email_invalid,
            url: IlyLocales.general.form.validation.url_invalid,
            date: IlyLocales.general.form.validation.date_invalid,
            dateISO: IlyLocales.general.form.validation.iso_date_invalid,
            number: IlyLocales.general.form.validation.number_invalid,
            digits: IlyLocales.general.form.validation.digits_invalid,
            creditcard: IlyLocales.general.form.validation.card_invalid,
            equalTo: IlyLocales.general.form.validation.equals_to_invalid,
            accept: "Please enter a value with a valid extension.",
            maxlength: jQuery.validator.format("Παρακαλώ συμπληρώστε μέχρι {0} χαρακτήρες."),
            minlength: jQuery.validator.format("Παρακαλώ συμπληρώστε τουλάχιστον {0} χαρακτήρες."),
            rangelength: jQuery.validator.format("Παρακαλώ συμπληρώστε από {0} μέχρι {1} χαρακτήρες."),
            range: jQuery.validator.format("Παρακαλώ συμπληρώστε μια τιμή μεταξύ {0} και {1}."),
            max: jQuery.validator.format("Η μέγιστη επιτρεπόμενη τιμή είναι {0}."),
            min: jQuery.validator.format("Η ελάχιστη επιτρεπόμενη τιμή είναι {0}."),
            greaterThan: IlyLocales.general.form.validation.date_range_to_invalid,
            greaterThanOrNull: "Η Ημερομηνία Έως πρέπει να είναι μεγαλύτερη της Ημερομηνίας Από.",
            lessThan: IlyLocales.general.form.validation.date_range_from_invalid,
            gt: function (el) {
                return IlyLocales.general.form.validation.min_value_invalid + $(el).val();
            },
            lt: function (el) {
                return IlyLocales.general.form.validation.max_value_invalid + $(el).val();
            },
            gte: function (el) {
                return IlyLocales.general.form.validation.min_value_invalid + $(el).val();
            },
            lte: function (el) {
                return IlyLocales.general.form.validation.max_value_invalid + $(el).val();
            },
            neq: function (el) {
                return IlyLocales.general.form.validation.diff_value.invalid + $(el).val();
            },
            kendoRequired: IlyLocales.general.form.validation.field_mandatory,
            kendoEditorRequired: IlyLocales.general.form.validation.field_mandatory
        }
);

jQuery.extend(
        jQuery.validator.defaults, {
            ignore: "",
            errorClass: "has-error",
            validClass: "has-success",
            errorPlacement: function (error, element) {
                error.appendTo($(element).parents(".form-group").find(".report-status"));
            },
            onfocusout: function (element) {
                //$(element).valid();
            },
            highlight: function (element, errorClass, validClass) {
                $(element).parent().addClass(errorClass)
                        .removeClass(validClass);
            },
            unhighlight: function (element, errorClass, validClass) {
                $(element).parent().removeClass(errorClass)
                        .addClass(validClass);
            }
        }
);

jQuery.validator.addMethod("dateITA", function (value, element) {
    var check = false,
            re = /^\d{1,2}\/\d{1,2}\/\d{4}$/,
            adata, gg, mm, aaaa, xdata;
    if (re.test(value)) {
        adata = value.split("/");
        gg = parseInt(adata[0], 10);
        mm = parseInt(adata[1], 10);
        aaaa = parseInt(adata[2], 10);
        xdata = new Date(aaaa, mm - 1, gg, 12, 0, 0, 0);
        if ((xdata.getUTCFullYear() === aaaa) && (xdata.getUTCMonth() === mm - 1) && (xdata.getUTCDate() === gg)) {
            check = true;
        } else {
            check = false;
        }
    } else {
        check = false;
    }
    return this.optional(element) || check;
}, "Please enter a correct date");

//parse a date in yyyy-mm-dd format
function parseDate(input) {
    var parts = input.split('/');
// Note: months are 0-based
    return new Date(parts[2], parts[1] - 1, parts[0]);
}

jQuery.validator.addMethod("alphabeticExt", function (value, element, params) {
    if (value !== null) {
        return IlyLib.helpers.checkIfAlphabetExtValid(value);
    }
    return false;
});

jQuery.validator.addMethod("neq", function (value, element, params) {
    if (!$($(params)[0]).is(":filled")) {
        return true;
    }
    var other = $(params).val();
    return value !== other;
});

jQuery.validator.addMethod("gt", function (value, element, params) {
    var v = parseFloat(value);
    if (!$($(params)[0]).is(":filled")) {
        return true;
    }
    var other = parseFloat($(params).val());
    return v > other;
});

jQuery.validator.addMethod("lt", function (value, element, params) {
    var v = parseFloat(value);
    if (!$($(params)[0]).is(":filled")) {
        return true;
    }
    var other = parseFloat($(params).val());
    return v < other;
});

jQuery.validator.addMethod("gte", function (value, element, params) {
    var v = parseFloat(value);
    if (!$($(params)[0]).is(":filled")) {
        return true;
    }
    var other = parseFloat($(params).val());
    return v >= other;
});

jQuery.validator.addMethod("lte", function (value, element, params) {
    var v = parseFloat(value);
    if (!$($(params)[0]).is(":filled")) {
        return true;
    }
    var other = parseFloat($(params).val());
    return v <= other;
});

jQuery.validator.addMethod("greaterThan", function (value, element, params) {
    endDate = parseDate(value);
    startDate = parseDate($(params).val());
    if (/Invalid|NaN/.test(startDate)) {
        return true;
    }
    if (!/Invalid|NaN/.test(endDate)) {
        return endDate >= startDate;
    }
    return isNaN(value) && isNaN($(params).val()) || (Number(value) >= Number($(params).val()));
});

jQuery.validator.addMethod("greaterThanOrNull", function (value, element, params) {
    endDate = parseDate(value);
    var valid;
    if(!Array.isArray(params)) {
        findValid(params);
    } else {
        for (var i = 0; i < params.length; i++) {
            if(!findValid(params[i])){
                break;
            }
        }
    }

    function findValid(params) {
        startDate = parseDate($(params).val());
        if (/Invalid|NaN/.test(startDate)) {
            valid = true;
            return valid;
        }
        if (!/Invalid|NaN/.test(endDate)) {
            valid = endDate >= startDate;
            if(valid === false){
                return valid;
            }
        }
        valid = isNaN(value) && isNaN($(params).val()) || (Number(value) >= Number($(params).val())) || value === "";
        if(valid === false){
            return valid;
        }
    }
    return valid;
});

jQuery.validator.addMethod("lessThan", function (value, element, params) {
    endDate = parseDate(value);
    startDate = parseDate($(params).val());
    if (/Invalid|NaN/.test(startDate)) {
        return true;
    }
    if (!/Invalid|NaN/.test(endDate)) {
        return endDate <= startDate;
    }
    return isNaN(value) && isNaN($(params).val()) || (Number(value) <= Number($(params).val()));
});

jQuery.validator.addMethod("kendoRequired", function (value, element, params) {

    var ms = $(params).data("kendoDropDownList");

    if (typeof ms === "undefined" || ms === null) {
        return false;
    }

    return typeof ms.value() !== "undefined" && ms.value() !== null && ms.value() !== "";
});

jQuery.validator.addMethod("kendoEditorRequired", function (value, element, params) {

    var ms = $(params).data("kendoEditor");

    if (typeof ms === "undefined" || ms === null) {
        return false;
    }

    return typeof ms.value() !== "undefined" && ms.value() !== null && ms.value() !== "";
});
