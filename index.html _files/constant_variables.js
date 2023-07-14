var ily_url = {
    general: {
        gradingScales: {
            GET: "api/general/grading_scale"
        },
        locales: {
            GET: "api/general/locales"
        }
    },
    person: {
        profile: {
            GET: "api/person/profiles"
        },
        data: {
            api: {
                feign: {
                    GET: "/api/person/person_data"
                }
            }
        }
    },
    teacher: {
        data: {
            api: {
                feign: {
                    GET: "/feign/teacher/teacher_data",
                    GET_EDUCATION: "/feign/teacher/teacher_education",
                    GET_WORK_XP: "/feign/teacher/teacher_working_experience",
                    GET_FOREIGN_LANGUAGES: "/feign/teacher/teacher_foreign_languages"
                }
            }
        },
        courses: {
            api: {
                feign: {
                    GET: "/feign/teacher/teacher_courses",
                    GET_COURSE_CLASS_BY_CS: "/feign/teacher/teacher_courses/course_syllabus/{0}",
                    GET_OTHER_TEACHER_COURSE_CLASS_BY_CS: "/feign/teacher/teacher_courses/course_syllabus/{0}/other_teachers",
                    GET_TEACHER_COURSE_CLASS_BY_CSC: "/feign/teacher/teacher_courses/course_syllabus_class/{0}",
                    GET_DOCUMENTS_BY_COURSE_SYLLABUS: "/feign/teacher/teacher_courses/course_syllabus/{0}/documents",
                    GET_DOCUMENT_BY_COURSE_SYLLABUS: "/feign/teacher/teacher_courses/course_syllabus/{0}/document/{1}",
                    CREATE_DOCUMENT_BY_COURSE_SYLLABUS: "/feign/teacher/teacher_courses/course_syllabus/{0}/document",
                    DELETE_DOCUMENT_BY_COURSE_SYLLABUS: "/feign/teacher/teacher_courses/course_syllabus/{0}/document/{1}",
                    GET_PROGRAM_COURSE_BY_CS: "/feign/teacher/teacher_courses/pc_by_cs/{0}",
                    GET_CLASS_STUDENTS: "/feign/teacher/teacher_courses/class_students/{0}",
                    GET_CLASS_STUDENTS_GRADES: "/feign/teacher/teacher_courses/class_students_grades/{0}",
                    GET_SYLLABUS_BY_TEACHER_COURSE_CLASS: "/feign/teacher/teacher_course_classes/syllabuses"
                }
            },
            view: {
                VIEW: "teacher/course/view/{0}"
            }
        },
        thesis: {
            api: {
                feign: {
                    GET_VIEW_THESIS_STUDENTS: "/feign/teacher/v_thesis_students",
                    GET: "/feign/teacher/thesis/{0}",
                    GET_THESIS_COMMITTEE_BY_THESIS: "/feign/teacher/thesis/{0}/thesis_committee",
                    GET_THESIS_STUDENT_BY_THESIS: "/feign/teacher/thesis/{0}/thesis_student",
                    GET_THESIS_GRADES_BY_THESIS: "/feign/teacher/thesis/{0}/thesis_grades",
                    GET_THESIS_COMMITTEE_SUPERVISOR_BY_THESIS: "/feign/teacher/thesis/{0}/thesis_committee_supervisor"
                }
            },
            view: {
                VIEW: "teacher/thesis/view/{0}"
            }
        },
        announcement: {
            api: {
                feign: {
                    GET_ANNOUNCEMENTS_PREVIEW: "feign/teacher/announcement/preview",
                    GET_ANNOUNCEMENTS: "feign/teacher/announcement",
                    GET_ANNOUNCEMENTS_ARCHIVE: "feign/teacher/announcement/archive",
                    ONE: "feign/teacher/announcement/{0}",
                    ONE_PREVIEW: "feign/teacher/announcement/{0}/preview",
                    GET_ANNOUNCEMENTS_BY_COURSE_SYLLABUS: "feign/teacher/announcement/by/courseSyllabus/{0}"
                }
            },
            view: {
                LIST: "teacher/announcement/list",
                NEW: "teacher/announcement/new",
                VIEW: "teacher/announcement/view/{0}",
                EDIT: "teacher/announcement/edit/{0}",
                ARCHIVE: "teacher/announcement/archive"
            }
        },
        announcement_tag: {
            api: {
                feign: {
                    GET_ANNOUNCEMENT_TAGS: "feign/teacher/announcement/announcement_tags"
                }
            }
        },
        announcement_document: {
          api: {
              feign: {
                  GET_DOCUMENTS_BY_ANNOUNCEMENT: "/feign/teacher/announcement/{0}/documents",
                  GET_DOCUMENT_BY_ANNOUNCEMENT: "/feign/teacher/announcement/{0}/document/{1}/file",
                  CREATE_DOCUMENT_BY_ANNOUNCEMENT: "/feign/teacher/announcement/{0}/document",
                  UPDATE_DOCUMENT_BY_ANNOUNCEMENT: "/feign/teacher/announcement/{0}/document",
                  DELETE_DOCUMENT_BY_ANNOUNCEMENT: "/feign/teacher/announcement/{0}/document/{1}"
              }
          }  
        },
        scoreboard: {
            api: {
                feign: {
                    GET_SCOREBOARDS_BY_COURSE_SYLLABUS_CLASS_EXAM: "/feign/teacher/course_syllabus_exam/{0}/scoreboard",
                    GET_SCOREBOARDS_BY_COURSE_SYLLABUS: "/feign/teacher/scoreboard/courseSyllabus/{0}",
                    GET_COURSE_SYLLABUS_EXAMS_BY_TEACHER_COURSE_SYLLABUS: "/feign/teacher/syllabus/{0}/courseSyllabusExam",
                    CREATE_SCORE_BOARD: "/feign/teacher/scoreboard",
                    VALIDATE_CREATE_SCORE_BOARD: "/feign/teacher/course_syllabus_exam/{0}/scoreboard/validate_create",
                    GET_SCOREBOARD_DATA: "/feign/teacher/scoreboard/{0}",
                    GET_SCOREBOARD_GRADES: "/feign/teacher/scoreboard/{0}/scoreBoardGrades",
                    UPDATE_SCOREBOARD_GRADES: "/feign/teacher/scoreboard/{0}/grades",
                    SUBMIT_SCOREBOARD: "/feign/teacher/scoreboard/{0}/submit",
                    FINALIZE_SCOREBOARD: "/feign/teacher/scoreboard/{0}/finalize",
                    GET_AVAILABLE_STUDENTS: "feign/teacher/courseSyllabus/{0}/scoreboard/{1}/getStudentsForAdding",
                    ADDED_STUDENTS_TO_SCOREBOARD: "feign/teacher/scoreboard/{0}/webScoreBoardGradesByTeacher",
                    IMPORT_GRADES_TO_SCOREBOARD_FROM_EXCEL: "feign/teacher/scoreboard/{0}/import_grades_from_excel",
                    EXPORT_SCOREBOARD: "feign/teacher/scoreboard/{0}/export/{1}"
                }
            },
            view: {
                EDIT: "teacher/course_syllabus_exam/{0}/scoreboard/edit/{1}",
                VIEW: "teacher/course_syllabus_exam/{0}/scoreboard/view/{1}",
                LIST: "teacher/course_syllabus_exam/{0}/scoreboard/list"
            }
        },
        course_syllabus_exam: {
            api: {
                feign: {
                    GET: "/feign/teacher/course_syllabus_exam/{0}"
                }
            },
            view: {
                VIEW: "teacher/course_syllabus_exam/view/{0}"
            }
        },
        course_syllabus_exam_csc: {
            api: {
                feign: {
                    GET_CSC_BY_COURSE_SYLLABUS_EXAM: "/feign/teacher/course_syllabus_exam/{0}/csc"
                }
            }
        },
        course_syllabus_exam_rooms: {
            api: {
                feign: {
                    GET_ROOMS_BY_COURSE_SYLLABUS_EXAM: "/feign/teacher/course_syllabus_exams/course_syllabus_exam/{0}/rooms"
                }
            }
        },
        web_cse_student_preferences: {
            api: {
                feign: {
                    GET_STUDENT_PREFERENCES_BY_COURSE_SYLLABUS_EXAM: "/feign/teacher/course_syllabus_exams/course_syllabus_exam/{0}/student_preferences"
                }
            }
        },
        absence: {
            api: {
                feign: {
                    GET: "/feign/teacher/teacher_courses/class_students_absences/{0}",
                    CREATE: "/feign/teacher/teacher_courses/class_students_absences/{0}",
                    UPDATE: "/feign/teacher/teacher_courses/class_students_absences/{0}",
                    DELETE: "/feign/teacher/teacher_courses/class_students_absences/{0}/{1}"
                }
            }
        },
        csc_mock_exam: {
            api: {
                feign: {
                    GET_BY_TCC: "/feign/teacher/teacher_courses/csc_mock_exams_by_tcc/{0}",
                    GET: "/feign/teacher/csc_mock_exam/{0}"
                }
            }
        },
        web_mock_exam: {
            api: {
                feign: {
                    GET_BY_CSC_MOCK_EXAM: "/feign/teacher/csc_mock_exam/{0}/web_mock_exam",
                    VALIDATE_CREATE: "/feign/teacher/csc_mock_exam/{0}/web_mock_exam/validate_create",
                    CREATE: "/feign/teacher/web_mock_exam/create",
                    WEB_MOCK_EXAM_DATA: "/feign/teacher/web_mock_exam/{0}",
                    WEB_MOCK_EXAM_GRADES: "/feign/teacher/web_mock_exam/{0}/grades",
                    IMPORT_GRADES_TO_WEB_MOCK_EXAM_FROM_EXCEL: "feign/teacher/web_mock_exam/{0}/import_grades_from_excel",
                    SUBMIT_WEB_MOCK_EXAM: "/feign/teacher/web_mock_exam/{0}/submit"
                }
            },
            view: {
                EDIT: "teacher/course/{0}/csc_mock_exam/{1}/web_mock_exam/edit/{2}",
                VIEW: "teacher/course/{0}/csc_mock_exam/{1}/web_mock_exam/view/{2}",
                LIST: "teacher/course/{0}/csc_mock_exam/{1}/web_mock_exam/list"
            }
        },
        supervised_students: {
            api: {
                feign: {
                    GET_SUPERVISED_STUDENTS: "/feign/teacher/supervised_students"
                }
            }
        }
    },
    student: {
        registration: {
            api: {
                feign: {
                    GET: "feign/student/student_registration",
                    GET_REGISTRATION_DATA_FOR_PERIOD: "feign/student/registrations_for_period/{0}",
                    REGISTRATION_PERIOD_GET: "feign/student/student_registration/registration_period/{0}",
                    REGISTRATION_PERIOD_HIS: "feign/student/web_student_registration/registration_period/{0}/history",
                    GET_ACTIVE_REGISTRATION_PERIODS: "feign/student/active_registration_periods"
                }
            },
            view: {
                EDIT: "student/student_registration/edit/{0}",
                PREVIEW: "student/student_registration/preview/{0}"
            }
        },
        program_course_groups: {
            api: {
                feign: {
                    GET_BY_DEPARTMENT: "feign/student/program_course_groups"
                }
            }
        },
        web_registration: {
            api: {
                feign: {
                    REGISTRATION_PERIOD_GET: "feign/student/web_student_registration/registration_period/{0}",
                    REGISTRATION_DRAFT_POST: "feign/student/web_student_registration/registration_period/{0}/draft",
                    REGISTRATION_VALIDATE: "feign/student/web_student_registration/registration_period/{0}/validate",
                    REGISTRATION_SUBMIT: "feign/student/web_student_registration/registration_period/{0}/submit_for_student",
                    REGISTRATION_PREVIEW: "feign/student/web_student_registration/registration_period/{0}/preview"
                }
            }
        },
        registration_period: {
            api: {
                feign: {
                    GET_ALL: "feign/student/registration_periods_all"
                }
            }
        },
        program_course: {
            api: {
                feign: {
                    GET_ALL_PER_STUDENT: "feign/student/program_courses",
                    GET_PROGRAM_COURSE: "/feign/student/program_course/{0}"
                }
            },
            view: {
                VIEW: "student/program_course/view/{0}"
            }
        },
        course_syllabus: {
            api: {
                feign: {
                    GET_DOCUMENTS_BY_COURSE_SYLLABUS: "/feign/student/course_syllabus/{0}/documents",
                    GET_DOCUMENT_BY_COURSE_SYLLABUS: "/feign/student/course_syllabus/{0}/documents/{1}",
                    GET_TEACHER_COURSE_CLASSES_BY_COURSE_SYLLABUS: "/feign/student/course_syllabus/{0}/teacher_course_classes"
                }
            }
        },
        course_syllabus_class_schedule: {
            api: {
                feign: {
                    GET_SYLLABUS_BY_COURSE_SYLLABUS_CLASS_SCHEDULE: "feign/student/csc_schedule/syllabuses",
                    GET_COURSE_SYLLABUS_CLASS_SCHEDULE_BY_SYLLABUS: "/feign/student/syllabus/{0}/csc_schedule"
                }
            }
        },
        pre_registration_period: {
            api: {
                feign: {
                    GET: "feign/student/pre_registration_periods",
                    GET_FILE: "feign/student/pre_registration_periods/{0}/file"
                }
            }
        },
        web_pre_registration: {
            api: {
                feign: {
                    BASE: "feign/student/web_student_pre_registration/pre_registration_period/{0}",
                    GET_FILE: "feign/student/web_student_pre_registration/pre_registration_period/{0}/file/{1}",
                    UPLOAD_FILE: "feign/student/web_student_pre_registration/pre_registration_period/{0}/file",
                    UPDATE_COMMENT_STUDENT: "feign/student/web_student_pre_registration/pre_registration_period/{0}/comment_student",
                    SUBMIT: "feign/student/web_student_pre_registration/pre_registration_period/{0}/submit"
                }
            },
            view: {
                ALL: "student/student_web_pre_registration",
                EDIT: "student/web_student_pre_registration/edit/{0}",
                PREVIEW: "student/web_student_pre_registration/preview/{0}"
            }
        },
        grades: {
            api: {
                feign: {
                    GET: "feign/student/grades/all",
                    DIPLOMA_GET: "feign/student/grades/diploma",
                    EXAM_PERIOD_GET: "feign/student/grades/exam_period/{0}",
                    STUDENT_GRADES_AVG: "feign/student/grades/average_student_course_grades"
                }
            }
        },
        exam_period: {
            api: {
                feign: {
                    GET: "feign/student/exam_periods"
                }
            }
        },
        certificates: {
            api: {
                feign: {
                    GET_REQUESTS: "feign/student/certificate/get_student_certificate_requests",
                    GET_CERTIFICATE_GROUPS: "feign/student/certificate/get_student_certificate_groups",
                    GET_CERTIFICATE_EXPORTED: "feign/student/certificate/get_student_certificate_exported",
                    PUT_CERTIFICATE_FOR_STUDENT: "feign/student/certificate/create_request"
                }
            }
        },
        data: {
            api: {
                feign: {
                    GET: "/feign/student/student_data"
                }
            }
        },
        transactions: {
            api: {
                feign: {
                    GET: "feign/student/student_transaction",
                    POST: "feign/student/student_transaction"
                }
            }
        },
        web_transactions: {
            api: {
                feign: {
                    GET: "feign/student/web_student_transaction",
                    GET_PENDING: "feign/student/web_student_transaction/pending"
                }
            }
        },
        thesis: {
            api: {
                feign: {
                    GET: "feign/student/thesis"
                }
            }
        },
        practice: {
            api: {
                feign: {
                    GET: "feign/student/practice"
                }
            }
        },
        settings: {
            api: {
                feign: {
                    GET: "feign/student/student_settings"
                }
            }
        },
        student_program_course_group: {
            api: {
                feign: {
                    GET: "feign/student/student_program_course_groups"
                }
            }
        },
        program_course_subject: {
            api: {
                feign: {
                    GET: "feign/student/program_course_subjects"
                }
            }
        },
        program_course_sub_subject: {
            api: {
                feign: {
                    GET: "feign/student/program_course_sub_subjects"
                }
            }
        },
        statistics: {
            api: {
                feign: {
                    GET_GRADE_STATISTIC: "feign/student/statistics/student_grades"
                }
            }
        },
        csc_mock_exam: {
            api: {
                feign: {
                    ONE: "/feign/student/csc_mock_exam/{0}",
                    GET_SYLLABUS_BY_CSC_MOCK_EXAM: "/feign/student/csc_mock_exam/syllabuses",
                    GET_CSC_MOCK_EXAMS_BY_SYLLABUS: "/feign/student/syllabus/{0}/csc_mock_exam"
                }
            }
        },
        course_syllabus_exam: {
            api: {
                feign: {
                    GET_ONE: "/feign/student/course_syllabus_exams/course_syllabus_exam/{0}",
                    GET_SYLLABUS_BY_STUDENT_REGISTRATION: "/feign/student/course_syllabus_exams/syllabuses",
                    GET_COURSE_SYLLABUS_EXAMS_BY_STUDENT_REGISTRATION_SYLLABUS: "/feign/student/syllabus/{0}/courseSyllabusExam"
                }
            },
            view: {
                VIEW: "student/course_syllabus_exam/view/{0}"
            }
        },
        web_cse_student_preference: {
            api: {
                feign: {
                    COUNT: "/feign/student/course_syllabus_exams/course_syllabus_exam/{0}/count_student_preferences",
                    BASE: "/feign/student/course_syllabus_exams/course_syllabus_exam/{0}/student_preference"
                }
            }
        },
        course_syllabus_exam_rooms: {
            api: {
                feign: {
                    GET_ROOMS_BY_COURSE_SYLLABUS_EXAM: "/feign/student/course_syllabus_exams/course_syllabus_exam/{0}/rooms"
                }
            }
        },
        course_syllabus_exam_cscs: {
            api: {
                feign: {
                    GET_CSCS_BY_COURSE_SYLLABUS_EXAM: "/feign/student/course_syllabus_exams/course_syllabus_exam/{0}/csc"
                }
            }
        },
        student_scholarship: {
            api: {
                feign: {
                    GET_SCHOLARSHIPS_BY_STUDENT: "feign/student/student_scholarship",
                    GET_SCHOLARSHIPS: "feign/student/scholarship"
                }
            }
        },
        announcement: {
            api: {
                feign: {
                    GET_ANNOUNCEMENTS_PREVIEW: "feign/student/announcements/preview",
                    GET_ANNOUNCEMENTS: "feign/student/announcements",
                    GET_ANNOUNCEMENTS_ARCHIVE: "feign/student/announcements/archive",
                    ONE: "feign/student/announcement/{0}"
                }
            },
            view: {
                LIST: "student/announcement/list",
                VIEW: "student/announcement/view/{0}",
                ARCHIVE: "student/announcement/archive"
            }
        },
        announcement_document: {
          api: {
              feign: {
                  GET_DOCUMENTS_BY_ANNOUNCEMENT: "/feign/student/announcement/{0}/documents",
                  GET_DOCUMENT_BY_ANNOUNCEMENT: "/feign/student/announcement/{0}/document/{1}/file"
              }
          }
      }
    }
};

