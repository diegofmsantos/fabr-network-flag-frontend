import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/libs/axios';
import { Time } from '@/types/time';

interface TeamComparisonData {
  teams: {
    time1: TeamComparisonDetail;
    time2: TeamComparisonDetail;
  }
}

interface TeamComparisonDetail {
  id: number;
  nome: string;
  sigla: string;
  cor: string;
  logo: string;
  estatisticas: {
    ataque: TeamOffenseStats;
    defesa: TeamDefenseStats;
  };
  destaques: {
    ataque: {
      passador: PlayerHighlight | null;
      corredor: PlayerHighlight | null;
      recebedor: PlayerHighlight | null;
    };
    defesa: {
      flagRetirada: PlayerHighlight | null;
      pressao: PlayerHighlight | null;
      interceptador: PlayerHighlight | null;
    };
  };
}

interface TeamOffenseStats {
  passes_completos: number;
  passes_tentados: number;
  passes_percentual: number;
  td_passado: number;
  interceptacoes_sofridas: number;
  sacks_sofridos: number;
  corrida: number;
  tds_corridos: number;
  recepcao: number;
  alvo: number;
  td_recebido: number;
}

interface TeamDefenseStats {
  sack: number;
  pressao: number;
  flag_retirada: number;
  flag_perdida: number;
  passe_desviado: number;
  interceptacao_forcada: number;
  td_defensivo: number;
}

interface PlayerHighlight {
  id: number;
  nome: string;
  camisa: string;
  numero: number;
  estatisticas: any;
}

export function useTeamComparison() {
  const [selectedTeams, setSelectedTeams] = useState<{time1Id?: number, time2Id?: number}>({});
  const [temporada, setTemporada] = useState('2025');

  const teamsSelected = !!(selectedTeams.time1Id && selectedTeams.time2Id);
  
  const { data, isLoading, error, refetch } = useQuery<TeamComparisonData>({
    queryKey: ['teamComparison', selectedTeams.time1Id, selectedTeams.time2Id, temporada],
    queryFn: async () => {
      if (!teamsSelected) return null;
      
      const { data } = await api.get('/comparar-times', {
        params: {
          time1Id: selectedTeams.time1Id,
          time2Id: selectedTeams.time2Id,
          temporada
        }
      });
      
      return data;
    },
    enabled: teamsSelected,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const selectTeam = (position: 'time1Id' | 'time2Id', teamId: number) => {
    setSelectedTeams(prev => ({
      ...prev,
      [position]: teamId
    }));
  };

  const changeTemporada = (newTemporada: string) => {
    setTemporada(newTemporada);
  };

  const swapTeams = () => {
    setSelectedTeams(prev => ({
      time1Id: prev.time2Id,
      time2Id: prev.time1Id
    }));
  };

  return {
    data,
    isLoading,
    error,
    teamsSelected,
    selectedTeams,
    temporada,
    selectTeam,
    changeTemporada,
    swapTeams,
    refetch
  };
}