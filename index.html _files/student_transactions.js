var _student_entity, _formOptions, wizard_step = 1;

var _studentTransactions = {
    createStudentTransactions: function (transactionType) {
        _studentTransactions.getDropDownItemsForTransactions(function (dropDownOptions) {
            _studentTransactions.createStudentTransactionForm("new", transactionType.code, dropDownOptions);

            var title = document.createTextNode(transactionType.title);
            $("#studentTransactionModal .modal-title").empty().append(title);

        });
    },
    getDropDownItemsForTransactions: function (callback) {
        var dropDownItems = {};

        $.blockUI({message: IlyLocales.general.initializing_params_please_wait});
        
        var promise = RSVP.all([getProgramCourseSubjectsForStudent(), getProgramCourseSubSubjectsForStudent()]);
        promise["then"](function (results) {
            $("#studentTransactionModal").modal("show");

            $("#studentTransactionModal button.close").unbind("click").click(function () {
                $("#studentTransactionModal").modal("hide");
                redirectBack();
            });

            var subjects = results[0], subSubjects = results[1];

            var data = [], data0 = [];

            if (typeof subjects === "undefined" || subjects === null) {
                subjects = [];
            }
            if (typeof subSubjects === "undefined" || subSubjects === null) {
                subSubjects = [];
            }

            $.each(subjects, function (i, v) {
                data.push({
                    "key": v.id,
                    "value": v.code + " - " + v.title
                });
            });
            $.each(subSubjects, function (i, v) {
                data0.push({
                    "key": v.id,
                    "value": v.code + " - " + v.title
                });
            });

            dropDownItems.subjects = data;
            dropDownItems.subSubjects = data0;

            if (callback !== null && typeof callback !== "undefined" && typeof callback === 'function') {
                callback(dropDownItems);
            }
        });
        promise["catch"](function (e) {
            console.log("Promised failed for reason:", e);
        });
        promise["finally"](function (e) {
            $.unblockUI();
        });
    },
    createStudentTransactionForm: function (mode, transactionTypeCode, params) {
        var subjects = params.subjects;
        var subSubjects = params.subSubjects;
        
        var formSelector = "#studentTransactionForm";
        var dkatCondition = false, dypkCondition = false, dkat2Condition = false, dypk2Condition = false, domCondition = false;
        switch (transactionTypeCode) {
            case _studentTransactionTypeEnum.DOM.code:
                domCondition = true;
                break;
            case _studentTransactionTypeEnum.DYPK2.code:
                dypk2Condition = true;
                break;
            case _studentTransactionTypeEnum.DKAT.code:
                dkatCondition = true;
                break;
            case _studentTransactionTypeEnum.DYPK.code:
                dypkCondition = true;
                break;
            case _studentTransactionTypeEnum.DKAT2.code:
                dkat2Condition = true;
                break;
            default:
                break;
        }

        var formFields = {
            formId: "stuTransactionEntityForm",
            entityId: "transactionEntityId",
            fields: [
                {type: "help_text", title: IlyLocales.message.student.webStudentTransaction.prompt.select_group_ids, hidden: !domCondition},
                {type: "help_text", title: IlyLocales.message.student.webStudentTransaction.prompt.select_subject_sub_subject_id, hidden: !dypkCondition && !dypk2Condition && !dkat2Condition && !dkatCondition},
                {type: "help_text", title: IlyLocales.message.student.webStudentTransaction.info.subject_group_will_be_permanent},
                {type: "field", datatype: "select", code: "programSubSubjectId", title: IlyLocales.entity.all.subSubjectId, options: subSubjects, hidden: !dypkCondition, required: dypkCondition},
                {type: "field", datatype: "select", code: "programSubSubject2Id", title: IlyLocales.entity.student.subSubject2Id, options: subSubjects, hidden: !dypk2Condition, required: dypk2Condition},
                {type: "field", datatype: "select", code: "programSubject2Id", title: IlyLocales.entity.student.subject2Id, options: subjects, hidden: !dkat2Condition, required: dkat2Condition},
                {type: "field", datatype: "select", code: "programSubjectId", title: IlyLocales.entity.all.subjectId.normal, options: subjects, hidden: !dkatCondition, required: dkatCondition},
                {type: "field", datatype: "string", code: "programCourseGroupIds", title: IlyLocales.entity.studentTransaction.groupIds, hidden: true, required: domCondition},
                {type: "input_group", datatype: "string", code: "programCourseGroupLabel", title: IlyLocales.entity.studentTransaction.groupIds, hidden: !domCondition, required: domCondition, readonly: true,
                    buttons_after: [{btnId: "chooseStudentProgramCourseGroups"}]
                }
            ]
        };

        var studTransData = {};
        studTransData.transactionTypeCode = transactionTypeCode;
        var options = {
            formFields: formFields,
            selectorEl: formSelector,
            data: studTransData,
            action: mode,
            baseApiUrl: ily_url.student.transactions.api.feign.POST,
            initEntityForm: function (options) {
                if (transactionTypeCode == _studentTransactionTypeEnum.DOM.code) {
                    var contentSelector = "#treeAccordionGroup";
                    $("#chooseStudentProgramCourseGroups").unbind("click").on("click", function (e) {
                        $("#chooseStudentProgramCourseGroupsModal").modal("show");
                        $(contentSelector).empty();

                        var promise = RSVP.all([getProgramCourseGroupsByDepartment(), getStudentDeclaredGroups()]);
                        promise["then"](function (results) {
                            var groups = results[0];
                            var studentGroups = results[1];
                            var selectedGroupIds = [];
                            var groupsMap = {};
                            var groupsArray = [];

                            if (typeof studentGroups !== "undefined" && studentGroups !== null) {
                                // Find ALREADY selected groups
                                $.each(studentGroups, function (i, group) {
                                    selectedGroupIds.push(group.programCourseGroupId.id);
                                });
                            }

                            if (typeof groups !== "undefined" && groups !== null) {
                                // Find isFather groups only
                                $.each(groups, function (i, group) {
                                    if (group.isFather) {
                                        if (typeof groupsMap[group.id] === "undefined" || groupsMap[group.id] === null) {
                                            group["items"] = [];
                                            group["hasChildren"] = true;
                                            group["expanded"] = true;
                                            groupsMap[group.id] = group;
                                        }
                                    }
                                });

                                // Find children groups
                                $.each(groups, function (i, group) {
                                    var idFather = group.idFather && group.idFather.id || group.idFather;
                                    if (typeof idFather !== "undefined" && idFather !== null) {
                                        if (typeof groupsMap[idFather] !== "undefined" && groupsMap[idFather] !== null) {
                                            group["checked"] = false;
                                            group["hasChildren"] = false;
                                            if (selectedGroupIds.includes(group.id)) {
                                                group["checked"] = true;
                                                group["disabled"] = true;
                                            }
                                            groupsMap[idFather]["items"].push(group);
                                        }
                                    }
                                });

                                $.each(groupsMap, function (i, group) {
                                    groupsArray.push(group);
                                });

                                $.each(groupsArray, function (i, group) {
                                    var tableHtml = $.tmpl($("#programGroupsTableTemplate"), [{id: group.id, groupTitle: group.title}]);
                                    var tableRowBody = tableHtml.find("#table_body_" + group.id);
                                    var table_content = [];
                                    var subGroups = group.items;
                                    for (var idx in subGroups) {
                                        var subGroup = subGroups[idx];
                                        var obj = {};
                                        obj["id"] = subGroup["id"];
                                        obj["title"] = subGroup["title"];
                                        obj["checked"] = subGroup["checked"] ? "checked" : "";
                                        obj["disabled"] = subGroup["disabled"] ? "disabled" : "";
                                        obj["idFather"] = subGroup["idFather"] !== null ? subGroup["idFather"].id : null;
                                        table_content.push(obj);
                                    }
                                    $.tmpl($("#programGroupsTableRowTemplate"), table_content).appendTo(tableRowBody);
                                    tableHtml.appendTo($(contentSelector));
                                });

                                $(contentSelector).find("[class^='selectedGroup_']").unbind("click").on("click", function (e) {
                                    var checkGroup = $(this);
                                    var parentId = $(checkGroup).attr("data-parent-id");
                                    var parent = null;
                                    $.each(groupsArray, function (i, group) {
                                        if (group.id === parentId) {
                                            parent = group;
                                        }
                                    });

                                    var checkedPositions = $(contentSelector).find("[data-parent-id='" + parentId + "']:checked");
                                    if (checkedPositions.length > 0 && checkedPositions.length > parent.maxGroupStudents) {
                                        checkGroup.prop("checked", false);
                                        $.growl.warning({
                                            message: IlyLocales.message.student.webStudentTransaction.error.max_group_ids_exceeded
                                        });
                                        return;
                                    }
                                });

                                $("#chooseStudentProgramCourseGroupsModal .btn-chooseStudentProgramCourseGroups").unbind("click").on("click", function (e) {
                                    
                                    var checkedPositions = $("#chooseStudentProgramCourseGroupsModal").find("[class^='selectedGroup_']:checked");

                                    var selectedItems = [];
                                    $.each(checkedPositions, function (i, checkField) {
                                        var itemId = $(checkField).attr("data-id");

                                        $.each(groupsArray, function (i, group) {
                                            $.each(group.items, function (i, item) {
                                                if (item.id === itemId) {
                                                    selectedItems.push(item);
                                                }
                                            });
                                        });
                                    });

                                    var resultsList = [];
                                    $.each(selectedItems, function (i, item) {
                                        if (item.idFather !== null) {
                                            resultsList[item.idFather.title] = typeof resultsList[item.idFather.title] !== "undefined" ? resultsList[item.idFather.title] + ", " + item.title : item.title;
                                        }
                                    });

                                    var groupsLabel = "";
                                    for (var parentTitle in resultsList) {
                                        var itemsTitles = resultsList[parentTitle];
                                        groupsLabel = groupsLabel.length === 0 ? parentTitle + " / " + itemsTitles : groupsLabel + ", " + parentTitle + " / " + itemsTitles;
                                    }
                                    $("[name='programCourseGroupLabel']").val(groupsLabel);

                                    var selectedItemIds = [];
                                    $.each(selectedItems, function (i, item) {
                                        selectedItemIds.push(item.id);
                                    });

                                    $("[name='programCourseGroupIds']").val(selectedItemIds.join());

                                    $("#chooseStudentProgramCourseGroupsModal").modal("hide");
                                });
                            }
                        });
                    });
                }
            },
            afterComplete: function (entity, action) {
                $("#studentTransactionModal").modal("hide");
                redirectBack();
            }
        };

        $(formSelector).createForm(options);
    }
};
