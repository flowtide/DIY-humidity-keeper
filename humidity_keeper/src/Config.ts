import parseDbUrl from 'parse-database-url'
import dotenv from 'dotenv'

dotenv.config()

/*
  * parse-database-url usage:
  parseDbUrl('sqlite3://./db.sqlite3') ==> 
  driver: 'sqlite3',
  user: 'api-user',
  password: 'api-user-password',
  filename: './db.sqlite3'
*/
export namespace Database {
  export const schema = 'api'
  export const url = process.env.DATABASE_URL || 'sqlite3://db.sqlite3'
  export const config = parseDbUrl(url)
  export const {driver, user, password, hostname, host, port, database, filename} = config
  export const poolMin = Number(process.env.DATABASE_POOL_MIN || '0')
  export const poolMax = Number(process.env.DATABASE_POOL_MAX || '10')
  export const poolIdle = Number(process.env.DATABASE_POOL_IDLE || '10000')
}

export namespace Server {
  export const port = Number(process.env.PORT || '8000')
  export const bodyLimit = '100kb'
  export const corsHeaders = ['Link']
  export const isDev = process.env.NODE_ENV === 'development'
}

export namespace API {
  export const authSecret : string = process.env.AUTH_SECRET || "My.Secret.1234"
}

export namespace Knex {
  export const config = {
    client: Database.driver,
    connection: {
      host: process.env.DATABASE_HOSTNAME || Database.host,
      database: process.env.DATABASE_NAME || Database.database,
      user: process.env.DATABASE_USERNAME || Database.user,
      password: process.env.DATABASE_PASSWORD || Database.password,
      port: process.env.DATABASE_PORT || Database.port,
    },
    pool: {
      min: process.env.DATABASE_POOL_MIN,
      max: process.env.DATABASE_POOL_MAX,
      idle: process.env.DATABASE_POOL_IDLE,
    },
    migrations: {
      tableName: 'KnexMigrations',
    },
  }
}

export default {Database, Server, API, Knex}
