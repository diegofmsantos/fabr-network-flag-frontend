import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { statMappings } from '@/utils/statMappings'

interface TeamCardProps {
    id: number
    name: string
    value: string
    teamColor?: string
    isFirst?: boolean
}

interface TeamRankingCardProps {
    title: string
    category: string
    teams: TeamCardProps[]
}

export const TeamRankingCard: React.FC<TeamRankingCardProps> = ({ title, category, teams }) => {

    const validTeams = teams.filter(team => {
        // Se o valor for porcentagem, apenas verificamos se existe
        if (typeof team.value === 'string' && team.value.includes('%')) {
            return true;
        }
        // Para números, verificamos se é maior que zero
        const value = parseFloat(team.value);
        return !isNaN(value) && value > 0;
    });

    const normalizeForFilePath = (input: string): string => {
        return input
            .toLowerCase()
            .replace(/\s+/g, "-")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9-]/g, "");
    }

    const formatValue = (value: string | number, title: string): string => {
        let numValue: number;

        if (typeof value === 'string') {
            numValue = parseFloat(value.replace(/\./g, '').replace(/,/g, '.'));
        } else {
            numValue = value;
        }

        if (isNaN(numValue)) return value.toString();

        const percentageIdentifiers = [
            'PASSES(%)', 'PASSES COMP(%)',
            'PASSES(%):', 'PASSES COMP(%):'
        ];

        const isPercentage =
            percentageIdentifiers.some(pt =>
                title.toUpperCase().includes(pt)) ||
            title.includes('(%)');

        if (title.includes('(AVG)') || title.includes('MÉDIA') || title.includes('MEDIA')) {
            return numValue.toFixed(1).replace('.', ',');
        }

        if (isPercentage) {
            return `${Math.round(numValue)}%`;
        }

        return Math.round(numValue).toLocaleString('pt-BR');
    }

    const getViewMoreUrl = (category: string, title: string): string => {
        // Normalizar a categoria para remover acentos e caracteres especiais
        const categoryLower = normalizeForFilePath(category.toLowerCase());
    
        const normalizedTitle = title.toUpperCase().replace(/\s+/g, ' ').trim();
    
        for (const [urlParam, mapping] of Object.entries(statMappings)) {
            if (urlParam.startsWith(categoryLower) &&
                mapping.title.toUpperCase() === normalizedTitle) {
                return `/ranking/times/stats?stat=${urlParam}`;
            }
        }
    
        const statKey = normalizeForFilePath(title);
        return `/ranking/times/stats?stat=${categoryLower}-${statKey}`;
    }

    const sortedTeams = validTeams
        .sort((a, b) => {
            let valueA = parseFloat(a.value.replace(/\./g, '').replace(/,/g, '.'));
            let valueB = parseFloat(b.value.replace(/\./g, '').replace(/,/g, '.'));

            if (isNaN(valueA) || isNaN(valueB)) {
                return a.name.localeCompare(b.name);
            }

            if (valueB === valueA) return a.name.localeCompare(b.name);
            return valueB - valueA;
        })
        .map((team, index) => ({
            ...team,
            isFirst: index === 0
        }));

    if (sortedTeams.length === 0) return null;

    return (
        <div className="ranking-card-container px-3">
            <h3 className="inline-block text-sm font-bold mb-2 bg-black text-white p-2 rounded-xl">{title}</h3>
            <ul className="flex flex-col text-white h-full">
                {sortedTeams.map((team, index) => {
                    const teamLogoPath = `/assets/times/logos/${normalizeForFilePath(team.name)}.png`;

                    return (
                        <li
                            key={index}
                            className={`flex items-center justify-center p-2 px-4 border-b border-b-[#D9D9D9] rounded-md xl:w-[450px]
                                ${team.isFirst ? "bg-gray-100 text-black shadow-lg" : "bg-white text-black"}`}
                            style={{
                                backgroundColor: team.isFirst ? team.teamColor : undefined,
                            }}
                        >
                            <Link
                                href={getViewMoreUrl(category, title)}
                                className="w-full"
                            >
                                {team.isFirst ? (
                                    <div className="flex justify-between items-center w-full text-white md:px-10 lg:px-10">
                                        <div className="flex flex-col justify-center">
                                            <p className="text-[25px] font-bold">{index + 1}</p>
                                            <div className='flex flex-col gap-2'>
                                                <h4 className="font-extrabold italic leading-4 text-xl uppercase">{team.name}</h4>
                                                <Image
                                                    src={teamLogoPath}
                                                    width={100}
                                                    height={100}
                                                    alt={`Logo do time ${team.name}`}
                                                    className="w-24 h-24"
                                                    onError={(e) => {
                                                        console.error(`Error loading team logo for: ${team.name}`);
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = '/assets/times/logos/default-logo.png';
                                                    }}
                                                />
                                                <span className="font-extrabold italic text-4xl mt-2">
                                                    {formatValue(team.value, title)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="relative w-[200px] h-[200px] flex items-center justify-center">
                                            <Image
                                                src={teamLogoPath}
                                                width={160}
                                                height={160}
                                                alt={`Logo do ${team.name}`}
                                                className="object-contain"
                                                priority
                                                quality={100}
                                                onError={(e) => {
                                                    console.error(`Error loading logo for: ${team.name}`);
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/assets/times/logos/default-logo.png';
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-auto flex justify-between items-center gap-2 px-2 md:px-10 lg:px-10">
                                        <div className="flex items-center gap-2 max-[374px]:gap-1">
                                            <span className="font-bold text-[14px]">{index + 1}</span>
                                            <Image
                                                src={teamLogoPath}
                                                width={40}
                                                height={40}
                                                alt={`Logo do time ${team.name}`}
                                                onError={(e) => {
                                                    console.error(`Error loading team logo for: ${team.name}`);
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/assets/times/logos/default-logo.png';
                                                }}
                                            />
                                            <div className="text-sm">{team.name}</div>
                                        </div>
                                        <span className="font-bold text-lg">
                                            {formatValue(team.value, title)}
                                        </span>
                                    </div>
                                )}
                            </Link>
                        </li>
                    )
                })}
            </ul>
            <Link
                href={getViewMoreUrl(category, title)}
                className="block text-center border border-gray-400 bg-white text-[17px] text-black font-bold py-1 mt-1 rounded-md hover:bg-[#C1C2C3] xl:mr-6"
            >
                Ver Mais
            </Link>
        </div>
    )
}