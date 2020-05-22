export interface IDevice {
    id: string
    name: string
    desc: string
    address: string
    type: number
    registerAt: Date | null
    updateAt: Date | null
}

class Device implements IDevice {

    public id: string
    public name: string
    public desc: string
    public address: string
    public type: number
    public registerAt: Date | null
    public updateAt: Date | null

    constructor(device: null | IDevice) {
        if (device === null) {
            this.id = ''
            this.name = ''
            this.address = ''
            this.desc = ''
            this.type = 0
            this.registerAt = null
            this.updateAt = null
        } else {
            this.id = device.id
            this.name = device.name
            this.address = device.address
            this.desc = device.desc
            this.type = device.type
            this.registerAt = device.registerAt
            this.updateAt = device.updateAt
        }
    }
}

export default Device;
