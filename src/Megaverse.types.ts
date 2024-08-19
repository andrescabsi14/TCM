export enum EntityType {
    POLYANET = 'polyanets',
    SOLOON = 'soloons',
    COMETH = 'comeths',
}

export interface Entity {
    type: EntityType
}

export interface Polyanet extends Entity {
    type: EntityType.POLYANET
}

export interface Soloon extends Entity {
    type: EntityType.SOLOON
    color: 'red' | 'blue' | 'purple' | 'white'
}

export interface Cometh extends Entity {
    type: EntityType.COMETH
    direction: 'up' | 'down' | 'left' | 'right'
}

export interface BaseEntityArgs {
    emoji: string
}

export interface SoloonArgs extends BaseEntityArgs {
    color: string
}

export interface ComethArgs extends BaseEntityArgs {
    direction: string
}

export type MegaverseEntity = Polyanet | Soloon | Cometh

export enum RawEntityType {
    SPACE = 'SPACE',
    POLYANET = 'POLYANET',
    BLUE_SOLOON = 'BLUE_SOLOON',
    RED_SOLOON = 'RED_SOLOON',
    PURPLE_SOLOON = 'PURPLE_SOLOON',
    WHITE_SOLOON = 'WHITE_SOLOON',
    UP_COMETH = 'UP_COMETH',
    DOWN_COMETH = 'DOWN_COMETH',
    LEFT_COMETH = 'LEFT_COMETH',
    RIGHT_COMETH = 'RIGHT_COMETH',
}

export interface TargetData {
    goal: RawEntityType[][]
}
