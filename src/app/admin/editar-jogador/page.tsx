// src/app/admin/editar-jogador/page.tsx
"use client"

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Save, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface JogadorStats {
  passe?: {
    passes_completos?: number;
    passes_tentados?: number;
    passes_incompletos?: number;
    jds_passe?: number;
    tds_passe?: number;
    passe_xp1?: number;
    passe_xp2?: number;
    int_sofridas?: number;
    sacks_sofridos?: number;
    pressao_pct?: string;
  };
  corrida?: {
    corridas?: number;
    jds_corridas?: number;
    tds_corridos?: number;
    corrida_xp1?: number;
    corrida_xp2?: number;
  };
  recepcao?: {
    recepcoes?: number;
    alvos?: number;
    drops?: number;
    jds_recepcao?: number;
    jds_yac?: number;
    tds_recepcao?: number;
    recepcao_xp1?: number;
    recepcao_xp2?: number;
  };
  defesa?: {
    tck?: number;
    tfl?: number;
    pressao_pct?: string;
    sacks?: number;
    tip?: number;
    int?: number;
    tds_defesa?: number;
    defesa_xp2?: number;
    sft?: number;
    sft_1?: number;
    blk?: number;
    jds_defesa?: number;
  };
}

interface JogadorTimeData {
  id: number;
  jogadorId: number;
  timeId: number;
  temporada: string;
  numero: number;
  camisa: string;
  estatisticas: JogadorStats;
  jogador: {
    id: number;
    nome: string;
  };
  time: {
    id: number;
    nome: string;
    sigla: string;
    cor: string;
    regiao?: string;
    sexo?: string;
  };
}

