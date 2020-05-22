import './LoadEnv'; // Must be the first import
import app from '@server';
import logger from '@shared/Logger';
import {Database, Server} from './Config'
import {openDatabase} from '@daos/Instance'
import Debug from "debug";
const debug = Debug("humidity-keeper:index");

export async function connectDatabase () {
    debug(`connect database: ${Database.driver}`)
    const knexInstance = await openDatabase(Database.driver)
    return knexInstance
}


var dbHandle = connectDatabase()

dbHandle.then((knexInstance) => {
    // Start the server
    knexInstance.count().from('users').then((numUsers) => {
        debug('DB ACCESS CHECKING: numUsers=', numUsers)
    })

    app.listen(Server.port, () => {
        logger.info(`Web server started on port: ${Server.port}`);
    })
}).catch((error) => {
    logger.error('app error:', error)    
})
