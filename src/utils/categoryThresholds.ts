export type CategoryKey = 'passe' | 'corrida' | 'recepcao' | 'defesa' 

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
        tier1: 10,  // 10+ passes tentados/completos/TDs
        tier2: { min: 5, max: 10 },  // 5-10 atividades
        tier3: 5  // menos de 5 atividades
    },
    corrida: {
        tier1: 8,  // 8+ corridas/jardas/TDs
        tier2: { min: 4, max: 8 },  // 4-8 atividades
        tier3: 4  // menos de 4 atividades
    },
    recepcao: {
        tier1: 8,  // 8+ recepções/alvos/TDs
        tier2: { min: 4, max: 8 },  // 4-8 atividades
        tier3: 4  // menos de 4 atividades
    },
    defesa: {
        tier1: 4,  // 4+ ações defensivas (flags retiradas, sacks, interceptações, etc.)
        tier2: { min: 2, max: 4 },  // 2-4 ações
        tier3: 2  // menos de 2 ações
    }
}

/**
 * Obtém o título para um tier específico dentro de uma categoria
 */
export const getTierTitle = (category: CategoryKey, tier: number): string => {
    // Define títulos personalizados por categoria se necessário
    const categoryLabels: Record<CategoryKey, string> = {
        'passe': 'PASSE',
        'corrida': 'CORRIDA',
        'recepcao': 'RECEPÇÃO',
        'defesa': 'DEFESA'
    };

    const categoryLabel = categoryLabels[category] || category.toUpperCase();
    
    switch (tier) {
        case 1:
            return `${categoryLabel} TIER 1`;
        case 2:
            return `${categoryLabel} TIER 2`;
        case 3:
            return `${categoryLabel} TIER 3`;
        default:
            return `${categoryLabel} TIER`;
    }
}

/**
 * Determina o tier de um jogador com base no seu valor estatístico e categoria
 */
export const getTierForValue = (value: number, category: CategoryKey): number => {
    const thresholds = CATEGORY_THRESHOLDS[effectiveCategory] || CATEGORY_THRESHOLDS.passe;

    if (value >= thresholds.tier1) return 1;
    if (value >= thresholds.tier2.min) return 2;
    return 3;
}

/**
 * Verifica se um valor está dentro do intervalo de um tier específico
 */
export const isInTierRange = (value: number, category: CategoryKey, tier: number): boolean => {
    const thresholds = CATEGORY_THRESHOLDS[effectiveCategory] || CATEGORY_THRESHOLDS.passe;

    switch (tier) {
        case 1:
            return value >= thresholds.tier1;
        case 2:
            return value >= thresholds.tier2.min && value < thresholds.tier1;
        case 3:
            return value < thresholds.tier2.min;
        default:
            return false;
    }
}