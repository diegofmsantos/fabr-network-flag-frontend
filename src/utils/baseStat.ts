import { DefesaStats, StatsBase } from "@/types/Stats"
import { CategoryKey } from "./categoryThresholds"

export class BaseStatCalculator {
    static calculate(stats: StatsBase[keyof StatsBase], category: CategoryKey): number {
      switch (category) {
        case 'defesa':
          return this.calculateDefenseTotal(stats as DefesaStats)
        default:
          return this.getBasicStat(stats, category)
      }
    }
  
    private static calculateDefenseTotal(stats: DefesaStats): number {
      // Adaptado para as estatísticas de defesa do flag football
      return (stats.flag_retirada || 0) +
             (stats.flag_perdida || 0) +
             (stats.sack || 0) +
             (stats.pressao || 0) +
             (stats.interceptacao_forcada || 0) +
             (stats.passe_desviado || 0) +
             (stats.td_defensivo || 0);
    }
  
    private static getBasicStat(stats: any, category: CategoryKey): number {
      // Mapeamento atualizado para flag football
      const statMap: Record<string, string> = {
        ataque: 'passes_tentados',
        defesa: 'flag_retirada'
      }
      
      // Tratamento especial para estatísticas que podem não existir
      if (category === 'ataque' && !stats[statMap[category]]) {
        // Tenta encontrar qualquer estatística relacionada a passe que possa estar presente
        const possibleStats = ['passes_tentados', 'passes_completos', 'td_passado', 
                              'corrida', 'recepcao', 'alvo'];
        
        for (const stat of possibleStats) {
          if (stats[stat] && typeof stats[stat] === 'number' && stats[stat] > 0) {
            return stats[stat];
          }
        }
      }
      
      // Se não encontrou nenhuma estatística ou a categoria não está no mapeamento
      if (!statMap[category]) {
        return 0; // Retorna 0 para categorias não mapeadas
      }
      
      // Retorna a estatística mapeada ou 0 se não existir
      return stats[statMap[category]] || 0;
    }
  }