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
    const [selectedCategory, setSelectedCategory] = useState("ataque")

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
            case "ataque": return "ATAQUE"
            case "defesa": return "DEFESA"
            default: return "ataque"
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

                return {
                    id: player.id,
                    name: player.nome,
                    team: teamInfo.nome || 'Time Desconhecido',
                    value: value !== null ? String(value) : 'N/A',
                    camisa: player.camisa,
                    teamColor: index === 0 ? teamInfo.cor : undefined,
                    teamLogo: `/assets/times/logos/${teamInfo.logo || 'default-logo.png'}`,
                    isFirst: index === 0
                };
            });

            return {
                title: stat.title,
                key: stat.key,
                players: formattedPlayers
            };
        });
    };

    return (
        <RankingLayout initialFilter="jogadores">
            <div className="pb-12 bg-[#ECECEC]">
                {/* Botões de categoria para todas as telas */}
                <div className="px-4 pt-8 lg:px-8 xl:px-12 xl:max-w-5xl max-w-7xl mx-auto xl:ml-20">
                    <StatCategoryButtons
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                    />
                </div>

                {/* Visualização em grid para todas as telas */}
                <div className="px-4 mt-8 lg:px-8 xl:px-12 max-w-7xl mx-auto xl:ml-20">
                    <StatCardsGrid //@ts-ignore
                        stats={prepareStatsForCards(players, times, currentStats, categoryTitle)}
                        category={categoryTitle}
                    />
                </div>

                {/* Visualização em carrossel apenas para telas menores */}
                <div className="lg:hidden">
                    <RankingGroup
                        title="ATAQUE"
                        stats={[
                            { key: "passes_percentual", title: "PASSES(%)" },
                            { key: "td_passado", title: "TOUCHDOWNS" },
                            { key: "passes_completos", title: "PASSES COMP." },
                            { key: "passes_tentados", title: "PASSES TENT." },
                            { key: "interceptacoes_sofridas", title: "INTERCEPTAÇÕES" },
                            { key: "sacks_sofridos", title: "SACKS" },
                            { key: "corrida", title: "CORRIDAS" },
                            { key: "tds_corridos", title: "TDs CORRIDAS" },
                            { key: "recepcao", title: "RECEPÇÕES" },
                            { key: "alvo", title: "ALVOS" },
                            { key: "td_recebido", title: "TDs RECEBIDOS" }
                        ]}
                        players={players}
                    />

                    <RankingGroup
                        title="DEFESA"
                        stats={[
                            { key: "flag_retirada", title: "FLAG RETIRADA" },
                            { key: "flag_perdida", title: "FLAG PERDIDA" },
                            { key: "sack", title: "SACKS" },
                            { key: "pressao", title: "PRESSÃO" },
                            { key: "interceptacao_forcada", title: "INTERCEPTAÇÕES" },
                            { key: "passe_desviado", title: "PASSES DESV." },
                            { key: "td_defensivo", title: "TOUCHDOWNS" }
                        ]}
                        players={players}
                    />
                </div>
            </div>
        </RankingLayout>
    )
}