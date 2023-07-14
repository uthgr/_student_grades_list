_grading_scales = null;

function showAlertModal(message) {
    var alert = {
        title: IlyLocales.general.warning,
        message: message,
        buttonTxt: IlyLocales.general.ok,
        btnAction: function () {},
        closeAction: function () {}
    };
    alertModal(alert);
}

function initScalesAjax() {
    if (_grading_scales) {
        var res = $.Deferred();
        res.resolve();
        return res;
    } else {
        return $.ajax({
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: ily_url.general.gradingScales.GET
        }).done(function (results) {
            var gradingScales = results;
            _grading_scales = gradingScales;
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            var message = jqXHR.responseText ? jqXHR.responseText : IlyLocales.general.error.try_again
            console.log(jqXHR.status, message);
            $.growl.error({
                message: message,
                timeout: 1500
            });
        });
    }
}

function getScale(gradingScaleId) {
    var gradingScale = null;
    if (gradingScaleId === null) {
        return gradingScale;
    }
    $.each(_grading_scales, function (i, gs) {
        if (gs.id === gradingScaleId) {
            gradingScale = gs;
            return false;
        }
    });
    return gradingScale;
}

function toBaseGrade(grade, gs) {
    var baseGrade = null;

    if (typeof grade === "undefined" || grade === null || typeof gs === "undefined" || gs === null) {
        return baseGrade;
    }

    var gradingScale = getScale(gs.id);

    if (gradingScale === null) {
        return baseGrade;
    }

    if (gradingScaleIsNumeric(gradingScale)) {
        var minNumber = gradingScale.minNumber;
        var maxNumber = gradingScale.maxNumber;
        var step = gradingScale.step;

        var gradeBD = parseFloat(grade);

        if (typeof gradeBD !== "number") {
            return baseGrade;
        }

        var decimalsAllowed = IlyLib.helpers.getNumberOfDecimalPlaces(step);
        var decimals = IlyLib.helpers.getNumberOfDecimalPlaces(gradeBD);

        if (decimals > decimalsAllowed) {
            gradeBD = IlyLib.helpers.roundToDecimals(gradeBD, decimalsAllowed);
        }
        baseGrade = (gradeBD + minNumber) / (maxNumber - minNumber);
        baseGrade = (baseGrade > 1) ? 1 : baseGrade;
    } else {
        var gradingScaleGrades = gradingScale.grades;
        if (gradingScaleGrades.length === 0) {
            return baseGrade;
        } else {
            $.each(gradingScaleGrades, function (i, gradingScaleGrade) {
                if (grade === gradingScaleGrade.grade) {
                    baseGrade = (typeof gradingScaleGrade.exactVal !== "undefined" && gradingScaleGrade.exactVal !== null) ? gradingScaleGrade.exactVal : gradingScaleGrade.val;
                    return false;
                }
            });
        }
    }
    return baseGrade;
}

function fromBaseGrade(baseGrade, gs) {
    var grade = null;

    if (typeof baseGrade === "undefined" || baseGrade === null || typeof gs === "undefined" || gs === null) {
        return baseGrade;
    }

    var gradingScale;
    if (typeof gs === "string") {
        gradingScale = getScale(gs);
    } else if (typeof gs === "object") {
        gradingScale = getScale(gs.id);
    }

    if (gradingScale === null) {
        return grade;
    }

    if (gradingScaleIsNumeric(gradingScale)) {
        var minNumber = gradingScale.minNumber;
        var maxNumber = gradingScale.maxNumber;
        var step = gradingScale.step;

        var baseGradeBD = parseFloat(baseGrade);

        if (typeof baseGradeBD !== "number") {
            return grade;
        }

        var decimals = IlyLib.helpers.getNumberOfDecimalPlaces(step);
        var gradeBD = (IlyLib.helpers.roundToDecimals((((maxNumber - minNumber) * baseGrade) / 1), decimals) + minNumber);
        grade = gradeBD.toString();
        grade = (gradeBD > maxNumber) ? maxNumber : grade;
    } else {
        var gradingScaleGrades = gradingScale.grades;
        if (gradingScaleGrades.length === 0) {
            return grade;
        } else {
            $.each(gradingScaleGrades, function (i, gradingScaleGrade) {
                if (!(gradingScaleGrade.val > baseGrade)) {
                    grade = gradingScaleGrade.grade;
                    return false;
                }
            });
        }
    }

    return grade;
}

function fromBaseGradeToLocaleStringIfNumeric(grade, gradingScale) {
    if (!isNaN(fromBaseGrade(grade, gradingScale))) {
        return parseFloat(fromBaseGrade(grade, gradingScale)).toLocaleString("el-GR");
    } else {
        return fromBaseGrade(grade, gradingScale);
    }
}


