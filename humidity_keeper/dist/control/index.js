"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceIsExist = exports.DeviceWrite = exports.DeviceClose = exports.DeviceOpen = void 0;
const tslib_1 = require("tslib");
const SerialActuator_1 = tslib_1.__importDefault(require("./SerialActuator"));
let actuators = {};
function DeviceOpen(portNumber, baudRate) {
    actuators[portNumber] = new SerialActuator_1.default(portNumber, baudRate);
}
exports.DeviceOpen = DeviceOpen;
function DeviceClose(portNumber) {
    actuators[portNumber].close();
    delete actuators[portNumber];
}
exports.DeviceClose = DeviceClose;
function DeviceWrite(portNumber, data, crlf) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!DeviceIsExist(portNumber))
            throw new Error(`Actuator port not opened: ${portNumber}`);
        if (crlf)
            data += '\r';
        let result = actuators[portNumber].write(data);
        return result;
    });
}
exports.DeviceWrite = DeviceWrite;
function DeviceIsExist(portNumber) {
    return portNumber in actuators;
}
exports.DeviceIsExist = DeviceIsExist;
exports.default = {
    DeviceOpen,
    DeviceClose,
    DeviceWrite,
    DeviceIsExist,
};
