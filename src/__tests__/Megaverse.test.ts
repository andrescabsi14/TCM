import { Megaverse } from '../Megaverse'
import { Polyanet, Soloon, Cometh } from '../entities'
import { EntityType, RawEntityType, TargetData } from '../Megaverse.types'
import axios from 'axios'

jest.mock('axios')
jest.mock('../utils/logger')

describe('Megaverse', () => {
    let megaverse: Megaverse

    beforeEach(() => {
        process.env.CANDIDATE_ID = 'e8d9953f-cb5a-45bf-8262-05aaf38a2ba5'
        process.env.RATE_LIMIT = '10'
        process.env.GRID_SIZE = '30'
        process.env.API_URL = 'https://challenge.crossmint.io/api'
        megaverse = new Megaverse(process.env.CANDIDATE_ID)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should initialize with correct properties', () => {
        expect(megaverse['candidateId']).toBe('test-candidate-id')
        expect(megaverse['gridSize']).toBe(30)
        expect(megaverse['map'].length).toBe(30)
        expect(megaverse['map'][0].length).toBe(30)
    })

    it('should set an entity at a valid position', async () => {
        const polyanet = new Polyanet({ emoji: '🪐' })
        await megaverse.setEntity(0, 0, polyanet)
        expect(megaverse.getMap()[0][0]).toBe(polyanet)
    })

    it('should not set an entity at an invalid position', async () => {
        const polyanet = new Polyanet({ emoji: '🪐' })
        await megaverse.setEntity(-1, -1, polyanet)
        expect(megaverse.getMap()[0][0]).toBeNull()
    })

    it('should destroy an entity at a valid position', async () => {
        const polyanet = new Polyanet({ emoji: '🪐' })
        await megaverse.setEntity(0, 0, polyanet)
        await megaverse.destroyEntity(0, 0)
        expect(megaverse.getMap()[0][0]).toBeNull()
    })

    it('should initialize from target data', async () => {
        const targetData: TargetData = {
            goal: [
                [RawEntityType.POLYANET, RawEntityType.SPACE],
                [RawEntityType.BLUE_SOLOON, RawEntityType.UP_COMETH],
            ],
        }
        await megaverse.initializeFromData(targetData)
        const map = megaverse.getMap()
        expect(map[0][0]).toBeInstanceOf(Polyanet)
        expect(map[0][1]).toBeNull()
        expect(map[1][0]).toBeInstanceOf(Soloon)
        expect(map[1][1]).toBeInstanceOf(Cometh)
    })

    it('should destroy entities by type', async () => {
        const polyanet = new Polyanet({ emoji: '🪐' })
        const soloon = new Soloon({ color: 'blue', emoji: '🔵' })
        await megaverse.setEntity(0, 0, polyanet)
        await megaverse.setEntity(1, 1, soloon)
        await megaverse.destroyEntitiesByType(EntityType.POLYANET)
        expect(megaverse.getMap()[0][0]).toBeNull()
        expect(megaverse.getMap()[1][1]).toBeInstanceOf(Soloon)
    })

    it('should destroy the entire megaverse', async () => {
        const polyanet = new Polyanet({ emoji: '🪐' })
        const soloon = new Soloon({ color: 'blue', emoji: '🔵' })
        const cometh = new Cometh({ direction: 'up', emoji: '👆' })
        await megaverse.setEntity(0, 0, polyanet)
        await megaverse.setEntity(1, 1, soloon)
        await megaverse.setEntity(2, 2, cometh)
        await megaverse.destroyMegaverse()
        const map = megaverse.getMap()
        expect(map[0][0]).toBeNull()
        expect(map[1][1]).toBeNull()
        expect(map[2][2]).toBeNull()
    })
})
