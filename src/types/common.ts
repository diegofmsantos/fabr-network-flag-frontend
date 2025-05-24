export type Temporada = '2024' | '2025'

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number
  page: number
  limit: number
}

// Tipos para componentes UI
export interface PlayerCardProps {
  id: number
  name: string
  team: string
  value: string
  camisa: string
  teamColor?: string
  teamLogo?: string
  isFirst?: boolean
}

export interface TeamCardProps {
  id: number
  name: string
  value: string
  teamColor?: string
  isFirst?: boolean
}

export interface StatCardProps {
  title: string
  category: string
  players: PlayerCardProps[]
}

// Tipos para estatísticas
export type StatCategory = 'passe' | 'corrida' | 'recepcao' | 'defesa'

export interface StatConfig {
  key: string
  title: string
  category: StatCategory
  isCalculated?: boolean
}