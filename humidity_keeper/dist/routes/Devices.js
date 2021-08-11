"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const DeviceDao_1 = tslib_1.__importDefault(require("@daos/Device/DeviceDao"));
const ReadingDao_1 = tslib_1.__importDefault(require("@daos/Reading/ReadingDao"));
const RuleDao_1 = tslib_1.__importDefault(require("@daos/Rule/RuleDao"));
const Reading_1 = tslib_1.__importDefault(require("@entities/Reading"));
const constants_1 = require("@shared/constants");
const control_1 = tslib_1.__importDefault(require("../control"));
const debug_1 = tslib_1.__importDefault(require("debug"));
const Logger_1 = tslib_1.__importDefault(require("@shared/Logger"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const debug = debug_1.default("humidity-keeper:devices");
const router = express_1.Router();
const deviceDao = new DeviceDao_1.default();
const readingDao = new ReadingDao_1.default();
const ruleDao = new RuleDao_1.default();
const serialBaudRate = 9600;
const Alarm_Off = 0;
const Alarm_LowOn = 1;
const Alarm_HighOn = 2;
const alarmMap = new Map();
function getAlarmStatus(ruleId) {
    let status = alarmMap.get(ruleId);
    return status === undefined ? Alarm_Off : status;
}
function setAlarmStatus(ruleId, status) {
    alarmMap.set(ruleId, status);
}
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
function isLightCtrlActive(rule) {
    let now = moment_1.default();
    let dayOfWeek = now.day();
    if (rule.ctrlWeeks.indexOf(dayOfWeek + '') < 0) {
        debug(`${dayOfWeek} not in ctrlWeeks`);
        return false;
    }
    let hhmmss = now.format("HH:mm:ss");
    if (hhmmss < '09:00:00' || hhmmss > '18:00:00') {
        debug(`${hhmmss} not between working time`);
        return false;
    }
    return true;
}
function isPowerCtrlActive(rule) {
    let now = moment_1.default();
    let dayOfWeek = now.day();
    if (rule.ctrlWeeks.indexOf(dayOfWeek + '') < 0) {
        debug(`${dayOfWeek} not in ctrlWeeks`);
        return false;
    }
    let hhmmss = now.format("HH:mm:ss");
    if (hhmmss < rule.ctrlBegin || hhmmss > rule.ctrlEnd) {
        debug(`${hhmmss} not between ctrlBegin and ctrlEnd`);
        return false;
    }
    return true;
}
function controlLight(deviceAddr, isOn) {
    if (control_1.default.DeviceNeedLightOnOff(deviceAddr, isOn)) {
        control_1.default.DeviceLightOnOff(deviceAddr, isOn);
        return true;
    }
    return false;
}
function checkRules(reading, device) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const rule = yield ruleDao.findOne('sensorId', device.id);
        if (!rule) {
            debug(`Rule not found: sensorId=${device.id}`);
            return;
        }
        const actuatorDevice = yield deviceDao.findOne('id', rule.actuatorId);
        if (!actuatorDevice) {
            debug(`Rule not found: actuatorId=${rule.actuatorId}`);
            return;
        }
        if (rule.ctrlLight) {
            let alarmStatus = getAlarmStatus(rule.id);
            if (!isLightCtrlActive(rule)) {
                if (alarmStatus != Alarm_Off) {
                    console.log(`rule=${rule.name} -> alarm OFF in inactive period`);
                    controlLight(actuatorDevice.address, false);
                    setAlarmStatus(rule.id, Alarm_Off);
                }
                debug(`Light Ctrl not activated: sensorId=${device.id}`);
            }
            else if (alarmStatus == Alarm_LowOn) {
                if (reading.humidity > rule.humidityThreshold + 3) {
                    debug(`lightOff humidity=${reading.humidity} lowThreshold=${rule.humidityThreshold}`);
                    if (controlLight(actuatorDevice.address, false)) {
                        setAlarmStatus(rule.id, Alarm_Off);
                    }
                }
            }
            else if (alarmStatus == Alarm_HighOn) {
                if (reading.humidity < rule.humidityHighThreshold - 3) {
                    debug(`lightOff humidity=${reading.humidity} highThreshold=${rule.humidityHighThreshold}`);
                    if (controlLight(actuatorDevice.address, false)) {
                        setAlarmStatus(rule.id, Alarm_Off);
                    }
                }
            }
            else {
                if (reading.humidity < rule.humidityThreshold) {
                    debug(`lightOn humidity=${reading.humidity} lowThreshold=${rule.humidityThreshold}`);
                    if (controlLight(actuatorDevice.address, true)) {
                        setAlarmStatus(rule.id, Alarm_LowOn);
                    }
                }
                else if (reading.humidity > rule.humidityHighThreshold) {
                    debug(`lightOn humidity=${reading.humidity} highThreshold=${rule.humidityHighThreshold}`);
                    if (controlLight(actuatorDevice.address, true)) {
                        setAlarmStatus(rule.id, Alarm_HighOn);
                    }
                }
            }
        }
        if (rule.ctrlPower) {
            if (!isPowerCtrlActive(rule)) {
                debug(`Power Ctrl not activated: sensorId=${device.id}`);
            }
            else {
                if (reading.humidity > rule.humidityThreshold) {
                }
                else {
                    let checkMoment = moment_1.default().subtract(20, 'hours');
                    let ctrlAt = moment_1.default(rule.ctrlAt);
                    if (!ctrlAt.isValid() || checkMoment.isAfter(ctrlAt)) {
                        debug(`DeviceSendPowerKey ${ctrlAt.format()}`);
                        control_1.default.DeviceSendPowerKey(actuatorDevice.address);
                        rule.ctrlAt = new Date();
                        ruleDao.update(rule);
                    }
                    else {
                    }
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
        if (prevDevice === null || prevDevice === void 0 ? void 0 : prevDevice.address) {
            if (control_1.default.DeviceIsExist(prevDevice === null || prevDevice === void 0 ? void 0 : prevDevice.address))
                control_1.default.DeviceClose(prevDevice === null || prevDevice === void 0 ? void 0 : prevDevice.address);
        }
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
    checkRules(reading, device);
    return res.status(http_status_codes_1.OK).json({ data: result });
}));
exports.default = router;