export default function EditarJogadorPage() {
  const searchParams = useSearchParams();
  const jogadorId = searchParams.get('id');
  const temporada = searchParams.get('temporada') || '2025';
  
  const [jogadorTime, setJogadorTime] = useState<JogadorTimeData | null>(null);
  const [estatisticas, setEstatisticas] = useState<JogadorStats>({
    passe: {},
    corrida: {},
    recepcao: {},
    defesa: {}
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchJogador = async () => {
      if (!jogadorId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/jogador/${jogadorId}/temporada/${temporada}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao buscar dados do jogador');
        }
        
        const data = await response.json();
        setJogadorTime(data);
        
        // Garante que as estatísticas seguem a nova estrutura
        const novasEstatisticas = data.estatisticas || {};
        if (!novasEstatisticas.passe) novasEstatisticas.passe = {};
        if (!novasEstatisticas.corrida) novasEstatisticas.corrida = {};
        if (!novasEstatisticas.recepcao) novasEstatisticas.recepcao = {};
        if (!novasEstatisticas.defesa) novasEstatisticas.defesa = {};
        
        setEstatisticas(novasEstatisticas);
      } catch (err: any) {
        setError(err.message || 'Erro ao buscar dados do jogador');
        console.error('Erro:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJogador();
  }, [jogadorId, temporada]);

  const handleStatChange = (category: 'passe' | 'corrida' | 'recepcao' | 'defesa', stat: string, value: string) => {
    // Lidar com campos de percentual como string e números como números
    const isPctField = stat.includes('pressao_pct');
    const statValue = isPctField ? value : (value === '' ? 0 : parseInt(value, 10));
    
    setEstatisticas(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] || {}),
        [stat]: isPctField ? statValue : (isNaN(statValue as number) ? 0 : statValue)
      }
    }));
  };

  const handleSave = async () => {
    if (!jogadorTime) return;
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch(`/api/jogador/${jogadorTime.jogadorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: jogadorTime.jogadorId,
          timeId: jogadorTime.timeId,
          temporada: jogadorTime.temporada,
          numero: jogadorTime.numero,
          camisa: jogadorTime.camisa,
          estatisticas: estatisticas
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar estatísticas');
      }
      
      setSuccess('Estatísticas atualizadas com sucesso!');
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar estatísticas');
      console.error('Erro:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center py-8">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  if (!jogadorTime) {
    return (
      <div className="min-h-screen bg-gray-100 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-bold mb-2">Jogador não encontrado</h2>
            <p className="text-gray-600 mb-4">
              Não foi possível encontrar o jogador especificado para a temporada {temporada}.
            </p>
            <Link href="/admin" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft size={16} className="mr-1" />
              Voltar para a administração
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <Link href="/admin" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft size={16} className="mr-1" />
            Voltar para a administração
          </Link>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b" style={{ backgroundColor: jogadorTime.time.cor, color: '#fff' }}>
            <h1 className="text-2xl font-bold">
              {jogadorTime.jogador.nome} - #{jogadorTime.numero}
            </h1>
            <p className="text-lg opacity-90">{jogadorTime.time.nome} ({jogadorTime.time.sigla})</p>
            <p className="opacity-80">Temporada: {jogadorTime.temporada}</p>
            {jogadorTime.time.regiao && <p className="opacity-80">Região: {jogadorTime.time.regiao}</p>}
            {jogadorTime.time.sexo && <p className="opacity-80">Categoria: {jogadorTime.time.sexo}</p>}
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 m-6 rounded flex items-center">
              <AlertCircle size={20} className="mr-2" />
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 m-6 rounded flex items-center">
              <CheckCircle size={20} className="mr-2" />
              {success}
            </div>
          )}
          
          <div className="p-6 space-y-6">
            {/* ESTATÍSTICAS DE PASSE */}
            <div>
              <h2 className="text-xl font-bold mb-4">Estatísticas de Passe</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'passes_completos', label: 'Passes Completos' },
                  { key: 'passes_tentados', label: 'Passes Tentados' },
                  { key: 'passes_incompletos', label: 'Passes Incompletos' },
                  { key: 'jds_passe', label: 'Jardas de Passe' },
                  { key: 'tds_passe', label: 'Touchdowns de Passe' },
                  { key: 'passe_xp1', label: 'XP1 de Passe' },
                  { key: 'passe_xp2', label: 'XP2 de Passe' },
                  { key: 'int_sofridas', label: 'Interceptações Sofridas' },
                  { key: 'sacks_sofridos', label: 'Sacks Sofridos' },
                  { key: 'pressao_pct', label: 'Percentual de Pressão' }
                ].map(stat => (
                  <div key={stat.key} className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {stat.label}
                    </label>
                    <input
                      type={stat.key === 'pressao_pct' ? 'text' : 'number'}
                      min={stat.key === 'pressao_pct' ? undefined : "0"}
                      value={(estatisticas.passe && estatisticas.passe[stat.key as keyof typeof estatisticas.passe]) || (stat.key === 'pressao_pct' ? '' : 0)}
                      onChange={(e) => handleStatChange('passe', stat.key, e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ESTATÍSTICAS DE CORRIDA */}
            <div>
              <h2 className="text-xl font-bold mb-4">Estatísticas de Corrida</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'corridas', label: 'Corridas' },
                  { key: 'jds_corridas', label: 'Jardas de Corrida' },
                  { key: 'tds_corridos', label: 'Touchdowns de Corrida' },
                  { key: 'corrida_xp1', label: 'XP1 de Corrida' },
                  { key: 'corrida_xp2', label: 'XP2 de Corrida' }
                ].map(stat => (
                  <div key={stat.key} className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {stat.label}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={(estatisticas.corrida && estatisticas.corrida[stat.key as keyof typeof estatisticas.corrida]) || 0}
                      onChange={(e) => handleStatChange('corrida', stat.key, e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ESTATÍSTICAS DE RECEPÇÃO */}
            <div>
              <h2 className="text-xl font-bold mb-4">Estatísticas de Recepção</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'recepcoes', label: 'Recepções' },
                  { key: 'alvos', label: 'Alvos' },
                  { key: 'drops', label: 'Drops' },
                  { key: 'jds_recepcao', label: 'Jardas de Recepção' },
                  { key: 'jds_yac', label: 'Jardas Após Recepção (YAC)' },
                  { key: 'tds_recepcao', label: 'Touchdowns de Recepção' },
                  { key: 'recepcao_xp1', label: 'XP1 de Recepção' },
                  { key: 'recepcao_xp2', label: 'XP2 de Recepção' }
                ].map(stat => (
                  <div key={stat.key} className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {stat.label}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={(estatisticas.recepcao && estatisticas.recepcao[stat.key as keyof typeof estatisticas.recepcao]) || 0}
                      onChange={(e) => handleStatChange('recepcao', stat.key, e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* ESTATÍSTICAS DE DEFESA */}
            <div>
              <h2 className="text-xl font-bold mb-4">Estatísticas de Defesa</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'tck', label: 'Tackles' },
                  { key: 'tfl', label: 'Tackles for Loss' },
                  { key: 'pressao_pct', label: 'Percentual de Pressão' },
                  { key: 'sacks', label: 'Sacks' },
                  { key: 'tip', label: 'Passes Desviados' },
                  { key: 'int', label: 'Interceptações' },
                  { key: 'tds_defesa', label: 'Touchdowns Defensivos' },
                  { key: 'defesa_xp2', label: 'XP2 Defensivos' },
                  { key: 'sft', label: 'Safety' },
                  { key: 'sft_1', label: 'Safety 1pt' },
                  { key: 'blk', label: 'Bloqueios' },
                  { key: 'jds_defesa', label: 'Jardas Defensivas' }
                ].map(stat => (
                  <div key={stat.key} className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {stat.label}
                    </label>
                    <input
                      type={stat.key === 'pressao_pct' ? 'text' : 'number'}
                      min={stat.key === 'pressao_pct' ? undefined : "0"}
                      value={(estatisticas.defesa && estatisticas.defesa[stat.key as keyof typeof estatisticas.defesa]) || (stat.key === 'pressao_pct' ? '' : 0)}
                      onChange={(e) => handleStatChange('defesa', stat.key, e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={20} className="mr-2" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}