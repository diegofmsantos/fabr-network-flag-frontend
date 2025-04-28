// src/components/Ranking/TeamRankingGroup.tsx
import React, { useState, useEffect } from 'react'
import Slider from 'react-slick'
import { Time } from '@/types/time'
import { getTimes } from '@/api/api'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { NoStats } from '../ui/NoStats'
import { getStatMapping } from '@/utils/statMappings'
import { TeamRankingCard } from './TimeRankingCard'

interface TeamRankingGroupProps {
    title: string
    stats: { key: string; title: string }[]
    teamStats: any[]
}

const SLIDER_SETTINGS = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1.2,
    slidesToScroll: 1,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 1.5,
                slidesToScroll: 1,
            },
        },
        {
            breakpoint: 640,
            settings: {
                slidesToShow: 1.2,
                slidesToScroll: 1,
            },
        },
    ],
}

export const getCategoryFromKey = (key: string): string => {
    const exactKeyMap: Record<string, string> = {
        'jardas_de_passe': 'passe',
        'passes_completos': 'passe',
        'passes_tentados': 'passe',
        'td_passados': 'passe',
        'interceptacoes_sofridas': 'passe',
        'sacks_sofridos': 'passe',
        'fumble_de_passador': 'passe',

        'jardas_corridas': 'corrida',
        'corridas': 'corrida',
        'tds_corridos': 'corrida',
        'fumble_de_corredor': 'corrida',

        'recepcoes': 'recepcao',
        'jardas_recebidas': 'recepcao',
        'tds_recebidos': 'recepcao',
        'alvo': 'recepcao',

        'jardas_retornadas': 'retorno',
        'retornos': 'retorno',
        'td_retornados': 'retorno',

        'passe_desviado': 'defesa',
        'tackles_totais': 'defesa',
        'tackles_for_loss': 'defesa',
        'sacks_forcado': 'defesa',
        'fumble_forcado': 'defesa',
        'interceptacao_forcada': 'defesa',
        'safety': 'defesa',
        'td_defensivo': 'defesa',

        'fg_bons': 'kicker',
        'tentativas_de_fg': 'kicker',
        'fg_mais_longo': 'kicker',
        'xp_bons': 'kicker',
        'tentativas_de_xp': 'kicker',
        'field_goals': 'kicker',
        'extra_points': 'kicker',

        'punts': 'punter',
        'jardas_de_punt': 'punter'
    }

    return exactKeyMap[key] || 'passe'
}

