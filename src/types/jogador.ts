export type Estatisticas = {
  passe?: {
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
  defesa?: {
    sack: number
    pressao: number
    flag_retirada: number
    flag_perdida: number
    interceptacao_forcada?: number
    passe_desviado?: number
    td_defensivo?: number
  }
}

export type Jogador = {
  id?: number
  nome?: string
  time?: string
  timeId?: number
  numero?: number
  idade?: number
  altura?: number
  peso?: number
  instagram?: string
  instagram2?: string
  cidade?: string
  camisa?: string
  estatisticas?: Estatisticas
}
