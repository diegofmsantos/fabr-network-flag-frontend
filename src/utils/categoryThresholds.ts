export type CategoryKey = 'ataque' | 'defesa'

interface TierThreshold {
    min: number
    max: number
}

interface CategoryThreshold {
    tier1: number
    tier2: TierThreshold
    tier3: number
}

export const CATEGORY_THRESHOLDS: Record<CategoryKey, CategoryThreshold> = {
    ataque: {
        tier1: 10,  // 10+ atividades ofensivas (passes tentados, corridas, recepções)
        tier2: { min: 5, max: 10 },  // 5-10 atividades
        tier3: 5  // menos de 5 atividades
    },
    defesa: {
        tier1: 4,  // 4+ ações defensivas (flags retiradas, sacks, interceptações, etc.)
        tier2: { min: 2, max: 4 },  // 2-4 ações
        tier3: 2  // menos de 2 ações
    }
}

export const getTierTitle = (category: CategoryKey, tier: number): string => {
    const thresholds = CATEGORY_THRESHOLDS[category]
    if (!thresholds) return `Tier ${tier}`

    switch (tier) {
        case 1:
            return `Tier 1`
        case 2:
            return `Tier 2`
        case 3:
            return `Tier 3`
        default:
            return 'Tier'
    }
}

export const getTierForValue = (value: number, category: CategoryKey): number => {
    const thresholds = CATEGORY_THRESHOLDS[category]
    if (!thresholds) return 3

    if (value >= thresholds.tier1) return 1
    if (value >= thresholds.tier2.min) return 2
    return 3
}

export const isInTierRange = (value: number, category: CategoryKey, tier: number): boolean => {
    const thresholds = CATEGORY_THRESHOLDS[category]
    if (!thresholds) return false

    switch (tier) {
        case 1:
            return value >= thresholds.tier1
        case 2:
            return value >= thresholds.tier2.min && value < thresholds.tier1
        case 3:
            return value < thresholds.tier2.min
        default:
            return false
    }
}