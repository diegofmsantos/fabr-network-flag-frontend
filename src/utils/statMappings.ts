import { Jogador } from '@/types/jogador'
import { CategoryKey, CATEGORY_THRESHOLDS, getTierForValue } from './categoryThresholds'
import { StatKey } from '@/components/Ranking/RankingGroup'

export interface StatConfig {
    key: string
    title: string
    category: CategoryKey
    isCalculated?: boolean
}

export interface StatResult {
    value: number | null
    tier: number
}

/**
 * Função para verificar requisitos mínimos por categoria
 */
const checkCategoryMinimum = (category: CategoryKey, stats: any): boolean => {
    const thresholds = CATEGORY_THRESHOLDS[category];
    if (!thresholds) return true; // Se não houver threshold, permitir

    switch (category) {
        case 'passe':
            return stats && (stats.passes_tentados > 0 || stats.passes_completos > 0 || stats.tds_passe > 0);
        case 'corrida':
            return stats && (stats.corridas > 0 || stats.jds_corridas > 0 || stats.tds_corridos > 0);
        case 'recepcao':
            return stats && (stats.recepcoes > 0 || stats.alvos > 0 || stats.tds_recepcao > 0);
        case 'defesa':
            return stats && (
                stats.tck > 0 || stats.tip > 0 || stats.int > 0 || stats.sacks > 0 ||
                stats.flag_retirada > 0 || stats.flag_perdida > 0 || stats.pressao > 0 ||
                stats.tds_defesa > 0
            );
        default:
            return true;
    }
}

/**
 * Função para calcular estatísticas derivadas
 */
const calculateDerivedStat = (stats: any, key: string): number | null => {
    switch (key) {
        case 'passes_percentual':
            return stats.passes_tentados > 0
                ? (stats.passes_completos / stats.passes_tentados) * 100
                : null
        case 'jds_corridas_media':
            return stats.corridas > 0
                ? stats.jds_corridas / stats.corridas
                : null
        case 'jds_recepcao_media':
            return stats.recepcoes > 0
                ? stats.jds_recepcao / stats.recepcoes
                : null
        default:
            return null
    }
}

/**
 * Função principal de cálculo
 */
export const calculateStatValue = (player: Jogador, mapping: StatConfig): StatResult => {
    try {
        if (!player.estatisticas) {
            return { value: null, tier: 3 }
        }

        const category = mapping.category
        const stats = player.estatisticas[category]

        if (!stats || !checkCategoryMinimum(category, stats)) {
            return { value: null, tier: 3 }
        }

        let value: number | null

        if (mapping.isCalculated) {
            value = calculateDerivedStat(stats, mapping.key)
        } else {
            value = stats[mapping.key as keyof typeof stats] as number
        }

        if (value === null || value === undefined) {
            return { value: null, tier: 3 }
        }

        const tier = getTierForValue(value, category)

        return { value, tier }
    } catch (error) {
        console.error('Error calculating stat value:', error)
        return { value: null, tier: 3 }
    }
}

/**
 * Função para formatar valores de estatística
 */
export const formatStatValue = (statResult: StatResult, stat: StatConfig): string => {
    if (statResult.value === null) return 'N/A'

    if (stat.isCalculated) {
        if (stat.key.includes('percentual')) {
            return `${Math.round(statResult.value)}%`
        }
        if (stat.key.includes('media')) {
            return statResult.value.toFixed(1)
        }
        return statResult.value.toFixed(1)
    }

    return Math.round(statResult.value).toString()
};

/**
 * Função para comparar valores de estatística
 */
export const compareStatValues = (a: StatResult, b: StatResult): number => {
    if (a.value === null && b.value === null) return 0
    if (a.value === null) return 1
    if (b.value === null) return -1
    return b.value - a.value
}

/**
 * Exportamos uma função para obter o mapeamento de estatísticas
 */
