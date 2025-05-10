import { StatKey } from "@/components/Ranking/RankingGroup";

export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    ataque: 'ATAQUE',
    defesa: 'DEFESA'
  }

  return labels[category] || 'ESTATÍSTICAS'
}

export // Função para obter as estatísticas com base na categoria selecionada
    const getStatsByCategory = (category: string): Array<{ key: StatKey; title: string }> => {
        switch (category) {
            case "ataque":
                return [
                    { key: "passes_completos", title: "PASSES COMPLETOS" },
                    { key: "passes_tentados", title: "PASSES TENTADOS" },
                    { key: "passes_percentual", title: "PASSES(%)" },
                    { key: "td_passado", title: "TOUCHDOWNS PASSE" },
                    { key: "interceptacoes_sofridas", title: "INTERCEPTAÇÕES" },
                    { key: "sacks_sofridos", title: "SACKS SOFRIDOS" },
                    { key: "corrida", title: "CORRIDAS" },
                    { key: "tds_corridos", title: "TOUCHDOWNS CORRIDA" },
                    { key: "recepcao", title: "RECEPÇÕES" },
                    { key: "alvo", title: "ALVOS" },
                    { key: "td_recebido", title: "TOUCHDOWNS RECEPÇÃO" }
                ]
           
            case "defesa":
                return [
                    { key: "flag_retirada", title: "FLAG RETIRADA" },
                    { key: "flag_perdida", title: "FLAG PERDIDA" },
                    { key: "sack", title: "SACKS" },
                    { key: "pressao", title: "PRESSÃO" },
                    { key: "interceptacao_forcada", title: "INTERCEPTAÇÕES" },
                    { key: "passe_desviado", title: "PASSES DESV." },
                    { key: "td_defensivo", title: "TOUCHDOWNS" }
                ]
           
            default:
                return []
        }
    }