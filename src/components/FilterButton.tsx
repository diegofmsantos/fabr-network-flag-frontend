import React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface FilterButtonProps {
    isSelected: boolean;
    onClick: () => void
    label: string
}

export const FilterButton: React.FC<FilterButtonProps> = ({ isSelected,  onClick,  label }) => {
    return (
        <button
            onClick={onClick}
            className={`px-1 font-extrabold italic text-xl leading-[30px] tracking-[-2px]  cursor-pointer  transition-all duration-500
                ${isSelected ? 'border-b-4 scale-110 border-b-[#63E300]' : 'border-b-4 border-transparent scale-100 opacity-65'}`}
        >
            <span className="text-[28px] font-extrabold italic uppercase tracking-[-3px] md:text-4xl xl:text-5xl">{label}</span>
        </button>
    )
}

interface RankingFiltersProps {
    currentFilter: 'jogadores' | 'times'
    onFilterChange: (filter: 'jogadores' | 'times') => void
    isStatsPage?: boolean
}

export const RankingFilters: React.FC<RankingFiltersProps> = ({ currentFilter, onFilterChange, isStatsPage = false }) => {
    const searchParams = useSearchParams();
    const statParam = searchParams.get('stat');

    // Define as URLs baseado em se está na página de stats ou ranking
    const jogadoresUrl = isStatsPage ? `/ranking/stats?stat=${statParam}` : "/ranking";
    const timesUrl = isStatsPage ? `/ranking/times/stats?stat=${statParam}` : "/ranking/times";

    return (
        <div className="w-full flex justify-around mt-4 xl:mt-6">
            <Link href={jogadoresUrl} className=''>
                <FilterButton isSelected={currentFilter === 'jogadores'} onClick={() => onFilterChange('jogadores')} label="Jogadores" />
            </Link>
            <Link href={timesUrl} className=''>
                <FilterButton isSelected={currentFilter === 'times'} onClick={() => onFilterChange('times')} label="Times" />
            </Link>
        </div>
    )
}