export type CategoryKey = 'passe' | 'corrida' | 'recepcao' | 'retorno' | 'defesa' | 'kicker' | 'punter'

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
    passe: {
        tier1: 40.9,
        tier2: { min: 30.6, max: 40.9 },
        tier3: 30.6
    },
    corrida: {
        tier1: 10.2,
        tier2: { min: 7.6, max: 10.2 },
        tier3: 7.6
    },
    recepcao: {
        tier1: 7.5,
        tier2: { min: 5.6, max: 7.5 },
        tier3: 5.6
    },
    retorno: {
        tier1: 2.9,
        tier2: { min: 2.1, max: 2.9 },
        tier3: 2.1
    },
    defesa: {
        tier1: 4.8,
        tier2: { min: 3.6, max: 4.8 },
        tier3: 3.6
    },
    kicker: {
        tier1: 1.8,
        tier2: { min: 1.3, max: 1.8 },
        tier3: 1.3
    },
    punter: {
        tier1: 5.0,
        tier2: { min: 3.75, max: 5.0 },
        tier3: 3.75
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