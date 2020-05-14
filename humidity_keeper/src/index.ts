import './LoadEnv'; // Must be the first import
import app from '@server';
import logger from '@shared/Logger';
import {Database} from './Config'
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

    const port = Number(process.env.PORT || 3000);
    app.listen(port, () => {
        logger.info('Express server started on port: ' + port);
    })
}).catch((error) => {
    logger.error('app error:', error)    
})