export const getStatMapping = (statParam: string | null): StatConfig => {
    if (!statParam) {
        return {
            key: 'not_found',
            title: 'Estatística não encontrada',
            category: 'passe'
        }
    }

    const urlParam = statParam.toLowerCase();

    // Buscar no mapeamento de estatísticas
    const mapping = statMappings[urlParam]
    if (mapping) return mapping

    return {
        key: 'not_found',
        title: 'Estatística não encontrada',
        category: 'passe'
    }
}

/**
 * Cálculo de estatística específica para um jogador
 */
export const calculateStat = (player: Jogador, key: StatKey): string | number | null => {
    try {
        if (!player.estatisticas) return null;

        // Estatísticas calculadas
        switch (key) {
            case 'passes_percentual':
                return player.estatisticas?.passe?.passes_tentados > 0
                    ? Math.round((player.estatisticas.passe.passes_completos / player.estatisticas.passe.passes_tentados) * 100)
                    : null;
            case 'jds_corridas_media':
                return player.estatisticas?.corrida?.corridas > 0
                    ? Number((player.estatisticas.corrida.jds_corridas / player.estatisticas.corrida.corridas).toFixed(1))
                    : null;
            case 'jds_recepcao_media':
                return player.estatisticas?.recepcao?.recepcoes > 0
                    ? Number((player.estatisticas.recepcao.jds_recepcao / player.estatisticas.recepcao.recepcoes).toFixed(1))
                    : null;
        }

        // Mapeamento de chaves para categorias
        const categoryMap: Record<string, CategoryKey> = {
            // Passe
            'passes_completos': 'passe',
            'passes_tentados': 'passe',
            'passes_incompletos': 'passe',
            'jds_passe': 'passe',
            'tds_passe': 'passe',
            'passe_xp1': 'passe',
            'passe_xp2': 'passe',
            'int_sofridas': 'passe',
            'sacks_sofridos': 'passe',
            'pressao_pct': 'passe',

            // Corrida
            'corridas': 'corrida',
            'jds_corridas': 'corrida',
            'tds_corridos': 'corrida',
            'corrida_xp1': 'corrida',
            'corrida_xp2': 'corrida',

            // Recepção
            'recepcoes': 'recepcao',
            'alvos': 'recepcao',
            'drops': 'recepcao',
            'jds_recepcao': 'recepcao',
            'jds_yac': 'recepcao',
            'tds_recepcao': 'recepcao',
            'recepcao_xp1': 'recepcao',
            'recepcao_xp2': 'recepcao',

            // Defesa
            'tck': 'defesa',
            'tfl': 'defesa',
            'flag_retirada': 'defesa',
            'flag_perdida': 'defesa',
            'sacks': 'defesa',
            'pressao': 'defesa',
            'tip': 'defesa',
            'int': 'defesa',
            'tds_defesa': 'defesa',
            'defesa_xp2': 'defesa',
            'sft': 'defesa',
            'sft_1': 'defesa',
            'blk': 'defesa',
            'jds_defesa': 'defesa',

            // Também mapear versões antigas para compatibilidade
            'td_passado': 'passe',
            'corrida': 'corrida',
            'recepcao': 'recepcao',
            'alvo': 'recepcao',
            'td_recebido': 'recepcao',
            'interceptacao_forcada': 'defesa',
            'passe_desviado': 'defesa',
            'td_defensivo': 'defesa'
        } 

        const category = categoryMap[key as string];
        if (!category || !player.estatisticas?.[category]) return null;

        // Para chaves antigas, mapeie para as novas
        const keyMapping: Record<string, string> = {
            'td_passado': 'tds_passe',
            'corrida': 'jds_corridas',
            'recepcao': 'recepcoes',
            'alvo': 'alvos',
            'td_recebido': 'tds_recepcao',
            'interceptacao_forcada': 'int',
            'passe_desviado': 'tip',
            'td_defensivo': 'tds_defesa'
        };

        const mappedKey = keyMapping[key as string] || key;

        // @ts-ignore - podemos usar index signature aqui porque sabemos que a chave existe
        return player.estatisticas[category][mappedKey];
    } catch (error) {
        console.error(`Error calculating statistic ${key}:`, error);
        return null;
    }
}

