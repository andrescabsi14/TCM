import axios from 'axios'
import { MegaverseEntity, Polyanet, Soloon, Cometh } from './entities'
import { logger } from './utils/logger'
import { EntityType, RawEntityType, TargetData } from './Megaverse.types'
import { RateLimiter } from './utils/RateLimiter'

export class Megaverse {
    private map: (MegaverseEntity | null)[][]
    private candidateId: string
    private rateLimiter: RateLimiter
    private gridSize: number

    constructor(candidateId: string) {
        this.candidateId = candidateId
        this.rateLimiter = new RateLimiter(Number(process.env.RATE_LIMIT) || 10)
        this.gridSize = parseInt(process.env.GRID_SIZE || '30', 10)

        this.map = Array(this.gridSize)
            .fill(null)
            .map(() => Array(this.gridSize).fill(null))
    }

    public getMap(): (MegaverseEntity | null)[][] {
        return this.map
    }

    public async setEntity(
        x: number,
        y: number,
        entity: MegaverseEntity
    ): Promise<void> {
        const valid = this.isValidPosition(x, y)
        console.log('VALID:', valid)
        console.log('ENTITY:', entity)
        console.log('X:', x)
        console.log('Y:', y)
        if (this.isValidPosition(x, y)) {
            try {
                await this.rateLimiter.removeTokens(1)
                await this.createEntityOnServer(x, y, entity)
                this.map[y][x] = entity
                logger.info(`Entity set at position (${x}, ${y})`)
            } catch (error) {
                this.handleError(error, `Failed to set entity at (${x}, ${y})`)
            }
        }
    }

    public async destroyEntity(x: number, y: number): Promise<void> {
        if (this.isValidPosition(x, y) && this.map[y][x]) {
            try {
                await this.rateLimiter.removeTokens(1)
                await this.deleteEntityFromServer(x, y, this.map[y][x]!)
                this.map[y][x] = null
                logger.info(`Entity destroyed at position (${x}, ${y})`)
            } catch (error) {
                this.handleError(
                    error,
                    `Failed to destroy entity at (${x}, ${y})`
                )
            }
        }
    }

    private getSoloonEmoji(color: string): string {
        switch (color) {
            case 'blue':
                return '🔵'
            case 'red':
                return '🔴'
            case 'purple':
                return '🟣'
            case 'white':
                return '⚪'
            default:
                return ''
        }
    }

    private getComethEmoji(direction: string): string {
        switch (direction) {
            case 'up':
                return '👆'
            case 'down':
                return '👇'
            case 'left':
                return '👈'
            case 'right':
                return '👉'
            default:
                return ''
        }
    }

    private async rateLimitedRequest(callback: () => Promise<any>) {
        await this.rateLimiter.removeTokens(1)
        return callback()
    }

    public async destroyMegaverse(): Promise<void> {
        try {
            // Destroy all Polyanets
            await this.destroyEntitiesByType(EntityType.POLYANET)

            // Destroy all Soloons of each color
            const soloonColors = ['blue', 'red', 'purple', 'white']
            for (const color of soloonColors) {
                await this.destroyEntitiesByType(EntityType.SOLOON, { color })
            }

            // Destroy all Comeths of each direction
            const comethDirections = ['up', 'down', 'left', 'right']
            for (const direction of comethDirections) {
                await this.destroyEntitiesByType(EntityType.COMETH, {
                    direction,
                })
            }

            logger.info('Megaverse destroyed')
        } catch (error) {
            this.handleError(error, 'Failed to destroy Megaverse')
        }
    }

    public async destroyEntitiesByType(
        entityType: EntityType,
        options: { color?: string; direction?: string } = {}
    ): Promise<void> {
        try {
            for (let y = 0; y < this.gridSize; y++) {
                for (let x = 0; x < this.gridSize; x++) {
                    let entity: MegaverseEntity | null = null

                    if (entityType === EntityType.SOLOON && options.color) {
                        entity = new Soloon({
                            color: options.color,
                            emoji: this.getSoloonEmoji(options.color),
                        })
                    } else if (
                        entityType === EntityType.COMETH &&
                        options.direction
                    ) {
                        entity = new Cometh({
                            direction: options.direction,
                            emoji: this.getComethEmoji(options.direction),
                        })
                    } else if (entityType === EntityType.POLYANET) {
                        entity = new Polyanet({ emoji: '🪐' })
                    }

                    if (entity) {
                        await this.rateLimiter.removeTokens(1)
                        await this.deleteEntityFromServer(x, y, entity)
                    }
                }
            }
            logger.info(`All entities of type ${entityType} destroyed`)
        } catch (error) {
            this.handleError(
                error,
                `Failed to destroy entities of type ${entityType}`
            )
        }
    }

    private async createEntityOnServer(
        x: number,
        y: number,
        entity: MegaverseEntity
    ): Promise<void> {
        const url = this.getEntityUrl(entity)
        const data = {
            row: y,
            column: x,
            ...entity.getAttributes(),
            candidateId: this.candidateId,
        }

        await axios.post(url, data)
    }

    private async deleteEntityFromServer(
        x: number,
        y: number,
        entity: MegaverseEntity
    ): Promise<void> {
        const url = this.getEntityUrl(entity)
        const data = {
            row: `${y}`,
            column: `${x}`,
            candidateId: this.candidateId,
        }

        await axios.delete(url, { data })
    }

    private getEntityUrl(entity: MegaverseEntity): string {
        return `${process.env.API_URL}/${entity.type.toString().toLowerCase()}`
    }

    private isValidPosition(x: number, y: number): boolean {
        return y >= 0 && y < this.gridSize && x >= 0 && x < this.gridSize
    }

    private handleError(error: unknown, message: string): void {
        if (error instanceof Error) {
            logger.error(`${message}: ${error.message}`)
        } else {
            logger.error(`${message}: ${String(error)}`)
        }
    }

    public async initializeFromData(targetData: TargetData): Promise<void> {
        try {
            const { goal } = targetData

            for (let y = 0; y < goal.length; y++) {
                for (let x = 0; x < goal[y].length; x++) {
                    const entity = this.createEntityFromType(goal[y][x])

                    if (entity) {
                        await this.setEntity(x, y, entity)
                    }
                }
            }

            logger.info('Megaverse initialized from target data')
        } catch (error) {
            this.handleError(
                error,
                'Failed to initialize Megaverse from target data'
            )
        }
    }

    private createEntityFromType(type: RawEntityType): MegaverseEntity | null {
        switch (type) {
            case RawEntityType.POLYANET:
                return new Polyanet({ emoji: '🪐' })
            case RawEntityType.BLUE_SOLOON:
                return new Soloon({ color: 'blue', emoji: '🔵' })
            case RawEntityType.RED_SOLOON:
                return new Soloon({ color: 'red', emoji: '🔴' })
            case RawEntityType.PURPLE_SOLOON:
                return new Soloon({ color: 'purple', emoji: '🟣' })
            case RawEntityType.WHITE_SOLOON:
                return new Soloon({ color: 'white', emoji: '⚪' })
            case RawEntityType.UP_COMETH:
                return new Cometh({ direction: 'up', emoji: '👆' })
            case RawEntityType.DOWN_COMETH:
                return new Cometh({ direction: 'down', emoji: '👇' })
            case RawEntityType.LEFT_COMETH:
                return new Cometh({ direction: 'left', emoji: '👈' })
            case RawEntityType.RIGHT_COMETH:
                return new Cometh({ direction: 'right', emoji: '👉' })
            default:
                return null
        }
    }
}
