function getStudentData() {
    return new RSVP.Promise(function (resolve, reject) {
        $.ajax({
            type: "GET",
            url: ily_url.student.data.api.feign.GET,
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        }).done(function (results) {
            resolve(results);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.status, errorThrown);
            reject();
        });
    });
}

function getStudentDeclareSubjectsSettings() {
    return new RSVP.Promise(function (resolve, reject) {
        $.ajax({
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: ily_url.student.settings.api.feign.GET
        }).done(function (results) {
            resolve(results);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.status, errorThrown);
            reject();
        });
    });
}

function getStudentRegistrationPeriods() {
    return new RSVP.Promise(function (resolve, reject) {
        $.ajax({
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: ily_url.student.registration_period.api.feign.GET_ALL
        }).done(function (results) {
            resolve(results);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.status, errorThrown);
            reject();
        });
    });
}

function getStudentRegistrationsByPeriod(regPeriodId) {
    return new RSVP.Promise(function (resolve, reject) {
        $.ajax({
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: substitutor(ily_url.student.registration.api.feign.REGISTRATION_PERIOD_GET, [regPeriodId])
        }).done(function (results) {
            resolve(results);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.status, errorThrown);
            reject();
        });
    });
}

function getStudentPreRegistrationPeriods() {
    return new RSVP.Promise(function (resolve, reject) {
        $.ajax({
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: ily_url.student.pre_registration_period.api.feign.GET
        }).done(function (results) {
            resolve(results);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.status, errorThrown);
            reject();
        });
    });
}

function getWebStudentRegistrationPcsByPeriod(regPeriodId) {
    return new RSVP.Promise(function (resolve, reject) {
        $.ajax({
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: substitutor(ily_url.student.web_registration.api.feign.REGISTRATION_PERIOD_GET, [regPeriodId])
        }).done(function (results) {
            resolve(results);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.status, errorThrown);
            reject();
        });
    });
}

function getWebStudentPreRegistrationByPeriod(regPeriodId) {
    return new RSVP.Promise(function (resolve, reject) {
        $.ajax({
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: substitutor(ily_url.student.web_pre_registration.api.feign.BASE, [regPeriodId])
        }).done(function (results) {
            resolve(results);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.status, errorThrown);
            reject();
        });
    });
}

function getStudentDeclaredGroups() {
    return new RSVP.Promise(function (resolve, reject) {
        $.ajax({
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: ily_url.student.student_program_course_group.api.feign.GET
        }).done(function (results) {
            resolve(results);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.status, errorThrown);
            reject();
        });
    });
}

function getProgramCourseSubjectsForStudent() {
    return new RSVP.Promise(function (resolve, reject) {
        $.ajax({
            type: "GET",
            url: ily_url.student.program_course_subject.api.feign.GET,
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        }).done(function (results) {
            resolve(results);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.status, errorThrown);
            reject();
        });
    });
}

function getProgramCourseSubSubjectsForStudent() {
    return new RSVP.Promise(function (resolve, reject) {
        $.ajax({
            type: "GET",
            url: ily_url.student.program_course_sub_subject.api.feign.GET,
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        }).done(function (results) {
            resolve(results);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.status, errorThrown);
            reject();
        });
    });
}

function getProgramCourseGroupsByDepartment() {
    return new RSVP.Promise(function (resolve, reject) {
        $.ajax({
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: ily_url.student.program_course_groups.api.feign.GET_BY_DEPARTMENT
        }).done(function (results) {
            resolve(results);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.status, errorThrown);
            reject();
        });
    });
}

function getWebStudentTransactionsPending() {
    return new RSVP.Promise(function (resolve, reject) {
        $.ajax({
            type: "GET",
            url: ily_url.student.web_transactions.api.feign.GET_PENDING,
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        }).done(function (results) {
            resolve(results);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.status, errorThrown);
            reject();
        });
    });
}

function getCourseSyllabusExamByStudent(courseSyllabusExamId) {
    return new RSVP.Promise(function (resolve, reject) {
        $.ajax({
            type: "GET",
            url: substitutor(ily_url.student.course_syllabus_exam.api.feign.GET_ONE, [courseSyllabusExamId]),
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        }).done(function (results) {
            resolve(results);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.status, errorThrown);
            reject();
        });
    });
}

function getCourseSyllabusExamsByStudentRegistrationSyllabus(syllabus) {
    return $.ajax({
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        url: substitutor(ily_url.student.course_syllabus_exam.api.feign.GET_COURSE_SYLLABUS_EXAMS_BY_STUDENT_REGISTRATION_SYLLABUS, [syllabus])
    }).done(function (results) {

    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        var message = jqXHR.responseText ? jqXHR.responseText : IlyLocales.general.error.try_again;
        console.log(jqXHR.status, message);
        $.growl.error({
            message: message,
            timeout: 1500
        });
    });
}

