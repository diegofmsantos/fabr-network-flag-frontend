import React from 'react'
import Image from 'next/image'
import { Jogador } from '@/types/jogador'
import { Time } from '@/types/time'
import { StatConfig } from '@/utils/statMappings'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { StatsFormatter } from '@/utils/statsFormater'
import { NoStats } from '../ui/NoStats'
import { getCategoryFromKey } from '../Ranking/TimeRankingGroup'

interface TeamStatsListProps {
  players: Jogador[]
  times: Time[]
  statMapping: StatConfig
}

interface RankedTeam {
  time: {
    id: number
    nome: string
    cor?: string
    capacete?: string
  }
  value: number
}

export const TeamStatsList: React.FC<TeamStatsListProps> = ({ players, times, statMapping }) => {

  const calculateTeamStat = (timeId: number): number | null => {
    if (!timeId) return null
    try {
      const teamPlayers = players.filter(player => player.timeId === timeId)
      const category = getCategoryFromKey(statMapping.key)
      let total = 0
      let divisor = 0

      if (statMapping.key === 'fumble_de_passador') {
        teamPlayers.forEach(player => {
          total += player.estatisticas.passe.fumble_de_passador
        })
        return total > 0 ? total : null
      }

      if (statMapping.key === 'jardas_punt_media') {
        teamPlayers.forEach(player => {
          total += player.estatisticas.punter.jardas_de_punt
          divisor += player.estatisticas.punter.punts
        })
        return divisor > 0 ? total / divisor : null
      }

      if (statMapping.isCalculated) {
        switch (statMapping.key) {
          case 'passes_percentual':
            teamPlayers.forEach(player => {
              total += player.estatisticas.passe.passes_completos
              divisor += player.estatisticas.passe.passes_tentados
            })
            return divisor > 0 ? (total / divisor) * 100 : null

          case 'jardas_media':
            teamPlayers.forEach(player => {
              total += player.estatisticas.passe.jardas_de_passe
              divisor += player.estatisticas.passe.passes_tentados
            })
            return divisor > 0 ? total / divisor : null

          case 'jardas_corridas_media':
            teamPlayers.forEach(player => {
              total += player.estatisticas.corrida.jardas_corridas
              divisor += player.estatisticas.corrida.corridas
            })
            return divisor > 0 ? total / divisor : null

          case 'jardas_recebidas_media':
            teamPlayers.forEach(player => {
              total += player.estatisticas.recepcao.jardas_recebidas
              divisor += player.estatisticas.recepcao.alvo
            })
            return divisor > 0 ? total / divisor : null

          case 'jardas_retornadas_media':
            teamPlayers.forEach(player => {
              total += player.estatisticas.retorno.jardas_retornadas
              divisor += player.estatisticas.retorno.retornos
            })
            return divisor > 0 ? total / divisor : null

          case 'field_goals':
            teamPlayers.forEach(player => {
              total += player.estatisticas.kicker.fg_bons
              divisor += player.estatisticas.kicker.tentativas_de_fg
            })
            return divisor > 0 ? (total / divisor) * 100 : null

          case 'extra_points':
            teamPlayers.forEach(player => {
              total += player.estatisticas.kicker.xp_bons
              divisor += player.estatisticas.kicker.tentativas_de_xp
            })
            return divisor > 0 ? (total / divisor) * 100 : null
        }
      }

      teamPlayers.forEach(player => { // @ts-ignore
        const value = player.estatisticas[category]?.[statMapping.key]
        if (typeof value === 'number') {
          total += value
        }
      })

      return total || null
    } catch (error) {
      console.error(`Error calculating stat:`, error)
      return null
    }
  }

  const normalizeForFilePath = (input: string): string => {
    return input
      .toLowerCase()
      .replace(/\s+/g, "-")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9-]/g, "");
  };

  const rankedTeams = times
    .map(time => ({
      time,
      value: calculateTeamStat(time.id || 0)
    }))
    .filter((team): team is RankedTeam =>
      team.value !== null &&
      typeof team.value === 'number' &&
      !isNaN(team.value) &&
      team.value > 0 
    )
    .sort((a, b) => {
      if (a.value === null || b.value === null) return 0
      if (b.value === a.value) {
        // @ts-ignore
        return a.time.nome.localeCompare(b.time.nome)
      }
      return b.value - a.value
    })



  const TeamListItem: React.FC<{ team: RankedTeam; index: number }> = ({ team, index }) => {

    return (
      <div className="bg-[#ECECEC] max-w-[1200px] mx-auto">
        <Link
          href={`/ranking/times`}
          className='fixed top-8 left-5 rounded-full text-xs text-[#63E300] p-2 w-8 h-8 flex justify-center items-center bg-gray-400/40 z-50 xl:left-96 2xl:left-[500px]'
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </Link>

        <div>
          <Link
            key={team.time.id}
            href={`/${encodeURIComponent(team.time.nome || '')}`}
            className={`block`}
          >
            <li
              className={`flex items-center justify-center p-2 px-4 border-b border-b-[#D9D9D9] rounded-md 
                        ${index === 0 ? "bg-gray-100 text-black shadow-lg" : "bg-white text-black"}`}
              style={{ backgroundColor: index === 0 ? team.time.cor : undefined }}
            >
              {index === 0 ? (
                <div className="flex justify-around items-center w-full text-white min-[375px]:px-4 md:justify-around md:pl-6">
                  <div className="flex flex-col justify-center pt-4">
                    <p className="text-[25px] font-bold">{index + 1}</p>
                    <h4 className="font-extrabold italic text-xl max-w-36 uppercase leading-4 md:text-[28px] md:leading-6">{team.time.nome}</h4>
                    <div className="flex items-center gap-1 ">
                      <Image
                        src={`/assets/times/logos/${normalizeForFilePath(team.time.nome)}.png`}
                        width={60}
                        height={60}
                        alt={`Logo do time ${team.time.nome}`}
                      />
                    </div>
                    <span className="font-extrabold italic text-[40px]">
                      {StatsFormatter.format(team.value, statMapping)}
                    </span>
                  </div>
                  <div className="relative w-[200px] h-[200px]">
                    <Image
                      src={`/assets/times/capacetes/${team.time.capacete}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      alt={`Capacete do ${team.time.nome}`}
                      className="object-contain"
                      priority
                      quality={100}
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full h-auto flex justify-between items-center gap-2 min-[350px]:px-4 min-[425px]:px-7 md:justify-around">
                  <div className="flex items-center md:w-60">
                    <span className="font-bold flex items-center gap-2">
                      <div>{index + 1}</div>
                      <Image
                        src={`/assets/times/logos/${normalizeForFilePath(team.time.nome)}.png`}
                        width={40}
                        height={40}
                        alt={`Logo do time ${team.time.nome}`}
                        className='mr-4'
                      />
                    </span>
                    <div className=" text-sm">
                      {team.time.nome}
                    </div>
                  </div>
                  <span className="font-bold text-lg">
                    {StatsFormatter.format(team.value, statMapping)}
                  </span>
                </div>
              )}
            </li>
          </Link>
        </div>
      </div>
    )
  }

  if (!rankedTeams.length) {
    return (
      <div className="bg-[#ECECEC] py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">{statMapping.category}</h1>
        <div className="max-w-2xl mx-auto px-4">
          <NoStats />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#ECECEC] py-8 max-w-[1200px] mx-auto">
      <div className="">
        {rankedTeams.map((team, index) => (
          <TeamListItem key={team.time.id} team={team} index={index} />
        ))}
      </div>
    </div>
  )
}