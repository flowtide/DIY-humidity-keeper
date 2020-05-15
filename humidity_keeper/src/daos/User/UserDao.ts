import { IUser } from '@entities/User';
import { knex } from '@daos/Instance'
import Debug from "debug"
const debug = Debug("humidity-keeper:users")
import { v4 as uuidv4 } from 'uuid'

export interface IUserDao {
    getOne: (id: string) => Promise<IUser | null>;
    getAll: () => Promise<IUser[]>;
    add: (user: IUser) => Promise<void>;
    update: (user: IUser) => Promise<void>;
    delete: (id: string) => Promise<void>;
}

class UserDao implements IUserDao {


    /**
     * @param id
     */
    public async getOne(id: string): Promise<IUser | null> {
        let users = await knex.select().from('users').where('id', id)
        return users.length > 0 ? users.length[0] : null as any;
    }


    /**
     *
     */
    public async getAll(): Promise<IUser[]> {
        let users = await knex.select().from('users')
        return users as any;
    }


    /**
     *
     * @param user
     */
    public async add(user: IUser): Promise<void> {
        if (!user.id)
            user.id = uuidv4()
        await knex('users').insert(user)
        return user as any;
    }


    /**
     *
     * @param user
     */
    public async update(user: IUser): Promise<void> {
        await knex('users').where('id', user.id).update(user)
        return {} as any;
    }


    /**
     *
     * @param id
     */
    public async delete(id: string): Promise<void> {
        await knex('users').where('id',id).delete()
        return {} as any;
    }
}

export default UserDao;
