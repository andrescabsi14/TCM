import {
    BaseEntityArgs,
    ComethArgs,
    EntityType,
    SoloonArgs,
} from './Megaverse.types'

export interface MegaverseEntity {
    type: EntityType
    getAttributes(): Record<string, any>
    toString(): string
}

export class Polyanet implements MegaverseEntity {
    public type: EntityType = EntityType.POLYANET
    public emoji: string

    constructor({ emoji }: BaseEntityArgs) {
        this.emoji = emoji
    }

    public getAttributes(): Record<string, string> {
        return {}
    }

    public toString(): string {
        return this.emoji
    }
}

export class Soloon implements MegaverseEntity {
    public type: EntityType = EntityType.SOLOON
    public color: string
    public emoji: string

    constructor({ color, emoji }: SoloonArgs) {
        this.color = color
        this.emoji = emoji
    }

    public getAttributes(): { color: string } {
        return { color: this.color }
    }

    public toString(): string {
        return this.emoji
    }
}

export class Cometh implements MegaverseEntity {
    public type: EntityType = EntityType.COMETH
    public direction: string
    public emoji: string

    constructor({ direction, emoji }: ComethArgs) {
        this.direction = direction
        this.emoji = emoji
    }

    public getAttributes(): { direction: string } {
        return { direction: this.direction }
    }

    public toString(): string {
        return this.emoji
    }
}
