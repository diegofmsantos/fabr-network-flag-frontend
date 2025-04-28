"use client"

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { getTransferenciasFromJson } from '@/api/api'
import { Loading } from '@/components/ui/Loading'
import { SelectFilter } from '@/components/SelectFilter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

// Interface para as transferências
interface Transferencia {
  id: number
  jogadorNome: string
  timeOrigemId?: number
  timeOrigemNome?: string
  timeOrigemSigla?: string
  timeDestinoId: number
  timeDestinoNome?: string
  timeDestinoSigla?: string
  novaPosicao?: string | null
  novoSetor?: string | null
  novoNumero?: number | null
  novaCamisa?: string | null
  data: string
}

export default function MercadoPage() {
  const searchParams = useSearchParams()
  const [temporadaOrigem, setTemporadaOrigem] = useState('2024')
  const [temporadaDestino, setTemporadaDestino] = useState('2025')
  const [transferencias, setTransferencias] = useState<Transferencia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar transferências
  useEffect(() => {
    const loadTransferencias = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getTransferenciasFromJson(temporadaOrigem, temporadaDestino)
        setTransferencias(data)
      } catch (err) {
        console.error('Erro ao carregar transferências:', err)
        setError('Não foi possível carregar os dados de transferências.')
      } finally {
        setLoading(false)
      }
    }

    loadTransferencias()
  }, [temporadaOrigem, temporadaDestino])

  // Função para normalizar nomes de time para usar em paths de arquivos
  const normalizeForFilePath = (input: string): string => {
    if (!input) return '';
    
    return input
      .toLowerCase()
      .replace(/\s+/g, '-')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9-]/g, '');
  }

  // Agrupar transferências por time de destino
  const transferenciasAgrupadas = transferencias.reduce((acc, transferencia) => {
    const timeDestino = transferencia.timeDestinoNome || 'Desconhecido';
    
    if (!acc[timeDestino]) {
      acc[timeDestino] = [];
    }
    
    acc[timeDestino].push(transferencia);
    return acc;
  }, {} as Record<string, Transferencia[]>);

  // Ordenar times por quantidade de transferências (decrescente)
  const timesOrdenados = Object.entries(transferenciasAgrupadas)
    .sort(([, transferenciasA], [, transferenciasB]) => 
      transferenciasB.length - transferenciasA.length
    );

  return (
    <div className="bg-[#ECECEC] min-h-screen pb-20 pt-4 lg:pt-6 max-w-[900px] mx-auto xl:mr-44 2xl:mr-80 xl:pt-0">
      <h1 className="w-full text-[40px] bg-[#ECECEC] fixed mt-16 z-50 text-black max-w-7xl p-4 px-2 font-extrabold italic leading-[55px] tracking-[-5px] uppercase lg:static lg:mt-16 lg:flex lg:justify-center">
        Mercado {temporadaOrigem}/{temporadaDestino}
      </h1>

      <div className="mt-40 lg:mt-4 flex flex-col gap-4 max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <div className="flex-1">
            <SelectFilter
              label="TEMPORADA ORIGEM"
              value={temporadaOrigem}
              onChange={setTemporadaOrigem}
              options={[
                { label: '2024', value: '2024' }
              ]}
              preventRefresh={true}
            />
          </div>
          <div className="flex-1">
            <SelectFilter
              label="TEMPORADA DESTINO"
              value={temporadaDestino}
              onChange={setTemporadaDestino}
              options={[
                { label: '2025', value: '2025' }
              ]}
              preventRefresh={true}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center my-12">
            <Loading />
          </div>
        ) : error ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-red-500 font-bold text-lg mb-2">Erro</p>
            <p>{error}</p>
            <p className="mt-4 text-sm text-gray-600">
              Verifique se os dados de transferências para as temporadas selecionadas estão disponíveis.
            </p>
          </div>
        ) : transferencias.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-700 font-bold text-lg mb-2">Sem Transferências</p>
            <p>Não há dados de transferências disponíveis para este período.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-2">Resumo de Transferências</h2>
              <p className="text-lg"><span className="font-bold">{transferencias.length}</span> jogadores transferidos</p>
              <p className="text-lg"><span className="font-bold">{Object.keys(transferenciasAgrupadas).length}</span> times envolvidos</p>
            </div>

            {timesOrdenados.map(([timeDestino, jogadoresTransferidos]) => (
              <div key={timeDestino} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 relative">
                    {jogadoresTransferidos[0]?.timeDestinoSigla && (
                      <Image
                        src={`/assets/times/logos/${normalizeForFilePath(timeDestino)}.png`}
                        alt={`Logo ${timeDestino}`}
                        width={48}
                        height={48}
                        className="object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/assets/times/logos/default-logo.png';
                        }}
                      />
                    )}
                  </div>
                  <h3 className="text-xl font-bold">{timeDestino}</h3>
                  <span className="bg-green-500 text-white rounded-full px-3 py-1 text-sm ml-2">
                    +{jogadoresTransferidos.length}
                  </span>
                </div>

                <ul className="divide-y divide-gray-200">
                  {jogadoresTransferidos.map((transferencia) => (
                    <li key={transferencia.id} className="py-3">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                        <div className="flex items-center gap-2">
                          <div className="font-bold">{transferencia.jogadorNome}</div>
                          {transferencia.novaPosicao && (
                            <span className="bg-gray-200 text-gray-700 rounded-md px-2 py-1 text-xs">
                              {transferencia.novaPosicao}
                            </span>
                          )}
                        </div>

                        {transferencia.timeOrigemNome && (
                          <div className="flex items-center gap-2 text-sm">
                            <div className="flex items-center">
                              <div className="w-6 h-6 relative">
                                <Image
                                  src={`/assets/times/logos/${normalizeForFilePath(transferencia.timeOrigemNome)}.png`}
                                  alt={`Logo ${transferencia.timeOrigemNome}`}
                                  width={24}
                                  height={24}
                                  className="object-contain"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/assets/times/logos/default-logo.png';
                                  }}
                                />
                              </div>
                              <span className="ml-1">{transferencia.timeOrigemNome}</span>
                            </div>
                            
                            <FontAwesomeIcon icon={faArrowRight} className="text-gray-500" />
                            
                            <div className="flex items-center">
                              <div className="w-6 h-6 relative">
                                <Image
                                  src={`/assets/times/logos/${normalizeForFilePath(timeDestino)}.png`}
                                  alt={`Logo ${timeDestino}`}
                                  width={24}
                                  height={24}
                                  className="object-contain"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/assets/times/logos/default-logo.png';
                                  }}
                                />
                              </div>
                              <span className="ml-1">{timeDestino}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}