/**
 * Verifica requisitos mínimos por categoria
 */
export const meetsMinimumRequirements = (player: Jogador, category: string): boolean => {
    if (!player.estatisticas) return false;

    try {
        switch (category) {
            case 'DEFESA':
                const defStats = player.estatisticas.defesa;
                if (!defStats) return false;
                return Object.values(defStats).some(val =>
                    typeof val === 'number' && val > 0);

            case 'PASSE':
                const passeStats = player.estatisticas.passe;
                if (!passeStats) return false;
                return Object.values(passeStats).some(val =>
                    typeof val === 'number' && val > 0);

            case 'CORRIDA':
                const corridaStats = player.estatisticas.corrida;
                if (!corridaStats) return false;
                return Object.values(corridaStats).some(val =>
                    typeof val === 'number' && val > 0);

            case 'RECEPÇÃO':
                const recepcaoStats = player.estatisticas.recepcao;
                if (!recepcaoStats) return false;
                return Object.values(recepcaoStats).some(val =>
                    typeof val === 'number' && val > 0);

            // Para compatibilidade com a estrutura antiga
            case 'ATAQUE':
                return meetsMinimumRequirements(player, 'PASSE');

            default:
                return true;
        }
    } catch (error) {
        console.error(`Error checking minimum requirements for ${category}:`, error)
        return false
    }
}

/**
 * Determina se o jogador deve ser incluído na estatística
 */
export const shouldIncludePlayer = (player: Jogador, key: StatKey, category: string): boolean => {
    try {
        if (!meetsMinimumRequirements(player, category)) {
            return false
        }

        const value = calculateStat(player, key)
        if (value === null) return false
        return Number(value) > 0
    } catch (error) {
        console.error(`Error checking statistic ${key}:`, error)
        return false
    }
}

/**
 * Compara valores para ordenação
 */
export const compareValues = (a: string | number | null, b: string | number | null): number => {
    if (a === null && b === null) return 0
    if (a === null) return 1
    if (b === null) return -1

    // Comparação normal para números
    return Number(b) - Number(a)
}

/**
 * Mapeamento de estatísticas com suas configurações
 */
