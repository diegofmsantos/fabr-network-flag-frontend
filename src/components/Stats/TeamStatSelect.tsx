"use client"

import React, { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loading } from '@/components/ui/Loading'
import { useStats } from '@/hooks/useStats'
import { useTeamInfo } from '@/hooks/useTeamInfo'
import { getStatMapping } from '@/utils/statMappings'
import { TeamStatsList } from '@/components/Stats/TeamStatsList'
import { teamStatGroups } from '@/utils/statGroups'

// Função para obter o grupo da estatística atual
const getStatGroup = (statParam: string): string => {
    for (const group of teamStatGroups) {
        if (group.stats.some(stat => stat.urlParam === statParam)) {
            return group.title
        }
    }
    return 'Passando'
}

const TeamStatSelect = ({ currentStat }: { currentStat: string }) => {
    const router = useRouter()
    const currentGroup = getStatGroup(currentStat)
    const handleStatChange = (newStat: string) => router.push(`/ranking/times/stats?stat=${newStat}`)

    return (
        <div className="mb-6">
            <h1 className="text-6xl font-extrabold mb-4 text-center italic tracking-[-3px]">{currentGroup}</h1>
            <select
                value={currentStat}
                onChange={(e) => handleStatChange(e.target.value)}
                className="w-full p-2 rounded-md border border-gray-300 bg-white"
            >
                {teamStatGroups.map((group) => (
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
}

function TeamStatsContent() {
    const searchParams = useSearchParams()
    const statParam = searchParams.get('stat') || 'passe-jardas'
    const { players, times, loading } = useStats()
    const getTeamInfo = useTeamInfo(times)
    const statMapping = getStatMapping(statParam)

    if (loading) return <Loading />

    return (
        <div className="max-w-4xl mx-auto">
            <TeamStatSelect currentStat={statParam} />
            <TeamStatsList  players={players} times={times} statMapping={statMapping} />
        </div>
    )
}

export default function TeamStatsPage() {
    return (
        <div className="bg-[#ECECEC] min-h-screen py-24 px-2">
            <Suspense fallback={<Loading />}>
                <TeamStatsContent />
            </Suspense>
        </div>
    )
}