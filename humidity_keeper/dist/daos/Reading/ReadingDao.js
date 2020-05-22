"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Instance_1 = require("@daos/Instance");
const Util_1 = tslib_1.__importDefault(require("@daos/Util"));
const debug_1 = tslib_1.__importDefault(require("debug"));
const debug = debug_1.default("humidity-keeper:readings");
class ReadingDao {
    getAll(dateFrom, dateTo, limit, orderBy, orderByParam) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var from = Util_1.default.parseStartOfDate(dateFrom);
            var to = Util_1.default.parseEndOfDate(dateTo);
            let query = Instance_1.knex.select().from('readings');
            query = query.where('created', '>=', from).andWhere('created', '<=', to);
            if (orderBy)
                query = query.orderBy(orderBy, orderByParam);
            if (limit > 0)
                query = query.limit(limit).offset(0);
            let readings = yield query;
            return readings;
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
