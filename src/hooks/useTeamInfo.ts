import { Time } from '@/types/time'

export interface TeamInfo {
  nome: string
  cor: string
}

export const useTeamInfo = (times: Time[]) => {
  return (timeId: number): TeamInfo => {
    const team = times.find((t) => t.id === timeId)
    return {
      nome: team?.nome || 'time-desconhecido',
      cor: team?.cor || '#CCCCCC',
    }
  }
}