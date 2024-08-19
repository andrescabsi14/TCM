import 'dotenv/config'

import { Megaverse } from './Megaverse'
import { logger, logMegaverseState } from './utils/logger'
import data from './data.json'
import { TargetData } from './Megaverse.types'

async function main() {
    try {
        const megaverse = new Megaverse(process.env.CANDIDATE_ID!)
        await megaverse.initializeFromData(data as TargetData)

        // Log the current state of the Megaverse
        logMegaverseState(megaverse.getMap())

        // EXAMPLE:: Example of using Megaverse after initialization
        // await megaverse.setEntity(0, 0, new Polyanet())
        // await megaverse.destroyEntitiesByType(EntityType.POLYANET)
        // await megaverse.destroyMegaverse()
    } catch (error) {
        logger.error(
            `Application failed: ${error instanceof Error ? error.message : String(error)}`
        )
    }
}

main()