export const TeamRankingGroup: React.FC<TeamRankingGroupProps> = ({ title, stats, teamStats }) => {
    const [times, setTimes] = useState<Time[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchTimes = async () => {
            try {
                setIsLoading(true)
                const timesData = await getTimes()
                setTimes(timesData)
            } catch (error) {
                console.error('Error fetching times:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchTimes()
    }, [])

    const calculateTeamStat = (teamStat: any, key: string): number | null => {
        try {
            const category = getCategoryFromKey(key);
            
            // Verificar se a categoria e chave existem
            if (!teamStat[category] || !(key in teamStat[category]) && 
                !['passes_percentual', 'jardas_media', 'jardas_corridas_media', 
                'jardas_recebidas_media', 'jardas_retornadas_media', 'extra_points', 
                'field_goals', 'jardas_punt_media'].includes(key)) {
                return null;
            }

            switch (key) {
                case 'passes_percentual':
                    return teamStat.passe.passes_tentados > 0
                        ? (teamStat.passe.passes_completos / teamStat.passe.passes_tentados) * 100
                        : null
                case 'jardas_media':
                    return teamStat.passe.passes_tentados > 0
                        ? teamStat.passe.jardas_de_passe / teamStat.passe.passes_tentados
                        : null
                case 'jardas_corridas_media':
                    return teamStat.corrida.corridas > 0
                        ? teamStat.corrida.jardas_corridas / teamStat.corrida.corridas
                        : null
                case 'jardas_recebidas_media':
                    return teamStat.recepcao.alvo > 0
                        ? teamStat.recepcao.jardas_recebidas / teamStat.recepcao.alvo
                        : null
                case 'jardas_retornadas_media':
                    return teamStat.retorno.retornos > 0
                        ? teamStat.retorno.jardas_retornadas / teamStat.retorno.retornos
                        : null
                case 'jardas_punt_media':
                    return teamStat.punter.punts > 0
                        ? teamStat.punter.jardas_de_punt / teamStat.punter.punts
                        : null
                case 'extra_points':
                    return teamStat.kicker.tentativas_de_xp > 0
                        ? (teamStat.kicker.xp_bons / teamStat.kicker.tentativas_de_xp) * 100
                        : null
                case 'field_goals':
                    return teamStat.kicker.tentativas_de_fg > 0
                        ? (teamStat.kicker.fg_bons / teamStat.kicker.tentativas_de_fg) * 100
                        : null;
                default:
                    return teamStat[category][key];
            }
        } catch (error) {
            console.error(`Error calculating stat ${key}:`, error)
            return null
        }
    }

    const normalizeValue = (value: number | null, key: string, title: string): string => {
        if (value === null) return 'N/A';
        
        // Para porcentagens
        if (key.includes('percentual') || key === 'field_goals' || key === 'extra_points' || 
            title.includes('(%)') || title === 'FG(%)' || title === 'XP(%)') {
            return `${Math.round(value)}%`;
        }
        
        // Para médias
        if (key.includes('media') || title.includes('(AVG)')) {
            return value.toFixed(1).replace('.', ',');
        }
        
        // Para números comuns, usar formato brasileiro
        return Math.round(value).toLocaleString('pt-BR');
    }

    const getTeamInfo = (timeId: number) => {
        const team = times.find((t) => t.id === timeId)
        return {
            nome: team?.nome || 'Time Desconhecido',
            cor: team?.cor || '#CCCCCC',
        }
    }
    
    const normalizeForFilePath = (input: string): string => {
        if (!input) return '';
        
        return input
            .toLowerCase()
            .replace(/\s+/g, "-")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9-]/g, "");
    }

    if (isLoading) {
        return <div className="p-4">Carregando estatísticas de times...</div>
    }

    return (
        <div className="mb-6 pl-4 py-8 overflow-x-hidden overflow-y-hidden mx-auto xl:px-12 xl:overflow-x xl:overflow-y">
            <h2 className="text-4xl pl-2 font-extrabold italic mb-4 leading-[30px] tracking-[-2px] lg:pl-16 xl:pl-20">{title}</h2>
            <Slider {...SLIDER_SETTINGS}>
                {stats.map((stat, index) => {
                    // Importante: Remover restrições extras para PUNT e CHUTE
                    // Processar times para esta estatística
                    const rankedTeams = teamStats
                        .map(teamStat => ({
                            teamId: teamStat.timeId,
                            value: calculateTeamStat(teamStat, stat.key)
                        }))
                        .filter(team => team.value !== null && team.value > 0)
                        .sort((a, b) => {
                            // Garantir que valores nulos sejam tratados corretamente
                            if (a.value === null && b.value === null) return 0;
                            if (a.value === null) return 1;
                            if (b.value === null) return -1;
                            // Ordenar em ordem decrescente
                            return b.value - a.value;
                        })
                        .slice(0, 5);

                    // Verificar se temos resultados
                    if (rankedTeams.length === 0) {
                        return (
                            <div key={index}>
                                <div className="inline-block text-sm font-bold mb-2 bg-black text-white p-2 rounded-xl">
                                    {stat.title}
                                </div>
                                <NoStats />
                            </div>
                        )
                    }

                    return (
                        <div key={index}>
                            <TeamRankingCard
                                title={stat.title}
                                category={title}
                                teams={rankedTeams.map((team, teamIndex) => {
                                    const teamInfo = getTeamInfo(team.teamId)
                                    return {
                                        id: team.teamId,
                                        name: teamInfo.nome,
                                        value: normalizeValue(team.value, stat.key, stat.title),
                                        teamColor: teamIndex === 0 ? teamInfo.cor : undefined,
                                        isFirst: teamIndex === 0,
                                    }
                                })}
                            />
                        </div>
                    )
                })}
            </Slider>
        </div>
    )
}