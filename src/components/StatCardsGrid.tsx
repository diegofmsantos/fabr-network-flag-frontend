import React from 'react';
import { StatKey } from '@/components/Ranking/RankingGroup';
import { Jogador } from '@/types/jogador';
import { Time } from '@/types/time';
import { calculateStat, compareValues, shouldIncludePlayer } from '@/utils/statMappings';
import { RankingCard } from '@/components/Ranking/RankingCard';

// Define the prop types clearly to avoid type errors
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
  players: PlayerCardProps[];
}

interface StatCardsGridProps {
  stats: StatCardProps[];
  category: string;
}

// Function to prepare player stats for display in cards
export const prepareStatsForCards = (
  players: Jogador[],
  times: Time[],
  currentStats: Array<{ key: StatKey; title: string }>,
  categoryTitle: string
): StatCardProps[] => {
  return currentStats.map(stat => {
    // Filter players for this stat
    const filteredPlayers = players
      .filter(player => shouldIncludePlayer(player, stat.key, categoryTitle))
      .sort((a, b) => {
        const aValue = calculateStat(a, stat.key);
        const bValue = calculateStat(b, stat.key);
        return compareValues(aValue, bValue);
      })
      .slice(0, 5);

    // Normalize function for file paths
    const normalizeForFilePath = (input: string): string => {
      if (!input) return '';

      return input
        .toLowerCase()
        .replace(/\s+/g, '-')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9-]/g, '');
    };

    // Format players for card display
    const formattedPlayers = filteredPlayers.map((player, index) => {
      const teamInfo = times.find(t => t.id === player.timeId) || {};
      const value = calculateStat(player, stat.key);

      return {
        id: player.id,
        name: player.nome,
        team: teamInfo.nome || 'Time Desconhecido',
        value: value !== null ? String(value) : 'N/A',
        camisa: player.camisa,
        teamColor: index === 0 ? teamInfo.cor : undefined,
        teamLogo: `/assets/times/logos/${normalizeForFilePath(teamInfo.nome || '')}.png`,
        isFirst: index === 0
      };
    });

    return {
      title: stat.title,
      category: categoryTitle,
      players: formattedPlayers
    };
  });
};

// The StatCardsGrid component
export const StatCardsGrid: React.FC<StatCardsGridProps> = ({ stats }) => {
  return (
    <div className="hidden lg:grid grid-cols-2 gap-6">
      {stats.map((stat, index) => (
        <div key={index}>
          <RankingCard
            title={stat.title}
            category={stat.category}
            players={stat.players}
          />
        </div>
      ))}
    </div>
  );
};

export default StatCardsGrid;