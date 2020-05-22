"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const UserDao_1 = tslib_1.__importDefault(require("@daos/User/UserDao"));
const constants_1 = require("@shared/constants");
const router = express_1.Router();
const userDao = new UserDao_1.default();
router.get('/all', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const users = yield userDao.getAll();
    return res.status(http_status_codes_1.OK).json({ data: users });
}));
router.get('/get/:id', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield userDao.getOne(id);
    return res.status(http_status_codes_1.OK).json({ data: user });
}));
router.post('/add', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { user } = req.body;
    if (!user) {
        return res.status(http_status_codes_1.BAD_REQUEST).json({
            error: constants_1.paramMissingError,
        });
    }
    const newUser = yield userDao.add(user);
    return res.status(http_status_codes_1.CREATED).json({ data: newUser });
}));
router.put('/update', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { user } = req.body;
    if (!user) {
        return res.status(http_status_codes_1.BAD_REQUEST).json({
            error: constants_1.paramMissingError,
        });
    }
    const result = yield userDao.update(user);
    return res.status(http_status_codes_1.OK).json({ data: result });
}));
router.delete('/delete/:id', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield userDao.delete(id);
    return res.status(http_status_codes_1.OK).json({ data: result });
}));
exports.default = router;
