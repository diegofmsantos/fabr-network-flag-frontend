import React from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface Transferencia {
  id: number;
  jogadorNome: string;
  timeOrigemId?: number;
  timeOrigemNome?: string;
  timeOrigemSigla?: string;
  timeDestinoId: number;
  timeDestinoNome?: string;
  timeDestinoSigla?: string;
  novaPosicao?: string | null;
  novoSetor?: string | null;
  novoNumero?: number | null;
  novaCamisa?: string | null;
  data: string;
}

interface TransferenciaCardProps {
  transferencia: Transferencia;
  destacado?: boolean;
}

export const TransferenciaCard: React.FC<TransferenciaCardProps> = ({ 
  transferencia, 
  destacado = false 
}) => {
  // Função para normalizar nomes de time para usar em paths de arquivos
  const normalizeForFilePath = (input: string): string => {
    if (!input) return '';
    
    return input
      .toLowerCase()
      .replace(/\s+/g, '-')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9-]/g, '');
  };

  const dataFormatada = new Date(transferencia.data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div 
      className={`${
        destacado 
          ? 'bg-white shadow-md border-l-4 border-green-500' 
          : 'bg-white shadow-sm'
      } rounded-lg p-4 transition-all hover:shadow-lg`}
    >
      <div className="mb-2 flex justify-between items-center">
        <h3 className="font-bold text-lg">{transferencia.jogadorNome}</h3>
        <span className="text-xs text-gray-500">{dataFormatada}</span>
      </div>
      
      <div className="flex items-center justify-between mb-2">
        {transferencia.timeOrigemNome ? (
          <div className="flex items-center">
            <div className="relative w-10 h-10 mr-2">
              <Image
                src={`/assets/times/logos/${normalizeForFilePath(transferencia.timeOrigemNome)}.png`}
                alt={transferencia.timeOrigemNome}
                fill
                className="object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/assets/times/logos/default-logo.png';
                }}
              />
            </div>
            <span className="text-sm font-medium">{transferencia.timeOrigemNome}</span>
          </div>
        ) : (
          <div className="text-sm text-gray-500">Sem time anterior</div>
        )}

        <FontAwesomeIcon 
          icon={faArrowRight} 
          className="mx-4 text-green-500"
          size="lg"
        />

        {transferencia.timeDestinoNome && (
          <div className="flex items-center">
            <div className="relative w-10 h-10 mr-2">
              <Image
                src={`/assets/times/logos/${normalizeForFilePath(transferencia.timeDestinoNome)}.png`}
                alt={transferencia.timeDestinoNome}
                fill
                className="object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/assets/times/logos/default-logo.png';
                }}
              />
            </div>
            <span className="text-sm font-medium">{transferencia.timeDestinoNome}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {transferencia.novaPosicao && (
          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {transferencia.novaPosicao}
          </span>
        )}
        {transferencia.novoSetor && (
          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {transferencia.novoSetor}
          </span>
        )}
      </div>
    </div>
  );
};

export default TransferenciaCard;