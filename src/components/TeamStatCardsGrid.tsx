import React from 'react';
import { Time } from '@/types/time';
import { TeamRankingCard } from '@/components/Ranking/TimeRankingCard';
import { getCategoryFromKey } from '@/components/Ranking/TimeRankingGroup';

interface TeamCardProps {
  id: number;
  name: string;
  value: string;
  teamColor?: string;
  isFirst?: boolean;
}

interface TeamStatCardProps {
  title: string;
  category: string;
  teams: TeamCardProps[];
}

interface TeamStatCardsGridProps {
  stats: TeamStatCardProps[];
  category: string;
}

const formatStatValue = (value: number | null, statKey: string, title: string): string => {
  if (value === null) return 'N/A';

  if (
    statKey.includes('percentual') || 
    title.includes('(%)')
  ) {
    return `${Math.round(value)}%`;
  }

  return Math.round(value).toLocaleString('pt-BR');
};

export const prepareTeamStatsForCards = (
  teamStats: any[],
  times: Time[],
  currentStats: Array<{ key: string; title: string }>,
  categoryTitle: string
): TeamStatCardProps[] => {
  return currentStats.map(stat => {

    const rankedTeams = teamStats
      .map(teamStat => {
        const category = getCategoryFromKey(stat.key);
        let value: number | null = null;

        try {
          switch (stat.key) {
            case 'passes_percentual':
              value = teamStat.passe.passes_tentados > 0
                ? (teamStat.passe.passes_completos / teamStat.passe.passes_tentados) * 100
                : null;
              break;
            default:
              if (category && teamStat[category] && stat.key in teamStat[category]) {
                value = teamStat[category][stat.key];
              } else {
                console.warn(`Estatística não encontrada: ${stat.key} em ${category}`);
                value = null;
              }
          }
        } catch (error) {
          console.error(`Erro ao calcular estatística ${stat.key} para time ${teamStat.timeId}:`, error);
          value = null;
        }

        return {
          teamId: teamStat.timeId,
          value
        };
      })
      .filter(team => team.value !== null && team.value > 0)
      .sort((a, b) => {
        if (a.value === null) return 1;
        if (b.value === null) return -1;

        return b.value - a.value;
      })
      .slice(0, 5);


    const getTeamInfo = (teamId: number) => {
      const team = times.find(t => t.id === teamId);
      return {
        id: team?.id || 0,
        nome: team?.nome || 'Time Desconhecido',
        cor: team?.cor || '#CCCCCC'
      };
    };

    const formattedTeams = rankedTeams.map((team, index) => {
      const teamInfo = getTeamInfo(team.teamId);
      
      return {
        id: teamInfo.id,
        name: teamInfo.nome,
        value: formatStatValue(team.value, stat.key, stat.title),
        teamColor: index === 0 ? teamInfo.cor : undefined,
        isFirst: index === 0
      };
    });

    return {
      title: stat.title,
      category: categoryTitle,
      teams: formattedTeams
    };
  }).filter(stat => stat.teams.length > 0); 
};

export const TeamStatCardsGrid: React.FC<TeamStatCardsGridProps> = ({ stats, category }) => {
  if (!stats || stats.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhuma estatística disponível para esta categoria.
      </div>
    );
  }

  return (
    <div className="hidden lg:grid grid-cols-2 gap-6 xl:ml-20">
      {stats.map((stat, index) => (
        <div key={index}>
          <TeamRankingCard
            title={stat.title}
            category={stat.category}
            teams={stat.teams}
          />
        </div>
      ))}
    </div>
  );
};

export default TeamStatCardsGrid;