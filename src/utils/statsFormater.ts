import { StatConfig } from "./statMappings"

export class StatsFormatter {
  static format(value: number | string | null, config: StatConfig): string {
    if (value === null) return 'N/A'

    // Para FGs e estatísticas no formato X/Y
    if (typeof value === 'string' && value.includes('/')) {
      return value; // Retorna o formato X/Y original
    }

    // Para médias
    if (config.isCalculated && config.key.includes('media')) {
      return typeof value === 'number' ? value.toFixed(1).replace('.', ',') : 'N/A'
    }

    // Para percentuais
    if (config.isCalculated && (
      config.key.includes('percentual') ||
      config.key === 'field_goals' ||
      config.key === 'extra_points'
    )) {
      return typeof value === 'number' ? `${Math.round(value)}%` : 'N/A'
    }

    // Para valores inteiros
    return typeof value === 'number' ? Math.round(value).toLocaleString('pt-BR') : 'N/A'
  }
}

 export const formatValue = (value: string | number, title: string): string => {
  // Se o valor já for uma string formatada (por exemplo, já tiver um símbolo de %)
  if (typeof value === 'string' && !isNaN(Number(value.replace(/[^0-9.,]/g, '')))) {
    // Verifica se é uma estatística de porcentagem
    const isPercentage = 
      title.includes('(%)') || 
      ['PASSES(%)', 'FG(%)', 'XP(%)'].includes(title);
    
    if (isPercentage) {
      // Extrai o número, formata-o e adiciona o símbolo de %
      const numValue = Number(value.replace(/[^0-9.,]/g, ''));
      return `${Math.round(numValue)}%`;
    }
  }
  
  // Se for um número, verifica se precisa formatar como porcentagem
  if (!isNaN(Number(value))) {
    const numValue = Number(value);
    
    // Verifica se é uma estatística de porcentagem
    const isPercentage = 
      title.includes('(%)') || 
      ['PASSES(%)', 'FG(%)', 'XP(%)'].includes(title);
    
    if (isPercentage) {
      return `${Math.round(numValue)}%`;
    }
    
    // Formata números com ponto de milhar
    return numValue.toLocaleString('pt-BR');
  }
  
  // Se não for um número ou uma string numérica, retorna o valor original
  return String(value);
}