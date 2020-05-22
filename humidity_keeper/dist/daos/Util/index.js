"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nearestFutureMinutes = exports.nearestPastMinutes = exports.nearestMinutes = exports.parseEndOfDate = exports.parseStartOfDate = void 0;
const tslib_1 = require("tslib");
const moment_1 = tslib_1.__importDefault(require("moment"));
function parseStartOfDate(datePart) {
    if (datePart)
        return moment_1.default(datePart).startOf('day').unix() * 1000;
    else
        return 0;
}
exports.parseStartOfDate = parseStartOfDate;
var endOfDate = moment_1.default('2050-12-31').endOf('day').unix() * 1000;
function parseEndOfDate(datePart) {
    if (datePart)
        return moment_1.default(datePart).endOf('day').unix() * 1000;
    else
        return endOfDate;
}
exports.parseEndOfDate = parseEndOfDate;
function nearestMinutes(interval, someMoment) {
    const roundedMinutes = Math.round(someMoment.clone().minute() / interval) * interval;
    return someMoment.clone().minute(roundedMinutes).second(0);
}
exports.nearestMinutes = nearestMinutes;
function nearestPastMinutes(interval, someMoment) {
    const roundedMinutes = Math.floor(someMoment.minute() / interval) * interval;
    return someMoment.clone().minute(roundedMinutes).second(0);
}
exports.nearestPastMinutes = nearestPastMinutes;
function nearestFutureMinutes(interval, someMoment) {
    const roundedMinutes = Math.ceil(someMoment.minute() / interval) * interval;
    return someMoment.clone().minute(roundedMinutes).second(0);
}
exports.nearestFutureMinutes = nearestFutureMinutes;
exports.default = {
    parseStartOfDate,
    parseEndOfDate,
    nearestMinutes,
    nearestPastMinutes,
    nearestFutureMinutes,
};
