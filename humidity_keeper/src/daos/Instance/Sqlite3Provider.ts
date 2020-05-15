import Knex from 'knex'
import fs from 'fs'
import path from 'path'
import logger from '@shared/Logger'
import Debug from "debug"
const debug = Debug("humidity-keeper:daos")
import {Database} from '../../Config'
import { v4 as uuidv4 } from 'uuid'

/**
 * Initialize a new Sqlite3 provider
 */
export async function create () {
  // create DB folder in case of not exist
  debug(`sqlite3: filename=${Database.filename}`)
  var dbDir = path.dirname(Database.filename)
  fs.mkdirSync(dbDir, { recursive: true })

  const knex = Knex({
    client: 'sqlite3',
    connection: {
        filename: Database.filename
    },
    useNullAsDefault: true
  })

  try {
    // Verify the connection before proceeding
    //await knex.raw('SELECT date("now")')
    if (!(await knex.schema.hasTable('devices'))) {
      debug("table creating: 'devices'")
      await knex.schema.createTable('devices', (table) => {
        table.uuid('id').notNullable().primary()
        table.string('name').notNullable()          // product serial number
        table.string('desc')
        table.string('address')
        table.integer('signal').defaultTo(-1)
        table.integer('battery').defaultTo(-1)
        table.dateTime('registerAt')
        table.dateTime('updateAt')
      })
    }

    if (!(await knex.schema.hasTable('readings'))) {
      debug("table creating: 'readings'")
      await knex.schema.createTable('readings', (table) => {
        table.dateTime('created').notNullable()
        table.uuid('deviceId').notNullable()
        table.float('temperature')
        table.float('humidity')
        table.float('battery')
        table.unique(['created', 'deviceId'])
        table.foreign('deviceId').references('devices.id')
      })
    }

    if (!(await knex.schema.hasTable('users'))) {
      debug("table creating: 'users'")
      await knex.schema.createTable('users', (table) => {
        table.uuid('id').notNullable().primary()
        table.dateTime('created').notNullable()
        table.string('userId').notNullable()
        table.string('name').notNullable()
        table.string('email').defaultTo('')
        table.string('password').defaultTo('')
        table.boolean('isAdmin').defaultTo(false)
        table.unique(['userId'])
      })

      await knex('users').insert({ 
        id: uuidv4(),
        created: new Date(),
        userId: 'admin',
        name: 'System Admin',
        isAdmin: true,
        })
    }

    return knex
  } catch (error) {
    logger.error('DB connect error:', error)
    throw new Error(`Unable to connect to sqlite3 via Knex. ${error}`)
  }
}

export default {create}
