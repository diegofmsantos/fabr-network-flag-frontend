import React from 'react';

interface PlayerComparisonCardProps {
  title: string;
  player1: any;
  player2: any;
  team1: {
    id: number;
    nome: string;
    cor: string;
  };
  team2: {
    id: number;
    nome: string;
    cor: string;
  };
  statKey: string;
  statCategory: 'ataque' | 'defesa';
}

export const PlayerComparisonCard: React.FC<PlayerComparisonCardProps> = ({
  title, 
  player1, 
  player2, 
  team1, 
  team2, 
  statKey, 
  statCategory
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
          className={`p-2 rounded-md ${
            isFirstBetter ? 'bg-green-100' : isEqual ? 'bg-gray-200' : ''
          }`}
        >
          {player1 ? (
            <div className="flex items-center">
              <div className="flex-1">
                <p className="font-bold" style={{ color: team1.cor }}>
                  {player1.nome}
                </p>
                <p className="text-sm">{value1}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">Nenhum destaque</p>
          )}
        </div>

        {/* Jogador Time 2 */}
        <div
          className={`p-2 rounded-md ${
            isSecondBetter ? 'bg-green-100' : isEqual ? 'bg-gray-200' : ''
          }`}
        >
          {player2 ? (
            <div className="flex items-center">
              <div className="flex-1">
                <p className="font-bold" style={{ color: team2.cor }}>
                  {player2.nome}
                </p>
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