"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const Middleware_1 = require("../Middleware");
const router = express_1.Router();
router.get('/current-user', Middleware_1.authenticate, (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return res.status(http_status_codes_1.OK).json({ data: req.user });
}));
exports.default = router;
