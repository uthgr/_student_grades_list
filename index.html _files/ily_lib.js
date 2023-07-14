var IlyLib = {};
IlyLib = {
    helpers: {
        checkIfAlphabetExtValid: function (text) {
            return /^[α-ωΑ-Ωίϊΐόάέύϋΰήώa-zA-Z\-.\s]*$/.test(text);
        },
        checkIfLatinChar: function (text) {
            return /^[a-zA-Z]+$/.test(text);
        },
        convertNameOnomastikiToAitiatiki: function (nameOnomastiki) {
            var nameFinal = "";
            var suffixTwoChars = nameOnomastiki.slice(-2);
            switch (suffixTwoChars) {
                case "ΟΣ":
                case "ΗΣ":
                case "ΑΣ":
                case "ΕΣ":
                case "ος":
                case "ός":
                case "ης":
                case "ής":
                case "ας":
                case "άς":
                case "ες":
                case "ές":
                    nameFinal = nameOnomastiki.substring(0, nameOnomastiki.length - 1);
                    return nameFinal;
                case "ών":
                    nameFinal = nameOnomastiki + "τα";
                    return nameFinal;
                case "ΩΝ":
                    var thirdCharacterFromEndOfString = nameOnomastiki.substring(nameOnomastiki.length - 3, nameOnomastiki.length - 2);
                    if (thirdCharacterFromEndOfString === 'A' || thirdCharacterFromEndOfString === 'α' || thirdCharacterFromEndOfString === 'ά' || thirdCharacterFromEndOfString === 'Ε' || thirdCharacterFromEndOfString === 'ε'
                            || thirdCharacterFromEndOfString === 'έ' || thirdCharacterFromEndOfString === 'Η' || thirdCharacterFromEndOfString === 'η' || thirdCharacterFromEndOfString === 'ή' || thirdCharacterFromEndOfString === 'Ι'
                            || thirdCharacterFromEndOfString === 'ι' || thirdCharacterFromEndOfString === 'ί' || thirdCharacterFromEndOfString === 'Ο' || thirdCharacterFromEndOfString === 'ο' || thirdCharacterFromEndOfString === 'ό'
                            || thirdCharacterFromEndOfString === 'Υ' || thirdCharacterFromEndOfString === 'υ' || thirdCharacterFromEndOfString === 'ύ' || thirdCharacterFromEndOfString === 'Ω' || thirdCharacterFromEndOfString === 'ω' || thirdCharacterFromEndOfString === 'ώ') {
                        nameFinal = nameOnomastiki + "Α";
                    } else {
                        nameFinal = nameOnomastiki.substring(0, nameOnomastiki.length - 2) + "ΟΝΑ";
                    }
                    return nameFinal;
                case "ων":
                    var thirdCharacterFromEndOfString = nameOnomastiki.substring(nameOnomastiki.length - 3, nameOnomastiki.length - 2);
                    if (thirdCharacterFromEndOfString === 'A' || thirdCharacterFromEndOfString === 'α' || thirdCharacterFromEndOfString === 'ά' || thirdCharacterFromEndOfString === 'Ε' || thirdCharacterFromEndOfString === 'ε'
                            || thirdCharacterFromEndOfString === 'έ' || thirdCharacterFromEndOfString === 'Η' || thirdCharacterFromEndOfString === 'η' || thirdCharacterFromEndOfString === 'ή' || thirdCharacterFromEndOfString === 'Ι'
                            || thirdCharacterFromEndOfString === 'ι' || thirdCharacterFromEndOfString === 'ί' || thirdCharacterFromEndOfString === 'Ο' || thirdCharacterFromEndOfString === 'ο' || thirdCharacterFromEndOfString === 'ό'
                            || thirdCharacterFromEndOfString === 'Υ' || thirdCharacterFromEndOfString === 'υ' || thirdCharacterFromEndOfString === 'ύ' || thirdCharacterFromEndOfString === 'Ω' || thirdCharacterFromEndOfString === 'ω' || thirdCharacterFromEndOfString === 'ώ') {
                        nameFinal = nameOnomastiki + "α";
                    } else {
                        nameFinal = nameOnomastiki.substring(0, nameOnomastiki.length - 2) + "ονα";
                    }
                    return nameFinal;
                default:
                    return nameOnomastiki;
            }
        },
        convertNameOnomastikiToGeniki: function (nameOnomastiki) {
            var nameFinal = "";
            var suffixTwoChars = nameOnomastiki.slice(-2), suffixOneChar = nameOnomastiki.slice(-1);
            switch (suffixOneChar) {
                case "Α":
                case "Η":
                case "Ω":
                    nameFinal = nameOnomastiki + "Σ";
                    return nameFinal;
                case "α":
                case "ά":
                case "η":
                case "ή":
                case "ω":
                case "ώ":
                    nameFinal = nameOnomastiki + "ς";
                    return nameFinal;
            }
            switch (suffixTwoChars) {
                case "ΟΣ":
                    nameFinal = nameOnomastiki.substring(0, nameOnomastiki.length - 1) + "Υ";
                    return nameFinal;
                case "ος":
                    nameFinal = nameOnomastiki.substring(0, nameOnomastiki.length - 1) + "υ";
                    return nameFinal;
                case "ός":
                    nameFinal = nameOnomastiki.substring(0, nameOnomastiki.length - 1) + "ύ";
                    return nameFinal;
                case "ΗΣ":
                case "ΑΣ":
                case "ΕΣ":
                case "ης":
                case "ής":
                case "ας":
                case "άς":
                case "ες":
                case "ές":
                    nameFinal = nameOnomastiki.substring(0, nameOnomastiki.length - 1);
                    return nameFinal;
                case "ών":
                    nameFinal = nameOnomastiki + "τος";
                    return nameFinal;
                case "ΩΝ":
                    var thirdCharacterFromEndOfString = nameOnomastiki.substring(nameOnomastiki.length - 3, nameOnomastiki.length - 2);
                    if (thirdCharacterFromEndOfString === 'A' || thirdCharacterFromEndOfString === 'α' || thirdCharacterFromEndOfString === 'ά' || thirdCharacterFromEndOfString === 'Ε' || thirdCharacterFromEndOfString === 'ε'
                            || thirdCharacterFromEndOfString === 'έ' || thirdCharacterFromEndOfString === 'Η' || thirdCharacterFromEndOfString === 'η' || thirdCharacterFromEndOfString === 'ή' || thirdCharacterFromEndOfString === 'Ι'
                            || thirdCharacterFromEndOfString === 'ι' || thirdCharacterFromEndOfString === 'ί' || thirdCharacterFromEndOfString === 'Ο' || thirdCharacterFromEndOfString === 'ο' || thirdCharacterFromEndOfString === 'ό'
                            || thirdCharacterFromEndOfString === 'Υ' || thirdCharacterFromEndOfString === 'υ' || thirdCharacterFromEndOfString === 'ύ' || thirdCharacterFromEndOfString === 'Ω' || thirdCharacterFromEndOfString === 'ω' || thirdCharacterFromEndOfString === 'ώ') {
                        nameFinal = nameOnomastiki + "ΟΣ";
                    } else {
                        nameFinal = nameOnomastiki.substring(0, nameOnomastiki.length - 2) + "ΟΝΟΣ";
                    }
                    return nameFinal;
                case "ων":
                    var thirdCharacterFromEndOfString = nameOnomastiki.substring(nameOnomastiki.length - 3, nameOnomastiki.length - 2);
                    if (thirdCharacterFromEndOfString === 'A' || thirdCharacterFromEndOfString === 'α' || thirdCharacterFromEndOfString === 'ά' || thirdCharacterFromEndOfString === 'Ε' || thirdCharacterFromEndOfString === 'ε'
                            || thirdCharacterFromEndOfString === 'έ' || thirdCharacterFromEndOfString === 'Η' || thirdCharacterFromEndOfString === 'η' || thirdCharacterFromEndOfString === 'ή' || thirdCharacterFromEndOfString === 'Ι'
                            || thirdCharacterFromEndOfString === 'ι' || thirdCharacterFromEndOfString === 'ί' || thirdCharacterFromEndOfString === 'Ο' || thirdCharacterFromEndOfString === 'ο' || thirdCharacterFromEndOfString === 'ό'
                            || thirdCharacterFromEndOfString === 'Υ' || thirdCharacterFromEndOfString === 'υ' || thirdCharacterFromEndOfString === 'ύ' || thirdCharacterFromEndOfString === 'Ω' || thirdCharacterFromEndOfString === 'ω' || thirdCharacterFromEndOfString === 'ώ') {
                        nameFinal = nameOnomastiki + "ος";
                    } else {
                        nameFinal = nameOnomastiki.substring(0, nameOnomastiki.length - 2) + "ονος";
                    }
                    return nameFinal;
                default:
                    return nameOnomastiki;
            }
        },
        convertPartiallyFromGreekToLatinCharacters: function (inputText, finalEn, maxPreviousChars) {
            if (inputText.length > 1 && inputText.length - maxPreviousChars >= 0) {
                var i, dipthong = "";
                for (i = 0; i < maxPreviousChars; i++) {
                    dipthong += inputText.charAt(inputText.length - maxPreviousChars + i);
                }
                var valueInMap = _mapGreekToLatinCharacters[dipthong];
                if (valueInMap !== null && valueInMap !== "" && typeof valueInMap !== "undefined" && finalEn !== null && finalEn !== "" && typeof finalEn !== "undefined" && finalEn.length > 0) {
                    finalEn = finalEn.substring(0, finalEn.length - 1);
                    finalEn += valueInMap;
                    return finalEn;
                }
            }
            var last = _mapGreekToLatinCharacters[inputText.charAt(inputText.length - maxPreviousChars + 1)];
            if (last !== null && last !== "" && typeof last !== "undefined") {
                finalEn += last;
                return finalEn;
            }
            return "";
        },
        convertToKeyValueList: function (list, key, value) {
            var data = [];
            if (typeof list === "undefined" || list === null) {
                list = [];
            }

            $.each(list, function (i, v) {
                data.push({
                    "key": v[key],
                    "value": v[value]
                });
            });
            return data;
        },
        dateConvertedNormal: function (UNIX_timestamp) {
            var a = new Date(UNIX_timestamp);
            var year = a.getFullYear();
            var month = a.getMonth() + 1;
            if (month < 10)
                month = "0" + month;
            var date = a.getDate();
            if (date < 10)
                date = "0" + date;
            var time = date + '/' + month + '/' + year;
            return time;
        },
        dateTimeConvertedNormal: function (UNIX_timestamp) {
            var a = new Date(UNIX_timestamp);
            var year = a.getFullYear();
            var month = a.getMonth() + 1;
            if (month < 10)
                month = "0" + month;
            var date = a.getDate();
            if (date < 10)
                date = "0" + date;
            var hour = a.getHours();
            if (hour < 10)
                hour = "0" + hour;
            var min = a.getMinutes();
            if (min < 10)
                min = "0" + min;
            // var sec = a.getSeconds();
            var datetime = date + '/' + month + '/' + year + ', ' + hour + ':' + min;
            return datetime;
        },
        dayOff(UNIX_timestamp) {
            var a = new Date(UNIX_timestamp);
            var day = a.getDay();
            var isWeekend = (day === 6) || (day === 0); // 6 = Saturday, 0 = Sunday

            return isWeekend;
        },
        getNumberOfDecimalPlaces: function (num) {
            var match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
            if (!match) {
                return 0;
            }
            return Math.max(
                    0,
                    // Number of digits right of decimal point.
                            (match[1] ? match[1].length : 0)
                            // Adjust for scientific notation.
                            - (match[2] ? +match[2] : 0));
        },
        getSyllabusLabel: function (syllabus) {
            if (syllabus === undefined || syllabus === null) {
                return "-";
            }
            return syllabus + " - " + (syllabus + 1);
        },
        getUrlParameter: function (sParam) {
            var sPageURL = decodeURIComponent(window.location.search.substring(1)),
                    sURLVariables = sPageURL.split('&'),
                    sParameterName,
                    i;
            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');
                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : sParameterName[1];
                }
            }
            return null;
        },
        getUrlParameters: function () {
            var sPageURL = decodeURIComponent(window.location.search.substring(1));
            return sPageURL;
        },
        goToTab: function (tab) {
            $("a[href='#" + tab + "']").trigger('click');
        },
        dayOfWeekText: function (day) {
            var days = [IlyLocales.general.day_of_week.sunday, 
                IlyLocales.general.day_of_week.monday, 
                IlyLocales.general.day_of_week.tuesday, 
                IlyLocales.general.day_of_week.wednesday, 
                IlyLocales.general.day_of_week.thursday, 
                IlyLocales.general.day_of_week.friday, 
                IlyLocales.general.day_of_week.saturday];
            return days[day];
        },
        monthText: function (monthId) {
            var months = [IlyLocales.general.month.january.long, 
                IlyLocales.general.month.february.long, 
                IlyLocales.general.month.march.long, 
                IlyLocales.general.month.april.long, 
                IlyLocales.general.month.may.long, 
                IlyLocales.general.month.june.long, 
                IlyLocales.general.month.july.long, 
                IlyLocales.general.month.august.long,
                IlyLocales.general.month.september.long, 
                IlyLocales.general.month.october.long, 
                IlyLocales.general.month.november.long, 
                IlyLocales.general.month.december.long];
            return months[monthId];
        },
        parseCheckbox: function (value) {
            if (value === 0) {
                value = true;
            } else if (value === 1) {
                value = false;
            }
            // Change values during filtering from boolean to number (our database has Long datatype)
            else if (value === "true") {
                value = 0;
            } else if (value === "false") {
                value = 1;
            }

            return value;
        },
        presentOutput: function (input, mapFunction, noInput) {
            if (noInput === null) {
                noInput = "-";
            }
            if (input === null) {
                return noInput;
            }
            if (mapFunction !== null) {
                return mapFunction(input);
            }

            return input;
        },
        /**
         * Gets the url substring specified by position. Spliting is done with '/'. Ignores request parameters.
         * 
         * @param {number} position : integer that specifies which path variable will be returned. Reverse counting is applied. (E.g. position=0 returns last path variable)
         * @returns {IlyLib.helpers.getPathVariable.pathname}
         */
        getPathVariable: function (position) {
            var pathname = window.location.pathname.split("/");
            var index = pathname.length - 1 - position;
            if (index < 0) {
                return null;
            }
            return pathname[index];
        },
        removeArtistryFromFormFields: function (formFields) {
            var fields = $.extend(true, {}, formFields), plainFields = [];
            function removeFormFieldsArtistryRecursively(fields) {
                $.each(fields, function (i, v) {
                    if (typeof fields[i].type !== "undefined" && fields[i].type !== null) {
                        if (fields[i].type === "group" && typeof fields[i].children !== "undefined") {
                            removeFormFieldsArtistryRecursively(fields[i].children);
                        } else if (fields[i].type !== "title") {
                            plainFields.push(fields[i]);
                        }
                    }
                });
            }

            removeFormFieldsArtistryRecursively(fields);
            return plainFields;
        },
        roundToDecimals: function (num, decimals) {
            return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
        },
        textWithLineBreaks: function (text) {
            return text.replace(/\n/g, "<br/>");
        },
        timeConverterDate: function (UNIX_timestamp) {
            var a = new Date(UNIX_timestamp);
            var months = [IlyLocales.general.month.january.short, 
                IlyLocales.general.month.february.short, 
                IlyLocales.general.month.march.short, 
                IlyLocales.general.month.april.short, 
                IlyLocales.general.month.may.short, 
                IlyLocales.general.month.june.short, 
                IlyLocales.general.month.july.short, 
                IlyLocales.general.month.august.short,
                IlyLocales.general.month.september.short, 
                IlyLocales.general.month.october.short, 
                IlyLocales.general.month.november.short, 
                IlyLocales.general.month.december.short];
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = a.getDate();
            var time = date + ' ' + month + ' ' + year;
            return time;
        },
        timeConverterFull: function (UNIX_timestamp) {
            var a = new Date(UNIX_timestamp);
            var months = [IlyLocales.general.month.january.short, 
                IlyLocales.general.month.february.short, 
                IlyLocales.general.month.march.short, 
                IlyLocales.general.month.april.short, 
                IlyLocales.general.month.may.short, 
                IlyLocales.general.month.june.short, 
                IlyLocales.general.month.july.short, 
                IlyLocales.general.month.august.short,
                IlyLocales.general.month.september.short, 
                IlyLocales.general.month.october.short, 
                IlyLocales.general.month.november.short, 
                IlyLocales.general.month.december.short];
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = a.getDate();
            var hour = a.getHours();
            if (hour < 10)
                hour = "0" + hour;
            var min = a.getMinutes();
            if (min < 10)
                min = "0" + min;
            // var sec = a.getSeconds();
            var time = date + ' ' + month + ' ' + year + ', ' + hour + ':' + min;
            return time;
        },
        timeConverterHour: function (UNIX_timestamp) {
            var a = new Date(UNIX_timestamp);
            var hour = a.getHours();
            if (hour < 10)
                hour = "0" + hour;
            var min = a.getMinutes();
            if (min < 10)
                min = "0" + min;
            // var sec = a.getSeconds();
            var time = hour + ':' + min;
            return time;
        }
    },
    ilyJSON: {
        convertStrToUrlParameters: function (jsonObj) {
            var str = Object.keys(jsonObj).map(function (key) {
                return encodeURIComponent(key) + '=' + encodeURIComponent(jsonObj[key]);
            }).join('&');
            return str;
        },
        removeEmptyStringsFromJSONObject: function (obj, isArray) {
            var o = (isArray === true) ? [] : {};
            $.map(obj, function (val, i) {
                if (typeof val === "object" && val !== null) {
                    val = IlyLib.ilyJSON.removeEmptyStringsFromJSONObject(val, Array.isArray(val));
                }
                if (val === "") {
                    val = null;
                }
                o[i] = val;
            });
            return o;
        }
    }
};
