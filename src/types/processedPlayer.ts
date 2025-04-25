import { Jogador } from './jogador'
import { TeamInfo } from '../hooks/useTeamInfo'

export interface ProcessedPlayer {
  player: Jogador
  average: number
  baseStat: number
  teamInfo: TeamInfo
  value: string
}