var enums = {
    entity_type: {
        SEMESTER: {
            code: "SEMESTER",
            field: "semesterId",
            title: IlyLocales.entity.all.semesterId
        },
        TYPE: {
            code: "TYPE",
            field: "typeId",
            title: IlyLocales.entity.all.typeId.short
        },
        SUBJECT: {
            code: "SUBJECT",
            field: "subjectId",
            title: IlyLocales.entity.all.subjectId.normal,
            no_title: IlyLocales.entity.all.subjectId.none
        },
        SUBSUBJECT: {
            code: "SUBSUBJECT",
            field: "subSubjectId",
            title: IlyLocales.entity.all.subSubjectId
        },
        CATEGORY: {
            code: "CATEGORY",
            field: "categId",
            title: IlyLocales.entity.all.categId
        },
        GROUP: {
            code: "GROUP",
            field: "groupId",
            title: IlyLocales.entity.all.groupId
        },
        SECTOR: {
            code: "SECTOR",
            field: "sectorId",
            title: IlyLocales.entity.all.sectorId
        },
        COGNITIVESUBJECT: {
            code: "COGNITIVESUBJECT",
            field: "cognitiveSubjectId",
            title: IlyLocales.entity.all.cognitiveSubjectId
        },
        COGNITIVESUBSUBJECT: {
            code: "COGNITIVESUBSUBJECT",
            field: "cognitiveSubSubjectId",
            title: IlyLocales.entity.all.cognitiveSubSubjectId
        },
        UNCATEGORIZED: {
            code: "UNCATEGORIZED",
            title: IlyLocales.general.uncategorized
        }
    },
    webStudentRegistrationStatusEnum: {
        DRAFT: {
            code: "0",
            title: IlyLocales.entity.webStudentRegistration.status.draft.title,
            display: IlyLocales.entity.webStudentRegistration.status.draft.description
        },
        FINALIZED: {
            code: "1",
            title: IlyLocales.entity.webStudentRegistration.status.finalized.title,
            display: IlyLocales.entity.webStudentRegistration.status.finalized.description
        },
        OVERDATED: {
            code: "2",
            title: IlyLocales.entity.webStudentRegistration.status.overdated.title,
            display: IlyLocales.entity.webStudentRegistration.status.overdated.description
        },
        PENDING: {
            code: "3",
            title: IlyLocales.entity.webStudentRegistration.status.pending.title,
            display: IlyLocales.entity.webStudentRegistration.status.pending.description
        }
    },
    webStudentPreRegistrationStatusEnum: {
        DRAFT: {
            code: "0",
            title: IlyLocales.entity.webStudentPreRegistration.status.draft.title,
            display: IlyLocales.entity.webStudentPreRegistration.status.draft.description
        },
        SUBMITTED: {
            code: "1",
            title: IlyLocales.entity.webStudentPreRegistration.status.submitted.title,
            display: IlyLocales.entity.webStudentPreRegistration.status.submitted.description
        },
        ACCEPTED: {
            code: "2",
            title: IlyLocales.entity.webStudentPreRegistration.status.accepted.title,
            display: IlyLocales.entity.webStudentPreRegistration.status.accepted.description
        },
        REJECTED: {
            code: "3",
            title: IlyLocales.entity.webStudentPreRegistration.status.rejected.title,
            display: IlyLocales.entity.webStudentPreRegistration.status.rejected.description
        },
        FOR_EMENDATION: {
            code: "4",
            title: IlyLocales.entity.webStudentPreRegistration.status.for_emendation.title,
            display: IlyLocales.entity.webStudentPreRegistration.status.for_emendation.description
        }
    },
    webScoreboardStatusEnum: {
        ONGOING: {
            code: "0",
            title: IlyLocales.entity.webScoreBoard.status.ongoing.title
        },
        SUBMITED_TEACHER: {
            code: "1",
            title: IlyLocales.entity.webScoreBoard.status.submitted_teacher.title
        },
        OTHER: {
            code: "-1",
            title: IlyLocales.entity.webScoreBoard.status.other.title
        }
    },
    courseSyllabusExamStatusEnum: {
        OPEN: {
            value: 0,
            description: IlyLocales.entity.courseSyllabusExam.status.open
        },
        CLOSED: {
            value: 1,
            description: IlyLocales.entity.courseSyllabusExam.status.closed
        }
    },
    webCseStudentPreferenceEnum: {
        EXAM_LOCATION: {
            value: "examLocation",
            description: IlyLocales.entity.webCseStudentPreference.examLocation.title
        },
        IS_PARTICIPATE: {
            value: "isParticipate",
            description: IlyLocales.entity.webCseStudentPreference.isParticipate.title
        }
    },
    webCseStudentPreferenceStatusEnum: {
        DRAFT: {
            value: 0,
            description: "-"
        },
        SEND: {
            value: 1,
            description: IlyLocales.entity.webCseStudentPreference.status.send
        }
    },
    cscMockExamStatusEnum: {
        OPEN: {
            value: 0,
            description: IlyLocales.entity.cscMockExam.status.open
        },
        CLOSED: {
            value: 1,
            description: IlyLocales.entity.cscMockExam.status.closed
        }
    },
    webMockExamStatusEnum: {
        ONGOING: {
            code: 0,
            title: IlyLocales.entity.webMockExam.status.ongoing.title
        },
        SUBMITTED: {
            code: 1,
            title: IlyLocales.entity.webMockExam.status.submitted.title
        }
    },
    examLocationEnum: {
        IN_PERSON: {
            value: "1",
            description: IlyLocales.entity.webCseStudentPreference.examLocation.in_person
        },
        REMOTE: {
            value: "2",
            description: IlyLocales.entity.webCseStudentPreference.examLocation.remote
        }
    },
    supervisionType: {
        ADVISOR: {
            code: "advisor",
            title: IlyLocales.entity.teacher.supervisionType.advisor
        },
        SUPERVISOR: {
            code: "supervisor",
            title: IlyLocales.entity.teacher.supervisionType.supervisor
        },
        COSUPERVISOR: {
            code: "coSupervisor",
            title: IlyLocales.entity.teacher.supervisionType.coSupervisor
        }
    },
    announcementScopeEnum: {
        INSTITUTION: {
            value: 0,
            description: IlyLocales.entity.announcement.scope.institution
        },
        DEPARTMENT: {
            value: 1,
            description: IlyLocales.entity.announcement.scope.department
        },
        COURSE_SYLLABUS: {
            value: 2,
            description: IlyLocales.entity.announcement.scope.course_syllabus
        },
        COURSE_SYLLABUS_CLASS: {
            value: 3,
            description: IlyLocales.entity.announcement.scope.course_syllabus_class
        },
        STUDENT: {
            value: 4,
            description: IlyLocales.entity.announcement.scope.student
        }
    },
    announcementTargetEnum: {
        ALL: {
            value: 0,
            description: IlyLocales.entity.announcement.target.all
        },
        TEACHER: {
            value: 1,
            description: IlyLocales.entity.announcement.target.teacher
        },
        STUDENT: {
            value: 2,
            description: IlyLocales.entity.announcement.target.student
        }
    },
    scoreBoardGradesEnum:{
        ALL:{
            value:"0",
            description:IlyLocales.message.teacher.webScoreBoard.export.pdf.all
        },
        PASSED:{
            value:"1",
            description:IlyLocales.message.teacher.webScoreBoard.export.pdf.passed
        },
        FAILED:{
            value:"2",
            description:IlyLocales.message.teacher.webScoreBoard.export.pdf.failed
        },
        GRADED:{
            value:"3",
            description:IlyLocales.message.teacher.webScoreBoard.export.pdf.graded
        },
        NOT_GRADED:{
            value:"4",
            description:IlyLocales.message.teacher.webScoreBoard.export.pdf.notGraded
        }
    }
};