function gradingScaleIsNumeric(gradingScale) {
    if (typeof gradingScale === "undefined" || gradingScale === null) {
        return false;
    }
    var minNumber = gradingScale.minNumber;
    var maxNumber = gradingScale.maxNumber;
    var step = gradingScale.step;
    return minNumber !== null && maxNumber !== null && step !== null;
}

function initGradeInput(options) {
    var entity = options.entity;
    var gradeEl = options.gradeEl;
    var gradeSelector = options.gradeSelector;
    var grade = options.grade;
    var autoInit = options.autoInit;
    var required = (typeof options.required !== "undefined" && options.required !== null) ? options.required : true;

    if (typeof entity === "undefined" || entity === null) {
        try {
            options.afterComplete();
        } catch (e) {
        }
        return;
    }

    var gradingScale = null;
    if (entity.gradingScaleId) {
        gradingScale = (typeof entity.gradingScaleId.id !== "undefined") ? getScale(entity.gradingScaleId.id) : getScale(entity.gradingScaleId);
    }

    if (gradingScale === null) {
        return;
    }

    if (typeof autoInit !== "undefined" && autoInit !== null && autoInit) {
        if (typeof grade === "undefined" || grade === null || grade === "") {
            grade = fromBaseGrade(gradingScale.baseGrade, gradingScale);
        }
    }

    if (!gradingScaleIsNumeric(gradingScale)) {
        var gradingScaleGrades = IlyLib.helpers.convertToKeyValueList(gradingScale.grades, "grade", "grade");
        var selectField = {
            type: "field",
            datatype: "select",
            required: required,
            code: gradeSelector,
            title: IlyLocales.entity.all.baseGrade,
            options: gradingScaleGrades
        };
        var fieldEl = $.tmpl($("#selectFieldProtoTypeTemplate"), selectField);
        var dataGroupMap = $("[name='" + selectField.code + "']").attr("data-group-map");
        $(gradeEl).find("[name='" + selectField.code + "']").replaceWith(fieldEl);
        if (typeof grade !== "undefined" && grade !== null) {
            $("[name='" + selectField.code + "']").val(grade);
        }
        if (typeof grade !== "undefined" && grade !== null) {
            $("[name='" + selectField.code + "']").attr("data-group-map", dataGroupMap);
        }
        try {
            options.afterComplete();
        } catch (e) {
        }
    } else {
        var selectField = {
            type: "field",
            datatype: "number",
            required: required,
            code: gradeSelector,
            title: IlyLocales.entity.all.baseGrade,
            max_number: gradingScale.maxNumber,
            min_number: gradingScale.minNumber === 0 ? "0" : gradingScale.minNumber,
            step: gradingScale.step
        };
        var fieldEl = $.tmpl($("#numberFieldProtoTypeTemplate"), selectField);
        var dataGroupMap = $("[name='" + selectField.code + "']").attr("data-group-map");
        $(gradeEl).find("[name='" + selectField.code + "']").replaceWith(fieldEl);
        if (typeof grade !== "undefined" && grade !== null) {
            $("[name='" + selectField.code + "']").val(grade);
        }
        if (typeof dataGroupMap !== "undefined" && dataGroupMap !== null) {
            $("[name='" + selectField.code + "']").attr("data-group-map", dataGroupMap);
        }
        try {
            options.afterComplete();
        } catch (e) {
        }
    }
}

// Settings

var _dataTypes = {
    "1": "string",
    "2": "number",
    "3": "boolean",
    "4": "select"
};

