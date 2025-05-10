import { Jogador } from '@/types/jogador'
import { StatConfig } from './statMappings'
import { TeamInfo } from '@/hooks/useTeamInfo'
import { ProcessedPlayer } from '@/types/processedPlayer'
import { CategoryKey } from './categoryThresholds'
import { StatsCalculator } from './statsCalculator'
import { BaseStatCalculator } from './baseStat'
import { StatsFormatter } from './statsFormater'

export function createProcessedPlayer(
  player: Jogador, 
  statMapping: StatConfig, 
  getTeamInfo: (timeId: number) => TeamInfo
): ProcessedPlayer | null {
  // Para flag football, precisamos verificar se a estatística está no lugar correto
  let stats;
  
  if (statMapping.category === 'ataque' || statMapping.category === 'defesa') {
    stats = player.estatisticas[statMapping.category];
  } else {
    // Se a categoria não for reconhecida, retornar null
    return null;
  }
  
  if (!stats) return null;

  const statValue = StatsCalculator.calculate(stats, statMapping.key);
  
  // Permitir 0 como valor válido para estatísticas (jogadores podem ter 0 em certas categorias)
  if (statValue === null || (typeof statValue === 'number' && statValue < 0)) return null;

  const baseStat = BaseStatCalculator.calculate(stats, statMapping.category as CategoryKey);
  const formattedValue = StatsFormatter.format(statValue, statMapping);

  // Cálculo de média ajustado
  let average: number;
  
  if (typeof statValue === 'string' && statValue.includes('/')) {
    // Para estatísticas no formato X/Y
    const [made, attempted] = statValue.split('/').map(Number);
    average = attempted > 0 ? made : 0;
  } else {
    average = Number(statValue) || 0;
  }

  return { 
    player, 
    average, 
    baseStat, 
    teamInfo: getTeamInfo(player.timeId), 
    value: formattedValue 
  };
}

export function filterValidPlayer(player: ProcessedPlayer | null): player is ProcessedPlayer { 
  return player !== null;
}

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
  
  // Para valores numéricos normais
  return b.average - a.average;
}