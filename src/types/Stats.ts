// src/types/Stats.ts

export interface StatsBase {
  passe: PasseStats
  corrida: CorridaStats
  recepcao: RecepcaoStats
  defesa: DefesaStats
}

export interface PasseStats {
  passes_completos: number
  passes_tentados: number
  passes_incompletos: number
  jds_passe: number
  td_passe: number
  passe_xp1: number
  passe_xp2: number
  int_sofridas: number
  sacks_sofridos: number
  pressao_pct: string
}

export interface CorridaStats {
  corridas: number
  jds_corridas: number
  tds_corridos: number
  corrida_xp1: number
  corrida_xp2: number
}

export interface RecepcaoStats {
  recepcoes: number
  alvos: number
  drops: number
  jds_recepcao: number
  jds_yac: number
  tds_recepcao: number
  recepcao_xp1: number
  recepcao_xp2: number
}

export interface DefesaStats {
  tck: number
  tfl: number
  pressao_pct: string
  sacks: number
  tip: number
  int: number
  tds_defesa: number
  defesa_xp2: number
  sft: number
  sft_1: number
  blk: number
  jds_defesa: number
}

export interface StatGroup {
  title: string
  groupLabel: string
  stats: Array<{
    title: string
    urlParam: string
  }>
}

export interface CalculatedStats {
  passes_percentual: number | null
  jardas_passe_media: number | null
  jardas_corrida_media: number | null
  jardas_recepcao_media: number | null
}

export type StatType = 'PASSE' | 'CORRIDA' | 'RECEPÇÃO' | 'DEFESA'

export interface TeamStats {
  timeId: number
  passe: PasseStats
  corrida: CorridaStats
  recepcao: RecepcaoStats
  defesa: DefesaStats
}