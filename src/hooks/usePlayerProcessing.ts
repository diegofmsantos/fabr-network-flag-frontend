// src/hooks/usePlayerProcessing.ts
import { Jogador } from '@/types/jogador'
import { StatConfig } from '@/utils/statMappings'
import { TeamInfo } from './useTeamInfo'
import { ProcessedPlayer } from '@/types/processedPlayer'
import { StatsCalculator } from '@/utils/statsCalculator'
import { BaseStatCalculator } from '@/utils/baseStat'
import { StatsFormatter } from '@/utils/statsFormater'
import { CategoryKey } from '@/utils/categoryThresholds'

export const usePlayerProcessing = (statMapping: StatConfig, getTeamInfo: (timeId: number) => TeamInfo) => {
  
  const processPlayers = (players: Jogador[]): ProcessedPlayer[] => {
    return players
      .map(player => createProcessedPlayer(player, statMapping, getTeamInfo))
      .filter(filterValidPlayer)
      .sort(sortByAverage)
  }

  return { processPlayers }
}

export function createProcessedPlayer(player: Jogador, statMapping: StatConfig, getTeamInfo: (timeId: number) => TeamInfo): ProcessedPlayer | null {
  const stats = player.estatisticas[statMapping.category]
  if (!stats) return null

  // Remova qualquer verificação de requisitos mínimos aqui
  // ou relaxe os requisitos para PUNT e CHUTE específicos
  const statValue = StatsCalculator.calculate(stats, statMapping.key)
  if (statValue === null) return null

  const baseStat = BaseStatCalculator.calculate(stats, statMapping.category as CategoryKey)
  const formattedValue = StatsFormatter.format(statValue, statMapping);

  const average = typeof statValue === 'string' && statValue.includes('/')
    ? Number(statValue.split('/')[0]) // Usa apenas o número de acertos para média
    : Number(statValue);

  return { player, average, baseStat, teamInfo: getTeamInfo(player.timeId), value: formattedValue }
}

export function filterValidPlayer(player: ProcessedPlayer | null): player is ProcessedPlayer { 
  // Remove verificações desnecessárias
  return player !== null;
}

export function sortByAverage(a: ProcessedPlayer, b: ProcessedPlayer): number {
  if (typeof a.value === 'string' && typeof b.value === 'string' &&
    a.value.includes('/') && b.value.includes('/')) {
    const [acertosA, tentativasA] = a.value.split('/').map(Number)
    const [acertosB, tentativasB] = b.value.split('/').map(Number)

    const proporcaoA = acertosA / tentativasA;
    const proporcaoB = acertosB / tentativasB;

    if (proporcaoA === proporcaoB) return acertosB - acertosA

    return proporcaoB - proporcaoA
  }
  return b.average - a.average
}