var _announcementScopeDS = [
    {
        "id": enums.announcementScopeEnum.INSTITUTION.value,
        "value": enums.announcementScopeEnum.INSTITUTION.description
    },
    {
        "id": enums.announcementScopeEnum.DEPARTMENT.value,
        "value": enums.announcementScopeEnum.DEPARTMENT.description
    },
    {
        "id": enums.announcementScopeEnum.COURSE_SYLLABUS.value,
        "value": enums.announcementScopeEnum.COURSE_SYLLABUS.description
    },
    {
        "id": enums.announcementScopeEnum.COURSE_SYLLABUS_CLASS.value,
        "value": enums.announcementScopeEnum.COURSE_SYLLABUS_CLASS.description
    },
    {
        "id": enums.announcementScopeEnum.STUDENT.value,
        "value": enums.announcementScopeEnum.STUDENT.description
    }
];

var _announcementTargetDS = [
    {
        "id": enums.announcementTargetEnum.ALL.value,
        "value": enums.announcementTargetEnum.ALL.description
    },
    {
        "id": enums.announcementTargetEnum.TEACHER.value,
        "value": enums.announcementTargetEnum.TEACHER.description
    },
    {
        "id": enums.announcementTargetEnum.STUDENT.value,
        "value": enums.announcementTargetEnum.STUDENT.description
    }
];

