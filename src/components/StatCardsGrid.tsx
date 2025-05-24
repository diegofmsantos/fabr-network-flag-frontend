import React from 'react';
import { StatKey } from '@/components/Ranking/RankingGroup';
import { Jogador } from '@/types/jogador';
import { Time } from '@/types/time';
import { RankingCard } from '@/components/Ranking/RankingCard';
import { normalizeForFilePath } from '@/utils/utils';
import { shouldIncludePlayer } from '@/utils/validations/statValidatioons';
import { calculateStat, compareValues } from '@/utils/calculations/statCalculations';

interface PlayerCardProps {
  id: number;
  name: string;
  team: string;
  value: string;
  camisa: string;
  teamColor?: string;
  teamLogo?: string;
  isFirst?: boolean;
}

interface StatCardProps {
  title: string;
  category: string;
  key: string;
  players: PlayerCardProps[];
}

interface StatCardsGridProps {
  stats: StatCardProps[];
  category: string;
}

export const prepareStatsForCards = (
  players: Jogador[],
  times: Time[],
  currentStats: Array<{ key: StatKey; title: string }>,
  categoryTitle: string
): StatCardProps[] => {


  return currentStats.map(stat => {
    const filteredPlayers = players
      .filter(player => shouldIncludePlayer(player, stat.key, categoryTitle))
      .sort((a, b) => {
        const aValue = calculateStat(a, stat.key);
        const bValue = calculateStat(b, stat.key);
        return compareValues(aValue, bValue);
      })
      .slice(0, 5);

   

    const formattedPlayers = filteredPlayers.map((player, index) => {
      const teamInfo = times.find(t => t.id === player.timeId);
      const value = calculateStat(player, stat.key);

      // Garantir propriedades seguras para o time
      const teamName = teamInfo?.nome || 'Time Desconhecido';
      const teamColor = teamInfo?.cor;

      return {
        id: player.id, // Agora TypeScript sabe que é number
        name: player.nome, // Agora TypeScript sabe que é string
        team: teamName,
        value: value !== null ? String(value) : 'N/A',
        camisa: player.camisa, // Agora TypeScript sabe que é string
        teamColor: index === 0 ? teamColor : undefined,
        teamLogo: `/assets/times/logos/${normalizeForFilePath(teamName)}.png`,
        isFirst: index === 0
      };
    });

    return {
      title: stat.title,
      category: categoryTitle,
      key: stat.key,
      players: formattedPlayers  // Pode ser vazio
    };
  });
};

export const StatCardsGrid: React.FC<StatCardsGridProps> = ({ stats, category }) => {
  // Não exibe nada se não houver estatísticas
  if (!stats || stats.length === 0) {
    return (
      <div className="lg:py-6 text-center text-gray-500">
        Nenhuma estatística disponível para esta categoria.
      </div>
    );
  }

  return (
    <div className="hidden lg:grid grid-cols-2 gap-6">
      {stats.map((stat, index) => (
        <div key={index}>
          <RankingCard
            title={stat.title}
            category={category}
            stat={stat.key}
            players={stat.players.length > 0 ? stat.players : []}
            showEmptyMessage={stat.players.length === 0}
          />
        </div>
      ))}
    </div>
  );
};

export default StatCardsGrid;