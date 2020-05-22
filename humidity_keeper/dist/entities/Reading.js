"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Reading {
    constructor(reading) {
        if (reading === null) {
            this.created = null;
            this.deviceId = '';
            this.temperature = -1;
            this.humidity = -1;
            this.battery = -1;
        }
        else {
            this.created = reading.created;
            this.deviceId = reading.deviceId;
            this.temperature = reading.temperature;
            this.humidity = reading.humidity;
            this.battery = reading.battery;
        }
    }
}
exports.default = Reading;
