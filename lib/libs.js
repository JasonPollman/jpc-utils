function libs () {
    'use strict';
    var IS_NODE = require('./isNode'),

    libs = {

        /**
         * Generic library functions
         * @type {Object}
         */
        generic: {
            inherits: function inherits (o, s) {
                if (o === undefined || o === null)
                throw new TypeError('The constructor to "inherits" must not be ' + 'null or undefined');

                if (s === undefined || s === null)
                throw new TypeError('The super constructor to "inherits" must not ' + 'be null or undefined');

                if (s.prototype === undefined)
                throw new TypeError('The super constructor to "inherits" must ' + 'have a prototype');

                o.super_ = s;
                Object.setPrototypeOf(o.prototype, s.prototype);
            }
        },

        /**
         * String library functions
         * @type {Object}
         */
        string: {

            /**
             * Returns all the characters found in one string but not the other.
             * @param {String} s The string to operate on.
             * @param {String} other The string to compute the difference against.
             * @return {String} A difference string.
             */
            differenceFromString: function differenceFromString (s, other) {
                if(typeof other !== 'string' || typeof s !== 'string') return s;
                var sarr = s.split(''), oarr = other.split('');
                return libs.array.differenceFromArray(sarr, oarr).join('');
            },

            /**
             * Replaces tokens (snippets of text wrapped in brackets) with their values.
             * @param {String} s The string to operate on.
             * @return {String} The token replaced values.
             */
            replaceTokens: function replaceTokens (s) {
                return libs.generic.replaceStringTokens(s);
            },

            /**
             * Returns only the characters common to both strings
             * @param {String} s The string to operate on.
             * @param {String} other The string to compute the intersection against.
             * @return {String} The intersection between the two strings.
             */
            intersectString: function intersectString (s, other) {
                if(typeof other !== 'string' || typeof s !== 'string') return s;
                var sarr = s.split(''), oarr = other.split('');
                return libs.intersectArray(sarr, oarr).join('');
            },

            /**
             * Repeat a string 'times' times.
             * @param {String} s The string to operate on.
             * @param {Number} times The number of times to repeat the string
             * @return {String} The repeated string.
             */
            repeat: function repeat (s, times) {
                times = parseInt(times, 10);
                times = isNaN(times) || !isFinite(times) || times <= 0 ? 1 : times;

                var os = s;
                for(var i = 1; i < times; i++) s += os;
                return s;
            },

            /**
             * Right trims a string. Same as String.trim, but only for the end of a string.
             * @param {String} s The string to operate on.
             * @param {String} [what='\\s+'] What to trim.
             * @return {String} The right trimmed string
             */
            rtrim: function rtrim (s, what) {
                what = typeof what === 'string' ? what : '\\s+';
                return s.replace(new RegExp(what + '$'), '');
            },

            /**
             * Left trims a string. Same as String.trim, but only for the beginning of a string.
             * @param {String} s The string to operate on.
             * @param {String} [what='\\s+'] What to trim.
             * @return {String} The left trimmed string
             */
            ltrim: function ltrim (s, what) {
                what = typeof what === 'string' ? what : '\\s+';
                return s.replace(new RegExp('^' + what), '');
            },

            /**
             * Escapes HTML special characters
             * @param {String} s The string to operate on.
             * @return {String} The HTML escaped string
             */
            htmlEncode: function htmlEncode (s) {
                var map = {
                    '&'  : '&amp;',
                    '<'  : '&lt;',
                    '>'  : '&gt;',
                    '"'  : '&quot;',
                    '\'' : '&#039;'
                };
                return s.replace(/[&<>"']/g, function (m) { return map[m]; });
            },

            /**
             * Un-escapes HTML special characters
             * @param {String} s The string to operate on.
             * @return {String} The HTML escaped string
             */
            htmlDecode: function htmlDecode (s) {
                var map = {
                    '&amp;'  : '&',
                    '&lt;'   : '<',
                    '&gt;'   : '>',
                    '&quot;' : '"',
                    '&#039;' : '\''
                };
                return s.replace(/(&amp;|&lt;|&gt;|&quot;|&#039;)/g, function (m) { return map[m]; });
            },

            /**
             * Created an 'eval' safe string, by adding slashes to ", ', \t, \n, \f, \r, and the NULL byte.
             * @param {String} s The string to operate on.
             * @return {String} A string with slashes
             */
            addSlashes: function addSlashes (s) {
                return s.replace(/[\\"'\t\n\f\r]/g, '\\$&').replace(/\u0000/g, '\\0');
            },

            /**
             * Returns a string with the first letter capitalized.
             * @param {String} s The string to operate on.
             * @return {String} The string with the first letter upper cased.
             * @function
             */
            ucFirst: function ucFirst (s) {
                return s.charAt(0).toUpperCase() + s.slice(1);
            },

            /**
             * Returns a string with the first letter lowercased.
             * @param {String} s The string to operate on.
             * @return {String} The string with the first letter lower cased.
             * @function
             */
            lcFirst: function lcFirst (s) {
                return s.charAt(0).toLowerCase() + s.slice(1);
            },

            /**
             * Returns a string in Title Case.
             * @param {String} s The string to operate on.
             * @return {String} The title cased string.
             * @function
             */
            titleCase: function titleCase (s) {
                var arr = [];
                libs.object.each(s.split(' '), function (t) { arr.push(libs.string.ucFirst(t)); });
                return arr.join(' ');
            },

            /**
             * Splices a string, much like an array.
             * @param {String} s The string to operate on.
             * @param {Number} index The index to begin splicing the string at
             * @param {Number} count The number of characters to delete
             * @param {String} add The string to append at the spliced section
             * @return {String} The spliced string.
             * @function
             */
            splice: function splice (s, index, count, add) {
                return s.slice(0, index) + (add || '') + s.slice(index + count);
            },

            /**
             * Return a truncated string with ellipses.
             * @param {String} s The string to operate on.
             * @param {Number=} length The length of the desired string. If ommited, the strings original length will be used.
             * @param {String=} [place='back'] Possible values are 'front' and 'back'. Specifying 'front' will truncate the
             * string and add ellipses to the front, 'back' (or any other value) will add the ellipses to the back.
             * @param {String=} [ellipses='...'] The string value of the ellipses. Use this to add anything other than '...'
             * @returns {String} A truncated string with ellipses (if its length is greater than 'length')
             * @function
             */
            ellipses: function ellipses_ (s, length, place, ellipses) {
                if(isNaN(parseInt(length, 10))) length = s.length;
                if(length < 0 || !isFinite(length)) length = 0;

                ellipses = typeof ellipses === 'string' ? ellipses : '...';
                if(s.length <= length) return s;

                if(length <= ellipses.length) {
                    return ellipses.substring(0, length);
                }
                else if(!place || place !== 'front') {
                    return s.substr(0, length - ellipses.length) + ellipses;
                }
                else {
                    return ellipses + s.substr(0, length - ellipses.length);
                }
            },

            /**
             * Shuffles a string
             * @param {String} s The string to operate on.
             * @return {String} The mixed up string.
             */
            shuffle: function shuffle (s) {
                var a = s.split(''), n = s.length;
                for(var i = n - 1; i > 0; i--) {
                    var j = Math.floor(Math.random() * (i + 1)),
                        tmp = a[i];

                    a[i] = a[j];
                    a[j] = tmp;
                }
                return a.join('');
            },

            /**
             * Reverses a string.
             * @param {String} s The string to operate on.
             * @return {String} The reversed string.
             */
            reverse: function reverse (s) {
                if(s.length < 64) {
                    var str = '';
                    for(var i = s.length; i >= 0; i--) str += s.charAt(i);
                    return str;
                }
                else {
                    return s.split('').reverse().join('');
                }
            },

            /**
             * Strips the trailing slashes from a string.
             * @param {String} s The string to operate on.
             * If using Node.js, it will replace the trailing slash based on the value of os.platform
             * (i.e. if windows, '\\' will be replaced, '/' otherwise).
             * @returns {String} The string without a trailing slash.
             * @function
             */
            withoutTrailingSlash: function withoutTrailingSlash (s) {
                if(IS_NODE && require('os').platform === 'win32') return s.replace(/\\+$/, '');
                return s.replace(/\/+$/, '');
            },

            /**
             * Add a trailing slash to a string, if it doesn't already have one.
             * If using Node.js, it will replace the trailing slash based on the value of os.platform
             * (i.e. if windows, '\\' will be replaced, '/' otherwise).
             * @param {String} s The string to operate on.
             * @returns {String} The string without a trailing slash.
             * @function
             */
            withTrailingSlash: function withTrailingSlash (s) {
                if(IS_NODE && require('os').platform === 'win32') return libs.string.withoutTrailingSlash(s) + '\\';
                return libs.string.withoutTrailingSlash(s) + '/';
            },

            /**
             * Escapes regular expression special characters. This is useful is you wish to create a new regular expression
             * from a stored string value.
             * @param {String} s The string to operate on.
             * @returns {String} The regular expression safe string
             * @function
             */
            regexpSafe: function regexpSafe (s) {
                return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            },

            /**
             * Pads a string with 'delim' characters to the specified length. If the length is less than the string length,
             * the string will be truncated.
             * @param {String} s The string to operate on.
             * @param {Number} length The length to pad the string to. If less that the length of the string, the string will
             * be returned. If less than the length of the string, the string will be sliced.
             * @param {String=} [delim=' '] The character to pad the string with.
             * @param {Boolean=} [pre=false] If true, the padding will be added to the beginning of the string, otherwise the padding
             * will be added to the end.
             * @returns {String} The padded string
             * @function
             */
            pad: function pad (s, length, delim, pre) {
                var i, thisLength = s.length;

                if(!delim) delim = ' ';
                if(length === 0) return ''; else if(isNaN(parseInt(length, 10))) return s;

                length = parseInt(length, 10);
                if(length < thisLength) return !pre ? s.slice(0, length) : s.slice(-length);

                if(pre) {
                    for(i = 0; i < length - thisLength; i++) s = delim + s;
                }
                else {
                    for(i = 0; i < length - thisLength; i++) s += delim;
                }
                return s;
            },

            /**
             * Replaces newlines with br tags.
             * @param {String} s The string to operate on.
             * @return {String} The string with newlines converted to br tags.
             */
            newlineToBreak: function newlineToBreak (s) {
                return s.replace(/(\r\n|\n)/g, '<br/>');
            },

            /**
             * Replaces tabs with a span element with the class 'tab'
             * @param {String} s The string to operate on.
             * @return {String} The string with tabs converted to spans with the class 'tab'
             */
            tabsToSpan: function tabsToSpan (s) {
                return s.replace(/\t/g, '<span class="tab"></span>');
            },

            /**
             * Adjusts a string to fit within the confines of 'width', without breaking words.
             * @param {String} s The string to operate on.
             * @param {Number=} [length=120] The length to word wrap the string to.
             * @param {Number=} [padleft=0] The number of columns to pad the string on the left
             * @param {Number=} [padright=0] The number of columns to pad the string on the right
             * @param {Boolean=} omitFirst If true, the first line will not be padded left
             * @return {String} The string adjusted and padded for the stdout.
             * @function
             */
            wordWrapToLength: function wordWrapToLength (s, width, padleft, padright, omitFirst) {
                if(padright === undefined && padleft) padright = padleft;

                padleft  = !isNaN(parseInt(padleft,  10)) ? parseInt(padleft, 10)  : 0;
                padright = !isNaN(parseInt(padright, 10)) ? parseInt(padright, 10) : 0;

                var paddingLeft = '';
                for(var n = 0; n < padleft;  n++) paddingLeft  += ' ';

                var cols   = !isNaN(parseInt(width, 10)) ? length : 120,
                    arr    = s.split(' '),
                    item   = null,
                    len    = !omitFirst ? cols - padright - padleft : cols - padright,
                    str    = !omitFirst ? paddingLeft : '',
                    olen   = cols - padright - padleft;

                while((item = arr.shift()) !== undefined) {
                    if(item.length < len) {
                        str += item + ' ';
                        len -= item.length + 1;
                    }
                    else if(item.length > olen) {
                        str += item.substring(0, len - 1) + '-\n' + paddingLeft;
                        arr.unshift(item.substring(len, item.length - 1));
                        len = cols - padright - padleft;
                    }
                    else {
                        str += '\n' + paddingLeft + item + ' ';
                        len = cols - padright - 1 - padleft - item.length;
                    }
                }
                return str;
            }
        },

        /**
         * Date library functions
         * @type {Object}
         */
        date: {
            /**
             * Moves a date forward 'daysInTheFuture' days.
             * @param {Date} The date object to operate on.
             * @param {Number} daysInTheFuture The number of days in the future to advance the date
             * @param {Boolean=} [adjustForWeekend=false] Whether or not the date should fall on a weekend day
             * @returns {Date} The date, adjusted the number of specified days.
             * @function
             */
            advanceDays: function advanceDays (d, daysInTheFuture, adjustForWeekend) {
                daysInTheFuture = daysInTheFuture && libs.generic.isNumeric(daysInTheFuture) ? daysInTheFuture : 1;
                d.setTime(d.getTime() + (daysInTheFuture * 86400000));

                if(adjustForWeekend && (d.getDay() === 0 || d.getDay() === 6)) {
                    while(d.getDay() === 0 || d.getDay() === 6) d.setTime(d.getTime() + 86400000);
                }
                return d;
            },

            /**
             * Moves a date forward 'monthsInTheFuture' months.
             * @param {Date} The date object to operate on.
             * @param {Number} monthsInTheFuture The number of months in the future to advance the date
             * @param {Boolean=} [adjustForWeekend=false] Whether or not the date should fall on a weekend day
             * @returns {Date} The date, adjusted the number of specified months.
             * @function
             */
            advanceMonths: function advanceMonths (d, monthsInTheFuture, adjustForWeekend) {
                monthsInTheFuture = monthsInTheFuture && libs.generic.isNumeric(monthsInTheFuture) ? monthsInTheFuture : 1;
                d.setTime(d.getTime() + (monthsInTheFuture * 2629746000));

                if(adjustForWeekend && (d.getDay() === 0 || d.getDay() === 6)) {
                    while(d.getDay() === 0 || d.getDay() === 6) d.setTime(d.getTime() + 86400000);
                }
                return d;
            },

            /**
             * Moves a date forward 'yearsInTheFuture' years.
             * @param {Date} The date object to operate on.
             * @param {Number} yearsInTheFuture The number of years in the future to advance the date
             * @param {Boolean=} [adjustForWeekend=false] Whether or not the date should fall on a weekend day
             * @returns {Date} The date, adjusted the number of specified years.
             * @function
             */
            advanceYears: function advanceYears (d, yearsInTheFuture, adjustForWeekend) {
                yearsInTheFuture = yearsInTheFuture && libs.generic.isNumeric(yearsInTheFuture) ? yearsInTheFuture : 1;
                d.setTime(d.getTime() + (yearsInTheFuture * 31536000000));

                if(adjustForWeekend && (d.getDay() === 0 || d.getDay() === 6)) {
                    while(d.getDay() === 0 || d.getDay() === 6) d.setTime(d.getTime() + 86400000);
                }
                return d;
            },

            /**
             * Returns the date in the yyyy-mm-dd format.
             * @param {Date} The date object to operate on.
             * @param {String} [delim='-'] The delimiter to used the separate the date components (e.g. '-' or '.')
             * @returns {String} The date in the yyyy-mm-dd format.
             * @function
             */
            yyyymmdd: function yyyymmdd (d, delim) {
                delim = typeof delim !== 'string' ? '-' : delim ;

                var dd   = d.getDate(),
                    mm   = d.getMonth() + 1,
                    yyyy = d.getFullYear();

                if(dd < 10) dd = '0' + dd;
                if(mm < 10) mm = '0' + mm;
                return yyyy + delim + mm + delim + dd;
            },

            /**
             * Converts a date to the HH:MM:SS.MSEC time format
             * @param {Date} The date object to operate on.
             * @param {Boolean=} [omitMS=false] Whether or not to include the MS portion of the returned string
             * @returns {String} The formatted number, now a string.
             * @function
             */
            clockTime: function clockTime (d, omitMS) {
                return libs.number.clockTime(d.getTime(), !!omitMS);
            }
        },

        /**
         * Number library functions
         * @type {Object}
         */
        number: {

            /**
             * Pads a number with preceeding zeros.
             * @param {Number} n The number object to operate on.
             * @param {Number} length The final length of the string
             * @returns {String} The padded number, now a string.
             * @function
             */
            pad: function pad (n, length) {
                return libs.string.pad(n.toString(), length, '0', true);
            },

            /**
             * Advances (or reverses) the date the specified number of days.
             * @param {Number} n The number object to operate on.
             * @param {Date} date The date to change.
             * @return {Date} The modified date.
             */
            daysFrom: function daysFrom (n, date) {
                if(typeof date === 'number') date = new Date(date);
                if(!(date instanceof Date))  date = new Date();

                date.setDate(date.getDate() + n);
                return date;
            },

            /**
             * Advances (or reverses) the current date the specified number of days.
             * @param {Number} n The number object to operate on.
             * @return {Date} A date object
             */
            daysFromNow: function daysFromNow (n) {
                return libs.number.daysFrom(n, new Date());
            },

            /**
             * Advances (or reverses) the date the specified number of days.
             * @param {Number} n The number object to operate on.
             * @param {Date} date The date to change.
             * @return {Date} The modified date.
             */
            secondsFrom: function secondsFrom (n, date) {
                if(typeof date === 'number') date = new Date(date);
                if(!(date instanceof Date))  date = new Date();

                date.setSeconds(date.getSeconds() + n);
                return date;
            },

            /**
             * Advances (or reverses) the current date the specified number of days.
             * @param {Number} n The number object to operate on.
             * @return {Date} A date object
             */
            secondsFromNow: function secondsFromNow (n) {
                return libs.number.secondsFrom(n, new Date());
            },

            /**
             * Advances (or reverses) the date the specified number of years.
             * @param {Number} n The number object to operate on.
             * @param {Date} date The date to change.
             * @return {Date} The modified date.
             */
            yearsFrom: function yearsFrom (n, date) {
                if(typeof date === 'number') date = new Date(date);
                if(!(date instanceof Date))  date = new Date();

                date.setFullYear(date.getFullYear() + n);
                return date;
            },

            /**
             * Advances (or reverses) the current date the specified number of years.
             * @return {Date} A date object
             */
            yearsFromNow: function yearsFromNow (n) {
                return libs.number.yearsFrom(n, new Date());
            },

            /**
             * Advances (or reverses) the date the specified number of months.
             * @param {Number} n The number object to operate on.
             * @param {Date} date The date to change.
             * @return {Date} The modified date.
             */
            monthsFrom: function monthsFrom (n, date) {
                if(typeof date === 'number') date = new Date(date);
                if(!(date instanceof Date))  date = new Date();

                date.setMonth(date.getMonth() + n);
                return date;
            },

            /**
             * Advances (or reverses) the current date the specified number of months.
             * @param {Number} n The number object to operate on.
             * @return {Date} A date object
             */
            monthsFromNow: function monthsFromNow (n) {
                return libs.number.monthsFrom(n, new Date());
            },

            /**
             * Advances (or reverses) the date the specified number of hours.
             * @param {Number} n The number object to operate on.
             * @param {Date} date The date to change.
             * @return {Date} The modified date.
             */
            hoursFrom: function hoursFrom (n, date) {
                if(typeof date === 'number') date = new Date(date);
                if(!(date instanceof Date))  date = new Date();

                date.setHours(date.getHours() + n);
                return date;
            },

            /**
             * Advances (or reverses) the current date the specified number of hours.
             * @param {Number} n The number object to operate on.
             * @return {Date} A date object
             */
            hoursFromNow: function hoursFromNow (n) {
                return libs.number.hoursFrom(n, new Date());
            },

            /**
             * Advances (or reverses) the date the specified number of minutes.
             * @param {Number} n The number object to operate on.
             * @param {Date} date The date to change.
             * @return {Date} A modified date.
             */
            minutesFrom: function minutesFrom (n, date) {
                if(typeof date === 'number') date = new Date(date);
                if(!(date instanceof Date))  date = new Date();

                date.setMinutes(date.getMinutes() + n);
                return date;
            },

            /**
             * Advances (or reverses) the current date the specified number of minutes.
             * @param {Number} n The number object to operate on.
             * @return {Date} The date object
             */
            minutesFromNow: function minutesFromNow (n) {
                return libs.number.minutesFrom(n, new Date());
            },

            /**
             * The time, months in the past.
             * @param {Number} n The number object to operate on.
             * @return {Date} A Date object.
             */
            monthsAgo: function monthsAgo (n) {
                return libs.number.minutesFromNow(-n, new Date());
            },

            /**
             * The time, days in the past.
             * @param {Number} n The number object to operate on.
             * @return {Date} A Date object.
             */
            daysAgo: function daysAgo (n) {
                return libs.number.daysFromNow(-n, new Date());
            },

            /**
             * The time, seconds in the past.
             * @param {Number} n The number object to operate on.
             * @return {Date} A Date object.
             */
            secondsAgo: function secondsAgo (n) {
                return libs.number.secondsFromNow(-n, new Date());
            },

            /**
             * The time, minutes in the past.
             * @param {Number} n The number object to operate on.
             * @return {Date} A Date object.
             */
            minutesAgo: function minutesAgo (n) {
                return libs.number.minutesFromNow(-n, new Date());
            },

            /**
             * The time, years in the past.
             * @param {Number} n The number object to operate on.
             * @return {Date} A Date object.
             */
            yearsAgo: function yearsAgo (n) {
                return libs.number.yearsFromNow(-n, new Date());
            },

            /**
             * Converts a number to the HH:MM:SS.MSEC time format
             * @param {Number} t The number object to operate on.
             * @memberof Number.prototype
             * @param {Boolean=} [omitMS=false] Whether or not to include the MS portion of the returned string
             * @returns {String} The formatted number, now a string.
             * @function
             */
            clockTime: function clockTime (t, omitMS) {
                var ms, secs, mins, hrs;

                ms = t % 1000;
                t = (t - ms) / 1000;

                secs = t % 60;
                t = (t - secs) / 60;

                mins = t % 60;
                hrs = (t - mins) / 60;

                return libs.number.pad(hrs.toString(), 2)  + ':' + libs.number.pad(mins.toString(), 2) + ':' +
                       libs.number.pad(secs.toString(), 2) + ((omitMS === true) ? '' : '.' + libs.number.pad(ms.toString(), 3));
            }
        },

        /**
         * Function library functions
         * @type {Object}
         */
        function: {
            /** @todo Implement some of these... */
        },

        /**
         * Array library functions
         * @type {Object}
         */
        array: {

            /**
             * Shuffles an array
             * @param {Array} a The Array object to operate on.
             * @return {Array<*>} The mixed up array
             */
            shuffle: function shuffle (a) {
                for(var i = a.length - 1; i > 0; i--) {
                    var j = Math.floor(Math.random() * (i + 1)), tmp = a[i];
                    a[i] = a[j];
                    a[j] = tmp;
                }
                return a;
            },

            /**
             * Computes the union between the current array, and all the array objects passed in. That is,
             * the set of unique objects present in all of the arrays.
             * @param {Array} a The Array object to operate on.
             * @param {...Array} arr A list of array objects
             * @return {Array<*>} The union set of the provided arrays.
             */
            union: function union (a) {
                var args = libs.array.only(libs.object.makeArray(arguments), 'array');

                var union = [];
                args.unshift(a);
                libs.object.each(args, function (array) {
                    libs.object.each(array, function (item) {
                        if(union.indexOf(item) === -1) union.push(item);
                    });
                });
                return union;
            },

            /**
             * Returns all the items unique to either array.
             * @param {Array} a The Array object to operate on.
             * @param {Array} other The array to compute the difference from.
             * @return {Array} A new array with items unique to each array.
             */
            differenceFromArray: function differenceFromArray (a, other) {
                if(!(other instanceof Array)) return a;
                var diff = [];

                libs.object.each(a, function (item) {
                    if(other.indexOf(item) === -1) diff.push(item);
                });

                libs.object.each(other, function (item) {
                    if(a.indexOf(item) === -1) diff.push(item);
                });

                return diff;
            },

            /**
             * Returns all the items common to both arrays.
             * @param {Array} a The Array object to operate on.
             * @param {Array} other The array to compute the intersection from.
             * @return {Array} A new array with items common to both arrays.
             */
            intersectArray: function intersectArray (a, other) {
                if(!(other instanceof Array)) return a;

                var intersection = [];
                libs.object.each(a, function (item) {
                    if(other.indexOf(item) !== -1) intersection.push(item);
                });

                return intersection;
            },

            /**
             * Creates a new array from the current one, with all occurences of the provided arguments ommited.<br>
             * For example: <em>[1,2,3,4,5].without(1)</em> will return <em>[2,3,4,5]</em>
             * and <em>[1, null, 2, null, undefined].without(null, undefined)</em> will return <em>[1, 2]</em>
             * @param {Array} a The Array object to operate on.
             * @returns {Array<*>} A shallow copy of the array with the provided arguments ommited.
             * @function
             */
            without: function without () {
                var args = libs.object.makeArray(arguments),
                    res  = [];

                libs.object.each(args, function (v) { if(args.indexOf(v) === -1) res.push(v); });
                return res;
            },

            /**
             * Rotates the array left or right the specified number of times. If the direction is left, it will shift off the
             * first <em>n</em> elements and push them to the end of the array. If right, it will pop off the last <em>n</em>
             * items and unshift them onto the front of the array.
             * @param {Array} a The Array object to operate on.
             * @param {String=} [direction='left'] The direction to rotate array members.
             * @param {Number=} [amount=1] The number of elements to shift
             * @return {Array<*>} The current array, shifted.
             * @function
             */
            rotate: function rotate (a, direction, amount) {
                if(direction && direction.isNumeric() && !amount) {
                    amount    = direction;
                    direction = undefined;
                }

                if(!amount || (amount && !amount.isNumeric())) amount = 1;
                for(var i = 0; i < amount; i++) {
                    if(direction !== 'right') a.push(a.shift()); else a.unshift(a.pop());
                }
                return a;
            },

            /**
             * Rotates the array left the specified number of times.
             * This is useful if trying to create a circular queue.
             * @param {Array} a The Array object to operate on.
             * @param {Number=} [amount=1] The number of times to rotate the array left.
             * @return {Array<*>} The current array, rotated left.
             * @function
             */
            rotateLeft: function rotateLeft (a, amount) {
                return libs.array.rotate(a, 'left', amount);
            },

            /**
             * Rotates the array right the specified number of times.
             * This is useful if trying to create a circular queue.
             * @param {Array} a The Array object to operate on.
             * @param {Number=} [amount=1] The number of times to rotate the array left.
             * @return {Array<*>} The current array, rotated right.
             * @function
             */
            rotateRight: function rotateLeft (a, amount) {
                return libs.array.rotate(a, 'right', amount);
            },

            /**
             * Removes duplicates from the current array.
             * This is a destructive action, and will modify the array in place.
             * @param {Array} a The Array object to operate on.
             * @returns {Array<*>} The current array, with duplicates removed.
             * @function
             */
            makeUnique: function makeUnique (a) {
                var visited = [];
                for(var i = 0; i < a.length; i++) {
                    if(visited.indexOf(a[i]) === -1) {
                        visited.push(a[i]);
                    }
                    else {
                        a.splice(i, 1);
                        i--; // Splice will affect the internal array pointer, so fix it...
                    }
                }
                return a;
            },

            /**
             * Gets an array of unique items from the current array.
             * @param {Array} a The Array object to operate on.
             * @returns {Array} A new array with no duplicate values.
             * @function
             */
            unique: function unique (a) {
                var visited = [],
                    unique  = [];

                libs.object.each(a, function (item) {
                    if(visited.indexOf(item) === -1) {
                        unique.push(item);
                        visited.push(item);
                    }
                });
                return unique;
            },

            /**
             * Sorts the array in ascending order.
             * This is a destructive action, and will modify the array in place.
             * @param {Array} a The Array object to operate on.
             * @returns {Array} The array sorted in ascending order.
             * @function
             */
            ascending: function ascending (a) {
                return a.sort(function (a, b) {
                    return a < b ? -1 : a > b ? 1 : 0;
                });
            },

            /**
             * Sorts the array in descending order.
             * This is a destructive action, and will modify the array in place.
             * @param {Array} a The Array object to operate on.
             * @returns {Array} The array sorted in descending order.
             * @function
             */
            descending: function descending (a) {
                return a.sort(function (a, b) {
                    return a > b ? -1 : a < b ? 1 : 0;
                });
            }
        },

        /**
         * Array library functions
         * @type {Object}
         */
        object: {

            /**
             * Returns the object's keys.
             * @param {Object} o The object to operate on.
             * @returns {Array<String|Number>} The object's key set
             * @function
             */
            keys : function keys (o) {
                return Object.keys(o);
            },

            /**
             * Returns the 'size' or 'length' of an object.
             * <ul>
             *      <li> String   -> The string's length  </li>
             *      <li> Number   -> The number of digits </li>
             *      <li> Object   -> The number of keys   </li>
             *      <li> Array    -> The number of items  </li>
             *      <li> Function -> 1                    </li>
             * </ul>
             * @param {Object} o The object to operate on.
             * @returns {Number} The number of items within the object.
             * @function
             */
            size: function size (o) {
                switch(true) {
                    case typeof o === 'function':
                        return 1;

                    case typeof o === 'number':
                        return o.toString().length;

                    case o instanceof Array:
                    case typeof o === 'string':
                        return o.length;

                    case libs.object.isArguments(o) && o.indexOf('length') > -1:
                        return o.length - 1;

                    case typeof o === 'object':
                        return Object.keys(o).length;

                    default:
                        return o;
                }
            },

            /**
             * Determines if an object can be converted to a number.
             * @param {Object} o The object to operate on.
             * @returns {Boolean} True if the object is numeric, false otherwise.
             * @function
             */
            isNumeric: function isNumeric (o) {
                return !isNaN(parseFloat(o)) && isFinite(o);
            },

            /**
             * Converts an object to a number.
             * @param {Object} o The object to operate on.
             * @returns {Number} The object as a number.
             * @function
             */
            numeric: function numeric (o) {
                return parseFloat(o);
            },

            /**
             * Determines if an object has no keys, if an array has no items, or if a string === ''.
             * @param {Object} o The object to operate on.
             * @returns {Boolean} True if the object is 'empty', false otherwise.
             * @function
             */
            isEmpty: function isEmpty (o) {
                return libs.object.size(o) === 0;
            },

            /**
             * True if the object is an array, false otherwise.
             * @param {Object} o The object to operate on.
             * @return {Boolean} True if the object is an array, false otherwise.
             */
            isArray: function isArray (o) {
                return o instanceof Array;
            },

            /**
             * True if the object is an object and not an array, false otherwise.
             * @param {Object} o The object to operate on.
             * @return {Boolean} True if the object is an object and not an array, false otherwise.
             */
            isPureObject: function isPureObject (o) {
                return !(o instanceof Array) && typeof o === 'object';
            },

            /**
             * True if the object is a string, false otherwise.
             * @param {Object} o The object to operate on.
             * @return {Boolean} True if the object is a string, false otherwise.
             */
            isString: function isString (o) {
                return typeof o === 'string';
            },

            /**
             * True if the object is a boolean, false otherwise.
             * @param {Object} o The object to operate on.
             * @return {Boolean} True if the object is a boolean, false otherwise.
             */
            isBoolean: function isBoolean (o) {
                return typeof o === 'boolean';
            },

            /**
             * True if the object is a function, false otherwise.
             * @param {Object} o The object to operate on.
             * @return {Boolean} True if the object is a function, false otherwise.
             */
            isFunction: function isFunction (o) {
                return typeof o === 'function';
            },

            /**
             * True if the object is an arguments object, false otherwise.
             * @param {Object} o The object to operate on.
             * @return {Boolean} True if the object is an arguments object, false otherwise
             */
            isArguments: function isArguments (o) {
                return Object.prototype.toString.call(o) === '[object Arguments]';
            },

            /**
             * Convers an object to a number, if possible.
             * @param {Object} o The object to operate on.
             * @returns {Number} The object as a float or NaN.
             * @function
             */
            toNumber: function toNumber (o) {
                return libs.object.isNumeric(o) ? parseFloat(o) : NaN;
            },

            /**
             * Convers an object to an integer, if possible.
             * @param {Object} o The object to operate on.
             * @returns {Number} The object as an integer or NaN.
             * @function
             */
            toInteger: function toInteger (o) {
                return libs.object.isNumeric(o) ? parseInt(o, 10) : NaN;
            },

            /**
             * Creates a new array from the object. If it's a string, it will split the string by ''; if a number, it will
             * split the number into digits and return an array of digits.
             * @param {Object} o The object to operate on.
             * @returns {Array} A new array, created from the object.
             * @function
             */
            makeArray: function makeArray (o) {
                var arr = [];
                if(o instanceof Array) return o;
                libs.object.each(o, function (obj) { arr.push(obj); });
                return arr;
            },

            /**
             * Returns a random array item, random object property, random character in a string, or random digit in a number.
             * @param {Object} o The object to operate on.
             * @returns {*}
             * @function
             */
            random: function random (o) {
                if(typeof o === 'object') {
                    return o instanceof Array ?
                        o[Math.floor(Math.random() * o.length)] :
                        o[Object.keys(o)[Math.floor(Math.random() * Object.keys(o).length)]];
                }
                else if(typeof o === 'string' || typeof o === 'number') {
                    var val = o, negative = false;

                    if(o.length === 0) return '';
                    if(typeof o === 'number' && o < 0) {
                        negative = true;
                        val = Math.abs(val);
                    }

                    val = val.toString()[Math.floor(Math.random() * val.toString().length)];
                    if(typeof o === 'number') val = parseInt(val, 10);
                    return negative ? -val : val;
                }
                return o;
            },

            /**
             * Invokes the callback 'f' for each property the object contains. If this is called
             * on a number or function, the object will be cast to a string.<br><br>
             * The callback `f` will be invoked with the following arguments:
             * <ul>
             * 	<li>value     - The value of the current object being iterated over</li>
             * 	<li>key       - The key of the current object (if an object, the index if an array)</li>
             * 	<li>iteration - The current iteration (same as key if a string or array)</li>
             * 	<li>exit      - A function which will break the loop and return the values passed to it,
             * 					or a single value if only a single value is passed.</li>
             * </ul>
             * @function
             * @param {Object} o The object to operate on.
             * @param {Number=} [rangeA=0] The iteration start index
             * @param {Number=} [rangeB='length of the item'] The iteration end index
             * @param {Function} f The callback to invoke for each item within the object
             * @returns {*} The value passed to the exit parameter of the callback...
             */
            each: function each (o, rangeA, rangeB, f) {
                // Can't use last here.. would cause circular ref...
                f = undefined;
                for(var k = arguments.length - 1; k >= 0; k--) if(arguments[k] instanceof Function) f = arguments[k];

                var ret       = null,
                    broken    = false,
                    self      = o,
                    keys, property, value,

                    exit = function () {
                        var args = libs.object.toArray(arguments);
                        broken   = true;
                        ret      = args.length > 1 ? args : args[0];
                    };

                if(typeof self === 'number' || typeof self === 'function' || typeof self === 'boolean') self = o.toString();

                // Firefox does some funky stuff here...
                if(typeof o === 'function') self = self.replace(/(?:\r)?\n+/g, '').replace(/"use strict";|'use strict';/g, '');

                var isArgs = Object.prototype.toString.call(o) === '[object Arguments]', idx = -1;
                keys = Object.keys(self);
                idx  = keys.indexOf('length');

                if(isArgs && idx > -1) keys.splice(idx, 1);

                rangeA = parseInt(rangeA);
                rangeA = (isNaN(rangeA) || rangeA < 0 || !isFinite(rangeA)) ? 0 : rangeA;

                rangeB = parseInt(rangeB);
                rangeB = (isNaN(rangeB) || rangeB + 1 > keys.length || !isFinite(rangeB)) ? keys.length : rangeB + 1; // End range is inclusive...
                rangeB = rangeB < 0 ? 0 : rangeB;

                var i = 0;
                if(f instanceof Function) {
                    for(var n = rangeA; n < rangeB; n++) {
                        property = keys[n];
                        value    = (typeof o === 'number' && !isNaN(parseFloat(self[property]))) ? parseFloat(self[property]) : self[property];
                        f.call(o, value, property, n, exit, i++);
                        if(broken) break;
                    }
                }
                return ret;
            },

            /**
             * Invokes the callback 'f' for every property the object contains. If the callback returns false, the
             * loop is broken and false is returned; otherwise true is returned.
             * @param {Object} o The object to operate on.
             * @param {Function} f The callback to invoke for each item within the object
             * @returns {Boolean} True if none of the callback invocations returned false.
             * @function
             */
            every: function every (o, f) {
                f = f instanceof Function ? f : undefined;

                var self = o, keys, property, value;
                if(typeof self === 'number' || typeof self === 'function' || typeof self === 'boolean') self = o.toString();
                keys = Object.keys(self);

                var i = 0;
                if(f instanceof Function) {
                    for(var n = 0; n < keys.length; n++) {
                        property = keys[n];
                        value    = (typeof o === 'number' && !isNaN(parseFloat(self[property]))) ? parseFloat(self[property]) : self[property];
                        if(f.call(o, value, property, n, i++) === false) return false;
                    }
                }
                return true;
            },

            /**
             * Converts an object to an array. For strings, numbers, and functions this will
             * return a char array to their respective .toString() values
             * @param {Object} o The object to operate on.
             * @function
             * @return {Array<*>} The object, converted to an array.
             */
            toArray: function toArray (o) {
                if(o instanceof Array) return o;

                var arr = [];
                libs.object.each(o, function (val) { arr.push(val); });
                return arr;
            },

            /**
             * Returns the first n elements of an object. If the object is an array, and only one items is retrieved,
             * that item will be returned, rather than an array.
             * @param {Object} o The object to operate on.
             * @param {Number=} [n=1] The number of elements to return
             * @return {Array<*>} The first n elements of the array.
             */
            first: function first (o, n) {
                n = parseInt(n, 10);
                n = isNaN(n) || !isFinite(n) ? 1 : n;
                var v = null;

                if(typeof o !== 'object') {
                    v = o.toString().slice(0, n);
                }
                else if(o instanceof Array) {
                    v = o.slice(0, n);
                }
                else {
                    v = {};
                    libs.object.each(o, 0, n - 1, function (item, key) { v[key] = item; });
                    var keys = Object.keys(v);
                    return keys.length === 1 ? v[keys[0]] : v;
                }
                return v.length === 1 ? v[0] : v;
            },

            /**
             * Returns the last n elements of an object. If the object is an array, and only one items is retrieved,
             * that item will be returned, rather than an array.
             * @param {Object} o The object to operate on.
             * @param {Number=} [n=1] The number of elements to return
             * @return {Array<*>} The last n elements of the array.
             * @function
             */
            last: function last (o, n) {
                n = parseInt(n, 10);
                n = isNaN(n) || !isFinite(n) ? 1 : n;
                var v = null, keys, len, idx;

                if(libs.object.isArguments(o)) {
                    keys = Object.keys(o);
                    idx  = keys.indexOf('length');

                    if(idx > -1) keys.splice(idx, 1);
                    v = []; len = keys.length;
                    libs.object.each(keys, len - n, len, function (k) { v.push(o[k]); });
                }
                else if(typeof o !== 'object') {
                    v = o.toString().slice(-n);
                }
                else if(o instanceof Array) {
                    v = o.slice(-n);
                }
                else {
                    v   = {};
                    len = libs.object.size(o);

                    libs.object.each(o, len - n, len, function (item, key) { v[key] = item; });
                    keys = Object.keys(v);
                    return keys.length === 1 ? v[keys[0]] : v;
                }
                return v.length === 1 ? v[0] : v.length > 0 ? v : null;
            },

            /**
             * Find a child of an object using the given path, split by the given delimiter (or '.' by default)
             * @param {Object} o The object to operate on.
             * @param {String} path The path to the child object
             * @param {String=} [delimiter='.'] The path delimiter
             * @param {Function=} done A callback for completion
             * @return {*|Null} The child object at the given string path, or null if it doesn't exist.
             * @function
             */
            findChildAtPath: function findChildAtPath (o, path, delimiter, original, invoked, done) {
                done = libs.object.last(arguments) instanceof Function ? libs.object.last(arguments) : function () {};

                var self = o;

                original = (!(original instanceof Function) && original) ? original : self;
                invoked  = invoked || false;

                if(typeof o === 'object' && typeof path === 'string') {
                    delimiter = typeof delimiter === 'string' ? delimiter : '.';
                    path      = path.split(delimiter);

                    var p = path.shift();
                    if(p) {
                        return libs.object.each(o, function (o, k, i, exit) {
                            if(path.length === 0 && k === p) {
                                done.call(original, o, self, k);
                                invoked = true;
                                exit(o);
                            }
                            else {
                                var obj = libs.object.findChildAtPath(o, path.join(delimiter), delimiter, original, invoked, done);
                                if(obj !== null) exit(obj);
                            }
                        });
                    }
                }
                if(!invoked && original === self && done instanceof Function) done.call(original, null, self, null);
                return null;
            },

            /**
             * Produces a shallow clone of the object, that is, if JSON.stringify can handle it.<br>
             * The object must be non-circular.
             * @param {Object} o The object to operate on.
             * @return {*} A shallow clone of the object.
             * @function
             */
            clone: function clone (o) {
                if(typeof o === 'string' || typeof o === 'number') return o;

                try {
                    return JSON.parse(JSON.stringify(o));
                }
                catch (e) {
                    throw new Error('Unable to clone object: ' + e.message);
                }
            },

            /**
             * Filters an array or object using only the types allowed. That is, if the item in the array is of a type listed
             * in the arguments, then it will be added to the filtered array. In this case 'array' is a valid type.
             * @param {Object} o The object to operate on.
             * @param {...String} types A list of typeof types that are allowed in the array.
             * @return {Array<*>} An array filtered by only the allowed types.
             */
            only: function only (o, types) {
                types = libs.object.makeArray(arguments);
                types.shift();

                // Allows the 'plural' form of the type...
                libs.object.each(types, function (type, key) { this[key] = type.replace(/s$/, ''); });

                if(typeof o !== 'object') return o;
                var isArray  = o instanceof Array ? true : false,
                    filtered = isArray ? [] : {};

                libs.object.each(o, function (item, key) {
                    if(types.indexOf(typeof item) !== -1 || (item instanceof Array && types.indexOf('array') !== -1)) {
                        if(isArray) filtered.push(item); else filtered[key] = item;
                    }
                });
                return filtered;
            },

            /**
             * Filters an object using the given predicate function. For objects, a new object will be returned, with
             * the values that passed the predicate function. For strings, a new string will be returned with the characters
             * that passed the predicate function. For numbers, a new number will be returned with the digits that passed
             * the predicate function. Functions will be operated on as strings.
             * @param {Object} o The object to operate on.
             * @param {Function} predicate The function used to filter the object.
             * @return {*} The filtered object
             */
            where: function where (o, predicate) {
                if(!(predicate instanceof Function)) return o;

                var isObject = typeof o === 'object' && !(o instanceof Array) ? true : false,
                    filtered = !isObject ? [] : {};

                libs.object.each(o, function (item, key) {
                    if(predicate.call(item, item)) {
                        if(isObject) filtered[key] = item; else filtered.push(item);
                    }
                });

                if(typeof o !== 'object') filtered = filtered.join('');
                return filtered;
            },

            /**
             * Filters an object by keys using the given predicate function.
             * @param {Object} o The object to operate on.
             * @param {Function} predicate The function used to filter the object.
             * @return {*} The filtered object
             */
            whereKeys: function whereKeys (o, predicate) {
                if(!(predicate instanceof Function)) return o;

                var isObject = typeof o === 'object' && !(o instanceof Array) ? true : false,
                    filtered = !isObject ? [] : {};

                libs.object.each(o, function (item, key) {
                    if(predicate.call(key, key)) {
                        if(isObject) filtered[key] = item; else filtered.push(item);
                    }
                });

                if(typeof o !== 'object') filtered = filtered.join('');
                return filtered;
            },

            /**
             * For objects, inverts the objects keys/values. If the value isn't a number or array, it will be omitted.
             * For strings, it will reverse the string.
             * For number, it will compute the number's inverse (i.e. 1 / x).
             * @param {Object} o The object to operate on.
             * @return {*} The inverse, as described above.
             */
            invert: function invert (o) {
                if(typeof o === 'string') return libs.string.reverse(o);
                if(typeof o === 'number') return 1 / o;

                var obj = {};
                libs.object.each(o, function (item, key) {
                    if(typeof item === 'string' || typeof item === 'number') obj[item] = key;
                });

                return obj;
            },

            /**
             * Returns the maximum item in the object.
             * @param {Object} o The object to operate on.
             * @param {Function=} func If passed, the function will be invoked for each item in the object collection.
             * @return {*} The maximum item in the object collection.
             */
            max: function max (o, func) {
                if(!(func instanceof Function)) func = undefined;

                if(typeof o !== 'object') return o;
                var max, maxValue;

                if(!func) {
                    max = libs.object.first(o);
                    libs.object.each(o, 1, function (item) {
                        if(item >= max) max = item;
                    });
                }
                else {
                    max = libs.object.first(o);
                    maxValue = func.call(max, max);

                    libs.object.each(o, 1, function (item) {
                        if(func.call(item, item) >= maxValue) max = item;
                    });
                }
                return max;
            },

            /**
             * Returns the minimum item in the object.
             * @param {Object} o The object to operate on.
             * @param {Function=} func If passed, the function will be invoked for each item in the object collection.
             * @return {*} The minimum item in the object collection.
             */
            min: function min (o, func) {
                if(!(func instanceof Function)) func = undefined;

                if(typeof o !== 'object') return o;
                var min, minValue;

                if(!func) {
                    min = libs.object.first(o);
                    libs.object.each(o, 1, function (item) {
                        if(item <= min) min = item;
                    });
                }
                else {
                    min = libs.object.first(o);
                    minValue = func.call(min, min);

                    libs.object.each(o, 1, function (item) {
                        if(func.call(item, item) <= minValue) min = item;
                    });
                }
                return min;
            },

            /**
             * Tests whether or not the object has a method called 'method'.
             * @param {Object} o The object to operate on.
             * @param {String} method The name of the method to test existence for.
             * @return {Boolean} True if the object has a function called 'method', false otherwise.
             */
            implements: function _implements (o, method) {
                return o && o[method] instanceof Function;
            },

            /**
             * Same as Object.j.implements, excepct with a hasOwnProperty check.
             * @param {Object} o The object to operate on.
             * @param {String} method The name of the method to test existence for.
             * @return {Boolean} True if the object has its own function called 'method', false otherwise.
             */
            implementsOwn: function implementsOwn (o, method) {
                return o && o[method] instanceof Function && o.hasOwnProperty(method);
            }
        }
    };

    return libs;
}

(function () {
    'use strict';
    module.exports = libs;
}());