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

// Função para lidar com a formatação de valores estatísticos
const formatStatValue = (value: number | null, statKey: string, title: string): string => {
  if (value === null) return 'N/A';
  
  // Formatar porcentagens
  if (
    statKey.includes('percentual') || 
    statKey === 'field_goals' || 
    statKey === 'extra_points' || 
    title.includes('(%)') || 
    title === 'FG(%)' || 
    title === 'XP(%)'
  ) {
    return `${Math.round(value)}%`;
  }
  
  // Formatar médias
  if (
    statKey.includes('media') || 
    title.includes('(AVG)')
  ) {
    return value.toFixed(1).replace('.', ',');
  }
  
  // Formatar números
  return Math.round(value).toLocaleString('pt-BR');
};

// Função para preparar os dados de times para exibição em cartões
export const prepareTeamStatsForCards = (
  teamStats: any[],
  times: Time[],
  currentStats: Array<{ key: string; title: string }>,
  categoryTitle: string
): TeamStatCardProps[] => {
  return currentStats.map(stat => {
    // Calcular estatísticas para cada time
    const rankedTeams = teamStats
      .map(teamStat => {
        const category = getCategoryFromKey(stat.key);
        let value: number | null = null;

        try {
          // Lidar com estatísticas calculadas
          switch (stat.key) {
            case 'passes_percentual':
              value = teamStat.passe.passes_tentados > 0
                ? (teamStat.passe.passes_completos / teamStat.passe.passes_tentados) * 100
                : null;
              break;
            case 'jardas_media':
              value = teamStat.passe.passes_tentados > 0
                ? teamStat.passe.jardas_de_passe / teamStat.passe.passes_tentados
                : null;
              break;
            case 'jardas_corridas_media':
              value = teamStat.corrida.corridas > 0
                ? teamStat.corrida.jardas_corridas / teamStat.corrida.corridas
                : null;
              break;
            case 'jardas_recebidas_media':
              value = teamStat.recepcao.alvo > 0
                ? teamStat.recepcao.jardas_recebidas / teamStat.recepcao.alvo
                : null;
              break;
            case 'jardas_retornadas_media':
              value = teamStat.retorno.retornos > 0
                ? teamStat.retorno.jardas_retornadas / teamStat.retorno.retornos
                : null;
              break;
            case 'jardas_punt_media':
              value = teamStat.punter.punts > 0
                ? teamStat.punter.jardas_de_punt / teamStat.punter.punts
                : null;
              break;
            case 'extra_points':
              value = teamStat.kicker.tentativas_de_xp > 0
                ? (teamStat.kicker.xp_bons / teamStat.kicker.tentativas_de_xp) * 100
                : null;
              break;
            case 'field_goals':
              value = teamStat.kicker.tentativas_de_fg > 0
                ? (teamStat.kicker.fg_bons / teamStat.kicker.tentativas_de_fg) * 100
                : null;
              break;
            default:
              // Estatísticas diretas
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
        // Lidar com valores nulos ou indefinidos
        if (a.value === null) return 1;
        if (b.value === null) return -1;
        // Ordenar em ordem decrescente
        return b.value - a.value;
      })
      .slice(0, 5);

    // Obter informações do time
    const getTeamInfo = (teamId: number) => {
      const team = times.find(t => t.id === teamId);
      return {
        id: team?.id || 0,
        nome: team?.nome || 'Time Desconhecido',
        cor: team?.cor || '#CCCCCC'
      };
    };

    // Formatar cada time para exibição
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
  });
};

// O componente TeamStatCardsGrid
export const TeamStatCardsGrid: React.FC<TeamStatCardsGridProps> = ({ stats, category }) => {
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