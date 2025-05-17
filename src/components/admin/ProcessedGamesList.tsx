// src/components/admin/ProcessedGamesList.tsx
import React, { useState, useEffect } from 'react';
import { ClipboardList, RefreshCw, AlertCircle } from 'lucide-react';

interface ProcessedGame {
    id_jogo: string;
    data_jogo: string;
    processado_em: string;
}

const ProcessedGamesList = () => {
    const [games, setGames] = useState<ProcessedGame[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProcessedGames = async () => {
        try {
            setLoading(true);
            setError(null);

            // Base URL da API
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
            const response = await fetch(`${API_BASE_URL}/jogos-processados`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao buscar jogos processados');
            }

            const data = await response.json();
            setGames(data.jogos || []);
        } catch (err: any) {
            setError(err.message || 'Erro ao buscar jogos processados');
            console.error('Erro:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProcessedGames();
    }, []);

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('pt-BR');
        } catch (e) {
            return dateString;
        }
    };

    const formatDateTime = (dateTimeString: string) => {
        try {
            const date = new Date(dateTimeString);
            return `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR')}`;
        } catch (e) {
            return dateTimeString;
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-[#1C1C24] p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Jogos Processados</h2>
                <button
                    onClick={fetchProcessedGames}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                    <RefreshCw size={16} className="mr-1" />
                    Atualizar
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
                    <AlertCircle size={20} className="mr-2" />
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-8">
                    <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            ) : games.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <ClipboardList size={48} className="mx-auto mb-4 text-gray-400" />
                    <p>Nenhum jogo processado ainda.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID do Jogo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Data do Jogo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Processado em
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {games.map((game) => (
                                <tr key={game.id_jogo} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {game.id_jogo}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(game.data_jogo)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDateTime(game.processado_em)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ProcessedGamesList;