function initTabContent(tabHref, tabInitFun1, arg0, arg1, arg2, arg3, tabInitFun2) {
    var aTag = "a[href='" + tabHref + "']";

    var hash = $.trim(window.location.hash);
    if (hash && hash === tabHref) {
        addTabReferenceToUrl(hash);
        tabInitFun1(arg0, arg1, arg2, arg3);
        if (typeof tabInitFun2 !== "undefined" && tabInitFun2 !== null) {
            tabInitFun2(arg0, arg1, arg2, arg3);
        }
        $("a[href='" + hash + "']").tab('show');
        $(aTag).off("shown.bs.tab").on("shown.bs.tab", addTabReferenceToUrl(tabHref));
        $(window).scrollTop(0);
    } else if (!hash && $($(aTag).parent()[0]).hasClass("active")) {
        addTabReferenceToUrl(tabHref);
        tabInitFun1(arg0, arg1, arg2, arg3);
        if (typeof tabInitFun2 !== "undefined" && tabInitFun2 !== null) {
            tabInitFun2(arg0, arg1, arg2, arg3);
        }
        $(aTag).tab('show');
        $(aTag).off("shown.bs.tab").on("shown.bs.tab", addTabReferenceToUrl(tabHref));
        $(window).scrollTop(0);
    } else {
        $(aTag).off("shown.bs.tab").on("shown.bs.tab", activateTabOnShow(tabHref, tabInitFun1, arg0, arg1, arg2, arg3, tabInitFun2));
    }

    $(aTag).click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        $(window).scrollTop(0);
    });

    $(aTag).each(function () {
        if (typeof window.location.search !== 'undefined' && window.location.search !== null && window.location.search !== "") {
            var href = window.location.origin + window.location.pathname + window.location.search + $(aTag)[0].hash;
        } else {
            var href = window.location.origin + window.location.pathname + $(aTag)[0].hash;
        }
        (function (href, that) {
            var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
            var isFirefox = typeof InstallTrigger !== 'undefined';
            if (isChrome) {
                $(that).off("auxclick").on("auxclick", function (e) {
                    if (e.which == 2) {
                        e.preventDefault();
                        window.open(href, "_blank");
                    }
                });
            }
            if (isFirefox) {
                $(document).on("click", function (e) {
                    if (e.which == 2) {
                        if (e.target == that) {
                            e.preventDefault();
                        }
                    }
                });
                $(that).off("auxclick").on("auxclick", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.which == 2) {

                        window.open(href, "_blank");
                        return false;
                    }
                });
            }
            $(that).off("contextmenu").on("contextmenu", function (e) {
                e.preventDefault();
                window.open(href, "_blank");
            });
        })(href, this);
    });
}

function activateTabOnShow(tabHref, tabInitFun1, arg0, arg1, arg2, arg3, tabInitFun2) {
    var act = false;
    return function (e) {
        addTabReferenceToUrl(tabHref);
        if (!act) {
            tabInitFun1(arg0, arg1, arg2, arg3);
            if (typeof tabInitFun2 !== "undefined" && tabInitFun2 !== null) {
                tabInitFun2(arg0, arg1, arg2, arg3);
            }
            act = true;
        }
    }
}

function addTabReferenceToUrl(tabHref) {
    var locationUrl = window.location.href;
    if (locationUrl.indexOf(tabHref) === -1) {
        location.hash = tabHref;
    }
}

function redirectBack() {
    window.location.href = window.location;
}


function isStudentActive(student) {
    return (student.studentStatusId !== null && typeof student.studentStatusId !== "undefined" && (parseInt(student.studentStatusId.id) === _studentStatusEnum.ACTIVE.value && student.isActive));
}

function isStudentPresubscribed(student) {
    return (student.studentStatusId !== null && typeof student.studentStatusId !== "undefined" && (parseInt(student.studentStatusId.id) === _studentStatusEnum.PRESUBSCRIBED.value && !student.isActive));
}

