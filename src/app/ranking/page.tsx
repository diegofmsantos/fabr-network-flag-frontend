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
                    getJogadores(),
                    getTimes()
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
            case "retorno": return "RETORNO"
            case "defesa": return "DEFESA"
            case "chute": return "CHUTE"
            case "punt": return "PUNT"
            default: return ""
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
                        title="PASSE"
                        stats={[
                            { key: "jardas_de_passe", title: "JARDAS" },
                            { key: "passes_percentual", title: "PASSES(%)" },
                            { key: "td_passados", title: "TOUCHDOWNS" },
                            { key: "jardas_media", title: "JARDAS(AVG)" },
                            { key: "passes_completos", title: "PASSES COMP." },
                            { key: "passes_tentados", title: "PASSES TENT." },
                            { key: "interceptacoes_sofridas", title: "INTERCEPTAÇÕES" },
                            { key: "sacks_sofridos", title: "SACKS" },
                            { key: "fumble_de_passador", title: "FUMBLES " }
                        ]}
                        players={players}
                    />

                    <RankingGroup
                        title="CORRIDA"
                        stats={[
                            { key: "jardas_corridas", title: "JARDAS" },
                            { key: "corridas", title: "CORRIDAS" },
                            { key: "tds_corridos", title: "TOUCHDOWNS" },
                            { key: "jardas_corridas_media", title: "JARDAS(AVG)" },
                            { key: "fumble_de_corredor", title: "FUMBLES" }
                        ]}
                        players={players}
                    />

                    <RankingGroup
                        title="RECEPÇÃO"
                        stats={[
                            { key: "jardas_recebidas", title: "JARDAS" },
                            { key: "recepcoes", title: "RECEPÇÕES" },
                            { key: "tds_recebidos", title: "TOUCHDOWNS" },
                            { key: "jardas_recebidas_media", title: "JARDAS(AVG)" },
                            { key: "alvo", title: "ALVOS" },
                        ]}
                        players={players}
                    />

                    <RankingGroup
                        title="RETORNO"
                        stats={[
                            { key: "jardas_retornadas_media", title: "JARDAS(AVG)" },
                            { key: "retornos", title: "RETORNOS" },
                            { key: "jardas_retornadas", title: "JARDAS" },
                            { key: "td_retornados", title: "TOUCHDOWNS" },
                        ]}
                        players={players}
                    />

                    <RankingGroup
                        title="DEFESA"
                        stats={[
                            { key: "interceptacao_forcada", title: "INTERCEPTAÇÕES" },
                            { key: "sacks_forcado", title: "SACKS" },
                            { key: "fumble_forcado", title: "FUMBLES FORÇ." },
                            { key: "td_defensivo", title: "TOUCHDOWNS" },
                            { key: "passe_desviado", title: "PASSES DESV." },
                            { key: "tackles_for_loss", title: "TACKLES(LOSS)" },
                            { key: "tackles_totais", title: "TACKLES TOTAIS" },
                            { key: "safety", title: "SAFETIES" }
                        ]}
                        players={players}
                    />

                    <RankingGroup
                        title="CHUTE"
                        stats={[
                            { key: "field_goals", title: "FG(%)" },
                            { key: "fg_bons", title: "FG BOM" },
                            { key: "fg_mais_longo", title: "MAIS LONGO" },
                            { key: "tentativas_de_fg", title: "FG TENTADOS" },
                            { key: "extra_points", title: "XP(%)" },
                            { key: "xp_bons", title: "XP BOM" },
                            { key: "tentativas_de_xp", title: "XP TENTADOS" },
                        ]}
                        players={players}
                    />

                    <RankingGroup
                        title="PUNT"
                        stats={[
                            { key: "jardas_punt_media", title: "JARDAS(AVG)" },
                            { key: "punts", title: "PUNTS" },
                            { key: "jardas_de_punt", title: "JARDAS" }
                        ]}
                        players={players}
                    />
                </div>
            </div>
        </RankingLayout>
    )
}