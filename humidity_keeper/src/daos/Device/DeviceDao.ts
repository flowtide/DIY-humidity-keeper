import { IDevice } from '@entities/Device'
import { knex } from '@daos/Instance'
import Debug from "debug"
const debug = Debug("humidity-keeper:devices")
import { v4 as uuidv4 } from 'uuid'

export interface IDeviceDao {
    getOne: (id: string) => Promise<IDevice | null>
    findOne(columnName: string, columnValue: string): Promise<IDevice | null>
    getAll: () => Promise<IDevice[]>
    add: (device: IDevice) => Promise<void>
    update: (device: IDevice) => Promise<void>
    delete: (id: string) => Promise<void>
}

class DeviceDao implements IDeviceDao {


    /**
     * @param id
     */
    public async getOne(id: string): Promise<IDevice | null> {
        return this.findOne('id', id)
    }

    /**
     * @param id
     */
    public async findOne(columnName: string, columnValue: string): Promise<IDevice | null> {
        let devices = await knex.select().from('devices').where(columnName, columnValue)
        return devices.length > 0 ? devices[0] : null as any
    }

    /**
     *
     */
    public async getAll(): Promise<IDevice[]> {
        let devices = await knex.select().from('devices')
        return devices as any
    }


    /**
     *
     * @param device
     */
    public async add(device: IDevice): Promise<void> {
        if (!device.id)
            device.id = uuidv4()
        let devices = await knex('devices').insert(device)
        return device as any
    }


    /**
     *
     * @param device
     */
    public async update(device: IDevice): Promise<void> {
        await knex('devices').where('id', device.id).update(device)
        return {} as any
    }


    /**
     *
     * @param id
     */
    public async delete(id: string): Promise<void> {
        await knex('devices').where('id',id).delete()
        await knex('readings').where('deviceId',id).delete()
        return {} as any
    }
}

export default DeviceDao
