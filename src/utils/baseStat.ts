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
      return stats.tackles_totais +
             stats.tackles_for_loss +
             stats.sacks_forcado +
             stats.fumble_forcado +
             stats.interceptacao_forcada +
             stats.passe_desviado +
             stats.safety +
             stats.td_defensivo;
    }
  
    private static getBasicStat(stats: any, category: CategoryKey): number {
      const statMap: Record<CategoryKey, string> = {
        passe: 'passes_tentados',
        corrida: 'corridas',
        recepcao: 'alvo',
        retorno: 'retornos',
        kicker: 'tentativas_de_fg',
        punter: 'punts',
        defesa: 'tackles_totais'
      }
  
      return stats[statMap[category]] || 0;
    }
  }