var _examLocationDS = [
    {
        "key": enums.examLocationEnum.IN_PERSON.value,
        "value": enums.examLocationEnum.IN_PERSON.description
    },
    {
        "key": enums.examLocationEnum.REMOTE.value,
        "value": enums.examLocationEnum.REMOTE.description
    }
];

var _programTypeEnum = {
    UNDERGRADUATE: {
        in_code: 1,
        code: IlyLocales.entity.programType.undergraduate.code,
        title: IlyLocales.entity.programType.undergraduate.title
    },
    POSTGRADUATE: {
        in_code: 2,
        code: IlyLocales.entity.programType.postGraduate.code,
        title: IlyLocales.entity.programType.postGraduate.title
    },
    DOCTORATE: {
        in_code: 3,
        code: IlyLocales.entity.programType.doctorate.code,
        title: IlyLocales.entity.programType.doctorate.title
    },
    POSTDOCTORATE: {
        in_code: 4,
        code: IlyLocales.entity.programType.postDoctorate.code,
        title: IlyLocales.entity.programType.postDoctorate.title
    }
};

var _genderEnum = {
    MALE: {
        value: 1,
        description: IlyLocales.general.gender.male
    },
    FEMALE: {
        value: 2,
        description: IlyLocales.general.gender.female
    }
};

