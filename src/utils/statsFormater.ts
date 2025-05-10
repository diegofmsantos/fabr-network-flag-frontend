import { StatConfig } from "./statMappings"

export class StatsFormatter {
  static format(value: number | string | null, config: StatConfig): string {
    if (value === null) return 'N/A'

    // Para valores no formato X/Y (se existirem no flag football)
    if (typeof value === 'string' && value.includes('/')) {
      return value; // Retorna o formato X/Y original
    }

    // Para percentuais
    if (config.isCalculated && (
      config.key.includes('percentual')
    )) {
      return typeof value === 'number' ? `${Math.round(value)}%` : 'N/A'
    }

    // Para valores inteiros
    return typeof value === 'number' ? Math.round(value).toLocaleString('pt-BR') : 'N/A'
  }
}

export const formatValue = (value: string | number, title: string): string => {
  // Se o valor já for uma string formatada
  if (typeof value === 'string' && !isNaN(Number(value.replace(/[^0-9.,]/g, '')))) {
    // Verifica se é uma estatística de porcentagem
    const isPercentage = 
      title.includes('(%)') || 
      ['PASSES(%)', 'PASSES COMP(%)'].includes(title);
    
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
      ['PASSES(%)', 'PASSES COMP(%)'].includes(title);
    
    if (isPercentage) {
      return `${Math.round(numValue)}%`;
    }
    
    // Formata números com ponto de milhar
    return numValue.toLocaleString('pt-BR');
  }
  
  // Se não for um número ou uma string numérica, retorna o valor original
  return String(value);
}