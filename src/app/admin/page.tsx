// src/app/admin/page.tsx
"use client"

import React, { useState } from 'react';
import AdminUploadForm from '@/components/admin/AdminUploadForm';
import ProcessedGamesList from '@/components/admin/ProcessedGamesList';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-4 xl:ml-80">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Administração de Estatísticas
        </h1>
        
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="flex border-b">
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'upload' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('upload')}
            >
              Upload de Planilhas
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'games' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('games')}
            >
              Jogos Processados
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === 'upload' ? (
              <AdminUploadForm />
            ) : (
              <ProcessedGamesList />
            )}
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Instruções de Uso</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Upload de Times</h3>
              <p className="text-gray-600">
                Colunas necessárias: <span className="font-mono bg-gray-100 px-1 rounded">nome</span>, <span className="font-mono bg-gray-100 px-1 rounded">sigla</span>, <span className="font-mono bg-gray-100 px-1 rounded">cor</span>, <span className="font-mono bg-gray-100 px-1 rounded">cidade</span>, <span className="font-mono bg-gray-100 px-1 rounded">bandeira_estado</span>, <span className="font-mono bg-gray-100 px-1 rounded">logo</span>. 
                Novos campos: <span className="font-mono bg-gray-100 px-1 rounded">regiao</span>, <span className="font-mono bg-gray-100 px-1 rounded">sexo</span>.
                Opcionais: <span className="font-mono bg-gray-100 px-1 rounded">instagram</span>, <span className="font-mono bg-gray-100 px-1 rounded">instagram2</span>, <span className="font-mono bg-gray-100 px-1 rounded">temporada</span>.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Upload de Jogadores</h3>
              <p className="text-gray-600">
                Colunas necessárias: <span className="font-mono bg-gray-100 px-1 rounded">nome</span>, <span className="font-mono bg-gray-100 px-1 rounded">time_nome</span>, <span className="font-mono bg-gray-100 px-1 rounded">numero</span>, <span className="font-mono bg-gray-100 px-1 rounded">camisa</span>. Opcionais: <span className="font-mono bg-gray-100 px-1 rounded">temporada</span>.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Upload de Estatísticas</h3>
              <p className="text-gray-600">
                Colunas necessárias: <span className="font-mono bg-gray-100 px-1 rounded">jogador_id</span> ou <span className="font-mono bg-gray-100 px-1 rounded">jogador_nome</span> (com <span className="font-mono bg-gray-100 px-1 rounded">time_nome</span>). 
              </p>
              <p className="text-gray-600">
                <strong>Passe:</strong> <span className="font-mono bg-gray-100 px-1 rounded">passes_completos</span>, <span className="font-mono bg-gray-100 px-1 rounded">passes_tentados</span>, <span className="font-mono bg-gray-100 px-1 rounded">passes_incompletos</span>, <span className="font-mono bg-gray-100 px-1 rounded">jds_passe</span>, <span className="font-mono bg-gray-100 px-1 rounded">tds_passe</span>, <span className="font-mono bg-gray-100 px-1 rounded">passe_xp1</span>, <span className="font-mono bg-gray-100 px-1 rounded">passe_xp2</span>, <span className="font-mono bg-gray-100 px-1 rounded">int_sofridas</span>, <span className="font-mono bg-gray-100 px-1 rounded">sacks_sofridos</span>, <span className="font-mono bg-gray-100 px-1 rounded">pressao_pct</span>
              </p>
              <p className="text-gray-600">
                <strong>Corrida:</strong> <span className="font-mono bg-gray-100 px-1 rounded">corridas</span>, <span className="font-mono bg-gray-100 px-1 rounded">jds_corridas</span>, <span className="font-mono bg-gray-100 px-1 rounded">tds_corridos</span>, <span className="font-mono bg-gray-100 px-1 rounded">corrida_xp1</span>, <span className="font-mono bg-gray-100 px-1 rounded">corrida_xp2</span>
              </p>
              <p className="text-gray-600">
                <strong>Recepção:</strong> <span className="font-mono bg-gray-100 px-1 rounded">recepcoes</span>, <span className="font-mono bg-gray-100 px-1 rounded">alvos</span>, <span className="font-mono bg-gray-100 px-1 rounded">drops</span>, <span className="font-mono bg-gray-100 px-1 rounded">jds_recepcao</span>, <span className="font-mono bg-gray-100 px-1 rounded">jds_yac</span>, <span className="font-mono bg-gray-100 px-1 rounded">tds_recepcao</span>, <span className="font-mono bg-gray-100 px-1 rounded">recepcao_xp1</span>, <span className="font-mono bg-gray-100 px-1 rounded">recepcao_xp2</span>
              </p>
              <p className="text-gray-600">
                <strong>Defesa:</strong> <span className="font-mono bg-gray-100 px-1 rounded">tck</span>, <span className="font-mono bg-gray-100 px-1 rounded">tfl</span>, <span className="font-mono bg-gray-100 px-1 rounded">pressao_pct_def</span>, <span className="font-mono bg-gray-100 px-1 rounded">sacks</span>, <span className="font-mono bg-gray-100 px-1 rounded">tip</span>, <span className="font-mono bg-gray-100 px-1 rounded">int</span>, <span className="font-mono bg-gray-100 px-1 rounded">tds_defesa</span>, <span className="font-mono bg-gray-100 px-1 rounded">defesa_xp2</span>, <span className="font-mono bg-gray-100 px-1 rounded">sft</span>, <span className="font-mono bg-gray-100 px-1 rounded">sft_1</span>, <span className="font-mono bg-gray-100 px-1 rounded">blk</span>, <span className="font-mono bg-gray-100 px-1 rounded">jds_defesa</span>
              </p>
              <p className="text-gray-600 mt-2">
                Sempre preencha o ID do Jogo (ex: jogo_001) e a Data do Jogo.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Reprocessar Estatísticas</h3>
              <p className="text-gray-600">
                Utilize esta opção quando precisar corrigir estatísticas de um jogo já processado. As estatísticas antigas serão revertidas e as novas serão aplicadas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}