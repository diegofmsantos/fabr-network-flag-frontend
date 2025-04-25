export const queryKeys = {
  times: (temporada: string) => ['times', temporada],
  jogadores: (temporada: string) => ['jogadores', temporada],
  noticias: ['noticias']
} as const