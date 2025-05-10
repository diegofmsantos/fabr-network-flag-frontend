export interface StatsBase {
  passe: AtaqueStats
  defesa: DefesaStats

}

export interface AtaqueStats {
  passes_completos?: number
  passes_tentados?: number
  td_passado?: number
  interceptacoes_sofridas?: number
  sacks_sofridos?: number
  corrida?: number
  tds_corridos?: number
  recepcao?: number
  alvo?: number
  td_recebido?: number
}


export interface DefesaStats {
  sack?: number
  pressao?: number
  flag_retirada?: number
  flag_perdida?: number
  interceptacao_forcada?: number
  passe_desviado?: number
  td_defensivo?: number
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
  jardas_media: number | null
  jardas_corridas_media: number | null
  jardas_recebidas_media: number | null
  jardas_retornadas_media: number | null
  jardas_punt_media: number | null
  passes_percentual: number | null

}

export type StatType = 'ATAQUE' | 'DEFESA'

export interface TeamStats {
  timeId: number
  ataque: {
    passes_completos?: number
    passes_tentados?: number
    td_passado?: number
    interceptacoes_sofridas?: number
    sacks_sofridos?: number
    corrida?: number
    tds_corridos?: number
    recepcao?: number
    alvo?: number
    td_recebido?: number
  }
  defesa: {
    sack: number
    pressao: number
    flag_retirada: number
    flag_perdida: number
    tackles_totais: number
    tackles_for_loss: number
    sacks_forcado: number
    fumble_forcado: number
    interceptacao_forcada: number
    passe_desviado: number
    safety: number
    td_defensivo: number
  }
}