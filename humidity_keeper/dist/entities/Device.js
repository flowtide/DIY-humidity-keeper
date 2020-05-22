"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Device {
    constructor(device) {
        if (device === null) {
            this.id = '';
            this.name = '';
            this.address = '';
            this.desc = '';
            this.type = 0;
            this.registerAt = null;
            this.updateAt = null;
        }
        else {
            this.id = device.id;
            this.name = device.name;
            this.address = device.address;
            this.desc = device.desc;
            this.type = device.type;
            this.registerAt = device.registerAt;
            this.updateAt = device.updateAt;
        }
    }
}
exports.default = Device;
