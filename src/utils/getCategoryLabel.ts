import { StatKey } from "@/components/Ranking/RankingGroup";

export const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
        passe: 'PASSE',
        corrida: 'CORRIDA',
        recepcao: 'RECEPÇÃO',
        defesa: 'DEFESA'
    }

    return labels[category] || 'ESTATÍSTICAS'
}

export // Função para obter as estatísticas com base na categoria selecionada
    const getStatsByCategory = (category: string): Array<{ key: StatKey; title: string }> => {
        switch (category) {
            case "passe":
                return [
                    { key: "passes_completos", title: "PASSES COMPLETOS" },
                    { key: "passes_tentados", title: "PASSES TENTADOS" },
                    { key: "passes_incompletos", title: "PASSES INCOMPLETOS" },
                    { key: "jds_passe", title: "PASSES(%)" },
                    { key: "tds_passe", title: "TOUCHDOWNS PASSE" },
                    { key: "passe_xp1", title: "XP 1" },
                    { key: "passe_xp2", title: "XP 2" },
                    { key: "int_sofridas", title: "INTERCEPTAÇÕES" },
                    { key: "sacks_sofridos", title: "SACKS SOFRIDOS" },
                    { key: "pressao_pct", title: "PRESSÃO" },
                ]
            case "corrida":
                return [
                    { key: "corrida", title: "CORRIDAS" },
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
                    { key: "jardas_recepcao", title: "JARDAS" },
                    { key: "jds_yac", title: "YAC" },
                    { key: "tds_recepcao", title: "TOUCHDOWNS RECEPÇÃO" }
                    { key: "recepcao_xp1", title: "XP 1" },
                    { key: "recepcao_xp2", title: "XP 2" },
                ]

            case "defesa":
                return [
                    { key: "tck", title: "TCK" },
                    { key: "tlf", title: "TFL" },
                    { key: "pressao_pct_def", title: "PRESSÃO" },
                    { key: "sacks", title: "SACKS" },
                    { key: "tip", title: "TIP" },
                    { key: "int", title: "INTERCEPTAÇÕES" },
                    { key: "tds_defesa", title: "TOUCHDOWNS DEFESA" },
                    { key: "defesa_xp2", title: "XP 2" },
                    { key: "sft", title: "SAFETIES" },
                    { key: "sft_1", title: "SAFETY 1" },
                    { key: "blk", title: "BLK" },
                    { key: "jds_defesa", title: "JARDAS" },
                ]

            default:
                return []
        }
    }