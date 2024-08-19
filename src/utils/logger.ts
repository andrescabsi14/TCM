// src/utils/logger.ts

import winston from 'winston'
import path from 'path'
import { MegaverseEntity } from '../entities'
import { EntityType } from '../Megaverse.types'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const logsDirectory = path.join(__dirname, '../../logs')

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory)
}

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: path.join(logsDirectory, 'megaverse.log'),
        }),
        new winston.transports.File({
            filename: path.join(logsDirectory, 'error.log'),
            level: 'error',
        }),
    ],
})

// Method to log the current state of the Megaverse grid using emojis
export const logMegaverseState = (
    megaverse: (MegaverseEntity | null)[][]
): void => {
    const state: string[] = []

    for (let y = 0; y < megaverse.length; y++) {
        const row = megaverse[y]
            .map((entity) => {
                if (!entity) return '🌌'
                switch (entity.type) {
                    case EntityType.POLYANET:
                        return '🪐'
                    case EntityType.SOLOON:
                        switch (entity.getAttributes().color) {
                            case 'blue':
                                return '🔵'
                            case 'red':
                                return '🔴'
                            case 'purple':
                                return '🟣'
                            case 'white':
                                return '⚪'
                            default:
                                return
                        }
                    case EntityType.COMETH:
                        switch (entity.getAttributes().direction) {
                            case 'up':
                                return '👆'
                            case 'down':
                                return '👇'
                            case 'left':
                                return '👈'
                            case 'right':
                                return '👉'
                            default:
                                return
                        }
                    default:
                        break
                }
            })
            .join('')
        state.push(row)
    }

    logger.info('Megaverse State:\n' + state.join('\n'))
}
