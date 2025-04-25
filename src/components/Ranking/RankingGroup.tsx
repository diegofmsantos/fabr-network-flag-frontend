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

type StatisticKey =
  | keyof Jogador['estatisticas']['passe']
  | keyof Jogador['estatisticas']['corrida']
  | keyof Jogador['estatisticas']['recepcao']
  | keyof Jogador['estatisticas']['retorno']
  | keyof Jogador['estatisticas']['defesa']
  | keyof Jogador['estatisticas']['kicker']
  | keyof Jogador['estatisticas']['punter'];

type CalculatedStatKey =
  | 'passes_percentual'
  | 'jardas_media'
  | 'jardas_corridas_media'
  | 'jardas_recebidas_media'
  | 'jardas_retornadas_media'
  | 'extra_points'
  | 'field_goals'
  | 'jardas_punt_media';

export type StatKey = StatisticKey | CalculatedStatKey

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

  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const timesData = await getTimes()
        setTimes(timesData)
      } catch (error) {
        console.error('Error fetching times:', error)
      }
    }
    fetchTimes()
  }, [])


  const normalizeValue = (value: string | number | null, statKey: StatKey): string => {
    if (value === null) return 'N/A'

    // Manter formato original para FGs
    if (['fg_11_20', 'fg_21_30', 'fg_31_40', 'fg_41_50'].includes(statKey)) return String(value)

    if (typeof value === 'string') return value

    const percentageStats = ['passes_percentual', 'extra_points', 'field_goals']
    const averageStats = ['jardas_media', 'jardas_corridas_media', 'jardas_recebidas_media', 'jardas_retornadas_media', 'jardas_punt_media']

    if (percentageStats.includes(statKey)) {
      return `${Math.round(value)}%`;
    } else if (averageStats.includes(statKey)) {
      return value.toFixed(1);
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
      .replace(/\s+/g, '-')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9-]/g, '')

  return (
    <div className="mb-6 pl-4 py-8 overflow-x-hidden overflow-y-hidden mx-auto xl:px-12 xl:overflow-x xl:overflow-y">
      <h2 className="text-4xl pl-2 font-extrabold italic mb-4 leading-[30px] tracking-[-2px] lg:pl-16 xl:pl-20">{title}</h2>
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