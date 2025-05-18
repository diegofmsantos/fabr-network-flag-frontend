import { Jogador } from '@/types/jogador'
import { StatConfig } from './statMappings'
import { TeamInfo } from '@/hooks/useTeamInfo'
import { ProcessedPlayer } from '@/types/processedPlayer'
import { CategoryKey } from './categoryThresholds'
import { StatsCalculator } from './statsCalculator'
import { BaseStatCalculator } from './baseStat'
import { StatsFormatter } from './statsFormater'

/**
 * Cria um jogador processado com estatísticas formatadas baseadas no mapeamento fornecido
 */
export function createProcessedPlayer(
  player: Jogador, 
  statMapping: StatConfig, 
  getTeamInfo: (timeId: number) => TeamInfo
): ProcessedPlayer | null {
  // Verificar se o jogador tem estatísticas
  if (!player.estatisticas) return null;

  // Mapear a categoria da estatística para a nova estrutura
  const categoryMapping: Record<string, CategoryKey> = {
    'passe': 'passe',
    'corrida': 'corrida',
    'recepcao': 'recepcao',
    'defesa': 'defesa',
  };

  // Obter a categoria efetiva (mapeada ou original)
  const effectiveCategory = categoryMapping[statMapping.category] || statMapping.category as CategoryKey;
  
  // Buscar estatísticas na categoria correspondente
  let stats = player.estatisticas[effectiveCategory];
  
  // Se não encontrou na categoria principal, tentar buscar em qualquer categoria válida
  if (!stats) {
    const validCategories: CategoryKey[] = ['passe', 'corrida', 'recepcao', 'defesa'];
    
    for (const category of validCategories) {
      if (player.estatisticas[category] && 
          typeof player.estatisticas[category] === 'object' &&
          player.estatisticas[category] !== null) {
            
        // Verifica se a chave estatística existe nesta categoria
        if (statMapping.key in player.estatisticas[category]) {
          stats = player.estatisticas[category];
          break;
        }
      }
    }
  }
  
  // Se ainda não encontrou estatísticas, retornar null
  if (!stats) return null;

  // Calcular o valor da estatística
  const statValue = StatsCalculator.calculate(stats, statMapping.key);
  
  // Permitir 0 como valor válido para estatísticas (jogadores podem ter 0 em certas categorias)
  if (statValue === null || (typeof statValue === 'number' && statValue < 0)) return null;

  // Calcular estatística base para determinar tier
  const baseStat = BaseStatCalculator.calculate(stats, effectiveCategory);
  
  // Formatar valor para exibição
  const formattedValue = StatsFormatter.format(statValue, statMapping);

  // Cálculo de média ajustado para diferentes tipos de estatísticas
  let average: number;
  
  if (typeof statValue === 'string' && statValue.includes('/')) {
    // Para estatísticas no formato X/Y
    const [made, attempted] = statValue.split('/').map(Number);
    average = attempted > 0 ? made : 0;
  } else if (statMapping.key === 'passes_percentual' && typeof statValue === 'number') {
    // Para percentuais
    average = statValue;
  } else {
    // Para valores numéricos normais
    average = Number(statValue) || 0;
  }

  // Retornar jogador processado
  return { 
    player, 
    average, 
    baseStat, 
    teamInfo: getTeamInfo(player.timeId), 
    value: formattedValue 
  };
}

/**
 * Filtra jogadores válidos (não nulos)
 */
export function filterValidPlayer(player: ProcessedPlayer | null): player is ProcessedPlayer { 
  return player !== null;
}

/**
 * Ordena jogadores por valor médio, com tratamento especial para diferentes tipos de estatísticas
 */
export function sortByAverage(a: ProcessedPlayer, b: ProcessedPlayer): number {
  // Tratamento especial para estatísticas no formato X/Y
  if (typeof a.value === 'string' && typeof b.value === 'string' &&
      a.value.includes('/') && b.value.includes('/')) {
    
    const [acertosA, tentativasA] = a.value.split('/').map(Number);
    const [acertosB, tentativasB] = b.value.split('/').map(Number);

    // Prevenir divisão por zero
    const proporcaoA = tentativasA > 0 ? acertosA / tentativasA : 0;
    const proporcaoB = tentativasB > 0 ? acertosB / tentativasB : 0;

    // Se as proporções forem iguais, ordenar por número absoluto de acertos
    if (proporcaoA === proporcaoB) return acertosB - acertosA;

    return proporcaoB - proporcaoA;
  }
  
  // Tratamento especial para percentuais
  if (a.value.toString().includes('%') && b.value.toString().includes('%')) {
    return b.average - a.average;
  }
  
  // Para valores numéricos normais
  return b.average - a.average;
}