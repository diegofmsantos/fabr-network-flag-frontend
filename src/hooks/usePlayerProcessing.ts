import { Jogador } from '@/types/jogador'
import { StatConfig } from '@/utils/statMappings'
import { TeamInfo } from './useTeamInfo'
import { ProcessedPlayer } from '@/types/processedPlayer'
import { createProcessedPlayer, filterValidPlayer, sortByAverage } from '@/utils/playerProcessor'

export const usePlayerProcessing = (statMapping: StatConfig, getTeamInfo: (timeId: number) => TeamInfo) => {
  
  const processPlayers = (players: Jogador[]): ProcessedPlayer[] => {
    return players
      .map(player => createProcessedPlayer(player, statMapping, getTeamInfo))
      .filter(filterValidPlayer)
      .sort(sortByAverage)
  }

  return { processPlayers }
}