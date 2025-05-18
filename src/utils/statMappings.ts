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

type PasseStats = Jogador['estatisticas']['passe'],
type CorridaStats = Jogador['estatisticas']['corrida']
type RecepcaoStats = Jogador['estatisticas']['recepcao']
type DefesaStats = Jogador['estatisticas']['defesa']

// Função para calcular o total de estatísticas defensivas
const calculateDefenseTotal = (stats: DefesaStats): number => {
    return (stats.flag_retirada || 0) +
        (stats.flag_perdida || 0) +
        (stats.sack || 0) +
        (stats.pressao || 0) +
        (stats.interceptacao_forcada || 0) +
        (stats.passe_desviado || 0) +
        (stats.td_defensivo || 0);
}

// Função para verificar requisitos mínimos por categoria
const checkCategoryMinimum = (category: CategoryKey, stats: any): boolean => {
    const thresholds = CATEGORY_THRESHOLDS[category];
    if (!thresholds) return true; // Se não houver threshold, permitir
    
    switch (category) {
        case 'passe':
            // Para flag football, considerar qualquer atividade ofensiva
            const hasPasseActivity = (stats as PasseStats).passes_tentados > 0 || 
                                   (stats as CorridaStats).corrida > 0 || 
                                   (stats as RecepcaoStats).recepcao > 0;
            return hasPasseActivity;
        case 'defesa':
            return calculateDefenseTotal(stats as DefesaStats) >= thresholds.tier3;
        default:
            return true;
    }
}

// Função para calcular estatísticas derivadas
const calculateDerivedStat = (stats: any, key: string): number | null => {
    switch (key) {
        case 'passes_percentual':
            return stats.passes_tentados > 0
                ? (stats.passes_completos / stats.passes_tentados) * 100
                : null
        default:
            return null
    }
}

