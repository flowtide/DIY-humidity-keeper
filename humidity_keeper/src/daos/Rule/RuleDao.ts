import { IRule } from '@entities/Rule'
import { knex } from '@daos/Instance'
import Debug from "debug"
const debug = Debug("humidity-keeper:rules")
import { v4 as uuidv4 } from 'uuid'

export interface IRuleDao {
    getOne: (id: string) => Promise<IRule | null>
    findOne(columnName: string, columnValue: string): Promise<IRule | null>
    getAll: () => Promise<IRule[]>
    add: (rule: IRule) => Promise<void>
    update: (rule: IRule) => Promise<void>
    delete: (id: string) => Promise<void>
}

class RuleDao implements IRuleDao {


    /**
     * @param id
     */
    public async getOne(id: string): Promise<IRule | null> {
        return this.findOne('id', id)
    }

    /**
     * @param id
     */
    public async findOne(columnName: string, columnValue: string): Promise<IRule | null> {
        let rules = await knex.select().from('rules').where(columnName, columnValue)
        return rules.length > 0 ? rules[0] : null as any
    }

    /**
     *
     */
    public async getAll(): Promise<IRule[]> {
        let rules = await knex.select().from('rules')
        return rules as any
    }


    /**
     *
     * @param rule
     */
    public async add(rule: IRule): Promise<void> {
        if (!rule.id)
            rule.id = uuidv4()
        let rules = await knex('rules').insert(rule)
        return rule as any
    }


    /**
     *
     * @param rule
     */
    public async update(rule: IRule): Promise<void> {
        await knex('rules').where('id', rule.id).update(rule)
        return {} as any
    }


    /**
     *
     * @param id
     */
    public async delete(id: string): Promise<void> {
        await knex('rules').where('id',id).delete()
        return {} as any
    }
}

export default RuleDao
