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

type PasseStats = Jogador['estatisticas']['passe']
type CorridaStats = Jogador['estatisticas']['corrida']
type RecepcaoStats = Jogador['estatisticas']['recepcao']
type RetornoStats = Jogador['estatisticas']['retorno']
type DefesaStats = Jogador['estatisticas']['defesa']
type KickerStats = Jogador['estatisticas']['kicker']
type PunterStats = Jogador['estatisticas']['punter']

// Função para calcular o total de estatísticas defensivas
const calculateDefenseTotal = (stats: DefesaStats): number => {
    return stats.tackles_totais +
        stats.tackles_for_loss +
        stats.sacks_forcado +
        stats.fumble_forcado +
        stats.interceptacao_forcada +
        stats.passe_desviado +
        stats.safety +
        stats.td_defensivo;
}

// Função para verificar requisitos mínimos por categoria
const checkCategoryMinimum = (category: CategoryKey, stats: any): boolean => {
    const thresholds = CATEGORY_THRESHOLDS[category];
    if (!thresholds) return false;

    switch (category) {
        case 'passe':
            return (stats as PasseStats).passes_tentados >= thresholds.tier3;
        case 'corrida':
            return (stats as CorridaStats).corridas >= thresholds.tier3;
        case 'recepcao':
            return (stats as RecepcaoStats).alvo >= thresholds.tier3;
        case 'retorno':
            return (stats as RetornoStats).retornos >= thresholds.tier3;
        case 'defesa':
            return calculateDefenseTotal(stats as DefesaStats) >= thresholds.tier3;
        case 'kicker':
            return (stats as KickerStats).tentativas_de_fg >= thresholds.tier3;
        case 'punter':
            return (stats as PunterStats).punts >= thresholds.tier3;
    }
}

// Função para calcular estatísticas derivadas
const calculateDerivedStat = (stats: any, key: string): number | null => {
    switch (key) {
        case 'passes_percentual':
            return stats.passes_tentados > 0
                ? (stats.passes_completos / stats.passes_tentados) * 100
                : null
        case 'jardas_media':
            return stats.passes_tentados > 0
                ? stats.jardas_de_passe / stats.passes_tentados
                : null
        case 'jardas_corridas_media':
            return stats.corridas > 0
                ? stats.jardas_corridas / stats.corridas
                : null
        case 'jardas_recebidas_media':
            return stats.alvo > 0
                ? stats.jardas_recebidas / stats.alvo
                : null
        case 'jardas_retornadas_media':
            return stats.retornos > 0
                ? stats.jardas_retornadas / stats.retornos
                : null
        case 'extra_points':
            return stats.tentativas_de_xp > 0
                ? (stats.xp_bons / stats.tentativas_de_xp) * 100
                : null
        case 'field_goals':
            return stats.tentativas_de_fg > 0
                ? (stats.fg_bons / stats.tentativas_de_fg) * 100
                : null
        case 'jardas_punt_media':
            return stats.punts > 0
                ? stats.jardas_de_punt / stats.punts
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
        if (
            stat.key.includes('percentual') ||
            stat.key === 'extra_points' ||
            stat.key === 'field_goals'
        ) {
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
            category: 'passe'
        }
    }

    const urlParam = statParam.toLowerCase();

    // Buscar no mapeamento de estatísticas (você manteria seu objeto statMappings aqui)
    const mapping = statMappings[urlParam]
    if (mapping) return mapping

    return {
        key: 'not_found',
        title: 'Estatística não encontrada',
        category: 'passe'
    }
}

// Função para obter a taxa de FG para ordenação
export const getFGRatio = (fgString: string): number => {
    if (!fgString || fgString === '') return 0
    const [made, attempted] = fgString.split('/').map(Number)
    if (isNaN(made) || isNaN(attempted) || attempted === 0) return 0
    return made / attempted
}

