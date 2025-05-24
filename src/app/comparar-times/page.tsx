"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTimes } from '@/hooks/queries';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, BarChart2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Loading } from '@/components/ui/Loading';
import { TeamComparisonHeader } from '@/components/Comparar-Times/TeamComparisonHeader';
import { StatComparisonCard } from '@/components/Comparar-Times/StatComparisonCard';
import { PlayerComparisonCard } from '@/components/Comparar-Times/PlayerComparisonCard';
import { prepareChartData, calculatePassPercentage, type TeamComparisonData } from '@/utils/comparisons/chartDataHelpers';

export default function CompararTimesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [temporada, setTemporada] = useState(searchParams?.get('temporada') || '2025');

  // Estados para controlar a seleção de times e dados de comparação
  const [selectedTeams, setSelectedTeams] = useState<{ time1Id?: number, time2Id?: number }>({});
  const [comparisonData, setComparisonData] = useState<TeamComparisonData | null>(null);
  const [loadingComparison, setLoadingComparison] = useState(false);

  // Buscar lista de times
  const { data: times = [], isLoading: loadingTimes } = useTimes(temporada);

  // Estado para controlar a aba ativa (estatísticas ou gráficos)
  const [activeTab, setActiveTab] = useState<'estatisticas' | 'graficos'>('estatisticas');
  const [activeChartCategory, setActiveChartCategory] = useState<'passe' | 'corrida' | 'recepcao' | 'defesa'>('passe');

  // Efeito para inicializar a seleção com base nos parâmetros da URL
  useEffect(() => {
    const time1Id = searchParams?.get('time1');
    const time2Id = searchParams?.get('time2');

    if (time1Id) selectTeam('time1Id', Number(time1Id));
    if (time2Id) selectTeam('time2Id', Number(time2Id));
  }, [searchParams]);

  // Efeito para carregar dados quando os times forem selecionados
  useEffect(() => {
    if (selectedTeams.time1Id && selectedTeams.time2Id) {
      loadComparisonData();
      updateURL();
    }
  }, [selectedTeams, temporada]);

  // Função para carregar dados de comparação
  const loadComparisonData = async () => {
    if (!selectedTeams.time1Id || !selectedTeams.time2Id) return;

    try {
      setLoadingComparison(true);
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
      const url = `${apiBaseUrl}/comparar-times?time1Id=${selectedTeams.time1Id}&time2Id=${selectedTeams.time2Id}&temporada=${temporada}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erro ao carregar comparação: ${response.status}`);
      }

      const data = await response.json();
      setComparisonData(data);
    } catch (error) {
      console.error('Erro ao carregar dados de comparação:', error);
    } finally {
      setLoadingComparison(false);
    }
  };

  // Função para selecionar um time
  const selectTeam = (position: 'time1Id' | 'time2Id', teamId: number) => {
    setSelectedTeams(prev => ({
      ...prev,
      [position]: teamId
    }));
  };

  // Função para trocar os times de posição
  const swapTeams = () => {
    setSelectedTeams(prev => ({
      time1Id: prev.time2Id,
      time2Id: prev.time1Id
    }));
  };

  // Função para atualizar URL
  const updateURL = () => {
    const params = new URLSearchParams();
    if (selectedTeams.time1Id) params.set('time1', String(selectedTeams.time1Id));
    if (selectedTeams.time2Id) params.set('time2', String(selectedTeams.time2Id));
    params.set('temporada', temporada);
    router.replace(`/comparar-times?${params.toString()}`, { scroll: false });
  };

  // Função para lidar com mudança de temporada
  const handleTemporadaChange = (novaTemporada: string) => {
    setTemporada(novaTemporada);
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('temporada', novaTemporada);
    router.replace(`/comparar-times?${params.toString()}`, { scroll: false });
  };

  // Verificar se os times estão selecionados
  const teamsSelected = !!(selectedTeams.time1Id && selectedTeams.time2Id);

  // Preparar dados para gráficos
  const chartData = comparisonData ? prepareChartData(comparisonData) : 
    { passeData: [], corridaData: [], recepcaoData: [], defesaData: [] };

  if (loadingTimes) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-[#ECECEC] pt-24 px-4 pb-16 max-w-[1200px] mx-auto xl:pt-10 xl:ml-[600px]">
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4">
          <button className="rounded-full text-xs text-[#18187c] p-2 w-8 h-8 flex justify-center items-center bg-gray-400/40 z-50">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <h1 className="text-5xl font-extrabold italic tracking-[-2px]">COMPARAR TIMES</h1>
      </div>

      {/* Seleção de times */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {/* Time 1 */}
        <div className="bg-white rounded-lg p-4">
          <label className="block mb-2 font-bold">Time 1</label>
          <select
            value={selectedTeams.time1Id || ''}
            onChange={(e) => selectTeam('time1Id', Number(e.target.value))}
            className="w-full p-2 border rounded"
          >
            <option value="">Selecione um time</option>
            {times.map((time) => (
              <option
                key={time.id}
                value={time.id}
                disabled={time.id === selectedTeams.time2Id}
              >
                {time.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Time 2 */}
        <div className="bg-white rounded-lg p-4">
          <label className="block mb-2 font-bold">Time 2</label>
          <select
            value={selectedTeams.time2Id || ''}
            onChange={(e) => selectTeam('time2Id', Number(e.target.value))}
            className="w-full p-2 border rounded"
          >
            <option value="">Selecione um time</option>
            {times.map((time) => (
              <option
                key={time.id}
                value={time.id}
                disabled={time.id === selectedTeams.time1Id}
              >
                {time.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Botão para inverter times */}
      {teamsSelected && (
        <div className="flex justify-center mt-4">
          <button
            onClick={swapTeams}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
          >
            <RefreshCw size={16} className="mr-2" />
            Inverter Times
          </button>
        </div>
      )}

      {/* Loading durante a comparação */}
      {loadingComparison && teamsSelected && (
        <div className="mt-8 text-center">
          <div className="w-12 h-12 border-t-2 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p>Carregando comparação...</p>
        </div>
      )}

      {/* Resultado da comparação */}
      {comparisonData && teamsSelected && !loadingComparison && (
        <div className="mt-8">
          {/* Cabeçalho */}
          <TeamComparisonHeader
            time1={comparisonData.teams.time1}
            time2={comparisonData.teams.time2}
          />

          {/* Abas para alternar entre estatísticas e gráficos */}
          <div className="flex border-b border-gray-200 mt-8 mb-4">
            <button
              className={`py-2 px-4 font-bold ${
                activeTab === 'estatisticas' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('estatisticas')}
            >
              Estatísticas
            </button>
            <button
              className={`py-2 px-4 font-bold flex items-center ${
                activeTab === 'graficos' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('graficos')}
            >
              <BarChart2 size={16} className="mr-2" />
              Gráficos
            </button>
          </div>

          {/* Conteúdo baseado na aba selecionada */}
          {activeTab === 'estatisticas' ? (
            <div className="space-y-8">
              {/* Seção de Estatísticas de Passe */}
              <div>
                <h2 className="text-2xl font-bold mb-4 bg-black text-white p-2 inline-block rounded-md">PASSE</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <StatComparisonCard
                    title="PASSES"
                    stat1={`${comparisonData.teams.time1.estatisticas.passe?.passes_completos || 0}/${comparisonData.teams.time1.estatisticas.passe?.passes_tentados || 0}`}
                    stat2={`${comparisonData.teams.time2.estatisticas.passe?.passes_completos || 0}/${comparisonData.teams.time2.estatisticas.passe?.passes_tentados || 0}`}
                    color1={comparisonData.teams.time1.cor}
                    color2={comparisonData.teams.time2.cor}
                  />

                  <StatComparisonCard
                    title="PERCENTUAL DE PASSES"
                    stat1={calculatePassPercentage(
                      comparisonData.teams.time1.estatisticas.passe?.passes_completos || 0,
                      comparisonData.teams.time1.estatisticas.passe?.passes_tentados || 0
                    )}
                    stat2={calculatePassPercentage(
                      comparisonData.teams.time2.estatisticas.passe?.passes_completos || 0,
                      comparisonData.teams.time2.estatisticas.passe?.passes_tentados || 0
                    )}
                    color1={comparisonData.teams.time1.cor}
                    color2={comparisonData.teams.time2.cor}
                  />

                  <StatComparisonCard
                    title="TOUCHDOWNS (PASSE)"
                    stat1={(comparisonData.teams.time1.estatisticas.passe?.tds_passe || 0).toString()}
                    stat2={(comparisonData.teams.time2.estatisticas.passe?.tds_passe || 0).toString()}
                    color1={comparisonData.teams.time1.cor}
                    color2={comparisonData.teams.time2.cor}
                  />

                  <StatComparisonCard
                    title="INTERCEPTAÇÕES SOFRIDAS"
                    stat1={(comparisonData.teams.time1.estatisticas.passe?.int_sofridas || 0).toString()}
                    stat2={(comparisonData.teams.time2.estatisticas.passe?.int_sofridas || 0).toString()}
                    color1={comparisonData.teams.time1.cor}
                    color2={comparisonData.teams.time2.cor}
                  />
                </div>
              </div>

              {/* Seção de Estatísticas de Corrida */}
              <div>
                <h2 className="text-2xl font-bold mb-4 bg-black text-white p-2 inline-block rounded-md">CORRIDA</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <StatComparisonCard
                    title="CORRIDAS"
                    stat1={(comparisonData.teams.time1.estatisticas.corrida?.corridas || 0).toString()}
                    stat2={(comparisonData.teams.time2.estatisticas.corrida?.corridas || 0).toString()}
                    color1={comparisonData.teams.time1.cor}
                    color2={comparisonData.teams.time2.cor}
                  />

                  <StatComparisonCard
                    title="JARDAS CORRIDA"
                    stat1={(comparisonData.teams.time1.estatisticas.corrida?.jds_corridas || 0).toString()}
                    stat2={(comparisonData.teams.time2.estatisticas.corrida?.jds_corridas || 0).toString()}
                    color1={comparisonData.teams.time1.cor}
                    color2={comparisonData.teams.time2.cor}
                  />

                  <StatComparisonCard
                    title="TOUCHDOWNS (CORRIDA)"
                    stat1={(comparisonData.teams.time1.estatisticas.corrida?.tds_corridos || 0).toString()}
                    stat2={(comparisonData.teams.time2.estatisticas.corrida?.tds_corridos || 0).toString()}
                    color1={comparisonData.teams.time1.cor}
                    color2={comparisonData.teams.time2.cor}
                  />
                </div>
              </div>

              {/* Seção de Estatísticas de Recepção */}
              <div>
                <h2 className="text-2xl font-bold mb-4 bg-black text-white p-2 inline-block rounded-md">RECEPÇÃO</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <StatComparisonCard
                    title="RECEPÇÕES/ALVOS"
                    stat1={`${comparisonData.teams.time1.estatisticas.recepcao?.recepcoes || 0}/${comparisonData.teams.time1.estatisticas.recepcao?.alvos || 0}`}
                    stat2={`${comparisonData.teams.time2.estatisticas.recepcao?.recepcoes || 0}/${comparisonData.teams.time2.estatisticas.recepcao?.alvos || 0}`}
                    color1={comparisonData.teams.time1.cor}
                    color2={comparisonData.teams.time2.cor}
                  />

                  <StatComparisonCard
                    title="TOUCHDOWNS (RECEPÇÃO)"
                    stat1={(comparisonData.teams.time1.estatisticas.recepcao?.tds_recepcao || 0).toString()}
                    stat2={(comparisonData.teams.time2.estatisticas.recepcao?.tds_recepcao || 0).toString()}
                    color1={comparisonData.teams.time1.cor}
                    color2={comparisonData.teams.time2.cor}
                  />
                </div>
              </div>

              {/* Seção de Estatísticas de Defesa */}
              <div>
                <h2 className="text-2xl font-bold mb-4 bg-black text-white p-2 inline-block rounded-md">DEFESA</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <StatComparisonCard
                    title="TACKLES"
                    stat1={(comparisonData.teams.time1.estatisticas.defesa?.tck || 0).toString()}
                    stat2={(comparisonData.teams.time2.estatisticas.defesa?.tck || 0).toString()}
                    color1={comparisonData.teams.time1.cor}
                    color2={comparisonData.teams.time2.cor}
                  />

                  <StatComparisonCard
                    title="SACKS"
                    stat1={(comparisonData.teams.time1.estatisticas.defesa?.sacks || 0).toString()}
                    stat2={(comparisonData.teams.time2.estatisticas.defesa?.sacks || 0).toString()}
                    color1={comparisonData.teams.time1.cor}
                    color2={comparisonData.teams.time2.cor}
                  />

                  <StatComparisonCard
                    title="PASSES DESVIADOS"
                    stat1={(comparisonData.teams.time1.estatisticas.defesa?.tip || 0).toString()}
                    stat2={(comparisonData.teams.time2.estatisticas.defesa?.tip || 0).toString()}
                    color1={comparisonData.teams.time1.cor}
                    color2={comparisonData.teams.time2.cor}
                  />

                  <StatComparisonCard
                    title="INTERCEPTAÇÕES"
                    stat1={(comparisonData.teams.time1.estatisticas.defesa?.int || 0).toString()}
                    stat2={(comparisonData.teams.time2.estatisticas.defesa?.int || 0).toString()}
                    color1={comparisonData.teams.time1.cor}
                    color2={comparisonData.teams.time2.cor}
                  />

                  <StatComparisonCard
                    title="TOUCHDOWNS DEFENSIVOS"
                    stat1={(comparisonData.teams.time1.estatisticas.defesa?.tds_defesa || 0).toString()}
                    stat2={(comparisonData.teams.time2.estatisticas.defesa?.tds_defesa || 0).toString()}
                    color1={comparisonData.teams.time1.cor}
                    color2={comparisonData.teams.time2.cor}
                  />
                </div>
              </div>
            </div>
          ) : (
            // Visualização de gráficos
            <div className="mt-4">
              {/* Selector para escolher categoria do gráfico */}
              <div className="mb-6">
                <div className="flex justify-center space-x-2">
                  {(['passe', 'corrida', 'recepcao', 'defesa'] as const).map((category) => (
                    <button
                      key={category}
                      className={`px-4 py-2 font-bold rounded-md ${
                        activeChartCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200'
                      }`}
                      onClick={() => setActiveChartCategory(category)}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-bold mb-4">
                  Comparativo de {activeChartCategory.charAt(0).toUpperCase() + activeChartCategory.slice(1)}
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData[`${activeChartCategory}Data`]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey={comparisonData.teams.time1.nome}
                        fill={comparisonData.teams.time1.cor}
                      />
                      <Bar
                        dataKey={comparisonData.teams.time2.nome}
                        fill={comparisonData.teams.time2.cor}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Jogadores Destaque */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 bg-black text-white p-2 inline-block rounded-md">DESTAQUES</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Destaque Ataque */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-bold mb-4">Melhores do Ataque</h3>
                <div className="grid grid-cols-1 gap-4">
                  <PlayerComparisonCard
                    title="Melhor Passador (TDs)"
                    player1={comparisonData.teams.time1.destaques.ataque.passador}
                    player2={comparisonData.teams.time2.destaques.ataque.passador}
                    team1={comparisonData.teams.time1}
                    team2={comparisonData.teams.time2}
                    statKey="td_passado"
                    statCategory="ataque"
                  />

                  <PlayerComparisonCard
                    title="Melhor Corredor"
                    player1={comparisonData.teams.time1.destaques.ataque.corredor}
                    player2={comparisonData.teams.time2.destaques.ataque.corredor}
                    team1={comparisonData.teams.time1}
                    team2={comparisonData.teams.time2}
                    statKey="corrida"
                    statCategory="ataque"
                  />

                  <PlayerComparisonCard
                    title="Melhor Recebedor (TDs)"
                    player1={comparisonData.teams.time1.destaques.ataque.recebedor}
                    player2={comparisonData.teams.time2.destaques.ataque.recebedor}
                    team1={comparisonData.teams.time1}
                    team2={comparisonData.teams.time2}
                    statKey="td_recebido"
                    statCategory="ataque"
                  />
                </div>
              </div>

              {/* Destaque Defesa */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-bold mb-4">Melhores da Defesa</h3>
                <div className="grid grid-cols-1 gap-4">
                  <PlayerComparisonCard
                    title="Melhor em Flag Retirada"
                    player1={comparisonData.teams.time1.destaques.defesa.flagRetirada}
                    player2={comparisonData.teams.time2.destaques.defesa.flagRetirada}
                    team1={comparisonData.teams.time1}
                    team2={comparisonData.teams.time2}
                    statKey="flag_retirada"
                    statCategory="defesa"
                  />

                  <PlayerComparisonCard
                    title="Melhor em Pressão"
                    player1={comparisonData.teams.time1.destaques.defesa.pressao}
                    player2={comparisonData.teams.time2.destaques.defesa.pressao}
                    team1={comparisonData.teams.time1}
                    team2={comparisonData.teams.time2}
                    statKey="pressao"
                    statCategory="defesa"
                  />

                  <PlayerComparisonCard
                    title="Melhor Interceptador"
                    player1={comparisonData.teams.time1.destaques.defesa.interceptador}
                    player2={comparisonData.teams.time2.destaques.defesa.interceptador}
                    team1={comparisonData.teams.time1}
                    team2={comparisonData.teams.time2}
                    statKey="interceptacao_forcada"
                    statCategory="defesa"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mensagem para selecionar times */}
      {!teamsSelected && (
        <div className="mt-8 bg-white p-8 rounded-lg text-center">
          <h2 className="text-xl font-bold mb-4">Selecione dois times para comparar</h2>
          <p className="text-gray-600">
            Escolha dois times diferentes nas caixas de seleção acima para ver uma comparação detalhada de estatísticas e jogadores.
          </p>
        </div>
      )}
    </div>
  );
}