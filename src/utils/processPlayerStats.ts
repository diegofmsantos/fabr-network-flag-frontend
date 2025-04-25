import { Jogador } from "@/types/jogador";
import { Time } from "@/types/time";
import { calculateStat, compareValues, shouldIncludePlayer } from "@/utils/statMappings";
import { StatKey } from "@/components/Ranking/RankingGroup";

// Tipo para os cards de estatísticas processados
export interface ProcessedStatCard {
  title: string;
  category: string;
  players: Array<{
    id: number;
    name: string;
    team: string;
    value: string;
    camisa: string;
    teamColor?: string;
    teamLogo?: string;
    isFirst?: boolean;
  }>;
}

/**
 * Processa os dados dos jogadores para cada estatística dentro de uma categoria
 */
export const processPlayerStats = (
  players: Jogador[],
  times: Time[],
  stats: Array<{ key: StatKey; title: string }>,
  categoryTitle: string
): ProcessedStatCard[] => {
  // Normaliza o caminho do arquivo
  const normalizeForFilePath = (input: string): string => {
    return input
      .toLowerCase()
      .replace(/\\s+/g, "-")
      .normalize("NFD")
      .replace(/[\\u0300-\\u036f]/g, "")
      .replace(/[^a-z0-9-]/g, "");
  };

  // Obtém informações do time
  const getTeamInfo = (timeId: number) => {
    const team = times.find((t) => t.id === timeId);
    return {
      nome: team?.nome || "Time Desconhecido",
      cor: team?.cor || "#CCCCCC",
    };
  };

  return stats.map((stat) => {
    const filteredPlayers = players
      .filter((player) => shouldIncludePlayer(player, stat.key, categoryTitle))
      .sort((a, b) => {
        const aValue = calculateStat(a, stat.key);
        const bValue = calculateStat(b, stat.key);
        return compareValues(aValue, bValue);
      })
      .slice(0, 5);

    return {
      title: stat.title,
      category: categoryTitle,
      players: filteredPlayers.map((player, playerIndex) => {
        const teamInfo = getTeamInfo(player.timeId);
        const value = calculateStat(player, stat.key);

        // Normaliza o valor para exibição
        const normalizeValue = (value: string | number | null, statKey: StatKey): string => {
          if (value === null) return "N/A";
          
          if (typeof value === "string") return value;
          
          const percentageStats = ["passes_percentual", "extra_points", "field_goals"];
          const averageStats = [
            "jardas_media",
            "jardas_corridas_media",
            "jardas_recebidas_media",
            "jardas_retornadas_media",
            "jardas_punt_media",
          ];
          
          if (percentageStats.includes(statKey)) {
            return `${Math.round(value)}%`;
          } else if (averageStats.includes(statKey)) {
            return value.toFixed(1);
          }
          
          return Math.round(value).toString();
        };

        return {
          id: player.id,
          name: player.nome,
          team: teamInfo.nome,
          value: normalizeValue(value, stat.key),
          camisa: player.camisa,
          teamColor: playerIndex === 0 ? teamInfo.cor : undefined,
          teamLogo: `/assets/times/logos/${normalizeForFilePath(teamInfo.nome)}.png`,
          isFirst: playerIndex === 0,
        };
      }),
    };
  });
};