var _studentTransactionTypeEnum = {
    ENERG: {
        code: IlyLocales.entity.studentTransactionType.ENERG.code,
        title: IlyLocales.entity.studentTransactionType.ENERG.title
    },
    APEN: {
        code: IlyLocales.entity.studentTransactionType.APEN.code,
        title: IlyLocales.entity.studentTransactionType.APEN.title
    },
    EGG: {
        code: IlyLocales.entity.studentTransactionType.EGG.code,
        title: IlyLocales.entity.studentTransactionType.EGG.title
    },
    DEGG: {
        code: IlyLocales.entity.studentTransactionType.DEGG.code,
        title: IlyLocales.entity.studentTransactionType.DEGG.title
    },
    AEJ: {
        code: IlyLocales.entity.studentTransactionType.AEJ.code,
        title: IlyLocales.entity.studentTransactionType.AEJ.title
    },
    DKAT: {
        code: IlyLocales.entity.studentTransactionType.DKAT.code,
        title: IlyLocales.entity.studentTransactionType.DKAT.title
    },
    AKAT: {
        code: IlyLocales.entity.studentTransactionType.AKAT.code,
        title: IlyLocales.entity.studentTransactionType.AKAT.title
    },
    DYPK: {
        code: IlyLocales.entity.studentTransactionType.DYPK.code,
        title: IlyLocales.entity.studentTransactionType.DYPK.title
    },
    AYPK: {
        code: IlyLocales.entity.studentTransactionType.AYPK.code,
        title: IlyLocales.entity.studentTransactionType.AYPK.title
    },
    DKAT2: {
        code: IlyLocales.entity.studentTransactionType.DKAT2.code,
        title: IlyLocales.entity.studentTransactionType.DKAT2.title
    },
    AKAT2: {
        code: IlyLocales.entity.studentTransactionType.AKAT2.code,
        title: IlyLocales.entity.studentTransactionType.AKAT2.title
    },
    DYPK2: {
        code: IlyLocales.entity.studentTransactionType.DYPK2.code,
        title: IlyLocales.entity.studentTransactionType.DYPK2.title
    },
    AYPK2: {
        code: IlyLocales.entity.studentTransactionType.AYPK2.code,
        title: IlyLocales.entity.studentTransactionType.AYPK2.title
    },
    ANA: {
        code: IlyLocales.entity.studentTransactionType.ANA.code,
        title: IlyLocales.entity.studentTransactionType.ANA.title
    },
    AKAN: {
        code: IlyLocales.entity.studentTransactionType.AKAN.code,
        title: IlyLocales.entity.studentTransactionType.AKAN.title
    },
    PTY: {
        code: IlyLocales.entity.studentTransactionType.PTY.code,
        title: IlyLocales.entity.studentTransactionType.PTY.title
    },
    ANS: {
        code: IlyLocales.entity.studentTransactionType.ANS.code,
        title: IlyLocales.entity.studentTransactionType.ANS.title
    },
    SNS: {
        code: IlyLocales.entity.studentTransactionType.SNS.code,
        title: IlyLocales.entity.studentTransactionType.SNS.title
    },
    DANS: {
        code: IlyLocales.entity.studentTransactionType.DANS.code,
        title: IlyLocales.entity.studentTransactionType.DANS.title
    },
    DGR: {
        code: IlyLocales.entity.studentTransactionType.DGR.code,
        title: IlyLocales.entity.studentTransactionType.DGR.title
    },
    AKDGR: {
        code: IlyLocales.entity.studentTransactionType.AKDGR.code,
        title: IlyLocales.entity.studentTransactionType.AKDGR.title
    },
    APS: {
        code: IlyLocales.entity.studentTransactionType.APS.code,
        title: IlyLocales.entity.studentTransactionType.APS.title
    },
    ENE: {
        code: IlyLocales.entity.studentTransactionType.ENE.code,
        title: IlyLocales.entity.studentTransactionType.ENE.title
    },
    DOM: {
        code: IlyLocales.entity.studentTransactionType.DOM.code,
        title: IlyLocales.entity.studentTransactionType.DOM.title
    }
};