function checkIfCseIsOpenForWebSubmission(courseSyllabusExamId) {
    if (typeof courseSyllabusExamId.webSubmissionDateFrom !== 'undefined' && typeof courseSyllabusExamId.webSubmissionDateTo !== 'undefined' && courseSyllabusExamId.webSubmissionDateFrom !== null && typeof courseSyllabusExamId.webSubmissionDateTo !== null) {
        var currentDate = new Date().setHours(0, 0, 0, 0);
        if (currentDate >= courseSyllabusExamId.webSubmissionDateFrom && currentDate <= courseSyllabusExamId.webSubmissionDateTo) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function checkIfCseIsAvailableForStudentPreferences(courseSyllabusExamId) {
    if (typeof courseSyllabusExamId.studentPreferenceDateFrom !== 'undefined' && typeof courseSyllabusExamId.studentPreferenceDateTo !== 'undefined' && courseSyllabusExamId.studentPreferenceDateFrom !== null && typeof courseSyllabusExamId.studentPreferenceDateTo !== null) {
        var currentDate = new Date().setHours(0, 0, 0, 0);
        if (currentDate >= courseSyllabusExamId.studentPreferenceDateFrom && currentDate <= courseSyllabusExamId.studentPreferenceDateTo && typeof courseSyllabusExamId.enabledPreferences !== 'undefined' && courseSyllabusExamId.enabledPreferences !== null && courseSyllabusExamId.enabledPreferences !== "") {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function checkIfCscMockExamIsOpenForWebSubmission(mockExam) {
    if (typeof mockExam.webSubmissionDateFrom !== 'undefined' && typeof mockExam.webSubmissionDateTo !== 'undefined' && mockExam.webSubmissionDateFrom !== null && typeof mockExam.webSubmissionDateTo !== null) {
        var currentDate = new Date().setHours(0, 0, 0, 0);
        if (currentDate >= mockExam.webSubmissionDateFrom && currentDate <= mockExam.webSubmissionDateTo) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function studentGradesDatatable(selector, data) {
    return $(selector).createDataTable({
        data: data,
        columnDefs: [
            {
                aTargets: '_all',
                bSortable: false
            },
            {
                targets: [-1, -2, -3],
                className: 'noVis'
            }
        ],
        columns: [
            {data: "courseCode", title: IlyLocales.entity.all.courseCode, visible: true, width: "8%"},
            {data: "title", title: IlyLocales.entity.all.courseId, visible: true, width: "15%",
                render: function (data, type, row) {
                    if (typeof data !== "undefined" && data !== null && row.title !== null) {
                        return row.title;
                    } else if (typeof row.courseId !== 'undefined' && row.courseId !== null) {
                        return row.courseId.title;
                    } else {
                        return '-';
                    }
                }
            },
            {data: "grade", title: IlyLocales.entity.studentCourses.grade, visible: true,
                render: function (data, type, row) {
                    return (typeof row.grade !== "undefined" && row.grade !== null) ? fromBaseGradeToLocaleStringIfNumeric(data, row.gradingScaleId) : '';
                }
            },
            {data: "examPeriodId.title", title: IlyLocales.entity.all.examPeriodId, visible: true,
                render: function (data, type, row) {
                    return (typeof data !== "undefined" && data !== null && data.examPeriodId !== null) ? row.examPeriodId.title : ((row.homologationTypeId !== null) ? row.homologationTypeId.title : '-');
                }
            },
            {data: "syllabus", title: IlyLocales.entity.all.syllabus, visible: true, width: "7%",
                render: function (data, type, row) {
                    return IlyLib.helpers.getSyllabusLabel(data);
                }
            },
            {data: "semesterId.title", title: IlyLocales.entity.studentCourses.semesterId, visible: false,
                render: function (data, type, row) {
                    return (typeof data !== "undefined" && data !== null && data.semesterId !== null) ? row.semesterId.title : '-';
                }
            },
            {data: "semesterId.sortOrder", title: IlyLocales.entity.all.semesterSortOrder, visible: false,
                render: function (data, type, row) {
                    return (typeof data !== "undefined" && data !== null && data.sortOrder !== null) ? row.semesterId.sortOrder : null;
                }
            },
            {data: "studentSemester", title: IlyLocales.entity.all.studentSemester, visible: false},
            {data: "isCountInGrade", title: IlyLocales.entity.all.isCountInGrade.normal, visible: true, description: IlyLocales.entity.all.isCountInGrade.description,
                render: function (data, type, row) {
                    return getValueByBoolean(data);
                }
            },
            {data: "isCountInDiploma", title: IlyLocales.entity.all.isCountInDiploma.normal, visible: true, description: IlyLocales.entity.all.isCountInDiploma.description,
                render: function (data, type, row) {
                    return getValueByBoolean(data);
                }
            },
            {data: "units", title: IlyLocales.entity.all.units, visible: true, width: "4%"},
            {data: "ects", title: "ECTS", visible: true, width: "4%"},
            {data: "typeId.title", title: IlyLocales.entity.all.typeId.long, visible: true,
                render: function (data, type, row) {
                    return (typeof data !== "undefined" && data !== null && data.typeId !== null) ? row.typeId.title : '-';
                }
            },
            {data: "categId", title: IlyLocales.entity.all.categId, visible: true,
                render: function (data, type, row) {
                    return (typeof data !== "undefined" && data !== null && data.categId !== null) ? row.categId.title : '-';
                }
            },
            {data: "subjectId.title", title: IlyLocales.entity.all.subjectId.normal, visible: true,
                render: function (data, type, row) {
                    return (typeof data !== "undefined" && data !== null && data.subjectId !== null) ? row.subjectId.title : '-';
                }
            },
            {data: "cognitiveSubjectId.title", title: IlyLocales.entity.all.cognitiveSubjectId, visible: false,
                render: function (data, type, row) {
                    return (typeof data !== "undefined" && data !== null && data.cognitiveSubjectId !== null) ? row.cognitiveSubjectId.title : '-';
                }
            },
            {data: "groupId.title", title: IlyLocales.entity.all.groupId, visible: true,
                render: function (data, type, row) {
                    return (typeof data !== "undefined" && data !== null && data.groupId !== null) ? row.groupId.title : '-';
                }
            },
            {name: "isPassed", data: "isPassed", visible: false},
            {name: "isCountInGrade", data: "isCountInGrade", title: IlyLocales.entity.all.isCountInGrade.normal, visible: false},
            {name: "isCountInDiploma", data: "isCountInDiploma", title: IlyLocales.entity.all.isCountInDiploma.normal, visible: false},
        ],
        rowCallback: function (row, data, index) {
            if (data.isPassed) {
                if (data.isCountInDiploma) {
                    // $('td', row).addClass("passed-program-course-accordion");
                    $('td', row).addClass("k-grid-background-row-success");
                }

            } else {
                $('td', row).addClass("k-grid-background-row-fail");
            }

        },
        rowGroup: {
            dataSrc: "semesterId.sortOrder",
            startRender: function (rows, group) {
                if (typeof group !== 'undefined' && group !== null) {
                    return $('<td colspan="3">' + IlyLocales.entity.all.semesterId + ': ' + rows.row(rows[0][0]).data().semesterId.title + '</td>');
                } else {
                    return $('<td colspan="3">' + IlyLocales.entity.all.semesterId + ': -</td>');
                }

            }
        },
        initComplete: function () {
            var table = $(selector).DataTable();
            $('select[name="showOptions"]').change(function () {
                table.search('').columns().search('').draw();
                if ($(this).val() == "all") {

                } else {
                    table.column(table.column("isPassed:name").index()).search('true').column(table.column($(this).val() + ":name").index()).search('true').draw();
                }
            });
        },
        order: [["6", "asc"], ["1", "asc"], ["4", "desc"]]
    });
}

function createTeacherCoursesTableBySyllabus(options) {
    var selector = options.selector ? options.selector : "#courses_by_syllabus";
    var data = options.data;
    var multiple = options.multiple ? options.multiple : false;
    var ignoreColVis = options.ignoreColVis ? options.ignoreColVis : false;
    var selectable = options.selectable ? options.selectable : false;
    var showViewBtn = (typeof options.showViewBtn !== "undefined" && options.showViewBtn !== null) ? options.showViewBtn : true;

    var table;
    var courseClasses = data;
    var courseByYear = {};
    var labelOrder = [];
    var courseById = {};

    var columns = [
        {data: "departmentId.title", title: IlyLocales.entity.all.departmentId, visible: true},
        {data: "title", title: IlyLocales.entity.all.courseId, visible: true},
        {data: "courseId.code", title: IlyLocales.entity.course.code, visible: true},
        {data: "periodTitle", title: IlyLocales.entity.all.periodId, visible: true},
        {data: "courseId.isActive", title: IlyLocales.entity.course.isActive,
            render: function (data, type, row) {
                return getValueByBoolean(data);
            }
        },
        {data: "weekCourseHours", title: IlyLocales.entity.courseSyllabus.weekCourseHours, visible: true},
        {data: "maxAbsences", title: IlyLocales.entity.courseSyllabus.maxAbsences, width: '13%', visible: true}
    ];

    if (showViewBtn) {
        columns.push({data: null, title: IlyLocales.general.details,
            render: function (data, type, row) {
                var button = $.tmpl($("#tableButtonViewTemplate"), [{id: "view_button_" + row.id}]);
                return button[0].outerHTML;
            }
        });
    }

    if (selectable) {
        columns.unshift({
            targets: 0,
            className: 'dt-body-center',
            render: function (data, type, full, meta) {
                return '<input type="checkbox" name="checkRow" value="'
                        + $('<div/>').text(data).html() + '">';
            }
        });
    }

    for (var idx in courseClasses) {
        if (!courseById[courseClasses[idx].courseSyllabusId.id]) {
            courseById[courseClasses[idx].courseSyllabusId.id] = courseClasses[idx].courseSyllabusId;
            var course = courseById[courseClasses[idx].courseSyllabusId.id];
            course.periodTitle = courseClasses[idx].periodTitle;
        } else {
            var course = courseById[courseClasses[idx].courseSyllabusId.id];
            if (courseClasses[idx].periodTitle !== course.periodTitle) {
                course.periodTitle = course.periodTitle.concat(", " + courseClasses[idx].periodTitle);
            }
        }
    }
    $.each(courseById, function (id, course) {
        var year = course.syllabus;
        var label = IlyLib.helpers.getSyllabusLabel(year);
        if (!courseByYear[year]) {
            courseByYear[year] = [];
            labelOrder.push({"text": label, "value": year});
        }
        courseByYear[year].push(course);
    });

    $("#syllabusSelection").empty();
    $.tmpl($("#yearOptionsTemplate"), labelOrder).appendTo($("#syllabusSelection"));
    $("#syllabusSelection").unbind("change").on("change", function () {
        var val = $("#syllabusSelection").val();
        if ($.fn.DataTable.isDataTable(selector)) {
            $(selector).DataTable().clear();
            $(selector).DataTable().destroy();
            $(selector).empty();
        }
        if (!val || val == "") {
            $("#tableDiv").hide();
            return;
        }
        $("#tableDiv").show();

        if (courseByYear[val]) {
            var courses = courseByYear[val];
            table = $(selector).createDataTable({
                data: courses,
                columns: columns,
                ignoreColVis: ignoreColVis,
                drawCallback: function (settings, json) {
                    if (showViewBtn) {
                        var api = this.api();
                        var data = api.rows({page: 'current'}).data();
                        for (var idx = 0; idx < data.length; idx++) {
                            var row = data[idx];
                            (function (id) {
                                var url = substitutor(ily_url.teacher.courses.view.VIEW, [id]) + "?p=" + IlyLib.helpers.getUrlParameter("p");
                                $("#view_button_" + id).attr("href", url);
                            })(row.id);
                        }
                    }
                }
            });
        }
    });

    $("#syllabusSelection").trigger("change");

    if (selectable && !multiple) {
        table.$('input[name="checkRow"]').change(function () {
            var that = this;
            table.$('input[name="checkRow"]').each(function () {
                if (this !== that) {
                    $(this).prop("checked", false);
                }
            });
        });
    }

    return table;
}

function createTeacherCourseClassTable(options) {
    var selector = options.selector ? options.selector : "#myTeacherCourseClassTable";
    var data = options.data;
    var selectable = options.selectable ? options.selectable : false;
    var multiple = options.multiple ? options.multiple : false;
    var ignoreColVis = options.ignoreColVis ? options.ignoreColVis : false;

    var table;
    var teacherCourseClasses = data;

    var columns = [
        {data: "courseSyllabusClassId", title: IlyLocales.entity.all.courseSyllabusClassId, width: "23%",
            render: function (data, type, row) {
                return (data === null) ? "-" : (data.title + " (" + data.code + ")");
            }
        },
        {data: "periodTitle", title: IlyLocales.entity.all.periodId, width: "10%",
            render: function (data, type, row) {
                return (row.courseSyllabusClassId === null) ? "-" : row.courseSyllabusClassId.periodTitle;
            }
        },
        {data: "isActive", title: IlyLocales.entity.teacherCourseClass.isActive, visible: false,
            render: function (data, type, row) {
                return getValueByBoolean(data);
            }
        },
        {data: "isTeaching", title: IlyLocales.entity.teacherCourseClass.isTeaching, visible: false,
            render: function (data, type, row) {
                return getValueByBoolean(data);
            }
        },
        {data: "isAnnounce", title: IlyLocales.entity.teacherCourseClass.isAnnounce, 
            render: function (data, type, row) {
                return getValueByBoolean(data);
            }
        },
        {data: "isGrading", title: IlyLocales.entity.teacherCourseClass.isGrading,
            render: function (data, type, row) {
                return getValueByBoolean(data);
            }
        },
        {data: "isResponsible", title: IlyLocales.entity.teacherCourseClass.isResponsible,
            render: function (data, type, row) {
                return getValueByBoolean(data);
            }
        },
        {data: "weekCourseHours", title: IlyLocales.entity.courseSyllabusClass.weekCourseHours, width: "12%",
            render: function (data, type, row) {
                return (row.courseSyllabusClassId === null) ? "-" : row.courseSyllabusClassId.weekCourseHours;
            }
        },
        {data: "officeId", title: IlyLocales.entity.teacherCourseClass.office,
            render: function (data, type, row) {
                return (row.officeId === null) ? "-" : row.officeId.title;
            }
        },
        {data: "officeHours", title: IlyLocales.entity.teacherCourseClass.officeHours, visible: false}
    ];

    if (selectable) {
        columns.unshift({
            targets: 0,
            className: 'dt-body-center',
            render: function (data, type, full, meta) {
                return '<input ' + (full.isAnnounce === false ? 'disabled="disabled"' : '')+ ' type="checkbox" name="checkRow" value="'
                        + $('<div/>').text(data).html() + '">';
            }
        });
    }

    if ($.fn.DataTable.isDataTable(selector)) {
        $(selector).DataTable().destroy();
        $(selector).empty();
    }

    table = $(selector).createDataTable({
        data: teacherCourseClasses,
        order: [1, 'asc'],
        columns: columns,
        ignoreColVis: ignoreColVis
    });

    if (selectable && !multiple) {
        table.$('input[name="checkRow"]').change(function () {
            var that = this;
            table.$('input[name="checkRow"]').each(function () {
                if (this !== that) {
                    $(this).prop("checked", false);
                }
            });
        });
    }

    return table;
}

function createTeacherAnnouncementTable(options) {
    var selector = options.selector ? options.selector : "#teacher_announcement";
    var data = options.data;
    var showArchive = options.showArchive;

    var columnsToHide = options.columnsToHide;

    var announcements = data;

    if ($.fn.DataTable.isDataTable(selector)) {
        $(selector).DataTable().destroy();
        $(selector).empty();
    }

    var columns = [
        {data: "title", title: IlyLocales.entity.announcement.title, width: '25%'},
        {data: "preview", title: IlyLocales.entity.announcement.preview},
        {data: "isPublished", title: IlyLocales.entity.announcement.isPublished,
            render: function (data, type, row) {
                return getValueByBoolean(data);
            }
        },
        {data: "announcementTagId", title: IlyLocales.entity.announcement.announcementTagTitle, width: '12%',
            render: function (data, type, row) {
                return (data === null) ? "" : data.title;
            }
        },
        {data: "isHighImportance", title: IlyLocales.entity.announcement.isHighImportance,
            render: function (data, type, row) {
                return getValueByBoolean(data);
            }
        },
        {data: "datePublished", title: IlyLocales.entity.announcement.datePublished, width: '12%',
            render: function (data, type, row) {
                return (data === null) ? "-" : IlyLib.helpers.dateConvertedNormal(data);
            }
        },
        {data: "teacherId", title: IlyLocales.entity.announcement.teacherId, width: '15%',
            render: function (data, type, row) {
                return (data === null || data.personId === null) ? "" : data.personId.lastName + " " + data.personId.firstName;
            }
        },
        {data: null, title: IlyLocales.general.actions, width: "10%",
            render: function (data, type, row) {
                var button;
                var buttonView = $.tmpl($("#tableButtonViewTemplate"), [{id: "view_button_" + row.id}]);
                if (data.isEditable) {
                    button = $.tmpl($("#announcementsEditableActionsTemplate"), [{editId: "edit_button_" + row.id, deleteId: "delete_button_" + row.id, id: row.id}]);
                }
                return buttonView[0].outerHTML + (typeof button !== "undefined" ? button[0].outerHTML : "");
            }
        }
    ];

    if (typeof columnsToHide !== "undefined" && columnsToHide !== null) {
        $.each(columns, function (i, column) {
            if (columnsToHide.indexOf(column.data) !== -1) {
                column.visible = false;
            }
        });
    }
    
    var buttons = [
        {
            text: '<span class="glyphicon glyphicon-plus"></span> ' + IlyLocales.message.teacher.announcement.info.add_announcement,
            attr: {
                id: 'addAnnouncement'
            },
            action: function () {
                location.href = ily_url.teacher.announcement.view.NEW + ((options.params) ? "?" + options.params : "");
            }
        }
    ];
    
    if (showArchive) {
        buttons.push({
            text: '<span class="glyphicon glyphicon-folder-open"></span> ' + IlyLocales.message.announcement.archive,
            attr: {
                id: 'announcementArchive'
            },
            action: function () {
                location.href = ily_url.teacher.announcement.view.ARCHIVE + "?p=" + IlyLib.helpers.getUrlParameter("p");
            }
        });
    }

    $(selector).createDataTable({
        dom: '<"top"Bf><"clear"><"top"l>rt<"bottom"ip><"clear">',
        buttons: buttons,
        data: announcements,
        columns: columns,
        drawCallback: function (settings, json) {
            var api = this.api();
            var data = api.rows({page: 'current'}).data();
            for (var idx = 0; idx < data.length; idx++) {
                var row = data[idx];
                (function (id) {
                    var urlView = substitutor(ily_url.teacher.announcement.view.VIEW, [id]) + "?p=" + IlyLib.helpers.getUrlParameter("p");
                    $("#view_button_" + id).attr("href", urlView);

                    var urlEdit = substitutor(ily_url.teacher.announcement.view.EDIT, [id]) + "?p=" + IlyLib.helpers.getUrlParameter("p");
                    $("#edit_button_" + id).attr("href", urlEdit);

                    $("#delete_button_" + id).unbind("click").on("click", function () {
                        var announcementId = $(this).attr("data-id");
                        var alertConfirm = {
                            title: IlyLocales.general.delete.title,
                            message: IlyLocales.general.delete.confirm,
                            buttonText: "Ναι",
                            btnConfirmAction: function () {
                                $.ajax({
                                    type: "DELETE",
                                    dataType: "json",
                                    contentType: "application/json; charset=utf-8",
                                    url: substitutor(ily_url.teacher.announcement.api.feign.ONE, [announcementId])
                                }).done(function (results) {
                                    $.growl.notice({
                                        message: IlyLocales.general.entity.delete.complete,
                                        timeout: 1500
                                    });
                                    location.reload();
                                }).fail(function (jqXHR, textStatus, errorThrown) {
                                    var message = jqXHR.responseText ? jqXHR.responseText : "Error.";
                                    $.growl.error({
                                        message: message,
                                        timeout: 1500
                                    });
                                });
                            },
                            closeConfirmAction: function () {
                                return;
                            }
                        };
                        alertConfirmModal(alertConfirm);
                    });
                })(row.id);
            }
        }
        ,order: []
    });
}

function createArchiveAnnouncementTable(options) {
    var selector = options.selector ? options.selector : "#announcement_archive";
    var baseUrl = options.baseUrl;

    var columnsToHide = options.columnsToHide;
    
    if ($.fn.DataTable.isDataTable(selector)) {
        $(selector).DataTable().destroy();
        $(selector).empty();
    }
    
    var columns = [
        {data: "title", title: IlyLocales.entity.announcement.title, width: '25%'},
        {data: "preview", title: IlyLocales.entity.announcement.preview},
        {data: "scope", title: IlyLocales.entity.announcement.scope.title, width: '15%',
            render: function (data, type, row) {
                return (data === null) ? "" : getType(data, _announcementScopeDS);
            }
        },
        {data: "isHighImportance", title: IlyLocales.entity.announcement.isHighImportance,
            render: function (data, type, row) {
                return getValueByBoolean(data);
            }
        },
        {data: "announcementTagId", title: IlyLocales.entity.announcement.announcementTagTitle, width: '15%',
            name: "announcementTagId.title",
            render: function (data, type, row) {
                return (data === null) ? "" : data.title;
            }
        },
        {data: "datePublished", title: IlyLocales.entity.announcement.datePublished, width: '12%',
            render: function (data, type, row) {
                return (data === null) ? "" : IlyLib.helpers.dateConvertedNormal(data);
            }
        },
        {data: "teacherId", title: IlyLocales.entity.announcement.teacherId, width: '15%',
            render: function (data, type, row) {
                return (data === null || data.personId === null) ? "" : data.personId.lastName + " " + data.personId.firstName;
            }
        },
        {data: null, title: IlyLocales.general.actions, width: "10%",
            render: function (data, type, row) {
                var button;
                var buttonView = $.tmpl($("#tableButtonViewTemplate"), [{id: "view_button_" + row.id}]);
                if (data.isEditable) {
                    button = $.tmpl($("#announcementsEditableActionsTemplate"), [{editId: "edit_button_" + row.id, deleteId: "delete_button_" + row.id, id: row.id}]);
                }
                return buttonView[0].outerHTML + (typeof button !== "undefined" ? button[0].outerHTML : "");
            }
        }
    ];
    
    if (typeof columnsToHide !== "undefined" && columnsToHide !== null) {
        $.each(columns, function (i, column) {
            if (columnsToHide.indexOf(column.data) !== -1) {
                column.visible = false;
            }
        });
    }
    
    $(selector).createDataTable({
        serverSide: true,
        ajax: baseUrl,
        columns: columns,
        drawCallback: function (settings, json) {
            var api = this.api();
            var data = api.rows({page: 'current'}).data();
            for (var idx = 0; idx < data.length; idx++) {
                var row = data[idx];
                (function (id) {
                    if (typeof row.isEditable === "undefined") {
                        //student
                        var urlView = substitutor(ily_url.student.announcement.view.VIEW, [id]) + "?p=" + IlyLib.helpers.getUrlParameter("p");
                        $("#view_button_" + id).attr("href", urlView);
                    } else {
                        //teacher
                        var urlView = substitutor(ily_url.teacher.announcement.view.VIEW, [id]) + "?p=" + IlyLib.helpers.getUrlParameter("p");
                        $("#view_button_" + id).attr("href", urlView);
                    }
                    
                    var urlEdit = substitutor(ily_url.teacher.announcement.view.EDIT, [id]) + "?p=" + IlyLib.helpers.getUrlParameter("p");
                    $("#edit_button_" + id).attr("href", urlEdit);

                    $("#delete_button_" + id).unbind("click").on("click", function () {
                        var announcementId = $(this).attr("data-id");
                        var alertConfirm = {
                            title: IlyLocales.general.delete.title,
                            message: IlyLocales.general.delete.confirm,
                            buttonText: "Ναι",
                            btnConfirmAction: function () {
                                $.ajax({
                                    type: "DELETE",
                                    dataType: "json",
                                    contentType: "application/json; charset=utf-8",
                                    url: substitutor(ily_url.teacher.announcement.api.feign.ONE, [announcementId])
                                }).done(function (results) {
                                    $.growl.notice({
                                        message: IlyLocales.general.entity.delete.complete,
                                        timeout: 1500
                                    });
                                    location.reload();
                                }).fail(function (jqXHR, textStatus, errorThrown) {
                                    var message = jqXHR.responseText ? jqXHR.responseText : "Error.";
                                    $.growl.error({
                                        message: message,
                                        timeout: 1500
                                    });
                                });
                            },
                            closeConfirmAction: function () {
                                return;
                            }
                        };
                        alertConfirmModal(alertConfirm);
                    });
                })(row.id);
            }
        }
        ,order: []
    });
    
}