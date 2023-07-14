$(document).ready(function () {
    var selectorModal = $(document).find('.grid_modal');
    selectorModal.on('shown.bs.modal', function () {
        $(document).off('focusin.modal');
    });
});

// Adding CSRF protection tokens on the header when performing AJAX requests
// Without this code post requests will fail because Spring security CSRF is enabled
// and it requires CSRF tokens to be passed. That behavior can be disabled if 
// we remove by <security:csrf /> in security-config.xml
$(function () {
    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");
    $(document).ajaxSend(function (e, xhr, options) {
        xhr.setRequestHeader(header, token);
        var profile = IlyLib.helpers.getUrlParameter("p");
        if (profile) {
            xhr.setRequestHeader("X-Profile", profile)
        }
    });
    $(document).ajaxError(function (e, xhr, options) {
        var accessDeniedCustomHeader = xhr.getResponseHeader("Access-Status-Custom-Header");
        if (accessDeniedCustomHeader != null && accessDeniedCustomHeader == "UNAUTHORIZED") {

            $("#reLoginLink").on('click', function () {
                window.location.reload(true);
            });
            $("#reLoginModal").modal("show");
//            $.growl.error({message: IlyLocales.general.authentication.logged_out, timeout:2000});
        } else {
            $("#reLoginLink").off('click');
        }
    });
});

// Global AJAX setup. Notice: this will make all jQuery methods ($.post, $.get)
// to automatically send JSON as data.
$.ajaxSetup({
    contentType: "application/json; charset=utf-8"
});

// Alert object to easier create bootstrap alerts.
// Usage:
// 1. Create Alert object
// 2. Post to server on /alert
// 3. Receive bootstrap alert html
// 4. Add to DOM
function Alert(strongMessage, message, type, dismissable) {
    this.strongMessage = strongMessage;
    this.message = message;
    this.type = type;
    this.dismissable = dismissable;
}

// Helper function that creates a new alert and returns
// the JSON string ready to be passed in an AJAX as data
function createAlert(strongMessage, message, type, dismissable) {
    return JSON.stringify(new Alert(strongMessage, message, type, dismissable));
}

function getType(id, ds, key) {

    if ((id === undefined) || (id === null)) {
        return "";
    }

    if (typeof key === "undefined" || key === null || key === "") {
        key = "id";
    }

    for (var idx = 0; idx < ds.length; idx++) {
        if (ds[idx][key] === id) {
            return ds[idx].value;
        }
    }

    return "";
}

function getValueByBoolean(val) {
    return "<input type='checkbox' " + (val === "true" || val === true ? "checked=checked" : "") + " disabled='disabled' ></input>";
}

var keyCodes = {
    TAB: 9,
    ENTER: 13,
    UP_ARROW: 38,
    DOWN_ARROW: 40
};

function htmlDecode(input) {
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes[0].nodeValue;
}

function findLongestPathFromTree(programCourse, fatherList, childrenMap, sectorMap, length) {
    var results = [];
    for (var idx in fatherList) {
        var parentId = fatherList[idx]
        var children = childrenMap[parentId];
        if (!children || children.length == 0) {
            results.push({id: parentId, success: true, length: length});
        } else {
            var passed_children_ids = [];
            for (var idx in children) {
                var child = children[idx];
                var id = idForProgramTreeElement(child);
                var field = enums.entity_type[child.entity].field;
                if (child.entity == enums.entity_type.SUBJECT.code) {
                    if ((programCourse[field] && programCourse[field].id == id) || (programCourse[field] == null && id == null)) {
                        passed_children_ids.push(child.id);
                    }
                } else {
                    if ((programCourse[field] && programCourse[field].id == id)) {
                        passed_children_ids.push(child.id);
                    }
                }
            }
            if (passed_children_ids.length == 0) {
                results.push({id: parentId, success: false, length: length});
            } else {
                var newLength = length + 1;
                var tmp_res = findLongestPathFromTree(programCourse, passed_children_ids, childrenMap, sectorMap, newLength);
                results = results.concat(tmp_res);
            }
        }
    }
    return results;
}