var _programCourseSubjectNone = {
    key: "-1",
    value: IlyLocales.entity.all.subjectId.none
};

var _studentStatusEnum = {
    ALL: {
        value: -3,
        code: "all",
        title: IlyLocales.entity.studentStatus.all.title
    },
    INACTIVE: {
        value: -2,
        code: "inactive",
        title: IlyLocales.entity.studentStatus.inactive.title
    },
    OTHER: {
        value: -1,
        code: "other",
        title: IlyLocales.entity.studentStatus.other.title
    },
    UNDEFINED: {
        value: 0,
        code: "undefined",
        title: IlyLocales.entity.studentStatus.undefined.title
    },
    ACTIVE: {
        value: 1,
        code: "active",
        title: IlyLocales.entity.studentStatus.active.title
    },
    PAUSED: {
        value: 2,
        code: "paused",
        title: IlyLocales.entity.studentStatus.paused.title
    },
    GRADUATED: {
        value: 3,
        code: "graduated",
        title: IlyLocales.entity.studentStatus.graduated.title
    },
    DELETED: {
        value: 4,
        code: "deleted",
        title: IlyLocales.entity.studentStatus.deleted.title
    },
    NOMINATION: {
        value: 5,
        code: "nomination",
        title: IlyLocales.entity.studentStatus.nomination.title
    },
    PRESUBSCRIBED: {
        value: 6,
        code: "presubscribed",
        title: IlyLocales.entity.studentStatus.presubscribed.title
    }
};

var _webSbgByTeacherStatusEnum = {
    PENDING: {
        code: 0,
        description: IlyLocales.entity.webScoreBoard.byTeacherStatus.pending
    },
    REJECTED: {
        code: -1,
        description: IlyLocales.entity.webScoreBoard.byTeacherStatus.rejected
    },
    APPROVED: {
        code: 1,
        description: IlyLocales.entity.webScoreBoard.byTeacherStatus.accepted
    }
};

var _courseSyllabusExamStatusDS = [
    {
        "id": enums.courseSyllabusExamStatusEnum.OPEN.value,
        "value": enums.courseSyllabusExamStatusEnum.OPEN.description
    },
    {
        "id": enums.courseSyllabusExamStatusEnum.CLOSED.value,
        "value": enums.courseSyllabusExamStatusEnum.CLOSED.description
    }
];

