"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const debug = debug_1.default("humidity-keeper:serial-actuator");
const serialport_1 = tslib_1.__importDefault(require("serialport"));
const parser_readline_1 = tslib_1.__importDefault(require("@serialport/parser-readline"));
const events_1 = tslib_1.__importDefault(require("events"));
let em = new events_1.default.EventEmitter();
function readAsync() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const promise = new Promise((resolve, reject) => {
            var timeoutTimer = setTimeout(() => {
                debug('Serial timeout');
                throw new Error('Serial Port Timeout');
            }, 1000);
            em.once('dataReady', (data) => {
                clearTimeout(timeoutTimer);
                debug('resolve:', data);
                resolve(data);
            });
        });
        return promise;
    });
}
class SerialActuator {
    constructor(devicePort, baudRate) {
        debug(`SerialPort open: port=${devicePort} baudRate=${baudRate}`);
        this.port = new serialport_1.default(devicePort, { baudRate: baudRate, dataBits: 8, stopBits: 1, parity: 'none' });
        this.parser = this.port.pipe(new parser_readline_1.default({ delimiter: '\r' }));
        debug('open ok');
        this.parser.on('data', (data) => {
            em.emit('dataReady', data);
        });
    }
    write(command) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            debug(`SerialPort write: ${command}`);
            this.port.write(command);
            return readAsync();
        });
    }
    close() {
        if (this.port.isOpen)
            this.port.close();
    }
}
exports.default = SerialActuator;
