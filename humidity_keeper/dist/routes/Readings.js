"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const ReadingDao_1 = tslib_1.__importDefault(require("@daos/Reading/ReadingDao"));
const debug_1 = tslib_1.__importDefault(require("debug"));
const debug = debug_1.default("humidity-keeper:readings");
const router = express_1.Router();
const readingDao = new ReadingDao_1.default();
router.get('/all', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { dateFrom, dateTo, limit, orderBy, desc } = req.query;
    const orderByParam = Number(desc) ? 'DESC' : 'ASC';
    debug(`desc=${desc} orderByParam=${orderByParam}`);
    const readings = yield readingDao.getAll(dateFrom, dateTo, Number(limit), orderBy, orderByParam);
    return res.status(http_status_codes_1.OK).json({ data: readings });
}));
router.get('/recent-data', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { deviceId } = req.query;
    const reading = yield readingDao.getRecent(deviceId);
    return res.status(http_status_codes_1.OK).json({ data: reading });
}));
router.delete('/delete-range', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { fromDate, toDate } = req.query;
    const result = yield readingDao.deleteRange(fromDate, toDate);
    return res.status(http_status_codes_1.OK).json({ data: result });
}));
exports.default = router;
