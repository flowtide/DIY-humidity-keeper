"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Instance_1 = require("@daos/Instance");
const Util_1 = tslib_1.__importDefault(require("@daos/Util"));
const debug_1 = tslib_1.__importDefault(require("debug"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const debug = debug_1.default("humidity-keeper:readings");
class ReadingDao {
    getAll(dateFrom, dateTo, limit, orderBy, orderByParam) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var from = Util_1.default.parseStartOfDate(dateFrom);
            var to = Util_1.default.parseEndOfDate(dateTo);
            let query = Instance_1.knex.select().from('readings');
            query = query.where('created', '>=', from).andWhere('created', '<=', to);
            if (orderBy) {
                query = query.orderBy(orderBy, orderByParam);
            }
            if (limit > 0)
                query = query.limit(limit).offset(0);
            let readings = yield query;
            return readings;
        });
    }
    getRecent(deviceId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var from = moment_1.default().subtract(1, 'days');
            let query = Instance_1.knex.select().from('readings');
            query = query.where('deviceId', '=', deviceId).andWhere('created', '>', from.toDate());
            query = query.orderBy('created', 'DESC').limit(1).offset(0);
            let readings = yield query;
            return readings.length > 0 ? readings[0] : null;
        });
    }
    add(reading) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let result = yield Instance_1.knex('readings').insert(reading);
            return result;
        });
    }
    deleteRange(fromDate, toDate) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
}
exports.default = ReadingDao;
