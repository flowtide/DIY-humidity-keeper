import { IUser } from '@entities/User'
import { knex } from '@daos/Instance'
import Debug from "debug"
const debug = Debug("humidity-keeper:users")
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

const saltRounds = 11

export interface IUserDao {
  getOne: (id: string) => Promise<IUser | null>
  getAll: () => Promise<IUser[]>
  add: (user: IUser) => Promise<void>
  update: (user: IUser) => Promise<void>
  delete: (id: string) => Promise<void>
  login: (userId: string, password: string) => Promise<IUser | null>
  password: (id: string, password: string) => Promise<IUser | null>
}

class UserDao implements IUserDao {


  /**
   * @param id
   */
  public async getOne(id: string): Promise<IUser | null> {
      let users = await knex.select().from('users').where('id', id)
      return users.length > 0 ? users.length[0] : null as any
  }


  /**
   *
   */
  public async getAll(): Promise<IUser[]> {
      let users = await knex.select().from('users')
      return users as any
  }

  /**
   *
   * @param user
   */
  public async add(user: IUser): Promise<void> {
      if (!user.id)
          user.id = uuidv4()
      if (user.password) {
          let salt = await bcrypt.genSalt(saltRounds)
          user.password = await bcrypt.hash(user.password, salt)
      }
      await knex('users').insert(user)
      return user as any
  }

  /**
   *
   * @param user
   */
  public async update(user: IUser): Promise<void> {
      let oldUser = await this.getOne(user.id)
      /*
      if (user.password && user.password != oldUser?.password) {
          let salt = await bcrypt.genSalt(saltRounds)
          user.password = await bcrypt.hash(user.password, salt)
      }
      */
      await knex('users').where('id', user.id).update(user)
      return {} as any
  }


  /**
   *
   * @param id
   */
  public async delete(id: string): Promise<void> {
    await knex('users').where('id',id).delete()
    return {} as any
  }

    
  /**
   * @param id
   */
  public async login(userId: string, password: string): Promise<IUser | null> {
    let users = await knex.select().from('users').where('userId', userId)
    if (users.length == 0) {
      debug(`user not found: userId=${userId}`)
      return null
    }
    let user = users[0]

    if (!password && !user.password) {
      debug(`login with no password: id=${userId}`)
      delete user.password
      return user
    } else {
      if (await bcrypt.compare(password, user.password)) {
        delete user.password
            return user
        }
        debug('password not matching:', userId, password)
      }
    return null
  }

  /**
   * @param id
   */
  public async password(id: string, password: string): Promise<IUser | null> {
    let users = await knex.select().from('users').where('id', id)
    if (users.length == 0) {
      debug(`user not found: id=${id}`)
      return null
    }

    let user = { id: id, password: ''}
    if (password) {
      let salt = await bcrypt.genSalt(saltRounds)
      password = await bcrypt.hash(password, salt)
    }

    user.password = password
    debug(`save password: id=${id} password=${password}`)
    return await knex('users').where('id', user.id).update(user)
  }

}

export default UserDao
