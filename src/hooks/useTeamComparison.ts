import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/libs/axios';
import { Time } from '@/types/time';

// Estruturas de estatísticas atualizadas
interface TeamOffenseStats {
  // Estatísticas de passe
  passes_completos: number;
  passes_tentados: number;
  passes_percentual: number;
  td_passado: number;
  interceptacoes_sofridas: number;
  sacks_sofridos: number;
  // Estatísticas de corrida/recepção incluídas na mesma categoria no backend
  corrida: number;
  tds_corridos: number;
  recepcao: number;
  alvo: number;
  td_recebido: number;
}

interface TeamDefenseStats {
  flag_retirada: number;
  flag_perdida: number;
  sack: number;
  pressao: number;
  interceptacao_forcada: number;
  passe_desviado: number;
  td_defensivo: number;
}

interface PlayerHighlight {
  id: number;
  nome: string;
  camisa: string;
  numero: number;
  estatisticas: {
    passe?: Record<string, any>;
    corrida?: Record<string, any>;
    recepcao?: Record<string, any>;
    defesa?: Record<string, any>;
  };
}

interface TeamComparisonDetail {
  id: number;
  nome: string;
  sigla: string;
  cor: string;
  regiao: string; // Novo campo
  sexo: string;   // Novo campo
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

interface TeamComparisonData {
  teams: {
    time1: TeamComparisonDetail;
    time2: TeamComparisonDetail;
  }
}

export function useTeamComparison() {
  const [selectedTeams, setSelectedTeams] = useState<{time1Id?: number, time2Id?: number}>({});
  const [temporada, setTemporada] = useState('2025'); // Default para flag football
  
  const teamsSelected = !!(selectedTeams.time1Id && selectedTeams.time2Id);
  
  const { data, isLoading, error, refetch } = useQuery<TeamComparisonData>({
    queryKey: ['teamComparison', selectedTeams.time1Id, selectedTeams.time2Id, temporada],
    queryFn: async () => {
      if (!teamsSelected) return null;
      
      // API compatível com a estrutura atualizada
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
  
  // Função para selecionar um time
  const selectTeam = (position: 'time1Id' | 'time2Id', teamId: number) => {
    setSelectedTeams(prev => ({
      ...prev,
      [position]: teamId
    }));
  };
  
  // Função para mudar a temporada
  const changeTemporada = (newTemporada: string) => {
    // Validar que a temporada é 2024 ou 2025
    if (newTemporada !== '2024' && newTemporada !== '2025') {
      console.warn(`Temporada inválida: ${newTemporada}, usando 2025`);
      newTemporada = '2025';
    }
    setTemporada(newTemporada);
  };
  
  // Função para trocar os times
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