function getSyllabusesByCourseSyllabusExamsStudentRegistration() {
    return $.ajax({
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        url: ily_url.student.course_syllabus_exam.api.feign.GET_SYLLABUS_BY_STUDENT_REGISTRATION
    }).done(function (results) {

    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        var message = jqXHR.responseText ? jqXHR.responseText : IlyLocales.general.error.try_again;
        console.log(jqXHR.status, message);
        $.growl.error({
            message: message,
            timeout: 1500
        });
    });
}

function getWebCseStudentPreferenceByStudent(courseSyllabusExamId) {
    return new RSVP.Promise(function (resolve, reject) {
        $.ajax({
            type: "GET",
            url: substitutor(ily_url.student.web_cse_student_preference.api.feign.BASE, [courseSyllabusExamId]),
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        }).done(function (results) {
            resolve(results);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.status, errorThrown);
            reject();
        });
    });
}

function getCourseSyllabusExamByTeacher(courseSyllabusExamId) {
    return new RSVP.Promise(function (resolve, reject) {
        $.ajax({
            type: "GET",
            url: substitutor(ily_url.teacher.course_syllabus_exam.api.feign.GET, [courseSyllabusExamId]),
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        }).done(function (results) {
            resolve(results);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.status, errorThrown);
            reject();
        });
    });
}

function getSyllabusesByTeacherCourseClasses() {
    return $.ajax({
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        url: ily_url.teacher.courses.api.feign.GET_SYLLABUS_BY_TEACHER_COURSE_CLASS
    }).done(function (results) {

    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        var message = jqXHR.responseText ? jqXHR.responseText : IlyLocales.general.error.try_again;
        console.log(jqXHR.status, message);
        $.growl.error({
            message: message,
            timeout: 1500
        });
    });
}

function getCourseSyllabusExamsByTeacherCourseSyllabus(syllabus) {
    return $.ajax({
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        url: substitutor(ily_url.teacher.scoreboard.api.feign.GET_COURSE_SYLLABUS_EXAMS_BY_TEACHER_COURSE_SYLLABUS, [syllabus])
    }).done(function (results) {

    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        var message = jqXHR.responseText ? jqXHR.responseText : IlyLocales.general.error.try_again;
        console.log(jqXHR.status, message);
        $.growl.error({
            message: message,
            timeout: 1500
        });
    });
}

function getAnnouncementTags() {
    return $.ajax({
        type: "GET",
        url: ily_url.teacher.announcement_tag.api.feign.GET_ANNOUNCEMENT_TAGS,
        dataType: "json",
        contentType: "application/json; charset=utf-8"
    }).done(function (results) {
        
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.status, errorThrown);
    });
}

function getTeacherCourses() {
    return $.ajax({
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        url: ily_url.teacher.courses.api.feign.GET
    }).done(function (results) {

    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        var message = jqXHR.responseText ? jqXHR.responseText : IlyLocales.general.error.try_again;
        console.log(jqXHR.status, message);
        $.growl.error({
            message: message,
            timeout: 1500
        });
    });
}

function getTeacherCourseClass(courseSyllabusId) {
    return $.ajax({
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        url: substitutor(ily_url.teacher.courses.api.feign.GET_COURSE_CLASS_BY_CS, [courseSyllabusId])
    }).done(function (results) {
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        var message = jqXHR.responseText ? jqXHR.responseText : IlyLocales.general.error.try_again;
        console.log(jqXHR.status, message);
        $.growl.error({
            message: message,
            timeout: 1500
        });
    });
}

function getAnnouncementsForTeacher() {
    return $.ajax({
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        url: ily_url.teacher.announcement.api.feign.GET_ANNOUNCEMENTS
    }).done(function (results) {

    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        var message = jqXHR.responseText ? jqXHR.responseText : IlyLocales.general.error.try_again;
        console.log(jqXHR.status, message);
        $.growl.error({
            message: message,
            timeout: 1500
        });
    });
}

function getAnnouncementsForTeacherByCourseSyllabus(courseSyllabusId) {
    return $.ajax({
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        url: substitutor(ily_url.teacher.announcement.api.feign.GET_ANNOUNCEMENTS_BY_COURSE_SYLLABUS, [courseSyllabusId])
    }).done(function (results) {

    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        var message = jqXHR.responseText ? jqXHR.responseText : IlyLocales.general.error.try_again;
        console.log(jqXHR.status, message);
        $.growl.error({
            message: message,
            timeout: 1500
        });
    });
}