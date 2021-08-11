"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceSendPowerKey = exports.DeviceLightOnOff = exports.DeviceNeedLightOnOff = exports.DeviceLightStatus = exports.DeviceIsExist = exports.DeviceWrite = exports.DeviceClose = exports.DeviceOpen = exports.lightMap = exports.LightStatus = void 0;
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const debug = debug_1.default("humidity-keeper:serial-actuator");
const SerialActuator_1 = tslib_1.__importDefault(require("./SerialActuator"));
let actuators = {};
class LightStatus {
    constructor() {
        this.lightStatus = -1;
        this.updateTime = new Date();
    }
    UpdateLightStatus(isOn) {
        this.lightStatus = isOn ? 1 : 0;
        this.updateTime = new Date();
    }
    NeedToControl(isOn) {
        if (this.lightStatus == -1)
            return true;
        if ((this.lightStatus == 1) != isOn)
            return true;
        return false;
    }
}
exports.LightStatus = LightStatus;
exports.lightMap = {};
function DeviceOpen(portNumber, baudRate) {
    actuators[portNumber] = new SerialActuator_1.default(portNumber, baudRate);
    if (!(portNumber in exports.lightMap))
        exports.lightMap[portNumber] = new LightStatus();
}
exports.DeviceOpen = DeviceOpen;
function DeviceClose(portNumber) {
    actuators[portNumber].close();
    delete actuators[portNumber];
}
exports.DeviceClose = DeviceClose;
function DeviceWrite(portNumber, data) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!DeviceIsExist(portNumber))
            throw new Error(`Actuator port not opened: ${portNumber}`);
        let result = yield actuators[portNumber].write(data);
        debug('result:', result);
        return result;
    });
}
exports.DeviceWrite = DeviceWrite;
function DeviceIsExist(portNumber) {
    return portNumber in actuators;
}
exports.DeviceIsExist = DeviceIsExist;
function DeviceLightStatus(portNumber) {
    if (!DeviceIsExist(portNumber))
        throw new Error(`Actuator port not opened: ${portNumber}`);
    return exports.lightMap[portNumber].lightStatus;
}
exports.DeviceLightStatus = DeviceLightStatus;
function DeviceNeedLightOnOff(portNumber, isOn) {
    if (!DeviceIsExist(portNumber))
        throw new Error(`Actuator port not opened: ${portNumber}`);
    return exports.lightMap[portNumber].NeedToControl(isOn);
}
exports.DeviceNeedLightOnOff = DeviceNeedLightOnOff;
function DeviceLightOnOff(portNumber, isOn) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!DeviceIsExist(portNumber))
            throw new Error(`Actuator port not opened: ${portNumber}`);
        let data = isOn ? 'gpio.high 12\r' : 'gpio.low 12\r';
        let result = yield actuators[portNumber].write(data);
        exports.lightMap[portNumber].UpdateLightStatus(isOn);
        debug('result:', result);
        return result;
    });
}
exports.DeviceLightOnOff = DeviceLightOnOff;
function DeviceSendPowerKey(portNumber) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!DeviceIsExist(portNumber))
            throw new Error(`Actuator port not opened: ${portNumber}`);
        let data = 'ir.NEC 40FF00FF\r';
        let result = yield actuators[portNumber].write(data);
        debug('result:', result);
        return result;
    });
}
exports.DeviceSendPowerKey = DeviceSendPowerKey;
exports.default = {
    DeviceOpen,
    DeviceClose,
    DeviceWrite,
    DeviceIsExist,
    DeviceLightStatus,
    DeviceNeedLightOnOff,
    DeviceLightOnOff,
    DeviceSendPowerKey,
};
