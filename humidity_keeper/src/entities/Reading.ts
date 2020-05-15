export interface IReading {
    created: Date | null
    deviceId: string
    temperature: number
    humidity: number
    battery: number
}

class Reading implements IReading {

    public created: Date | null
    public deviceId: string
    public temperature: number
    public humidity: number
    public battery: number

    constructor(reading: null | IReading) {
        if (reading === null) {
            this.created = null
            this.deviceId = ''
            this.temperature = -1
            this.humidity = -1
            this.battery = -1
        } else {
            this.created = reading.created
            this.deviceId = reading.deviceId
            this.temperature = reading.temperature
            this.humidity = reading.humidity
            this.battery = reading.battery
        }
    }
}

export default Reading;
