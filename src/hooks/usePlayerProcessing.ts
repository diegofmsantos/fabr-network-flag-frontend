// src/hooks/usePlayerProcessing.ts
import { Jogador } from '@/types/jogador'
import { StatConfig } from '@/utils/mappings/statMappings'
import { TeamInfo } from './useTeamInfo'
import { ProcessedPlayer } from '@/types/processedPlayer'
import { StatsCalculator } from '@/utils/statsCalculator'
import { BaseStatCalculator } from '@/utils/baseStat'
import { StatsFormatter } from '@/utils/statsFormater'
import { CategoryKey } from '@/utils/categoryThresholds'

/**
 * Hook para processar jogadores e suas estatísticas
 */
export const usePlayerProcessing = (statMapping: StatConfig, getTeamInfo: (timeId: number) => TeamInfo) => {
  const processPlayers = (players: Jogador[]): ProcessedPlayer[] => {
    return players
      .map(player => createProcessedPlayer(player, statMapping, getTeamInfo))
      .filter(filterValidPlayer)
      .sort(sortByAverage)
  }

  return { processPlayers }
}

/**
 * Cria um jogador processado com base na estatística selecionada
 */
export function createProcessedPlayer(player: Jogador, statMapping: StatConfig, getTeamInfo: (timeId: number) => TeamInfo): ProcessedPlayer | null {
  // Verificar se o jogador tem estatísticas
  if (!player.estatisticas) return null;
  
  // Mapear a categoria da estatística para a nova estrutura
  const categoryMapping: Record<string, CategoryKey> = {
    'passe': 'passe',
    'corrida': 'corrida',
    'recepcao': 'recepcao',
    'defesa': 'defesa',
  };
  
  // Obter a categoria mapeada ou usar a original se for uma das novas categorias
  const mappedCategory = categoryMapping[statMapping.category as string] || statMapping.category as CategoryKey;
  
  // Buscar estatísticas na categoria mapeada
  let stats = player.estatisticas[mappedCategory];

  // Se não encontrou na categoria mapeada, tentar encontrar em qualquer categoria
  if (!stats) {
    // Tentar encontrar em qualquer uma das categorias válidas
    const validCategories: CategoryKey[] = ['passe', 'corrida', 'recepcao', 'defesa'];
    for (const cat of validCategories) {
      if (player.estatisticas[cat] && 
          typeof player.estatisticas[cat] === 'object' && 
          statMapping.key in player.estatisticas[cat]) {
        stats = player.estatisticas[cat];
        break;
      }
    }
  }
  
  // Se ainda não encontrou estatísticas, retornar null
  if (!stats) return null;

  // Calcular valor da estatística
  const statValue = StatsCalculator.calculate(stats, statMapping.key);
  if (statValue === null) return null;

  // Calcular estatística base para tier
  const baseStat = BaseStatCalculator.calculate(stats, mappedCategory);
  
  // Formatar valor para exibição
  const formattedValue = StatsFormatter.format(statValue, statMapping);

  // Calcular valor médio para ordenação
  let average: number;
  if (typeof statValue === 'string' && statValue.includes('/')) {
    // Para estatísticas no formato "X/Y"
    const [made, attempted] = statValue.split('/').map(Number);
    average = attempted > 0 ? made : 0;
  } else if (statMapping.key === 'passes_percentual' && typeof statValue === 'number') {
    // Para percentuais de passe
    average = statValue;
  } else {
    // Para valores numéricos simples
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
 * Ordena jogadores por valor médio
 */
export function sortByAverage(a: ProcessedPlayer, b: ProcessedPlayer): number {
  // Tratamento especial para estatísticas no formato X/Y
  if (typeof a.value === 'string' && typeof b.value === 'string' &&
      a.value.includes('/') && b.value.includes('/')) {
    
    const [acertosA, tentativasA] = a.value.split('/').map(Number);
    const [acertosB, tentativasB] = b.value.split('/').map(Number);

    // Calcular proporção com proteção contra divisão por zero
    const proporcaoA = tentativasA > 0 ? acertosA / tentativasA : 0;
    const proporcaoB = tentativasB > 0 ? acertosB / tentativasB : 0;

    // Se as proporções forem iguais, ordenar por número absoluto de acertos
    if (proporcaoA === proporcaoB) return acertosB - acertosA;

    return proporcaoB - proporcaoA;
  }
  
  // Tratamento especial para percentuais (já que são arredondados na exibição)
  if (a.value.toString().includes('%') && b.value.toString().includes('%')) {
    return b.average - a.average;
  }
  
  // Para valores numéricos normais
  return b.average - a.average;
}