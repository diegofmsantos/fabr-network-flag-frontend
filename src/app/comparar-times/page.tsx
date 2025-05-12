"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTimes } from '@/hooks/queries';
import { useTeamComparison } from '@/hooks/useTeamComparison';
import { Loading } from '@/components/ui/Loading';
import { SelectFilter } from '@/components/SelectFilter';
import { normalizeForFilePath } from '@/utils/formatUrl';
import Image from 'next/image';
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

export default function CompararTimesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [temporada, setTemporada] = useState(searchParams?.get('temporada') || '2025');
  
  // Buscar lista de times
  const { data: times = [], isLoading: loadingTimes } = useTimes(temporada);
  
  // Hook de comparação
  const { 
    data: comparisonData,
    isLoading: loadingComparison,
    selectedTeams,
    selectTeam,
    teamsSelected,
    swapTeams
  } = useTeamComparison();

  // Estado para controlar a aba ativa
  const [activeTab, setActiveTab] = useState<'estatisticas' | 'graficos'>('estatisticas');

  // Inicializar seleção com base nos parâmetros da URL
  useEffect(() => {
    const time1Id = searchParams?.get('time1');
    const time2Id = searchParams?.get('time2');
    
    if (time1Id) selectTeam('time1Id', Number(time1Id));
    if (time2Id) selectTeam('time2Id', Number(time2Id));
  }, [searchParams, selectTeam]);

  // Atualizar URL quando times forem selecionados
  useEffect(() => {
    if (selectedTeams.time1Id && selectedTeams.time2Id) {
      const params = new URLSearchParams();
      params.set('time1', String(selectedTeams.time1Id));
      params.set('time2', String(selectedTeams.time2Id));
      params.set('temporada', temporada);
      
      router.replace(`/comparar-times?${params.toString()}`, { scroll: false });
    }
  }, [selectedTeams, temporada, router]);
  
  // Função para lidar com mudança de temporada
  const handleTemporadaChange = (novaTemporada: string) => {
    setTemporada(novaTemporada);
    
    // Atualizar URL mantendo os times selecionados
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('temporada', novaTemporada);
    
    router.replace(`/comparar-times?${params.toString()}`, { scroll: false });
  };

  // Preparar dados para gráficos quando houver dados de comparação
  const prepareChartData = () => {
    if (!comparisonData) return { ataqueData: [], defesaData: [] };

    const time1 = comparisonData.teams.time1;
    const time2 = comparisonData.teams.time2;

    const ataqueData = [
      {
        name: "Passes Completos",
        [time1.nome]: time1.estatisticas.ataque.passes_completos,
        [time2.nome]: time2.estatisticas.ataque.passes_completos
      },
      {
        name: "TDs de Passe",
        [time1.nome]: time1.estatisticas.ataque.td_passado,
        [time2.nome]: time2.estatisticas.ataque.td_passado
      },
      {
        name: "Corridas",
        [time1.nome]: time1.estatisticas.ataque.corrida,
        [time2.nome]: time2.estatisticas.ataque.corrida
      },
      {
        name: "Recepções",
        [time1.nome]: time1.estatisticas.ataque.recepcao,
        [time2.nome]: time2.estatisticas.ataque.recepcao
      },
      {
        name: "TDs Recebidos",
        [time1.nome]: time1.estatisticas.ataque.td_recebido,
        [time2.nome]: time2.estatisticas.ataque.td_recebido
      }
    ];

    const defesaData = [
      {
        name: "Flag Retirada",
        [time1.nome]: time1.estatisticas.defesa.flag_retirada,
        [time2.nome]: time2.estatisticas.defesa.flag_retirada
      },
      {
        name: "Sacks",
        [time1.nome]: time1.estatisticas.defesa.sack,
        [time2.nome]: time2.estatisticas.defesa.sack
      },
      {
        name: "Pressão",
        [time1.nome]: time1.estatisticas.defesa.pressao,
        [time2.nome]: time2.estatisticas.defesa.pressao
      },
      {
        name: "Interceptações",
        [time1.nome]: time1.estatisticas.defesa.interceptacao_forcada,
        [time2.nome]: time2.estatisticas.defesa.interceptacao_forcada
      },
      {
        name: "Passes Desviados",
        [time1.nome]: time1.estatisticas.defesa.passe_desviado,
        [time2.nome]: time2.estatisticas.defesa.passe_desviado
      }
    ];

    return { ataqueData, defesaData };
  };

  const { ataqueData, defesaData } = prepareChartData();

  if (loadingTimes) return <Loading />;

  return (
    <div className="min-h-screen bg-[#ECECEC] pt-24 px-4 pb-16 max-w-[1200px] mx-auto xl:pt-10 xl:ml-[600px]">
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4">
          <button className="rounded-full text-xs text-[#63E300] p-2 w-8 h-8 flex justify-center items-center bg-gray-400/40 z-50">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <h1 className="text-5xl font-extrabold italic tracking-[-2px]">COMPARAR TIMES</h1>
      </div>

      <div className="w-full mt-4">
        <SelectFilter
          label="TEMPORADA"
          value={temporada}
          onChange={handleTemporadaChange}
          options={[
            { label: '2024', value: '2024' },
            { label: '2025', value: '2025' }
          ]}
        />
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
          <Loading />
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
              {/* Seção de Estatísticas de Ataque */}
              <div className="mt-4">
                <h2 className="text-2xl font-bold mb-4 bg-black text-white p-2 inline-block rounded-md">ATAQUE</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <StatComparisonCard 
                    title="PASSES" 
                    stat1={`${comparisonData.teams.time1.estatisticas.ataque.passes_completos}/${comparisonData.teams.time1.estatisticas.ataque.passes_tentados}`}
                    stat2={`${comparisonData.teams.time2.estatisticas.ataque.passes_completos}/${comparisonData.teams.time2.estatisticas.ataque.passes_tentados}`}
                    color1={comparisonData.teams.time1.cor}
                    color2={comparisonData.teams.time2.cor}
                  />
                  
                  <StatComparisonCard 
                    title="PERCENTUAL DE PASSES" 
                    stat1={`${Math.round(comparisonData.teams.time1.estatisticas.ataque.passes_percentual)}%`}
                    stat2={`${Math.round(comparisonData.teams.time2.estatisticas.ataque.passes_percentual)}%`}
                    color1={comparisonData.teams.time1.cor}
                    color2={comparisonData.teams.time2.cor}
                  />
                  
                  <StatComparisonCard 
                    title="TOUCHDOWNS (PASSE)" 
                    stat1={comparisonData.teams.time1.estatisticas.ataque.td_passado.toString()}
                    stat2={comparisonData.teams.time2.estatisticas.ataque.td_passado.toString()}
                    color1={comparisonData.teams.time1.cor}
                    color2={comparisonData.teams.time2.cor}
                  />
                  
                  <StatComparisonCard 
                    title="TOUCHDOWNS (CORRIDA)" 
                    stat1={comparisonData.teams.time1.estatisticas.ataque.tds_corridos.toString()}
                    stat2={comparisonData.teams.time2.estatisticas.ataque.tds_corridos.toString()}
                    color1={comparisonData.teams.time1.cor}
                    color2={comparisonData.teams.time2.cor}
                  />
                  
                  <StatComparisonCard 
                    title="CORRIDAS" 
                    stat1={comparisonData.teams.time1.estatisticas.ataque.corrida.toString()}
                    stat2={comparisonData.teams.time2.estatisticas.ataque.corrida.toString()}
                    color1={comparisonData.teams.time1.cor}
                    color2={comparisonData.teams.time2.cor}
                  />
                  
                  <StatComparisonCard 
                    title="RECEPÇÕES/ALVOS" 
                    stat1={`${comparisonData.teams.time1.estatisticas.ataque.recepcao}/${comparisonData.teams.time1.estatisticas.ataque.alvo}`}
                    stat2={`${comparisonData.teams.time2.estatisticas.ataque.recepcao}/${comparisonData.teams.time2.estatisticas.ataque.alvo}`}
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
                    title="FLAG RETIRADA" 
                    stat1={comparisonData.teams.time1.estatisticas.defesa.flag_retirada.toString()}
                    stat2={comparisonData.teams.time2.estatisticas.defesa.flag_retirada.toString()}
                    color1={comparisonData.teams.time1.cor}
                    color2={comparisonData.teams.time2.cor}
                  />
                  
                  <StatComparisonCard 
                    title="PRESSÃO" 
                    stat1={comparisonData.teams.time1.estatisticas.defesa.pressao.toString()}
                    stat2={comparisonData.teams.time2.estatisticas.defesa.pressao.toString()}
                    color1={comparisonData.teams.time1.cor}
                    color2={comparisonData.teams.time2.cor}
                  />
                  
                  <StatComparisonCard 
                    title="SACKS" 
                    stat1={comparisonData.teams.time1.estatisticas.defesa.sack.toString()}
                    stat2={comparisonData.teams.time2.estatisticas.defesa.sack.toString()}
                    color1={comparisonData.teams.time1.cor}
                    color2={comparisonData.teams.time2.cor}
                  />
                  
                  <StatComparisonCard 
                    title="INTERCEPTAÇÕES" 
                    stat1={comparisonData.teams.time1.estatisticas.defesa.interceptacao_forcada.toString()}
                    stat2={comparisonData.teams.time2.estatisticas.defesa.interceptacao_forcada.toString()}
                    color1={comparisonData.teams.time1.cor}
                    color2={comparisonData.teams.time2.cor}
                  />
                  
                  <StatComparisonCard 
                    title="PASSES DESVIADOS" 
                    stat1={comparisonData.teams.time1.estatisticas.defesa.passe_desviado.toString()}
                    stat2={comparisonData.teams.time2.estatisticas.defesa.passe_desviado.toString()}
                    color1={comparisonData.teams.time1.cor}
                    color2={comparisonData.teams.time2.cor}
                  />
                  
                  <StatComparisonCard 
                    title="TOUCHDOWNS DEFENSIVOS" 
                    stat1={comparisonData.teams.time1.estatisticas.defesa.td_defensivo.toString()}
                    stat2={comparisonData.teams.time2.estatisticas.defesa.td_defensivo.toString()}
                    color1={comparisonData.teams.time1.cor}
                    color2={comparisonData.teams.time2.cor}
                  />
                </div>
              </div>
            </>
          ) : (
            // Visualização de gráficos
            <div className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico de Ataque */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold mb-4">Comparativo Ofensivo</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={ataqueData}
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
                
                {/* Gráfico de Defesa */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold mb-4">Comparativo Defensivo</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={defesaData}
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
              </div>
              
              {/* Gráfico Radar para comparação geral (opcional) */}
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
                        <span className="font-bold">{comparisonData.teams.time1.estatisticas.ataque.passes_completos}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>TDs de Passe:</span>
                        <span className="font-bold">{comparisonData.teams.time1.estatisticas.ataque.td_passado}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Flag Retirada:</span>
                        <span className="font-bold">{comparisonData.teams.time1.estatisticas.defesa.flag_retirada}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Interceptações:</span>
                        <span className="font-bold">{comparisonData.teams.time1.estatisticas.defesa.interceptacao_forcada}</span>
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
                        <span className="font-bold">{comparisonData.teams.time2.estatisticas.ataque.passes_completos}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>TDs de Passe:</span>
                        <span className="font-bold">{comparisonData.teams.time2.estatisticas.ataque.td_passado}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Flag Retirada:</span>
                        <span className="font-bold">{comparisonData.teams.time2.estatisticas.defesa.flag_retirada}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Interceptações:</span>
                        <span className="font-bold">{comparisonData.teams.time2.estatisticas.defesa.interceptacao_forcada}</span>
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
    if (!player || !player.estatisticas || !player.estatisticas[statCategory]) return 'N/A';
    return player.estatisticas[statCategory][statKey] || 0;
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