function nameForProgramTreeElement(element) {
    var title = "";
    switch (element.entity) {
        case enums.entity_type.SUBJECT.code:
            title = enums.entity_type.SUBJECT.title + ": " +
                    (_subject[element.entityId] ? _subject[element.entityId].title : enums.entity_type.SUBJECT.no_title);
            break;
        case enums.entity_type.SUBSUBJECT.code:
            title = enums.entity_type.SUBSUBJECT.title + ": " +
                    (_subSubject[element.entityId] ? _subSubject[element.entityId].title : IlyLocales.general.uncategorized);
            break;
        case enums.entity_type.CATEGORY.code:
            title = enums.entity_type.CATEGORY.title + ": " +
                    (_categories[element.entityId] ? _categories[element.entityId].title : IlyLocales.general.uncategorized);
            break;
        case enums.entity_type.COGNITIVESUBJECT.code:
            title = enums.entity_type.COGNITIVESUBJECT.title + ": " +
                    (_cognSubject[element.entityId] ? _cognSubject[element.entityId].title : IlyLocales.general.uncategorized);
            break;
        case enums.entity_type.COGNITIVESUBSUBJECT.code:
            title = enums.entity_type.COGNITIVESUBSUBJECT.title + ": " +
                    (_cognSubSubject[element.entityId] ? _cognSubSubject[element.entityId].title : IlyLocales.general.uncategorized);
            break;
        case enums.entity_type.GROUP.code:
            title = enums.entity_type.GROUP.title + ": " +
                    (_group[element.entityId] ? _group[element.entityId].title + " (" + _group[element.entityId].code + ")" : IlyLocales.general.uncategorized);
            break;
        case enums.entity_type.SECTOR.code:
            title = enums.entity_type.SECTOR.title + ": " +
                    (_sector[element.entityId] ? _sector[element.entityId].title : IlyLocales.general.uncategorized);
            break;
        case enums.entity_type.SEMESTER.code:
            title = enums.entity_type.SEMESTER.title + ": " +
                    (_semester[element.entityId] ? _semester[element.entityId].title : IlyLocales.general.uncategorized);
            break;
        case enums.entity_type.TYPE.code:
            title = enums.entity_type.TYPE.title + ": " +
                    (_type[element.entityId] ? _type[element.entityId].title : IlyLocales.general.uncategorized);
            break;
    }
    return title;
}

function idForProgramTreeElement(element) {
    var id = null;
    switch (element.entity) {
        case enums.entity_type.SUBJECT.code:
            id = _subject[element.entityId] ? _subject[element.entityId].id : null;
            break;
        case enums.entity_type.SUBSUBJECT.code:
            id = _subSubject[element.entityId] ? _subSubject[element.entityId].id : "-666";
            break;
        case enums.entity_type.CATEGORY.code:
            id = _categories[element.entityId] ? _categories[element.entityId].id : "-666";
            break;
        case enums.entity_type.COGNITIVESUBJECT.code:
            id = _cognSubject[element.entityId] ? _cognSubject[element.entityId].id : "-666";
            break;
        case enums.entity_type.COGNITIVESUBSUBJECT.code:
            id = _cognSubSubject[element.entityId] ? _cognSubSubject[element.entityId].id : "-666";
            break;
        case enums.entity_type.GROUP.code:
            id = _group[element.entityId] ? _group[element.entityId].id : "-666";
            break;
        case enums.entity_type.SECTOR.code:
            id = _sector[element.entityId] ? _sector[element.entityId].id : "-666";
            break;
        case enums.entity_type.SEMESTER.code:
            id = _semester[element.entityId] ? _semester[element.entityId].id : "-666";
            break;
        case enums.entity_type.TYPE.code:
            id = _type[element.entityId] ? _type[element.entityId].id : "-666";
            break;
    }
    return id;
}

function appendSubSectors(parentList, sectorMap, sectorChildren) {
    var leafNodes = [];
    for (var idx in parentList) {
        var parent = parentList[idx];
        var children = sectorChildren[parent];
        if (typeof children != "undefined" && children.length > 0) {
            var children_context = [];
            var childrenIds = [];
            for (var j in children) {
                var child = children[j];
                var title = nameForProgramTreeElement(child);
                children_context.push({code: child.id,
                    title: {title: title, type: _customTitle.H5, style: "color:black; margin-top: 2px; margin-bottom: 1px;", icon: "fa fa-chevron-right", icon_expanded: "fa fa-chevron-down"},
                    expanded: true});
                childrenIds.push(child.id);
            }
            children_context.push({code: "uncategorized_" + parent,
                title: {title: IlyLocales.general.uncategorized, type: _customTitle.H5, style: "color:black; margin-top: 2px; margin-bottom: 1px;", icon: "fa fa-chevron-right", icon_expanded: "fa fa-chevron-down"},
                expanded: true});

            var parentOptions = {
                selector: "#" + parent,
                accordionId: "accordion_" + parent,
                content: children_context
            }

            createAccordionWithCustomTitle(parentOptions);
            leafNodes.push({id: "uncategorized_" + parent, entity: enums.entity_type.UNCATEGORIZED.code});
            var childLeafNodes = appendSubSectors(childrenIds, sectorMap, sectorChildren);
            leafNodes = leafNodes.concat(childLeafNodes);
        } else {
            leafNodes.push(sectorMap[parent]);
        }
    }
    return leafNodes;
}