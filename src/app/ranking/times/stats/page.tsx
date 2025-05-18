"use client"

import React, { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loading } from '@/components/ui/Loading'
import { useStats } from '@/hooks/useStats'
import { useTeamInfo } from '@/hooks/useTeamInfo'
import { getStatMapping } from '@/utils/statMappings'
import { TeamStatsList } from '@/components/Stats/TeamStatsList'
import { StatsLayout } from '@/components/Stats/StatsLayout'

// Definindo os grupos de estatísticas atualizados para flag football
const statGroups = [
  {
    title: "Passe",
    groupLabel: "passe",
    stats: [
      { title: "Passes Tentados", urlParam: "passe-tentados" },
      { title: "Passes Completos", urlParam: "passe-completos" },
      { title: "Passes Incompletos", urlParam: "passe-incompletos" },
      { title: "Jardas", urlParam: "passe-jardas" },
      { title: "Touchdowns", urlParam: "passe-td" },
      { title: "Extra Point (1)", urlParam: "passe-xp1" },
      { title: "Extra Point (2)", urlParam: "passe-xp2" },
      { title: "Interceptações Sofridas", urlParam: "passe-int" },
      { title: "Sacks Sofridos", urlParam: "passe-sacks" },
      { title: "Percentual de Passe", urlParam: "passe-percentual" }
    ]
  },
  {
    title: "Corrida",
    groupLabel: "corrida",
    stats: [
      { title: "Corridas", urlParam: "corrida-total" },
      { title: "Jardas", urlParam: "corrida-jardas" },
      { title: "Touchdowns", urlParam: "corrida-td" },
      { title: "Extra Point (1)", urlParam: "corrida-xp1" },
      { title: "Extra Point (2)", urlParam: "corrida-xp2" }
    ]
  },
  {
    title: "Recepção",
    groupLabel: "recepcao",
    stats: [
      { title: "Recepções", urlParam: "recepcao-total" },
      { title: "Alvos", urlParam: "recepcao-alvo" },
      { title: "Drops", urlParam: "recepcao-drops" },
      { title: "Jardas", urlParam: "recepcao-jardas" },
      { title: "Jardas Após Recepção", urlParam: "recepcao-yac" },
      { title: "Touchdowns", urlParam: "recepcao-td" },
      { title: "Extra Point (1)", urlParam: "recepcao-xp1" },
      { title: "Extra Point (2)", urlParam: "recepcao-xp2" }
    ]
  },
  {
    title: "Defesa",
    groupLabel: "defesa",
    stats: [
      { title: "Tackles", urlParam: "defesa-tck" },
      { title: "Tackles For Loss", urlParam: "defesa-tfl" },
      { title: "Sacks", urlParam: "defesa-sack" },
      { title: "Pressão (%)", urlParam: "defesa-pressao" },
      { title: "Passes Desviados", urlParam: "defesa-tip" },
      { title: "Interceptações", urlParam: "defesa-int" },
      { title: "Touchdowns", urlParam: "defesa-td" },
      { title: "Extra Point (2)", urlParam: "defesa-xp2" },
      { title: "Safeties", urlParam: "defesa-sft" },
      { title: "Safety (1)", urlParam: "defesa-sft1" },
      { title: "Bloqueios", urlParam: "defesa-blk" },
      { title: "Jardas", urlParam: "defesa-jardas" }
    ]
  }
];

// Função getStatGroup permanece com a mesma lógica, mas adaptada para os novos grupos
const getStatGroup = (statParam: string): string => {
    for (const group of statGroups) {
        if (group.stats.some(stat => stat.urlParam === statParam)) {
            return group.title
        }
    }
    return 'Passe' // Default para "Passe" em vez de "Passando"
}

// Componente Select em um componente separado com Suspense
const TeamStatSelect = React.memo(({ currentStat }: { currentStat: string }) => {
    const router = useRouter()
    const currentGroup = getStatGroup(currentStat)

    const handleStatChange = (newStat: string) => {
        router.push(`/ranking/times/stats?stat=${newStat}`)
    }

    return (
        <div className="mb-6 mx-4">
            <h1 className="text-4xl font-bold mb-4 text-center uppercase">{currentGroup}</h1>
            <select
                value={currentStat}
                onChange={(e) => handleStatChange(e.target.value)}
                className="w-full p-2 rounded-md border border-gray-300 bg-white"
            >
                {statGroups.map((group) => (
                    <optgroup key={group.groupLabel} label={group.title}>
                        {group.stats.map((stat) => (
                            <option key={stat.urlParam} value={stat.urlParam}>
                                {stat.title}
                            </option>
                        ))}
                    </optgroup>
                ))}
            </select>
        </div>
    )
})

TeamStatSelect.displayName = 'TeamStatSelect'

// Componente de conteúdo separado
function TeamStatsContent() {
    const searchParams = useSearchParams()
    const statParam = searchParams.get('stat') || 'passe-tentados' // Valor padrão alterado para passe-tentados
    const { players, times, loading } = useStats() 
    const getTeamInfo = useTeamInfo(times)
    const statMapping = getStatMapping(statParam)

    if (loading) {
        return <Loading />
    }

    return (
        <Suspense fallback={<Loading />}>
            <div>
                <TeamStatSelect currentStat={statParam} />
                <TeamStatsList
                    players={players}
                    times={times}
                    statMapping={statMapping}
                />
            </div>
        </Suspense>
    );
}

// Componente principal da página envolto em um Suspense
export default function TeamStatsPage() {
    const searchParams = useSearchParams();
    const statParam = searchParams.get('stat') || '';

    return (
        <Suspense fallback={<Loading />}>
            <StatsLayout initialFilter="times" statType={statParam}>
                <div className="bg-[#ECECEC] min-h-screen pt-7 pb-14 px-2 lg:max-w-[800px] lg:min-w-[800px] lg:m-auto">
                    <TeamStatsContent />
                </div>
            </StatsLayout>
        </Suspense>
    )
}