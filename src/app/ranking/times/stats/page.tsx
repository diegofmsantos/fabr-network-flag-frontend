"use client"

import React, { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loading } from '@/components/ui/Loading'
import { useStats } from '@/hooks/useStats'
import { useTeamInfo } from '@/hooks/useTeamInfo'
import { getStatMapping } from '@/utils/statMappings'
import { TeamStatsList } from '@/components/Stats/TeamStatsList'
import { statGroups } from '@/utils/statGroups'
import { StatsLayout } from '@/components/Stats/StatsLayout'

// Função getStatGroup permanece a mesma
const getStatGroup = (statParam: string): string => {
    for (const group of statGroups) {
        if (group.stats.some(stat => stat.urlParam === statParam)) {
            return group.title
        }
    }
    return 'Passando'
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
            <h1 className="text-4xl font-extrabold italic mb-4 text-center uppercase">{currentGroup}</h1>
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
    const statParam = searchParams.get('stat') || 'passe-jardas'
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