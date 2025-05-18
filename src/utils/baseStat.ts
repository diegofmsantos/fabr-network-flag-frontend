import { StatsBase } from "@/types/Stats"
import { CategoryKey } from "./categoryThresholds"

export class BaseStatCalculator {
    /**
     * Calcula a estatística base para um jogador com base na categoria.
     * Esta estatística é usada para determinar o tier do jogador.
     */
    static calculate(stats: StatsBase[keyof StatsBase], category: CategoryKey): number {
      switch (category) {
        case 'passe':
          return this.calculatePasseTotal(stats);
        case 'corrida':
          return this.calculateCorridaTotal(stats);
        case 'recepcao':
          return this.calculateRecepcaoTotal(stats);
        case 'defesa':
          return this.calculateDefesaTotal(stats);
        default:
          return this.getBasicStat(stats, category);
      }
    }
  
    /**
     * Calcula a estatística base para passe
     */
    private static calculatePasseTotal(stats: any): number {
      return (stats.passes_completos || 0) +
             (stats.passes_tentados || 0) +
             (stats.passes_incompletos || 0) +
             (stats.td_passe || 0) +
             (stats.passe_xp1 || 0) +
             (stats.passe_xp2 || 0);
    }
    
    /**
     * Calcula a estatística base para corrida
     */
    private static calculateCorridaTotal(stats: any): number {
      return (stats.corridas || 0) +
             (stats.jds_corridas || 0) +
             (stats.tds_corridos || 0) +
             (stats.corrida_xp1 || 0) +
             (stats.corrida_xp2 || 0);
    }
    
    /**
     * Calcula a estatística base para recepção
     */
    private static calculateRecepcaoTotal(stats: any): number {
      return (stats.recepcoes || 0) +
             (stats.alvos || 0) +
             (stats.drops || 0) +
             (stats.jds_recepcao || 0) +
             (stats.jds_yac || 0) +
             (stats.tds_recepcao || 0) +
             (stats.recepcao_xp1 || 0) +
             (stats.recepcao_xp2 || 0);
    }

    /**
     * Calcula a estatística base para defesa
     */
    private static calculateDefesaTotal(stats: any): number {
      return (stats.flag_retirada || 0) +
             (stats.flag_perdida || 0) +
             (stats.sack || 0) +
             (stats.pressao || 0) +
             (stats.interceptacao_forcada || 0) +
             (stats.passe_desviado || 0) +
             (stats.td_defensivo || 0) +
             (stats.tck || 0) +
             (stats.tfl || 0) +
             (stats.tip || 0) +
             (stats.int || 0) +
             (stats.tds_defesa || 0) +
             (stats.defesa_xp2 || 0) +
             (stats.sft || 0) +
             (stats.sft_1 || 0) +
             (stats.blk || 0) +
             (stats.jds_defesa || 0);
    }
  
    /**
     * Caso de fallback - obtém uma estatística básica para qualquer categoria
     */
    private static getBasicStat(stats: any, category: CategoryKey): number {
      // Mapeamento de categorias para estatísticas principais
      const statMap: Record<string, string> = {
        'passe': 'passes_tentados',
        'corrida': 'corridas',
        'recepcao': 'recepcoes',
        'defesa': 'flag_retirada'
      };
      
      // Tratamento especial para categorias
      if (category === 'passe') {
        // Tenta encontrar qualquer estatística relacionada a passe que possa estar presente
        const possibleStats = ['passes_tentados', 'passes_completos', 'td_passe', 
                              'jds_passe', 'passe_xp1', 'passe_xp2'];
        
        for (const stat of possibleStats) {
          if (stats[stat] && typeof stats[stat] === 'number' && stats[stat] > 0) {
            return stats[stat];
          }
        }
      }
      
      // Para corrida
      if (category === 'corrida') {
        const possibleStats = ['corridas', 'jds_corridas', 'tds_corridos'];
        
        for (const stat of possibleStats) {
          if (stats[stat] && typeof stats[stat] === 'number' && stats[stat] > 0) {
            return stats[stat];
          }
        }
      }
      
      // Para recepção
      if (category === 'recepcao') {
        const possibleStats = ['recepcoes', 'alvos', 'tds_recepcao'];
        
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