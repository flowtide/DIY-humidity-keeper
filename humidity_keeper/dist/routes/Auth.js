"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const Middleware_1 = require("../Middleware");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const UserDao_1 = tslib_1.__importDefault(require("@daos/User/UserDao"));
const Config_1 = require("../Config");
const debug_1 = tslib_1.__importDefault(require("debug"));
const debug = debug_1.default("humidity-keeper:user");
const router = express_1.Router();
const userDao = new UserDao_1.default();
function makeToken(user) {
    debug(`login userId=${user} API.authSecret=${Config_1.API.authSecret}`);
    return jsonwebtoken_1.default.sign(user, Config_1.API.authSecret, { expiresIn: '30 days' });
}
router.get('/current-user', Middleware_1.authenticate, (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return res.status(http_status_codes_1.OK).json({ data: req.user });
}));
router.post('/login', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { userId, password } = req.body;
    debug(`login userId=${userId} password=${password}`);
    try {
        const user = yield userDao.login(userId, password);
        if (user) {
            return res.status(http_status_codes_1.OK).json({ data: user, token: makeToken(user) });
        }
        else {
            return res.status(http_status_codes_1.OK).json({ error: { code: 400, message: 'authentication failed' } });
        }
    }
    catch (err) {
        debug('exception:', err);
        return res.status(http_status_codes_1.OK).json({ error: { code: 400, message: 'authentication failed' } });
    }
}));
router.post('/password', Middleware_1.authenticate, (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body;
    const user = req.user;
    debug(`password id=${user.id} password=${password}`);
    let result = yield userDao.password(user.id, password);
    if (result === null) {
        return res.status(http_status_codes_1.OK).json({ error: { code: 400, message: 'password not changed' } });
    }
    else {
        return res.status(http_status_codes_1.OK).json({ data: result });
    }
}));
exports.default = router;
