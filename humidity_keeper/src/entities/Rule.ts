export interface IRule {
    id: string
    name: string
    sensorId: string
    actuatorId: string
    humidityThreshold: number
    ctrlLight: boolean
    ctrlPower: boolean
    ctrlBegin: string
    ctrlEnd: string
    ctrlWeeks: string
    ctrlAt: Date | null
    }

    class Rule implements IRule {

    public id: string
    public name: string
    public sensorId: string
    public actuatorId: string
    public humidityThreshold: number
    public ctrlLight: boolean
    public ctrlPower: boolean
    public ctrlBegin: string
    public ctrlEnd: string
    public ctrlWeeks: string
    public ctrlAt: Date | null

    constructor(device: null | IRule) {
        if (device === null) {
            this.id = ''
            this.name = ''
            this.sensorId = ''
            this.actuatorId = ''
            this.ctrlLight = false
            this.humidityThreshold = -1
            this.ctrlPower = false
            this.ctrlBegin = ''
            this.ctrlEnd = ''
            this.ctrlWeeks = ''
            this.ctrlAt = null
        } else {
            this.id = device.id
            this.name = device.name
            this.sensorId = device.sensorId
            this.actuatorId = device.actuatorId
            this.ctrlLight = device.ctrlLight
            this.humidityThreshold = device.humidityThreshold
            this.ctrlPower = device.ctrlPower
            this.ctrlBegin = device.ctrlBegin
            this.ctrlEnd = device.ctrlEnd
            this.ctrlWeeks = device.ctrlWeeks
            this.ctrlAt = device.ctrlAt
        }
    }
}

export default Rule;
