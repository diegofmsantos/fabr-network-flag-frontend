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
  // Verifique primeiro se a categoria existe nas estatísticas do jogador
  // No flag football, temos apenas "passe" e "defesa" como categorias
  if (!player.estatisticas) return null;
  
  let stats;
  const category = statMapping.category as string;

  // Para compatibilidade com a antiga estrutura, permite buscar estatísticas em subobjects
  if (category === 'ataque' || category === 'defesa') {
    stats = player.estatisticas[category];
  } else {
    // Para estatísticas que eram agrupadas em subcategorias no futebol americano,
    // mas agora estão diretamente em "passe" no flag football
    const possibleCategories = ['ataque', 'defesa'];
    for (const cat of possibleCategories) {
      if (player.estatisticas[cat] && statMapping.key in player.estatisticas[cat]) {
        stats = player.estatisticas[cat];
        break;
      }
    }
  }
  
  if (!stats) return null;

  const statValue = StatsCalculator.calculate(stats, statMapping.key)
  if (statValue === null) return null

  const baseStat = BaseStatCalculator.calculate(stats, statMapping.category as CategoryKey)
  const formattedValue = StatsFormatter.format(statValue, statMapping);

  const average = typeof statValue === 'string' && statValue.includes('/')
    ? Number(statValue.split('/')[0]) 
    : Number(statValue);

  return { player, average, baseStat, teamInfo: getTeamInfo(player.timeId), value: formattedValue }
}

export function filterValidPlayer(player: ProcessedPlayer | null): player is ProcessedPlayer { 
  return player !== null;
}

export function sortByAverage(a: ProcessedPlayer, b: ProcessedPlayer): number {
  if (typeof a.value === 'string' && typeof b.value === 'string' &&
    a.value.includes('/') && b.value.includes('/')) {
    const [acertosA, tentativasA] = a.value.split('/').map(Number)
    const [acertosB, tentativasB] = b.value.split('/').map(Number)

    // Prevenir divisão por zero
    const proporcaoA = tentativasA > 0 ? acertosA / tentativasA : 0;
    const proporcaoB = tentativasB > 0 ? acertosB / tentativasB : 0;

    if (proporcaoA === proporcaoB) return acertosB - acertosA

    return proporcaoB - proporcaoA
  }
  return b.average - a.average
}