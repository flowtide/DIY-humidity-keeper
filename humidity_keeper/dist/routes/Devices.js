"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const DeviceDao_1 = tslib_1.__importDefault(require("@daos/Device/DeviceDao"));
const ReadingDao_1 = tslib_1.__importDefault(require("@daos/Reading/ReadingDao"));
const Reading_1 = tslib_1.__importDefault(require("@entities/Reading"));
const constants_1 = require("@shared/constants");
const control_1 = tslib_1.__importDefault(require("../control"));
const debug_1 = tslib_1.__importDefault(require("debug"));
const Logger_1 = tslib_1.__importDefault(require("@shared/Logger"));
const debug = debug_1.default("humidity-keeper:devices");
const router = express_1.Router();
const deviceDao = new DeviceDao_1.default();
const readingDao = new ReadingDao_1.default();
const serialBaudRate = 115200;
function openAllActuators() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const devices = yield deviceDao.getAll();
        for (let device of devices) {
            if (device.type == 1) {
                if (!control_1.default.DeviceIsExist(device.address)) {
                    debug(`<openAllActuators>: address=${device.address}`);
                    control_1.default.DeviceOpen(device.address, serialBaudRate);
                }
            }
        }
    });
}
setTimeout(openAllActuators, 2000);
router.get('/all', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const devices = yield deviceDao.getAll();
    return res.status(http_status_codes_1.OK).json({ data: devices });
}));
router.post('/add', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { device } = req.body;
    if (!device) {
        debug('device is empty');
        return res.status(http_status_codes_1.BAD_REQUEST).json({
            error: constants_1.paramMissingError,
        });
    }
    const addedDevice = yield deviceDao.add(device);
    if (device.type == 1) {
        debug(`actuator port open...: ${device.address}`);
        control_1.default.DeviceOpen(device.address, serialBaudRate);
    }
    return res.status(http_status_codes_1.CREATED).json({ data: addedDevice });
}));
router.put('/update', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { device } = req.body;
    if (!device) {
        return res.status(http_status_codes_1.BAD_REQUEST).json({
            error: constants_1.paramMissingError,
        });
    }
    const prevDevice = yield deviceDao.getOne(device.id);
    const result = yield deviceDao.update(device);
    if (device.type == 1 && (prevDevice === null || prevDevice === void 0 ? void 0 : prevDevice.address) != device.address) {
        debug(`actuator port changed: ${prevDevice === null || prevDevice === void 0 ? void 0 : prevDevice.address} -> ${device.address}`);
        control_1.default.DeviceClose(prevDevice === null || prevDevice === void 0 ? void 0 : prevDevice.address);
        control_1.default.DeviceOpen(device.address, serialBaudRate);
    }
    return res.status(http_status_codes_1.OK).json({ data: result });
}));
router.delete('/delete/:id', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield deviceDao.delete(id);
    return res.status(http_status_codes_1.OK).json({ data: result });
}));
router.get('/notify', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { mac, temperature, humidity, battery } = req.query;
    if (!mac || !temperature || !humidity || !battery) {
        Logger_1.default.warn(`[notify] insufficient param: mac=${mac} temperature=${temperature} humidity=${humidity} battery=${battery}`);
        return res.status(http_status_codes_1.BAD_REQUEST).json({
            error: constants_1.paramMissingError,
        });
    }
    const device = yield deviceDao.findOne('address', mac);
    if (!device) {
        let error = `'mac' address not registred: ${mac}`;
        Logger_1.default.warn(`[notify] can't update sensor data: ${error}`);
        return res.status(http_status_codes_1.BAD_REQUEST).json({
            error: error,
        });
    }
    const reading = new Reading_1.default(null);
    reading.created = new Date();
    reading.deviceId = device.id;
    reading.temperature = Number(temperature);
    reading.humidity = Number(humidity);
    reading.battery = Number(battery);
    const result = yield readingDao.add(reading);
    return res.status(http_status_codes_1.OK).json({ data: result });
}));
exports.default = router;
