"use client"

import { getJogadores, getTimes } from "@/api/api"
import { useEffect, useState } from "react"
import { Jogador } from "@/types/jogador"
import { Time } from "@/types/time"
import { Loading } from "@/components/ui/Loading"
import { RankingLayout } from "@/components/Ranking/RankingLayout"
import { RankingGroup } from "@/components/Ranking/RankingGroup"
import { StatCardsGrid } from "@/components/StatCardsGrid"
import { StatCategoryButtons } from "@/components/ui/StatCategoryButtons"
import { StatKey } from '@/components/Ranking/RankingGroup';
import { calculateStat, compareValues, shouldIncludePlayer } from "@/utils/statMappings"
import { getStatsByCategory } from "@/utils/getCategoryLabel"

export default function Page() {
    const [players, setPlayers] = useState<Jogador[]>([])
    const [times, setTimes] = useState<Time[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState("passe") 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [playersData, timesData] = await Promise.all([
                    getJogadores('2025'), 
                    getTimes('2025')
                ])
                setPlayers(playersData)
                setTimes(timesData)
                setLoading(false)
            } catch (error) {
                console.error("Error fetching data:", error)
                setLoading(false)
            }
        }
        fetchData()
    }, [])


    const getCategoryTitle = (category: string): string => {
        switch (category) {
            case "passe": return "PASSE"
            case "corrida": return "CORRIDA"
            case "recepcao": return "RECEPÇÃO"
            case "defesa": return "DEFESA"
            default: return "PASSE"
        }
    }

    if (loading) {
        return <Loading />
    }

    // Obtém as estatísticas para a categoria atual
    const currentStats = getStatsByCategory(selectedCategory)
    const categoryTitle = getCategoryTitle(selectedCategory)

    // Função simplificada que retorna objetos no formato que o RankingCard espera
    const prepareStatsForCards = (
        players: Jogador[],
        times: Time[],
        currentStats: Array<{ key: StatKey; title: string }>,
        categoryTitle: string
    ) => {
        return currentStats.map(stat => {
            // Filtra jogadores para esta estatística
            const filteredPlayers = players
                .filter(player => shouldIncludePlayer(player, stat.key, categoryTitle))
                .sort((a, b) => {
                    const aValue = calculateStat(a, stat.key);
                    const bValue = calculateStat(b, stat.key);
                    return compareValues(aValue, bValue);
                })
                .slice(0, 5);

            // Monta os jogadores no formato que RankingCard espera
            const formattedPlayers = filteredPlayers.map((player, index) => {
                const teamInfo = times.find(t => t.id === player.timeId) || {};
                const value = calculateStat(player, stat.key);

                // Função para normalizar o caminho do arquivo
                const normalizeForFilePath = (input: string): string => {
                    if (!input) return '';
                
                    return input
                        .toLowerCase()
                        .replace(/\s+/g, '-')
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/[^a-z0-9-]/g, '');
                };

                return {
                    id: player.id,
                    name: player.nome,
                    team: teamInfo.nome || 'Time Desconhecido',
                    value: value !== null ? String(value) : 'N/A',
                    camisa: player.camisa,
                    teamColor: index === 0 ? teamInfo.cor : undefined,
                    teamLogo: `/assets/times/logos/${normalizeForFilePath(teamInfo.nome || '')}.png`,
                    isFirst: index === 0
                };
            });

             return {
              title: stat.title,
              category: categoryTitle,
              key: stat.key,
              players: formattedPlayers  // Pode ser vazio
            };
        });
    };

    return (
        <RankingLayout initialFilter="jogadores">
            <div className="pb-12 bg-[#ECECEC]">
                {/* Botões de categoria para todas as telas */}
                <div className="px-4 lg:px-8 xl:px-12 xl:max-w-5xl max-w-7xl mx-auto xl:ml-20">
                    <StatCategoryButtons
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                    />
                </div>

                {/* Visualização em grid para todas as telas */}
                <div className="px-4 lg:px-8 xl:px-12 max-w-7xl mx-auto xl:ml-20">
                    <StatCardsGrid 
                        stats={prepareStatsForCards(players, times, currentStats, categoryTitle)}
                        category={categoryTitle}
                    />
                </div>

                {/* Visualização em carrossel apenas para telas menores */}
                <div className="lg:hidden">
                    <RankingGroup
                        title="PASSE"
                        stats={[
                            { key: "passes_completos", title: "PASSES COMP." },
                            { key: "passes_tentados", title: "PASSES TENT." },
                            { key: "passes_incompletos", title: "PASSES INCOMPL." },
                            { key: "jds_passe", title: "JARDAS" },
                            { key: "tds_passe", title: "TOUCHDOWNS" },
                            { key: "passe_xp1", title: "EXTRA POINT (1)" },
                            { key: "passe_xp2", title: "EXTRA POINT (2)" },
                            { key: "int_sofridas", title: "INTERCEPTAÇÕES" },
                            { key: "sacks_sofridos", title: "SACKS SOFRIDOS" },
                            { key: "passes_percentual", title: "PASSES (%)" }
                        ]}
                        players={players}
                    />

                    <RankingGroup
                        title="CORRIDA"
                        stats={[
                            { key: "corridas", title: "CORRIDAS" },
                            { key: "jds_corridas", title: "JARDAS" },
                            { key: "tds_corridos", title: "TOUCHDOWNS" },
                            { key: "corrida_xp1", title: "EXTRA POINT (1)" },
                            { key: "corrida_xp2", title: "EXTRA POINT (2)" }
                        ]}
                        players={players}
                    />
                    
                    <RankingGroup
                        title="RECEPÇÃO"
                        stats={[
                            { key: "recepcoes", title: "RECEPÇÕES" },
                            { key: "alvos", title: "ALVOS" },
                            { key: "drops", title: "DROPS" },
                            { key: "jds_recepcao", title: "JARDAS" },
                            { key: "jds_yac", title: "JARDAS APÓS RECEPÇÃO" },
                            { key: "tds_recepcao", title: "TOUCHDOWNS" },
                            { key: "recepcao_xp1", title: "EXTRA POINT (1)" },
                            { key: "recepcao_xp2", title: "EXTRA POINT (2)" }
                        ]}
                        players={players}
                    />

                    <RankingGroup
                        title="DEFESA"
                        stats={[
                            { key: "tck", title: "TACKLES" },
                            { key: "tfl", title: "TACKLES FOR LOSS" },
                            { key: "sacks", title: "SACKS" },
                            { key: "pressao_pct", title: "PRESSÃO (%)" },
                            { key: "tip", title: "PASSES DESVIADOS" },
                            { key: "int", title: "INTERCEPTAÇÕES" },
                            { key: "tds_defesa", title: "TOUCHDOWNS" },
                            { key: "defesa_xp2", title: "EXTRA POINT (2)" },
                            { key: "sft", title: "SAFETIES" },
                            { key: "sft_1", title: "SAFETY (1)" },
                            { key: "blk", title: "BLOQUEIOS" },
                            { key: "jds_defesa", title: "JARDAS" }
                        ]}
                        players={players}
                    />
                </div>
            </div>
        </RankingLayout>
    )
}