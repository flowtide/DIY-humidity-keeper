import { IReading } from '@entities/Reading';
import { knex } from '@daos/Instance'
import Util from '@daos/Util'
import Debug from "debug"
const debug = Debug("humidity-keeper:readings")

export interface IReadingDao {
    getAll: (dateFrom: string, dateTo: string, limit: number, orderBy: string, orderByParam: string) => Promise<IReading[]>;
    add: (reading: IReading) => Promise<void>;
    deleteRange: (fromDate: string, toDate: string) => Promise<void>;
}

class ReadingDao implements IReadingDao {

    /**
     *
     */
    public async getAll(dateFrom: string, dateTo: string, limit: number, orderBy: string, orderByParam: string): Promise<IReading[]> {
        var from = Util.parseStartOfDate(dateFrom)
        var to = Util.parseEndOfDate(dateTo)
        let query = knex.select().from('readings')

        query = query.where('created', '>=', from).andWhere('created', '<=', to)
        // orderBy('name', 'desc')
        if (orderBy)
            query = query.orderBy(orderBy, orderByParam)

        if (limit > 0)
            query = query.limit(limit).offset(0)

        let readings = await query

        return readings as any;
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
