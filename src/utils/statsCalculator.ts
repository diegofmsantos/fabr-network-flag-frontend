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

  private static getFieldGoalRatio(value: string): number {
    if (!value || value === 'N/A') return 0
    const ratio = this.parseStringRatio(value)
    if (!ratio || ratio.attempted === 0) return 0
    return ratio.made / ratio.attempted
  }

  static compareFieldGoals(a: string, b: string): number {
    const ratioA = this.getFieldGoalRatio(a)
    const ratioB = this.getFieldGoalRatio(b)
    return ratioB - ratioA
  }

  static calculate(stats: any, key: string): number | string | null {
    if (!stats) return null

    switch (key) {
      case 'jardas_media':
        return this.calculateAverage(stats.jardas_de_passe, stats.passes_tentados)
        
      case 'jardas_corridas_media':
        return this.calculateAverage(stats.jardas_corridas, stats.corridas)
        
      case 'jardas_recebidas_media':
        return this.calculateAverage(stats.jardas_recebidas, stats.alvo)
        
      case 'jardas_retornadas_media':
        return this.calculateAverage(stats.jardas_retornadas, stats.retornos)
        
      case 'jardas_punt_media':
        return this.calculateAverage(stats.jardas_de_punt, stats.punts)
    }

    switch (key) {
      case 'passes_percentual':
        return this.calculatePercentage(stats.passes_completos, stats.passes_tentados)
        
      case 'field_goals':
        return this.calculatePercentage(stats.fg_bons, stats.tentativas_de_fg)
        
      case 'extra_points':
        return this.calculatePercentage(stats.xp_bons, stats.tentativas_de_xp)
    }

    // Field Goals por Distância
    if (key.match(/^fg_\d+_\d+$/)) {
      const stringRatio = stats[key]
      if (typeof stringRatio !== 'string') return null
      return stringRatio || null
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

    // Para médias
    if (isCalculated && key.includes('media')) {
      return typeof value === 'number' ? value.toFixed(1) : 'N/A';
    }

    // Para percentuais
    if (isCalculated && (key.includes('percentual') || key === 'field_goals' || key === 'extra_points')) {
      return typeof value === 'number' ? `${Math.round(value)}%` : 'N/A'
    }

    // Para valores inteiros
    return typeof value === 'number' ? Math.round(value).toString() : 'N/A'
  }
}