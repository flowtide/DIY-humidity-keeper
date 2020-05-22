"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = exports.promise = void 0;
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const debug = debug_1.default("humidity-keeper:auth");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const Config_1 = require("./Config");
exports.promise = (middleware) => ((req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield middleware(req, res);
        if (result) {
            res.json(result);
        }
        else {
            next();
        }
    }
    catch (err) {
        next(err);
    }
}));
exports.authenticate = (req, res, next) => {
    let token = (req.headers['x-access-token'] || req.headers['authorization']);
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }
    if (token) {
        jsonwebtoken_1.default.verify(token, Config_1.API.authSecret, (err, decoded) => {
            if (err) {
                debug('verify error:', err);
                res.json({
                    error: {
                        code: 403,
                        message: 'Token is not valid'
                    }
                });
            }
            else {
                req.user = decoded;
                next();
            }
        });
    }
    else {
        debug('Auth token is not supplied');
        res.json({
            error: {
                code: 403,
                message: 'access forbidden'
            }
        });
    }
};
exports.default = { promise: exports.promise, authenticate: exports.authenticate };
