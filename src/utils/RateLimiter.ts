export class RateLimiter {
    private tokens: number
    private lastRefill: number
    private refillRate: number
    private maxTokens: number

    constructor(tokensPerMinute: number) {
        this.tokens = tokensPerMinute
        this.lastRefill = Date.now()
        this.refillRate = tokensPerMinute / 60 // Convert to tokens per second
        this.maxTokens = tokensPerMinute
    }

    async removeTokens(count: number): Promise<void> {
        this.refill()
        if (this.tokens < count) {
            const waitTime = ((count - this.tokens) / this.refillRate) * 1000
            await new Promise((resolve) => setTimeout(resolve, waitTime))
            this.refill()
        }
        this.tokens -= count
    }

    private refill(): void {
        const now = Date.now()
        const timePassed = now - this.lastRefill
        this.tokens = Math.min(
            this.maxTokens,
            this.tokens + (timePassed / 60000) * this.maxTokens // Use maxTokens (tokens per minute) here
        )
        this.lastRefill = now
    }
}
