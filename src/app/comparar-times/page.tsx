
"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTimes } from '@/hooks/queries';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, BarChart2 } from 'lucide-react';
import { normalizeForFilePath } from '@/utils/formatUrl';
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
import { SelectFilter } from '@/components/SelectFilter';
import { Loading } from '@/components/ui/Loading';

export default function CompararTimesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [temporada, setTemporada] = useState(searchParams?.get('temporada') || '2025');

  // Estados para controlar a seleção de times e dados de comparação
  const [selectedTeams, setSelectedTeams] = useState<{ time1Id?: number, time2Id?: number }>({});
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [loadingComparison, setLoadingComparison] = useState(false);

  // Buscar lista de times
  const { data: times = [], isLoading: loadingTimes } = useTimes(temporada);

  // Estado para controlar a aba ativa (estatísticas ou gráficos)
  const [activeTab, setActiveTab] = useState<'estatisticas' | 'graficos'>('estatisticas');

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

      // Atualizar URL quando times forem selecionados
      const params = new URLSearchParams();
      params.set('time1', String(selectedTeams.time1Id));
      params.set('time2', String(selectedTeams.time2Id));
      params.set('temporada', temporada);

      router.replace(`/comparar-times?${params.toString()}`, { scroll: false });
    }
  }, [selectedTeams, temporada]);

  // Função para carregar dados de comparação
  const loadComparisonData = async () => {
    if (!selectedTeams.time1Id || !selectedTeams.time2Id) return;

    try {
      setLoadingComparison(true);

      // URL da API
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

  // Função para lidar com mudança de temporada
  const handleTemporadaChange = (novaTemporada: string) => {
    setTemporada(novaTemporada);

    // Atualizar URL mantendo os times selecionados
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('temporada', novaTemporada);

    router.replace(`/comparar-times?${params.toString()}`, { scroll: false });
  };

  // Verificar se os times estão selecionados
  const teamsSelected = !!(selectedTeams.time1Id && selectedTeams.time2Id);

  // Preparar dados para gráficos quando houver dados de comparação
  const prepareChartData = () => {
    if (!comparisonData) return { passeData: [], corridaData: [], recepcaoData: [], defesaData: [] };

    const time1 = comparisonData.teams.time1;
    const time2 = comparisonData.teams.time2;

    // Dados para o gráfico de passe
    const passeData = [
      {
        name: "Passes Completos",
        [time1.nome]: time1.estatisticas.passe?.passes_completos || 0,
        [time2.nome]: time2.estatisticas.passe?.passes_completos || 0
      },
      {
        name: "Passes Tentados",
        [time1.nome]: time1.estatisticas.passe?.passes_tentados || 0,
        [time2.nome]: time2.estatisticas.passe?.passes_tentados || 0
      },
      {
        name: "TDs de Passe",
        [time1.nome]: time1.estatisticas.passe?.tds_passe || 0,
        [time2.nome]: time2.estatisticas.passe?.tds_passe || 0
      },
      {
        name: "Interceptações",
        [time1.nome]: time1.estatisticas.passe?.int_sofridas || 0,
        [time2.nome]: time2.estatisticas.passe?.int_sofridas || 0
      },
      {
        name: "Sacks Sofridos",
        [time1.nome]: time1.estatisticas.passe?.sacks_sofridos || 0,
        [time2.nome]: time2.estatisticas.passe?.sacks_sofridos || 0
      }
    ];

    // Dados para o gráfico de corrida
    const corridaData = [
      {
        name: "Corridas",
        [time1.nome]: time1.estatisticas.corrida?.corridas || 0,
        [time2.nome]: time2.estatisticas.corrida?.corridas || 0
      },
      {
        name: "Jardas",
        [time1.nome]: time1.estatisticas.corrida?.jds_corridas || 0,
        [time2.nome]: time2.estatisticas.corrida?.jds_corridas || 0
      },
      {
        name: "TDs Corrida",
        [time1.nome]: time1.estatisticas.corrida?.tds_corridos || 0,
        [time2.nome]: time2.estatisticas.corrida?.tds_corridos || 0
      },
      {
        name: "Extra Point (1)",
        [time1.nome]: time1.estatisticas.corrida?.corrida_xp1 || 0,
        [time2.nome]: time2.estatisticas.corrida?.corrida_xp1 || 0
      },
      {
        name: "Extra Point (2)",
        [time1.nome]: time1.estatisticas.corrida?.corrida_xp2 || 0,
        [time2.nome]: time2.estatisticas.corrida?.corrida_xp2 || 0
      }
    ];

    // Dados para o gráfico de recepção
    const recepcaoData = [
      {
        name: "Recepções",
        [time1.nome]: time1.estatisticas.recepcao?.recepcoes || 0,
        [time2.nome]: time2.estatisticas.recepcao?.recepcoes || 0
      },
      {
        name: "Alvos",
        [time1.nome]: time1.estatisticas.recepcao?.alvos || 0,
        [time2.nome]: time2.estatisticas.recepcao?.alvos || 0
      },
      {
        name: "Jardas",
        [time1.nome]: time1.estatisticas.recepcao?.jds_recepcao || 0,
        [time2.nome]: time2.estatisticas.recepcao?.jds_recepcao || 0
      },
      {
        name: "TDs Recepção",
        [time1.nome]: time1.estatisticas.recepcao?.tds_recepcao || 0,
        [time2.nome]: time2.estatisticas.recepcao?.tds_recepcao || 0
      },
      {
        name: "Drops",
        [time1.nome]: time1.estatisticas.recepcao?.drops || 0,
        [time2.nome]: time2.estatisticas.recepcao?.drops || 0
      }
    ];

    // Dados para o gráfico de defesa com a nova estrutura
    const defesaData = [
      {
        name: "Flag Retirada",
        [time1.nome]: time1.estatisticas.defesa?.flag_retirada || 0,
        [time2.nome]: time2.estatisticas.defesa?.flag_retirada || 0
      },
      {
        name: "Sacks",
        [time1.nome]: time1.estatisticas.defesa?.sack || 0,
        [time2.nome]: time2.estatisticas.defesa?.sack || 0
      },
      {
        name: "Pressão",
        [time1.nome]: time1.estatisticas.defesa?.pressao || 0,
        [time2.nome]: time2.estatisticas.defesa?.pressao || 0
      },
      {
        name: "Interceptações",
        [time1.nome]: time1.estatisticas.defesa?.interceptacao_forcada || 0,
        [time2.nome]: time2.estatisticas.defesa?.interceptacao_forcada || 0
      },
      {
        name: "Passes Desviados",
        [time1.nome]: time1.estatisticas.defesa?.passe_desviado || 0,
        [time2.nome]: time2.estatisticas.defesa?.passe_desviado || 0
      }
    ];

    return { passeData, corridaData, recepcaoData, defesaData };
  };

  const { passeData, corridaData, recepcaoData, defesaData } = comparisonData ? prepareChartData() :
    { passeData: [], corridaData: [], recepcaoData: [], defesaData: [] };

  const [activeChartCategory, setActiveChartCategory] = useState<'passe' | 'corrida' | 'recepcao' | 'defesa'>('passe');

  if (loadingTimes) {
    <Loading />
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
              className={`py-2 px-4 font-bold ${activeTab === 'estatisticas' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('estatisticas')}
            >
              Estatísticas
            </button>
            <button
              className={`py-2 px-4 font-bold flex items-center ${activeTab === 'graficos' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('graficos')}
            >
              <BarChart2 size={16} className="mr-2" />
              Gráficos
            </button>
          </div>

          {/* Conteúdo baseado na aba selecionada */}
          {activeTab === 'estatisticas' ? (
            <>
              {/* Seção de Estatísticas de Passe */}
              {/* Seção de Estatísticas de Passe */}
              <div className="mt-4">
                <h2 className="text-2xl font-bold mb-4 bg-black text-white p-2 inline-block rounded-md">PASSE</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <StatComparisonCard
                    title="PASSES"
                    stat1={`${comparisonData.teams.time1.estatisticas.passe?.passes_completos || 0}/${comparisonData.teams.time1.estatisticas.passe?.passes_tentados || 0}`}
                    stat2={`${comparisonData.teams.time2.estatisticas.passe?.passes_completos || 0}/${comparisonData.teams.time2.estatisticas.passe?.passes_tentados || 0}`}
                    color1={comparisonData.teams.time1.cor}
                    color2={comparisonData.teams.time2.cor}
                  />

                  {/* Calcular percentual de passes */}
                  <StatComparisonCard
                    title="PERCENTUAL DE PASSES"
                    stat1={`${Math.round((comparisonData.teams.time1.estatisticas.passe?.passes_completos || 0) /
                      Math.max(1, (comparisonData.teams.time1.estatisticas.passe?.passes_tentados || 1)) * 100)}%`}
                    stat2={`${Math.round((comparisonData.teams.time2.estatisticas.passe?.passes_completos || 0) /
                      Math.max(1, (comparisonData.teams.time2.estatisticas.passe?.passes_tentados || 1)) * 100)}%`}
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
              <div className="mt-8">
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
              <div className="mt-8">
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
              <div className="mt-8">
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
            </>
          ) : (
            // Visualização de gráficos
            <div className="mt-4">
              {/* Selector para escolher categoria do gráfico */}
              <div className="mb-6">
                <div className="flex justify-center space-x-2">
                  <button
                    className={`px-4 py-2 font-bold rounded-md ${activeChartCategory === 'passe' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveChartCategory('passe')}
                  >
                    Passe
                  </button>
                  <button
                    className={`px-4 py-2 font-bold rounded-md ${activeChartCategory === 'corrida' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveChartCategory('corrida')}
                  >
                    Corrida
                  </button>
                  <button
                    className={`px-4 py-2 font-bold rounded-md ${activeChartCategory === 'recepcao' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveChartCategory('recepcao')}
                  >
                    Recepção
                  </button>
                  <button
                    className={`px-4 py-2 font-bold rounded-md ${activeChartCategory === 'defesa' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveChartCategory('defesa')}
                  >
                    Defesa
                  </button>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-bold mb-4">{
                  activeChartCategory === 'passe' ? 'Comparativo de Passe' :
                    activeChartCategory === 'corrida' ? 'Comparativo de Corrida' :
                      activeChartCategory === 'recepcao' ? 'Comparativo de Recepção' :
                        'Comparativo Defensivo'
                }</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={
                        activeChartCategory === 'passe' ? passeData :
                          activeChartCategory === 'corrida' ? corridaData :
                            activeChartCategory === 'recepcao' ? recepcaoData :
                              defesaData
                      }
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
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

              {/* Resumo Comparativo */}
              <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-bold mb-4">Resumo Comparativo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold" style={{ color: comparisonData.teams.time1.cor }}>
                      {comparisonData.teams.time1.nome}
                    </h4>
                    <ul className="mt-2 space-y-1">
                      <li className="flex justify-between">
                        <span>Passes Completos:</span>
                        <span className="font-bold">{comparisonData.teams.time1.estatisticas.passe?.passes_completos || 0}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>TDs de Passe:</span>
                        <span className="font-bold">{comparisonData.teams.time1.estatisticas.passe?.tds_passe || 0}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Tackles:</span>
                        <span className="font-bold">{comparisonData.teams.time1.estatisticas.defesa?.tck || 0}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Interceptações:</span>
                        <span className="font-bold">{comparisonData.teams.time1.estatisticas.defesa?.int || 0}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold" style={{ color: comparisonData.teams.time2.cor }}>
                      {comparisonData.teams.time2.nome}
                    </h4>
                    <ul className="mt-2 space-y-1">
                      <li className="flex justify-between">
                        <span>Passes Completos:</span>
                        <span className="font-bold">{comparisonData.teams.time2.estatisticas.passe?.passes_completos || 0}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>TDs de Passe:</span>
                        <span className="font-bold">{comparisonData.teams.time2.estatisticas.passe?.tds_passe || 0}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Tackles:</span>
                        <span className="font-bold">{comparisonData.teams.time2.estatisticas.defesa?.tck || 0}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Interceptações:</span>
                        <span className="font-bold">{comparisonData.teams.time2.estatisticas.defesa?.int || 0}</span>
                      </li>
                    </ul>
                  </div>
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
          <p className="text-gray-600">Escolha dois times diferentes nas caixas de seleção acima para ver uma comparação detalhada de estatísticas e jogadores.</p>
        </div>
      )}
    </div>
  );
}

// Componente de cabeçalho da comparação
interface TeamComparisonHeaderProps {
  time1: any;
  time2: any;
}

const TeamComparisonHeader: React.FC<TeamComparisonHeaderProps> = ({ time1, time2 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Time 1 */}
      <Link href={`/${time1.nome}`} className="block">
        <div
          className="rounded-lg p-6 flex flex-col items-center text-white shadow-lg"
          style={{ backgroundColor: time1.cor }}
        >
          <h2 className="text-3xl font-extrabold italic tracking-tight mb-4">{time1.nome}</h2>
          <div className="w-32 h-32 relative">
            <Image
              src={`/assets/times/logos/${normalizeForFilePath(time1.nome)}.png`}
              fill
              sizes="128px"
              alt={`Logo ${time1.nome}`}
              className="object-contain"
            />
          </div>
          <div className="mt-4 text-xl font-bold">{time1.sigla}</div>
        </div>
      </Link>

      {/* Time 2 */}
      <Link href={`/${time2.nome}`} className="block">
        <div
          className="rounded-lg p-6 flex flex-col items-center text-white shadow-lg"
          style={{ backgroundColor: time2.cor }}
        >
          <h2 className="text-3xl font-extrabold italic tracking-tight mb-4">{time2.nome}</h2>
          <div className="w-32 h-32 relative">
            <Image
              src={`/assets/times/logos/${normalizeForFilePath(time2.nome)}.png`}
              fill
              sizes="128px"
              alt={`Logo ${time2.nome}`}
              className="object-contain"
            />
          </div>
          <div className="mt-4 text-xl font-bold">{time2.sigla}</div>
        </div>
      </Link>
    </div>
  );
};

// Componente de card para comparação de estatísticas
interface StatComparisonCardProps {
  title: string;
  stat1: string;
  stat2: string;
  color1: string;
  color2: string;
}

const StatComparisonCard: React.FC<StatComparisonCardProps> = ({
  title, stat1, stat2, color1, color2
}) => {
  // Determinar qual valor é maior para destacar
  const num1 = parseFloat(stat1.replace(/[^0-9.]/g, ''));
  const num2 = parseFloat(stat2.replace(/[^0-9.]/g, ''));

  const isFirstBetter = !isNaN(num1) && !isNaN(num2) && num1 > num2;
  const isSecondBetter = !isNaN(num1) && !isNaN(num2) && num2 > num1;
  const isEqual = num1 === num2;

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-bold mb-4 text-center">{title}</h3>
      <div className="grid grid-cols-2 gap-2">
        <div
          className={`p-3 rounded-md text-center font-bold text-2xl ${isFirstBetter ? 'bg-green-100' : isEqual ? 'bg-gray-100' : ''}`}
          style={{ color: color1 }}
        >
          {stat1}
        </div>
        <div
          className={`p-3 rounded-md text-center font-bold text-2xl ${isSecondBetter ? 'bg-green-100' : isEqual ? 'bg-gray-100' : ''}`}
          style={{ color: color2 }}
        >
          {stat2}
        </div>
      </div>
    </div>
  );
};

// Componente para comparação de jogadores
interface PlayerComparisonCardProps {
  title: string;
  player1: any;
  player2: any;
  team1: any;
  team2: any;
  statKey: string;
  statCategory: 'ataque' | 'defesa';
}

const PlayerComparisonCard: React.FC<PlayerComparisonCardProps> = ({
  title, player1, player2, team1, team2, statKey, statCategory
}) => {
  // Obter os valores estatísticos
  const getValue = (player: any) => {
    if (!player || !player.estatisticas) return 'N/A';

    // Mapeamento de categoria antiga para nova
    const categoryMap: Record<string, string> = {
      'ataque': statKey.includes('passe') ? 'passe' :
        statKey.includes('corrida') ? 'corrida' : 'recepcao',
      'defesa': 'defesa'
    };

    // Mapeamento de nomes de campos antigos para novos
    const keyMap: Record<string, string> = {
      'td_passado': 'tds_passe',
      'corrida': 'jds_corridas',
      'td_recebido': 'tds_recepcao',
      'flag_retirada': 'tck', // Aproximação
      'pressao': 'pressao_pct',
      'interceptacao_forcada': 'int'
    };

    // Determinar categoria e chave corretas
    const actualCategory = categoryMap[statCategory] || statCategory;
    const actualKey = keyMap[statKey] || statKey;

    if (!player.estatisticas[actualCategory]) return 'N/A';
    return player.estatisticas[actualCategory][actualKey] || 0;
  };

  const value1 = getValue(player1);
  const value2 = getValue(player2);

  // Determinar qual valor é melhor
  const isFirstBetter = value1 !== 'N/A' && value2 !== 'N/A' && value1 > value2;
  const isSecondBetter = value1 !== 'N/A' && value2 !== 'N/A' && value2 > value1;
  const isEqual = value1 === value2 && value1 !== 'N/A';

  return (
    <div className="bg-gray-50 rounded-lg p-3 shadow-sm">
      <h4 className="text-md font-bold mb-2">{title}</h4>
      <div className="grid grid-cols-2 gap-2">
        {/* Jogador Time 1 */}
        <div
          className={`p-2 rounded-md ${isFirstBetter ? 'bg-green-100' : isEqual ? 'bg-gray-200' : ''}`}
        >
          {player1 ? (
            <div className="flex items-center">
              <div className="flex-1">
                <p className="font-bold" style={{ color: team1.cor }}>{player1.nome}</p>
                <p className="text-sm">{value1}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">Nenhum destaque</p>
          )}
        </div>

        {/* Jogador Time 2 */}
        <div
          className={`p-2 rounded-md ${isSecondBetter ? 'bg-green-100' : isEqual ? 'bg-gray-200' : ''}`}
        >
          {player2 ? (
            <div className="flex items-center">
              <div className="flex-1">
                <p className="font-bold" style={{ color: team2.cor }}>{player2.nome}</p>
                <p className="text-sm">{value2}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">Nenhum destaque</p>
          )}
        </div>
      </div>
    </div>
  );
};