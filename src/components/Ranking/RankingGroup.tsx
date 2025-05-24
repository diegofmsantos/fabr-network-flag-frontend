import React, { useState, useEffect } from 'react'
import Slider from 'react-slick'
import { Jogador } from '@/types/jogador'
import { Time } from '@/types/time'
import { getTimes } from '@/api/api'
import { RankingCard } from './RankingCard'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { calculateStat, compareValues, shouldIncludePlayer } from '@/utils/statMappings'
import { NoStats } from '../ui/NoStats'
import { Loading } from '../ui/Loading'

export type StatKey =
  // Passe
  | 'passes_completos'
  | 'passes_tentados'
  | 'passes_incompletos'
  | 'jds_passe'
  | 'tds_passe'
  | 'passe_xp1'
  | 'passe_xp2'
  | 'int_sofridas'
  | 'sacks_sofridos'
  | 'pressao_pct'
  // Corrida
  | 'corridas'
  | 'jds_corridas'
  | 'tds_corridos'
  | 'corrida_xp1'
  | 'corrida_xp2'
  // Recepção
  | 'recepcoes'
  | 'alvos'
  | 'drops'
  | 'jds_recepcao'
  | 'jds_yac'
  | 'tds_recepcao'
  | 'recepcao_xp1'
  | 'recepcao_xp2'
  // Defesa
  | 'tck'
  | 'tfl'
  | 'pressao_pct_def'
  | 'sacks'
  | 'tip'
  | 'int'
  | 'tds_defesa'
  | 'defesa_xp2'
  | 'sft'
  | 'sft_1'
  | 'blk'
  | 'jds_defesa'
  // Estatísticas calculadas
  | 'passes_percentual';
  
interface RankingGroupProps {
  title: string;
  stats: { key: StatKey; title: string }[]
  players: Jogador[]
}

const SLIDER_SETTINGS = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1.2,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1.5,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1.2,
        slidesToScroll: 1,
      },
    },
  ],
}

export const RankingGroup: React.FC<RankingGroupProps> = ({ title, stats, players }) => {
  const [times, setTimes] = useState<Time[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTimes = async () => {
      try {
        setLoading(true)
        // Atualizado para usar 2025 como temporada padrão
        const timesData = await getTimes('2025')
        setTimes(timesData)
      } catch (error) {
        console.error('Error fetching times:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTimes()
  }, [])

  const normalizeValue = (value: string | number | null, statKey: StatKey): string => {
    if (value === null) return 'N/A'

    if (typeof value === 'string') return value

    // Lista simplificada de estatísticas especiais para flag football
    const percentageStats = ['passes_percentual']

    if (percentageStats.includes(statKey as string)) {
      return `${Math.round(value)}%`;
    }
    
    return Math.round(value).toString();
  }

  const getTeamInfo = (timeId: number) => {
    const team = times.find((t) => t.id === timeId)
    return {
      nome: team?.nome || 'time-desconhecido',
      cor: team?.cor || '#CCCCCC',
    }
  }

  const normalizeForFilePath = (input: string): string =>
    input
      .toLowerCase()
      .replace(/\s+/g, "-")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9-]/g, "")

  // Verifique se há jogadores válidos para pelo menos uma estatística
  const hasValidPlayers = stats.some(stat => {
    const validPlayers = players
      .filter(player => shouldIncludePlayer(player, stat.key, title))
      .length > 0;
    return validPlayers;
  });

  if (loading) {
    return <div className="mb-6 pl-4 py-8"><Loading /></div>;
  }

  // Se não há jogadores válidos para nenhuma estatística, mostra mensagem
  if (!hasValidPlayers) {
    return (
      <div className="mb-6 pl-4 py-8">
        <h2 className="text-4xl pl-2 font-extrabold italic mb-4 leading-[30px] tracking-[-2px]">{title}</h2>
        <NoStats />
      </div>
    );
  }

  return (
    <div className="mb-6 pl-4 py-8 overflow-x-hidden overflow-y-hidden mx-auto xl:px-12 xl:overflow-x xl:overflow-y">
      <h2 className="text-3xl pl-2 font-extrabold italic mb-4 leading-[30px] tracking-[-2px] lg:pl-16 xl:pl-20 xl:text-4xl">{title}</h2>
      <Slider {...SLIDER_SETTINGS}>
        {stats.map((stat, index) => {
          const filteredPlayers = players
            .filter(player => shouldIncludePlayer(player, stat.key, title))
            .sort((a, b) => {
              const aValue = calculateStat(a, stat.key);
              const bValue = calculateStat(b, stat.key);
              return compareValues(aValue, bValue);
            })
            .slice(0, 5)

          if (filteredPlayers.length === 0) {
            return (
              <div key={index}>
                <div className="inline-block text-sm font-bold mb-2 bg-black text-white p-2 rounded-xl">
                  {stat.title}
                </div>
                <NoStats />
              </div>
            )
          }

          return (
            <div key={index}>
              <RankingCard
                title={stat.title}
                category={title}
                stat={stat.key}
                players={filteredPlayers.map((player, playerIndex) => {
                  const teamInfo = getTeamInfo(player.timeId);
                  const value = calculateStat(player, stat.key);

                  return {
                    id: player.id,
                    name: player.nome,
                    team: teamInfo.nome,
                    value: normalizeValue(value, stat.key),
                    camisa: player.camisa,
                    teamColor: playerIndex === 0 ? teamInfo.cor : undefined,
                    teamLogo: `/assets/times/logos/${normalizeForFilePath(teamInfo.nome)}.png`,
                    isFirst: playerIndex === 0,
                  }
                })}
              />
            </div>
          )
        })}
      </Slider>
    </div>
  )
}