export const statMappings: { [key: string]: StatConfig } = {
    // PASSE
    'passe-tentados': {
        key: 'passes_tentados',
        title: 'Passes Tentados',
        category: 'passe'
    },
    'passe-completos': {
        key: 'passes_completos',
        title: 'Passes Completos',
        category: 'passe'
    },
    'passe-incompletos': {
        key: 'passes_incompletos',
        title: 'Passes Incompletos',
        category: 'passe'
    },
    'passe-jardas': {
        key: 'jds_passe',
        title: 'Jardas de Passe',
        category: 'passe'
    },
    'passe-percentual': {
        key: 'passes_percentual',
        title: 'Passes Completos (%)',
        category: 'passe',
        isCalculated: true
    },
    'passe-td': {
        key: 'tds_passe',
        title: 'Touchdowns (Passe)',
        category: 'passe'
    },
    'passe-xp1': {
        key: 'passe_xp1',
        title: 'Extra Point 1 (Passe)',
        category: 'passe'
    },
    'passe-xp2': {
        key: 'passe_xp2',
        title: 'Extra Point 2 (Passe)',
        category: 'passe'
    },
    'passe-int': {
        key: 'int_sofridas',
        title: 'Interceptações Sofridas',
        category: 'passe'
    },
    'passe-sacks': {
        key: 'sacks_sofridos',
        title: 'Sacks Sofridos',
        category: 'passe'
    },
    'passe-pressao': {
        key: 'pressao_pct',
        title: 'Pressão (%)',
        category: 'passe'
    },

    // CORRIDA
    'corrida-total': {
        key: 'corridas',
        title: 'Corridas',
        category: 'corrida'
    },
    'corrida-jardas': {
        key: 'jds_corridas',
        title: 'Jardas de Corrida',
        category: 'corrida'
    },
    'corrida-td': {
        key: 'tds_corridos',
        title: 'Touchdowns (Corrida)',
        category: 'corrida'
    },
    'corrida-xp1': {
        key: 'corrida_xp1',
        title: 'Extra Point 1 (Corrida)',
        category: 'corrida'
    },
    'corrida-xp2': {
        key: 'corrida_xp2',
        title: 'Extra Point 2 (Corrida)',
        category: 'corrida'
    },
    'corrida-media': {
        key: 'jds_corridas_media',
        title: 'Média de Jardas por Corrida',
        category: 'corrida',
        isCalculated: true
    },

    // RECEPÇÃO
    'recepcao-total': {
        key: 'recepcoes',
        title: 'Recepções',
        category: 'recepcao'
    },
    'recepcao-alvo': {
        key: 'alvos',
        title: 'Alvos',
        category: 'recepcao'
    },
    'recepcao-drops': {
        key: 'drops',
        title: 'Drops',
        category: 'recepcao'
    },
    'recepcao-jardas': {
        key: 'jds_recepcao',
        title: 'Jardas de Recepção',
        category: 'recepcao'
    },
    'recepcao-yac': {
        key: 'jds_yac',
        title: 'Jardas Após Recepção',
        category: 'recepcao'
    },
    'recepcao-td': {
        key: 'tds_recepcao',
        title: 'Touchdowns (Recepção)',
        category: 'recepcao'
    },
    'recepcao-xp1': {
        key: 'recepcao_xp1',
        title: 'Extra Point 1 (Recepção)',
        category: 'recepcao'
    },
    'recepcao-xp2': {
        key: 'recepcao_xp2',
        title: 'Extra Point 2 (Recepção)',
        category: 'recepcao'
    },
    'recepcao-media': {
        key: 'jds_recepcao_media',
        title: 'Média de Jardas por Recepção',
        category: 'recepcao',
        isCalculated: true
    },

    // DEFESA
    'defesa-tck': {
        key: 'tck',
        title: 'Tackles',
        category: 'defesa'
    },
    'defesa-tfl': {
        key: 'tfl',
        title: 'Tackles For Loss',
        category: 'defesa'
    },
    'defesa-flag-retirada': {
        key: 'flag_retirada',
        title: 'Flag Retirada',
        category: 'defesa'
    },
    'defesa-flag-perdida': {
        key: 'flag_perdida',
        title: 'Flag Perdida',
        category: 'defesa'
    },
    'defesa-sack': {
        key: 'sacks',
        title: 'Sacks',
        category: 'defesa'
    },
    'defesa-pressao': {
        key: 'pressao',
        title: 'Pressão',
        category: 'defesa'
    },
    'defesa-desvio': {
        key: 'tip',
        title: 'Passes Desviados',
        category: 'defesa'
    },
    'defesa-interceptacao': {
        key: 'int',
        title: 'Interceptações',
        category: 'defesa'
    },
    'defesa-td': {
        key: 'tds_defesa',
        title: 'Touchdowns',
        category: 'defesa'
    },
    'defesa-xp2': {
        key: 'defesa_xp2',
        title: 'Extra Point 2',
        category: 'defesa'
    },
    'defesa-sft': {
        key: 'sft',
        title: 'Safeties',
        category: 'defesa'
    },
    'defesa-sft1': {
        key: 'sft_1',
        title: 'Safety 1',
        category: 'defesa'
    },
    'defesa-blk': {
        key: 'blk',
        title: 'Bloqueios',
        category: 'defesa'
    },
    'defesa-jardas': {
        key: 'jds_defesa',
        title: 'Jardas',
        category: 'defesa'
    }
}