// Função principal de cálculo
export const calculateStatValue = (player: Jogador, mapping: StatConfig): StatResult => {
    try {
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

// Função para formatar valores de estatística
export const formatStatValue = (statResult: StatResult, stat: StatConfig): string => {
    if (statResult.value === null) return 'N/A'

    if (stat.isCalculated) {
        if (stat.key.includes('percentual')) {
            return `${Math.round(statResult.value)}%`
        }
        return statResult.value.toFixed(1)
    }

    return Math.round(statResult.value).toString()
};

// Função para comparar valores de estatística
export const compareStatValues = (a: StatResult, b: StatResult): number => {
    if (a.value === null && b.value === null) return 0
    if (a.value === null) return 1
    if (b.value === null) return -1
    return b.value - a.value
}

// Exportamos uma função para obter o mapeamento de estatísticas
export const getStatMapping = (statParam: string | null): StatConfig => {
    if (!statParam) {
        return {
            key: 'not_found',
            title: 'Estatística não encontrada',
            category: 'ataque'
        }
    }

    const urlParam = statParam.toLowerCase();

    // Buscar no mapeamento de estatísticas
    const mapping = statMappings[urlParam]
    if (mapping) return mapping

    return {
        key: 'not_found',
        title: 'Estatística não encontrada',
        category: 'ataque'
    }
}

export const calculateStat = (player: Jogador, key: StatKey): string | number | null => {
    try {
        switch (key) {
            case 'passes_percentual':
                return player.estatisticas?.passe?.passes_tentados > 0
                    ? Math.round((player.estatisticas.passe.passes_completos / player.estatisticas.passe.passes_tentados) * 100)
                    : null;
            default:
                const categoryMap: Record<string, keyof Jogador["estatisticas"]> = {
                    // Mapeamento de chaves para categorias
                    'passes_completos': 'passe',
                    'passes_tentados': 'passe',
                    'passes_incompletos': 'passe',
                    'jds_passe': 'passe',
                    'td_passe': 'passe',
                    'passe_xp1': 'passe',
                    'passe_xp2': 'passe',
                    'int_sofridas': 'passe',
                    'sacks_sofridos': 'passe',
                    'pressao_pct': 'passe',
                    
                    'corridas': 'corrida',
                    'jds_corridas': 'corrida',
                    'tds_corridos': 'corrida',
                    'corrida_xp1': 'corrida',
                    'corrida_xp2': 'corrida',
                    
                    'recepcoes': 'recepcao',
                    'alvos': 'recepcao',
                    'drops': 'recepcao',
                    'jds_recepcao': 'recepcao',
                    'jds_yac': 'recepcao',
                    'tds_recepcao': 'recepcao',
                    'recepcao_xp1': 'recepcao',
                    'recepcao_xp2': 'recepcao',
                    
                    'tck': 'defesa',
                    'tfl': 'defesa',
                    'pressao_pct_def': 'defesa',
                    'sacks': 'defesa',
                    'tip': 'defesa',
                    'int': 'defesa',
                    'tds_defesa': 'defesa',
                    'defesa_xp2': 'defesa',
                    'sft': 'defesa',
                    'sft_1': 'defesa',
                    'blk': 'defesa',
                    'jds_defesa': 'defesa'
                };
                
                const category = categoryMap[key];
                if (!category || !player.estatisticas?.[category]) return null;
                
                // @ts-ignore - podemos usar index signature aqui porque sabemos que a chave existe
                return player.estatisticas[category][key];
        }
    } catch (error) {
        console.error(`Error calculating statistic ${key}:`, error);
        return null;
    }
}

export const meetsMinimumRequirements = (player: Jogador, category: string): boolean => {
    try {
        switch (category) {
            case 'DEFESA':
                const defStats = player.estatisticas.defesa;
                if (!defStats) return false;
                const defTotal = calculateDefenseTotal(defStats);
                return defTotal > 0;
            case 'ATAQUE':
                const passeStats = player.estatisticas.ataque;
                if (!passeStats) return false;
                // Para flag football, considerar qualquer atividade ofensiva
                return (passeStats.passes_tentados || 0) > 0 || 
                       (passeStats.corrida || 0) > 0 || 
                       (passeStats.recepcao || 0) > 0;
            default:
                return true;
        }
    } catch (error) {
        console.error(`Error checking minimum requirements for ${category}:`, error)
        return false
    }
}

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

export const compareValues = (a: string | number | null, b: string | number | null): number => {
    if (a === null && b === null) return 0
    if (a === null) return 1
    if (b === null) return -1

    // Comparação normal para números
    return Number(b) - Number(a)
}

export const getStatCategory = (key: StatKey): keyof Jogador['estatisticas'] => {
    // Todas as estatísticas de passe, corrida e recepção estão agora em 'passe'
    const ataqueKeys = [
        'passes_percentual', 'passes_completos', 'passes_tentados', 'td_passado',
        'interceptacoes_sofridas', 'sacks_sofridos', 'corrida', 'tds_corridos',
        'recepcao', 'alvo', 'td_recebido'
    ];
    
    const defesaKeys = [
        'flag_retirada', 'flag_perdida', 'sack', 'pressao',
        'interceptacao_forcada', 'passe_desviado', 'td_defensivo'
    ];
    
    if (ataqueKeys.includes(key)) return 'ataque'
    if (defesaKeys.includes(key)) return 'defesa'
    
    throw new Error(`Chave de estatística desconhecida: ${key}`)
}

export const statMappings: { [key: string]: StatConfig } = {
    // PASSE (incluindo estatísticas de ataque)
    'passe-tentados': {
        key: 'passes_tentados',
        title: 'Passes Tentados',
        category: 'ataque'
    },
    'passe-completos': {
        key: 'passes_completos',
        title: 'Passes Completos',
        category: 'ataque'
    },
    'passe-percentual': {
        key: 'passes_percentual',
        title: 'Passes Completos (%)',
        category: 'ataque',
        isCalculated: true
    },
    'passe-td': {
        key: 'td_passado',
        title: 'Touchdowns (Passe)',
        category: 'ataque'
    },
    'passe-int': {
        key: 'interceptacoes_sofridas',
        title: 'Interceptações Sofridas',
        category: 'ataque'
    },
    'passe-sacks': {
        key: 'sacks_sofridos',
        title: 'Sacks Sofridos',
        category: 'ataque'
    },
    'corrida-total': {
        key: 'corrida',
        title: 'Corridas',
        category: 'ataque'
    },
    'corrida-td': {
        key: 'tds_corridos',
        title: 'Touchdowns (Corrida)',
        category: 'ataque'
    },
    'recepcao-total': {
        key: 'recepcao',
        title: 'Recepções',
        category: 'ataque'
    },
    'recepcao-alvo': {
        key: 'alvo',
        title: 'Alvos',
        category: 'ataque'
    },
    'recepcao-td': {
        key: 'td_recebido',
        title: 'Touchdowns (Recepção)',
        category: 'ataque'
    },

    // DEFESA
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
        key: 'sack',
        title: 'Sacks',
        category: 'defesa'
    },
    'defesa-pressao': {
        key: 'pressao',
        title: 'Pressão',
        category: 'defesa'
    },
    'defesa-interceptacao': {
        key: 'interceptacao_forcada',
        title: 'Interceptações',
        category: 'defesa'
    },
    'defesa-desvio': {
        key: 'passe_desviado',
        title: 'Passes Desviados',
        category: 'defesa'
    },
    'defesa-td': {
        key: 'td_defensivo',
        title: 'Touchdowns',
        category: 'defesa'
    }
}