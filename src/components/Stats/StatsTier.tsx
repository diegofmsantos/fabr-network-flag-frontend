import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { StatsExplicacao } from './StatsExplicacao'

interface PlayerStats {
  player: any
  teamInfo: {
    nome: string
    cor: string
  }
  value: string | number
  index: number
}

interface StatsTierProps {
  title: string
  players: PlayerStats[]
  backgroundColor?: string
  statsType: 'PASSE' | 'CORRIDA' | 'RECEPÇÃO' | 'DEFESA'
  isLastTier?: boolean
}

const StatsTier: React.FC<StatsTierProps> = ({ title, players, backgroundColor = 'bg-black', statsType, isLastTier = false }) => {
  const normalizeForFilePath = (input: string): string =>
    input.toLowerCase()
      .replace(/\s+/g, '-')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9-]/g, '')

  const getShirtPath = (team: string, camisa: string): string => {
    const normalizedTeam = normalizeForFilePath(team);
    return team && team !== "time-desconhecido" && camisa
      ? `/assets/times/camisas/${normalizedTeam}/${camisa}`
      : "/assets/times/camisas/camisa-teste-flag.png"
  }

  const formatNumber = (value: string | number): string => {
    if (typeof value === 'number') {
      return value.toLocaleString('pt-BR')
    }
    const num = parseInt(value);
    return isNaN(num) ? value : num.toLocaleString('pt-BR')
  }

  if (players.length === 0) {
    return (
      <div className="mb-8">
        <div className={`inline-block text-sm font-bold mb-2 ${backgroundColor} text-white p-2 rounded-xl`}>
          {title}
        </div>
        <div className="bg-white p-4 rounded-md text-center text-gray-500">
          Nenhum jogador encontrado
        </div>
      </div>
    )
  }

  return (
    <div className="mb-8 max-w-[1200px] mx-auto">
      <Link
        href={"/ranking?temporada=2025"}
        className='fixed top-8 left-5 rounded-full text-xs text-[#63E300] p-2 w-8 h-8 flex justify-center items-center bg-gray-400/40 z-50 xl:left-96 2xl:left-[500px]'>
        <FontAwesomeIcon icon={faAngleLeft} />
      </Link>
      <div className={`inline-block text-sm font-bold mb-2 ${backgroundColor} text-white p-2 rounded-xl`}>
        {title}
      </div>
      <ul className="flex flex-col text-white h-full">
        {players.map(({ player, teamInfo, value, index }) => {
          const teamLogoPath = `/assets/times/logos/${normalizeForFilePath(teamInfo.nome)}.png`;
          const globalIndex = index + 1

          return (
            <li
              key={player.id}
              className={`flex items-center justify-center p-2 px-4 border-b border-b-[#D9D9D9] rounded-md 
                ${index === 0 ? "bg-gray-100 text-black shadow-lg" : "bg-white text-black"
                }`}
              style={{ backgroundColor: index === 0 ? teamInfo.cor : undefined }}
            >
              <Link
                href={`/${normalizeForFilePath(teamInfo.nome)}/${player.id}?temporada=2025`}
                className="w-full"
              >
                {index === 0 ? (
                  <div className="flex justify-between items-center w-full text-white min-[375px]:pl-4 md:justify-around md:pl-6">
                    <div className="flex flex-col justify-center">
                      <p className="text-[25px] font-bold">{globalIndex}</p>
                      <h4 className="font-bold flex flex-col leading-tight md:mt-2">
                        <span className="text-[12px] font-extrabold italic uppercase leading-4 md:text-lg md:leading-5">{player.nome.split(" ")[0]}</span>
                        <span className="text-2xl font-extrabold italic uppercase leading-4 md:text-3xl md:leading-5">{player.nome.split(" ").slice(1).join(" ")}</span>
                      </h4>
                      <div className="flex items-center gap-1 min-w-32 max-[374px]:hidden md:mt-3">
                        <Image src={teamLogoPath} width={40} height={40} alt={`Logo do time ${teamInfo.nome}`} />
                        <p className="text-[10px]">{teamInfo.nome}</p>
                      </div>
                      <span className="font-extrabold italic text-[40px] max-[374px]:mt-4">{value}</span>
                    </div>
                    <div className="relative w-[200px] h-[200px]">
                      <Image
                        src={getShirtPath(teamInfo.nome, player.camisa)}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        alt={`Camisa do ${player.nome}`}
                        className="object-contain"
                        priority
                        quality={100}
                        loading="eager"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-auto flex justify-between items-center gap-2 min-[350px]:px-4 min-[425px]:px-7 md:justify-around">
                    <div className="flex items-center md:w-60">
                      <span className="font-bold flex items-center gap-2">
                        <div>{globalIndex}</div>
                        <Image src={teamLogoPath} width={40} height={40} alt={`Logo do time ${teamInfo.nome}`} />
                      </span>
                      <div className="flex flex-col">
                        <div className="font-bold text-[14px]">{player.nome}</div>
                        <div className="font-light text-[14px]">{teamInfo.nome}</div>
                      </div>
                    </div>
                    <span className="font-bold text-lg">{value}</span>
                  </div>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
      {isLastTier && statsType && <StatsExplicacao type={statsType} />}
    </div>
  )
}

export default StatsTier