export const calculateStat = (player: Jogador, key: StatKey): string | number | null => {
    try {
        switch (key) {
            case 'passes_percentual':
                return player.estatisticas.passe.passes_tentados > 0
                    ? Math.round((player.estatisticas.passe.passes_completos / player.estatisticas.passe.passes_tentados) * 100)
                    : null
            case 'jardas_media':
                return player.estatisticas.passe.passes_completos > 0
                    ? Number((player.estatisticas.passe.jardas_de_passe / player.estatisticas.passe.passes_tentados))
                    : null
            case 'jardas_corridas_media':
                return player.estatisticas.corrida.corridas > 0
                    ? Number((player.estatisticas.corrida.jardas_corridas / player.estatisticas.corrida.corridas))
                    : null
            case 'jardas_recebidas_media':
                return player.estatisticas.recepcao.recepcoes > 0
                    ? Number((player.estatisticas.recepcao.jardas_recebidas / player.estatisticas.recepcao.alvo))
                    : null
            case 'jardas_retornadas_media':
                return player.estatisticas.retorno.retornos > 0
                    ? Number((player.estatisticas.retorno.jardas_retornadas / player.estatisticas.retorno.retornos))
                    : null
            case 'extra_points':
                return player.estatisticas.kicker.tentativas_de_xp > 0
                    ? Math.round((player.estatisticas.kicker.xp_bons / player.estatisticas.kicker.tentativas_de_xp) * 100)
                    : null
            case 'field_goals':
                return player.estatisticas.kicker.tentativas_de_fg > 0
                    ? Math.round((player.estatisticas.kicker.fg_bons / player.estatisticas.kicker.tentativas_de_fg) * 100)
                    : null
            case 'jardas_punt_media':
                return player.estatisticas.punter.punts > 0
                    ? Number((player.estatisticas.punter.jardas_de_punt / player.estatisticas.punter.punts))
                    : null
            default:
                const category = getStatCategory(key)
                const stats = player.estatisticas[category]
                return stats[key as keyof typeof stats] as number
        }
    } catch (error) {
        console.error(`Error calculating statistic ${key}:`, error)
        return null
    }
}

