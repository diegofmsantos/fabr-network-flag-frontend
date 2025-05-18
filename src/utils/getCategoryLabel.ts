import { StatKey } from "@/components/Ranking/RankingGroup";

/**
 * Obtém o rótulo de exibição para uma categoria de estatística
 */
export const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
        passe: 'PASSE',
        corrida: 'CORRIDA',
        recepcao: 'RECEPÇÃO',
        defesa: 'DEFESA',
    }

    return labels[category] || 'ESTATÍSTICAS'
}

/**
 * Retorna as estatísticas específicas para uma categoria selecionada
 */
export const getStatsByCategory = (category: string): Array<{ key: StatKey; title: string }> => {
    // Para compatibilidade, mapeia 'ataque' para 'passe'
    const effectiveCategory = category === 'ataque' ? 'passe' : category;

    switch (effectiveCategory) {
        case "passe":
            return [
                { key: "passes_completos", title: "PASSES COMPLETOS" },
                { key: "passes_tentados", title: "PASSES TENTADOS" },
                { key: "passes_incompletos", title: "PASSES INCOMPLETOS" },
                { key: "passes_percentual", title: "PASSE (%)" }, // Ajustado para nome correto
                { key: "tds_passe", title: "TOUCHDOWNS PASSE" }, // Corrigido de tds_passe para td_passe
                { key: "passe_xp1", title: "XP 1" },
                { key: "passe_xp2", title: "XP 2" },
                { key: "int_sofridas", title: "INTERCEPTAÇÕES" },
                { key: "sacks_sofridos", title: "SACKS SOFRIDOS" },
                { key: "pressao_pct", title: "PRESSÃO" },
            ]
        case "corrida":
            return [
                { key: "corridas", title: "CORRIDAS" }, // Corrigido de corrida para corridas
                { key: "jds_corridas", title: "JARDAS" },
                { key: "tds_corridos", title: "TOUCHDOWNS CORRIDA" },
                { key: "corrida_xp1", title: "XP 1" },
                { key: "corrida_xp2", title: "XP 2" },
            ]
        case "recepcao":
            return [
                { key: "recepcoes", title: "RECEPÇÕES" },
                { key: "alvos", title: "ALVOS" },
                { key: "drops", title: "DROPS" },
                { key: "jds_recepcao", title: "JARDAS" }, // Corrigido de jardas_recepcao para jds_recepcao
                { key: "jds_yac", title: "YAC" },
                { key: "tds_recepcao", title: "TOUCHDOWNS RECEPÇÃO" }, // Corrigido o erro de sintaxe (faltava vírgula)
                { key: "recepcao_xp1", title: "XP 1" },
                { key: "recepcao_xp2", title: "XP 2" },
            ]
        case "defesa":
            return [
                { key: "tck", title: "TACKLES" },
                { key: "tfl", title: "TACKLES FOR LOSS" }, // Corrigido de tlf para tfl
                { key: "pressao_pct", title: "PRESSÃO" }, // Corrigido de pressao_pct_def para pressao_pct
                { key: "sacks", title: "SACKS" },
                { key: "tip", title: "PASSES DESVIADOS" }, // Título mais descritivo
                { key: "int", title: "INTERCEPTAÇÕES" },
                { key: "tds_defesa", title: "TOUCHDOWNS DEFESA" },
                { key: "defesa_xp2", title: "XP 2" },
                { key: "sft", title: "SAFETIES" },
                { key: "sft_1", title: "SAFETY 1" },
                { key: "blk", title: "BLOQUEIOS" }, // Título mais descritivo
                { key: "jds_defesa", title: "JARDAS" },
            ]
        default:
            return []
    }
}