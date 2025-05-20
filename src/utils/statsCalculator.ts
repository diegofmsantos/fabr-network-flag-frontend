export class StatsCalculator {
  /**
   * Calcula o valor de uma estatística específica baseado na chave fornecida
   * Adaptado para a nova estrutura de estatísticas de flag football
   */
  static calculate(stats: any, key: string): number | string | null {
    if (!stats) return null;

    // Estatísticas calculadas especiais
    switch (key) {
      // Percentuais
      case 'passes_percentual':
        return this.calculatePercentage(stats.passes_completos || 0, stats.passes_tentados || 0);
      
      // Médias por tentativa/jogo
      case 'jds_passe_media':
        return this.calculateAverage(stats.jds_passe || 0, stats.passes_tentados || 0);
      case 'jds_corridas_media':
        return this.calculateAverage(stats.jds_corridas || 0, stats.corridas || 0);
      case 'jds_recepcao_media':
        return this.calculateAverage(stats.jds_recepcao || 0, stats.recepcoes || 0);
      
      // Valores diretos - apenas busca a propriedade correspondente
      default:
        return typeof stats[key] === 'number' ? stats[key] : null;
    }
  }

  /**
   * Calcula uma média com segurança (evitando divisão por zero)
   */
  private static calculateAverage(numerator: number, denominator: number): number | null {
    return denominator > 0 ? numerator / denominator : null;
  }

  /**
   * Calcula uma porcentagem com segurança (evitando divisão por zero)
   */
  private static calculatePercentage(made: number, attempted: number): number | null {
    return attempted > 0 ? (made / attempted) * 100 : null;
  }

  /**
   * Extrai valores de uma estatística em formato de string (X/Y)
   */
  private static parseStringRatio(value: string): { made: number; attempted: number } | null {
    if (!value || value === '') return null;
    const parts = value.split('/');
    if (parts.length !== 2) return null;
    
    const [made, attempted] = parts.map(Number);
    if (isNaN(made) || isNaN(attempted)) return null;
    
    return { made, attempted };
  }

  /**
   * Formata o valor para exibição, com tratamento especial para diferentes tipos de estatísticas
   */
  static formatValue(value: number | string | null, isCalculated: boolean, key: string): string {
    if (value === null) return 'N/A';

    // Se for uma string de ratio (X/Y), retorna direto
    if (typeof value === 'string' && value.includes('/')) {
      return value;
    }

    // Para percentuais
    if (isCalculated && (key.includes('percentual') || key.includes('pressao_pct'))) {
      return typeof value === 'number' ? `${Math.round(value)}%` : 'N/A';
    }

    // Para médias (1 casa decimal)
    if (isCalculated && key.includes('media')) {
      return typeof value === 'number' ? value.toFixed(1).replace('.', ',') : 'N/A';
    }

    // Para valores inteiros
    return typeof value === 'number' ? Math.round(value).toLocaleString('pt-BR') : 'N/A';
  }

  /**
   * Compara valores para ordenação, com tratamento especial para diferentes tipos
   */
  static compareValues(a: number | string | null, b: number | string | null): number {
    // Tratamento de valores nulos
    if (a === null && b === null) return 0;
    if (a === null) return 1;
    if (b === null) return -1;

    // Comparação para valores no formato X/Y
    if (typeof a === 'string' && typeof b === 'string' && 
        a.includes('/') && b.includes('/')) {
      
      const ratioA = this.parseStringRatio(a);
      const ratioB = this.parseStringRatio(b);
      
      if (!ratioA || !ratioB) return 0;
      
      // Calcular as proporções
      const propA = ratioA.made / ratioA.attempted;
      const propB = ratioB.made / ratioB.attempted;
      
      // Se proporções iguais, comparar por volume
      if (propA === propB) {
        return ratioB.made - ratioA.made;
      }
      
      return propB - propA;
    }
    
    // Para valores numéricos, comparação direta
    if (typeof a === 'number' && typeof b === 'number') {
      return b - a;
    }
    
    // Última tentativa: converter para números e comparar
    const numA = Number(a);
    const numB = Number(b);
    
    if (!isNaN(numA) && !isNaN(numB)) {
      return numB - numA;
    }
    
    // Se não conseguiu comparar, retorna 0
    return 0;
  }
}