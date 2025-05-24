import { Jogador } from "@/types/jogador"
import { StatConfig, StatResult } from "../types/statTypes"
import { CategoryKey, getTierForValue } from "../categoryThresholds"
import { StatKey } from "@/components/Ranking/RankingGroup"
import { checkCategoryMinimum } from "../validations/statValidatioons"

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

export const compareStatValues = (a: StatResult, b: StatResult): number => {
    if (a.value === null && b.value === null) return 0
    if (a.value === null) return 1
    if (b.value === null) return -1
    return b.value - a.value
}

export const calculateStat = (player: Jogador, key: StatKey): string | number | null => {
    try {
        if (!player.estatisticas) return null;

        switch (key) {
            case 'passes_percentual':
                const passe = player.estatisticas?.passe;
                return passe && passe.passes_tentados && passe.passes_tentados > 0
                    ? Math.round((passe.passes_completos || 0) / passe.passes_tentados * 100)
                    : null;
            case 'jds_corridas_media':
                const corrida = player.estatisticas?.corrida;
                return corrida && corrida.corridas && corrida.corridas > 0
                    ? Number(((corrida.jds_corridas || 0) / corrida.corridas).toFixed(1))
                    : null;
            case 'jds_recepcao_media':
                const recepcao = player.estatisticas?.recepcao;
                return recepcao && recepcao.recepcoes && recepcao.recepcoes > 0
                    ? Number(((recepcao.jds_recepcao || 0) / recepcao.recepcoes).toFixed(1))
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

export const compareValues = (a: string | number | null, b: string | number | null): number => {
    if (a === null && b === null) return 0
    if (a === null) return 1
    if (b === null) return -1

    // Comparação normal para números
    return Number(b) - Number(a)
}