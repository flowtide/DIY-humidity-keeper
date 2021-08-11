"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const control_1 = tslib_1.__importDefault(require("../control"));
const debug_1 = tslib_1.__importDefault(require("debug"));
const debug = debug_1.default("humidity-keeper:routes");
const router = express_1.Router();
router.post('/serial-write', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { message } = req.body;
    debug(`Device Write: ${message.address} -> ${message.text}`);
    var result = yield control_1.default.DeviceWrite(message.address, message.text);
    debug('result:', result);
    return res.status(http_status_codes_1.OK).json({ data: result });
}));
router.post('/light-onoff', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { message } = req.body;
    debug(`DeviceLightOnOff: ${message.address} -> ${message.isOn}`);
    var result = yield control_1.default.DeviceLightOnOff(message.address, message.isOn);
    debug('result:', result);
    return res.status(http_status_codes_1.OK).json({ data: result });
}));
router.get('/light-status', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { address } = req.query;
    debug('address:', address);
    var result = yield control_1.default.DeviceLightStatus(address);
    debug('result:', result);
    return res.status(http_status_codes_1.OK).json({ data: result });
}));
router.post('/send-power-key', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { message } = req.body;
    debug(`DeviceLightOnOff: ${message.address}`);
    var result = yield control_1.default.DeviceSendPowerKey(message.address);
    debug('result:', result);
    return res.status(http_status_codes_1.OK).json({ data: result });
}));
exports.default = router;
