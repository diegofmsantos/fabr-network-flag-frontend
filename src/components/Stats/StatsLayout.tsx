"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RankingFilters } from '../FilterButton'
import { SelectFilter } from '../SelectFilter'

interface StatsLayoutProps {
    children: React.ReactNode;
    initialFilter: 'jogadores' | 'times'
    statType: string
}

export function StatsLayout({ children, initialFilter, statType }: StatsLayoutProps) {
    const router = useRouter()
    const [season, setSeason] = useState('2024')

    const handleFilterChange = (filter: 'jogadores' | 'times') => {
        const searchParams = new URLSearchParams(window.location.search)
        const currentStat = searchParams.get('stat')

        if (filter === 'jogadores') {
            router.push(`/ranking/stats?stat=${currentStat}`)
        } else {
            router.push(`/ranking/times/stats?stat=${currentStat}`)
        }
    }

    const handleSeasonChange = (newSeason: string) => setSeason(newSeason)

    return (
        <div className="min-h-screen bg-[#ECECEC] max-w-[1200px] mx-auto">
            <div className="w-full pt-20 xl:pt-0 xl:ml-40">
                <RankingFilters currentFilter={initialFilter} onFilterChange={handleFilterChange} isStatsPage={true} />
                <div className="w-full mt-8 flex justify-center">
                    <SelectFilter
                        label="TEMPORADA"
                        value={season}
                        onChange={setSeason}
                        options={[
                            { label: '2024', value: '2024' },
                            { label: '2025', value: '2025' }
                        ]}
                    />
                </div>
                {children}
            </div>
        </div>
    )
}