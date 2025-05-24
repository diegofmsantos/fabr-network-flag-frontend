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

/**
 * Formata o valor da estatística para exibição
 */
const formatStatValue = (value: number | null, statKey: string, title: string): string => {
  if (value === null) return 'N/A';

  // Verifica se é estatística percentual
  if (
    statKey.includes('percentual') ||
    title.includes('(%)') ||
    title.includes('Percentual')
  ) {
    return `${Math.round(value)}%`;
  }

  // Para valores regulares, retorna com formatação de número
  return Math.round(value).toLocaleString('pt-BR');
};

/**
 * Prepara os dados dos times para exibição nos cards
 */
export const prepareTeamStatsForCards = (
  teamStats: any[],
  times: Time[],
  currentStats: Array<{ key: string; title: string }>,
  categoryTitle: string
): TeamStatCardProps[] => {
  return currentStats.map(stat => {
    // Obter a categoria correta para a estatística (passe, corrida, recepcao, defesa)
    const category = getCategoryFromKey(stat.key);

    const rankedTeams = teamStats
      .map(teamStat => {
        let value: number | null = null;

        try {
          // Casos especiais para estatísticas calculadas
          if (stat.key === 'passes_percentual') {
            const passesObj = teamStat.passe || {};
            const tentados = passesObj.passes_tentados || 0;
            const completos = passesObj.passes_completos || 0;
            value = tentados > 0 ? (completos / tentados) * 100 : null;
          }
          // Para estatísticas de jardas por corrida/recepção médias
          else if (stat.key === 'jds_corridas_media') {
            const corridaObj = teamStat.corrida || {};
            const jardas = corridaObj.jds_corridas || 0;
            const corridas = corridaObj.corridas || 0;
            value = corridas > 0 ? jardas / corridas : null;
          }
          else if (stat.key === 'jds_recepcao_media') {
            const recepcaoObj = teamStat.recepcao || {};
            const jardas = recepcaoObj.jds_recepcao || 0;
            const recepcoes = recepcaoObj.recepcoes || 0;
            value = recepcoes > 0 ? jardas / recepcoes : null;
          }
          // Estatísticas padrão
          else if (category && teamStat[category]) {
            value = teamStat[category][stat.key] || 0;
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
      .slice(0, 5); // Limita para os 5 melhores times

    // Obter informações completas do time para exibição
    const getTeamInfo = (teamId: number) => {
      const team = times.find(t => t.id === teamId);
      return {
        id: team?.id || 0,
        nome: team?.nome || 'Time Desconhecido',
        cor: team?.cor || '#CCCCCC'
      };
    };

    // Formatar os times para exibição nos cards
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
  }).filter(stat => stat.teams.length > 0); // Remove estatísticas sem times
};

/**
 * Componente que exibe as estatísticas de times em formato de grid
 */
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