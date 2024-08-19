import { Polyanet, Soloon, Cometh } from '../entities'
import { EntityType } from '../Megaverse.types'

describe('Polyanet', () => {
    it('should create a Polyanet with correct properties', () => {
        const polyanet = new Polyanet({ emoji: '🪐' })
        expect(polyanet.type).toBe(EntityType.POLYANET)
        expect(polyanet.emoji).toBe('🪐')
    })

    it('should return an empty object for getAttributes', () => {
        const polyanet = new Polyanet({ emoji: '🪐' })
        expect(polyanet.getAttributes()).toEqual({})
    })

    it('should return the emoji for toString', () => {
        const polyanet = new Polyanet({ emoji: '🪐' })
        expect(polyanet.toString()).toBe('🪐')
    })
})

describe('Soloon', () => {
    it('should create a Soloon with correct properties', () => {
        const soloon = new Soloon({ color: 'blue', emoji: '🔵' })
        expect(soloon.type).toBe(EntityType.SOLOON)
        expect(soloon.color).toBe('blue')
        expect(soloon.emoji).toBe('🔵')
    })

    it('should return color in getAttributes', () => {
        const soloon = new Soloon({ color: 'red', emoji: '🔴' })
        expect(soloon.getAttributes()).toEqual({ color: 'red' })
    })

    it('should return the emoji for toString', () => {
        const soloon = new Soloon({ color: 'purple', emoji: '🟣' })
        expect(soloon.toString()).toBe('🟣')
    })
})

describe('Cometh', () => {
    it('should create a Cometh with correct properties', () => {
        const cometh = new Cometh({ direction: 'up', emoji: '👆' })
        expect(cometh.type).toBe(EntityType.COMETH)
        expect(cometh.direction).toBe('up')
        expect(cometh.emoji).toBe('👆')
    })

    it('should return direction in getAttributes', () => {
        const cometh = new Cometh({ direction: 'down', emoji: '👇' })
        expect(cometh.getAttributes()).toEqual({ direction: 'down' })
    })

    it('should return the emoji for toString', () => {
        const cometh = new Cometh({ direction: 'left', emoji: '👈' })
        expect(cometh.toString()).toBe('👈')
    })
})
