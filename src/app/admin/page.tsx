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
                Colunas necessárias: <span className="font-mono bg-gray-100 px-1 rounded">nome</span>, <span className="font-mono bg-gray-100 px-1 rounded">sigla</span>, <span className="font-mono bg-gray-100 px-1 rounded">cor</span>, <span className="font-mono bg-gray-100 px-1 rounded">cidade</span>, <span className="font-mono bg-gray-100 px-1 rounded">bandeira_estado</span>, <span className="font-mono bg-gray-100 px-1 rounded">logo</span>. Opcionais: <span className="font-mono bg-gray-100 px-1 rounded">instagram</span>, <span className="font-mono bg-gray-100 px-1 rounded">instagram2</span>, <span className="font-mono bg-gray-100 px-1 rounded">temporada</span>.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Upload de Jogadores</h3>
              <p className="text-gray-600">
                Colunas necessárias: <span className="font-mono bg-gray-100 px-1 rounded">nome</span>, <span className="font-mono bg-gray-100 px-1 rounded">time_nome</span>, <span className="font-mono bg-gray-100 px-1 rounded">idade</span>, <span className="font-mono bg-gray-100 px-1 rounded">altura</span>, <span className="font-mono bg-gray-100 px-1 rounded">peso</span>, <span className="font-mono bg-gray-100 px-1 rounded">cidade</span>, <span className="font-mono bg-gray-100 px-1 rounded">numero</span>, <span className="font-mono bg-gray-100 px-1 rounded">camisa</span>. Opcionais: <span className="font-mono bg-gray-100 px-1 rounded">instagram</span>, <span className="font-mono bg-gray-100 px-1 rounded">instagram2</span>, <span className="font-mono bg-gray-100 px-1 rounded">temporada</span>.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Upload de Estatísticas</h3>
              <p className="text-gray-600">
                Colunas necessárias: <span className="font-mono bg-gray-100 px-1 rounded">jogador_id</span> ou <span className="font-mono bg-gray-100 px-1 rounded">jogador_nome</span> (com <span className="font-mono bg-gray-100 px-1 rounded">time_nome</span>). Estatísticas: qualquer uma das colunas <span className="font-mono bg-gray-100 px-1 rounded">passes_completos</span>, <span className="font-mono bg-gray-100 px-1 rounded">passes_tentados</span>, <span className="font-mono bg-gray-100 px-1 rounded">td_passado</span>, etc.
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