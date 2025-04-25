"use client"

import React from 'react'
import { useSearchParams } from 'next/navigation'
import { Loading } from '@/components/ui/Loading'
import { CategoryKey, getTierTitle, getTierForValue } from '@/utils/categoryThresholds'
import { getStatMapping } from '@/utils/statMappings'
import StatsTier from '@/components/Stats/StatsTier'
import { useStats } from '@/hooks/useStats'
import { useTeamInfo } from '@/hooks/useTeamInfo'
import { usePlayerProcessing } from '@/hooks/usePlayerProcessing'
import { ProcessedPlayer } from '@/types/processedPlayer'
import { StatType } from '@/types/Stats'
import { PlayerStatSelect } from '@/components/Stats/PlayerStatSelect'
import { StatsLayout } from '@/components/Stats/StatsLayout'

const StatsPage: React.FC = () => {
  const searchParams = useSearchParams()
  const statParam = searchParams.get('stat') || ''
  const { players, times, loading } = useStats()
  const getTeamInfo = useTeamInfo(times);
  const statMapping = getStatMapping(statParam)
  const { processPlayers } = usePlayerProcessing(statMapping, getTeamInfo)

  if (loading) return <Loading />

  const groupPlayersByTier = (processedPlayers: ProcessedPlayer[]) => {
    return processedPlayers.reduce<Record<string, ProcessedPlayer[]>>(
      (acc, player) => {
        // Determina o tier usando o valor base
        const tier = getTierForValue(
          player.baseStat,
          statMapping.category as CategoryKey
        );

        // Agrupa o jogador no tier apropriado
        const tierKey = `tier${tier}`
        if (!acc[tierKey]) {
          acc[tierKey] = []
        }
        acc[tierKey].push(player)

        return acc
      },
      { tier1: [], tier2: [], tier3: [] }
    )
  }

  const mapPlayersToProps = (
    players: ProcessedPlayer[],
    startIndex: number
  ) => {
    return players.map((item, index) => ({
      player: item.player,
      teamInfo: item.teamInfo,
      value: item.value,
      index: index + startIndex
    }))
  }

  const renderTierSection = (
    tier: number,
    players: ProcessedPlayer[],
    startIndex: number,
    backgroundColor?: string
  ) => {
    const getStatsType = (category: CategoryKey): StatType => {
      // Mapeia as categorias em minúsculo para o formato correto
      const categoryMapping: Record<string, StatType> = {
        'passe': 'PASSE',
        'corrida': 'CORRIDA',
        'recepcao': 'RECEPÇÃO',
        'retorno': 'RETORNO',
        'defesa': 'DEFESA',
        'kicker': 'CHUTE',
        'punter': 'PUNT'
      };

      // Verifica primeiro pelo statParam para casos especiais
      if (statParam) {
        const statBase = statParam.split('-')[0]; // Pega a parte antes do hífen
        const mappedType = categoryMapping[statBase as CategoryKey]
        if (mappedType) return mappedType
      }

      // Se não encontrou pelo statParam, usa a categoria direta
      return categoryMapping[category] || 'PASSE'
    }

    return (
      <StatsTier
        title={getTierTitle(statMapping.category as CategoryKey, tier)}
        players={mapPlayersToProps(players, startIndex)}
        backgroundColor={backgroundColor}
        statsType={getStatsType(statMapping.category)}
        isLastTier={tier === 3}
      />
    )
  }

  const processedPlayers = processPlayers(players)
  const tierPlayers = groupPlayersByTier(processedPlayers)

  return (
    <StatsLayout initialFilter="jogadores" statType={statParam}>
      {/* Conteúdo existente da página */}

      <div className="bg-[#ECECEC] min-h-screen pt-8 pb-14 px-2 lg:max-w-[800px] lg:min-w-[800px] lg:m-auto">
        <div className="">
          <PlayerStatSelect currentStat={statParam} />

          {renderTierSection(1, tierPlayers.tier1, 0)}
          {renderTierSection(2, tierPlayers.tier2, tierPlayers.tier1.length, 'bg-gray-700')}
          {renderTierSection(
            3,
            tierPlayers.tier3,
            tierPlayers.tier1.length + tierPlayers.tier2.length,
            'bg-gray-500'
          )}
        </div>
      </div>
    </StatsLayout>
  )
}

export default StatsPage