export class StatsCalculator {
  private static calculateAverage(numerator: number, denominator: number): number | null {
    return denominator > 0 ? numerator / denominator : null
  }

  private static calculatePercentage(made: number, attempted: number): number | null {
    return attempted > 0 ? (made / attempted) * 100 : null
  }

  private static parseStringRatio(value: string): { made: number; attempted: number } | null {
    if (!value || value === '') return null
    const [made, attempted] = value.split('/').map(Number)
    if (isNaN(made) || isNaN(attempted)) return null
    return { made, attempted }
  }

  static calculate(stats: any, key: string): number | string | null {
    if (!stats) return null

    // Cálculo de percentual para flag football
    switch (key) {
      case 'passes_percentual':
        return this.calculatePercentage(stats.passes_completos, stats.passes_tentados)
    }

    // Valores diretos
    return typeof stats[key] === 'number' ? stats[key] : null
  }

  static formatValue(value: number | string | null, isCalculated: boolean, key: string): string {
    if (value === null) return 'N/A'

    // Se for uma string de ratio (X/Y), retorna direto
    if (typeof value === 'string' && value.includes('/')) {
      return value
    }

    // Para percentuais
    if (isCalculated && (key.includes('percentual'))) {
      return typeof value === 'number' ? `${Math.round(value)}%` : 'N/A'
    }

    // Para valores inteiros
    return typeof value === 'number' ? Math.round(value).toString() : 'N/A'
  }

  // Método de comparação simplificado para flag football
  static compareValues(a: number | string | null, b: number | string | null): number {
    if (a === null && b === null) return 0
    if (a === null) return 1
    if (b === null) return -1

    // Para valores numéricos, comparação direta
    if (typeof a === 'number' && typeof b === 'number') {
      return b - a
    }

    // Se chegou aqui, algo está errado com os tipos
    return 0
  }
}