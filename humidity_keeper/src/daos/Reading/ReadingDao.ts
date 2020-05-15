import { IReading } from '@entities/Reading';
import { knex } from '@daos/Instance'
import Debug from "debug"
const debug = Debug("humidity-keeper:readings")

export interface IReadingDao {
    getAll: () => Promise<IReading[]>;
    add: (reading: IReading) => Promise<void>;
    putSensorValues: (mac: string, temperature: number, humidity: number, battery: number) => Promise<boolean>
    deleteRange: (fromDate: string, toDate: string) => Promise<void>;
}

class ReadingDao implements IReadingDao {

    /**
     *
     */
    public async getAll(): Promise<IReading[]> {
        let readings = await knex.select().from('readings')
        return readings as any;
    }

    /**
     *
     * @param reading
     */
    public async putSensorValues(mac: string, temperature: number, humidity: number, battery: number): Promise<boolean> {

        return true
    }


    /**
     *
     * @param reading
     */
    public async add(reading: IReading): Promise<void> {
        let result = await knex('readings').insert(reading)
        return result as any;
    }


    /**
     *
     * @param id
     */
    public async deleteRange(fromDate: string, toDate: string): Promise<void> {
        // TODO: delete reading
        //await knex('readings').where('id',id).delete()
        return {} as any;
    }
}

export default ReadingDao;