export const meetsMinimumRequirements = (player: Jogador, category: string): boolean => {
    try {
        switch (category) {
            case 'DEFESA':
                const defStats = player.estatisticas.defesa;
                const defTotal =
                    defStats.tackles_totais +
                    defStats.tackles_for_loss +
                    defStats.sacks_forcado +
                    defStats.fumble_forcado +
                    defStats.interceptacao_forcada +
                    defStats.passe_desviado +
                    defStats.safety +
                    defStats.td_defensivo;
                return defTotal >= 4.8;
            case 'PASSE':
                return player.estatisticas.passe.passes_tentados >= 40.9
            case 'CHUTE':
                return player.estatisticas.kicker.tentativas_de_fg >= 1.8
            case 'CORRIDA':
                return player.estatisticas.corrida.corridas >= 10.2
            case 'RECEPÇÃO':
                return player.estatisticas.recepcao.alvo >= 7.5
            case 'RETORNO':
                return player.estatisticas.retorno.retornos >= 2.9
            case 'PUNT':
                return player.estatisticas.punter.punts >= 6.4
            default:
                return true
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
    switch (key) {
        case 'passes_percentual':
        case 'passes_completos':
        case 'passes_tentados':
        case 'jardas_de_passe':
        case 'td_passados':
        case 'interceptacoes_sofridas':
        case 'sacks_sofridos':
        case 'fumble_de_passador':
        case 'jardas_media':
            return 'passe'
        case 'corridas':
        case 'jardas_corridas':
        case 'tds_corridos':
        case 'fumble_de_corredor':
        case 'jardas_corridas_media':
            return 'corrida'
        case 'recepcoes':
        case 'alvo':
        case 'jardas_recebidas':
        case 'tds_recebidos':
        case 'jardas_recebidas_media':
            return 'recepcao'
        case 'retornos':
        case 'jardas_retornadas':
        case 'td_retornados':
        case 'jardas_retornadas_media':
            return 'retorno'
        case 'tackles_totais':
        case 'tackles_for_loss':
        case 'sacks_forcado':
        case 'fumble_forcado':
        case 'interceptacao_forcada':
        case 'passe_desviado':
        case 'safety':
        case 'td_defensivo':
            return 'defesa'
        case 'extra_points':
        case 'field_goals':
        case 'xp_bons':
        case 'tentativas_de_xp':
        case 'fg_bons':
        case 'tentativas_de_fg':
        case 'fg_mais_longo':
            return 'kicker'
        case 'jardas_punt_media':
        case 'punts':
        case 'jardas_de_punt':
            return 'punter'
        default:
            throw new Error(`Chave de estatística desconhecida: ${key}`)
    }
}

export const statMappings: { [key: string]: StatConfig } = {
    // PASSE
    'passe-jardas': {
        key: 'jardas_de_passe',
        title: 'Jardas',
        category: 'passe'
    },
    'passe-passes': {
        key: 'passes_percentual',
        title: 'Passes Completos (%)',
        category: 'passe',
        isCalculated: true
    },
    'passe-jardasavg': {
        key: 'jardas_media',
        title: 'Jardas(AVG)',
        category: 'passe',
        isCalculated: true
    },
    'passe-touchdowns': {
        key: 'td_passados',
        title: 'Touchdowns',
        category: 'passe'
    },
    'passe-passes-comp': {
        key: 'passes_completos',
        title: 'Passes Completos',
        category: 'passe'
    },
    'passe-passes-tent': {
        key: 'passes_tentados',
        title: 'Passes Tentados',
        category: 'passe'
    },
    'passe-interceptacoes': {
        key: 'interceptacoes_sofridas',
        title: 'Interceptações',
        category: 'passe'
    },
    'passe-sacks': {
        key: 'sacks_sofridos',
        title: 'Sacks',
        category: 'passe'
    },
    'passe-fumbles': {
        key: 'fumble_de_passador',
        title: 'Fumbles',
        category: 'passe'
    },

    // CORRIDA
    'corrida-jardas': {
        key: 'jardas_corridas',
        title: 'Jardas',
        category: 'corrida'
    },
    'corrida-corridas': {
        key: 'corridas',
        title: 'Corridas',
        category: 'corrida'
    },
    'corrida-jardasavg': {
        key: 'jardas_corridas_media',
        title: 'Jardas(AVG)',
        category: 'corrida',
        isCalculated: true
    },
    'corrida-touchdowns': {
        key: 'tds_corridos',
        title: 'Touchdowns',
        category: 'corrida'
    },
    'corrida-fumbles': {
        key: 'fumble_de_corredor',
        title: 'Fumbles',
        category: 'corrida'
    },

    // RECEPÇÃO
    'recepcao-jardas': {
        key: 'jardas_recebidas',
        title: 'Jardas',
        category: 'recepcao'
    },
    'recepcao-recepcoes': {
        key: 'recepcoes',
        title: 'Recepções',
        category: 'recepcao'
    },
    'recepcao-touchdowns': {
        key: 'tds_recebidos',
        title: 'Touchdowns',
        category: 'recepcao'
    },
    'recepcao-jardasavg': {
        key: 'jardas_recebidas_media',
        title: 'Jardas(AVG)',
        category: 'recepcao',
        isCalculated: true
    },
    'recepcao-alvos': {
        key: 'alvo',
        title: 'Alvos',
        category: 'recepcao'
    },

    // RETORNO
    'retorno-jardas': {
        key: 'jardas_retornadas',
        title: 'Jardas',
        category: 'retorno'
    },
    'retorno-retornos': {
        key: 'retornos',
        title: 'Retornos',
        category: 'retorno'
    },
    'retorno-touchdowns': {
        key: 'td_retornados',
        title: 'Touchdowns',
        category: 'retorno'
    },
    'retorno-jardasavg': {
        key: 'jardas_retornadas_media',
        title: 'Jardas(AVG)',
        category: 'retorno',
        isCalculated: true
    },

    // DEFESA
    'defesa-sacks': {
        key: 'sacks_forcado',
        title: 'Sacks',
        category: 'defesa'
    },
    'defesa-interceptacoes': {
        key: 'interceptacao_forcada',
        title: 'Interceptações',
        category: 'defesa'
    },
    'defesa-fumbles-forc': {
        key: 'fumble_forcado',
        title: 'Fumbles Forçados',
        category: 'defesa'
    },
    'defesa-touchdowns': {
        key: 'td_defensivo',
        title: 'Touchdowns',
        category: 'defesa'
    },
    'defesa-tacklesloss': {
        key: 'tackles_for_loss',
        title: 'Tackles (Loss)',
        category: 'defesa'
    },
    'defesa-tackles-totais': {
        key: 'tackles_totais',
        title: 'Tackles Totais',
        category: 'defesa'
    },
    'defesa-passes-desv': {
        key: 'passe_desviado',
        title: 'Passes Desviados',
        category: 'defesa'
    },
    'defesa-safeties': {
        key: 'safety',
        title: 'Safeties',
        category: 'defesa'
    },

    // CHUTE
    'chute-fg': {
        key: 'field_goals',
        title: 'FG(%)',
        category: 'kicker',
        isCalculated: true
    },
    'chute-xp': {
        key: 'extra_points',
        title: 'Extra Points(%)',
        category: 'kicker',
        isCalculated: true
    },
    'chute-xp-bom': {
        key: 'xp_bons',
        title: 'XP Bons',
        category: 'kicker'
    },
    'chute-xp-tentados': {
        key: 'tentativas_de_xp',
        title: 'XP Tentados',
        category: 'kicker'
    },
    'chute-fg-bom': {
        key: 'fg_bons',
        title: 'FG Bons',
        category: 'kicker'
    },
    'chute-fg-tentados': {
        key: 'tentativas_de_fg',
        title: 'FG Tentados',
        category: 'kicker'
    },
    'chute-mais-longo': {
        key: 'fg_mais_longo',
        title: 'FG Mais Longo',
        category: 'kicker'
    },

    // PUNT
    'punt-jardasavg': {
        key: 'jardas_punt_media',
        title: 'Jardas (AVG)',
        category: 'punter',
        isCalculated: true
    },
    'punt-punts': {
        key: 'punts',
        title: 'Punts',
        category: 'punter'
    },
    'punt-jardas': {
        key: 'jardas_de_punt',
        title: 'Jardas',
        category: 'punter'
    }
}