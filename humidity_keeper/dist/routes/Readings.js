"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const ReadingDao_1 = tslib_1.__importDefault(require("@daos/Reading/ReadingDao"));
const router = express_1.Router();
const readingDao = new ReadingDao_1.default();
router.get('/all', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { dateFrom, dateTo, limit, orderBy, desc } = req.query;
    const readings = yield readingDao.getAll(dateFrom.toString(), dateTo.toString(), Number(limit), orderBy.toString(), desc ? 'DESC' : 'ASC');
    return res.status(http_status_codes_1.OK).json({ data: readings });
}));
router.delete('/delete-range', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { fromDate, toDate } = req.query;
    const result = yield readingDao.deleteRange(fromDate.toString(), toDate.toString());
    return res.status(http_status_codes_1.OK).json({ data: result });
}));
exports.default = router;
