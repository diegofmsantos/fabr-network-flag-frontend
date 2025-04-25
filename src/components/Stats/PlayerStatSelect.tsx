"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { statGroups } from '@/utils/statGroups'

interface PlayerStatSelectProps {
    currentStat: string
}

// Função para obter o grupo da estatística atual
const getStatGroup = (statParam: string): string => {
    for (const group of statGroups) {
        const stat = group.stats.find(s => s.urlParam === statParam)
        if (stat) {
            return group.title
        }
    }
    return 'Passando'
}

export const PlayerStatSelect: React.FC<PlayerStatSelectProps> = ({ currentStat }) => {
    const router = useRouter()
    const currentGroup = getStatGroup(currentStat)
    const [selectedStat, setSelectedStat] = useState(currentStat)

    const handleStatChange = (newStat: string) => {
        setSelectedStat(newStat)
        router.push(`/ranking/stats?stat=${newStat}`)
    }

    return (
        <div className="mb-6">
            <h1 className="text-4xl font-extrabold italic mb-4 text-center tracking-[-2px] uppercase">{currentGroup}</h1>
            <select
                value={selectedStat}
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
}