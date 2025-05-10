"use client"

import React, { useEffect, useState } from 'react'
import { getJogadores, getTimes } from "@/api/api"
import { Jogador } from "@/types/jogador"
import { Time } from "@/types/time"
import { Loading } from "@/components/ui/Loading"
import { RankingLayout } from '@/components/Ranking/RankingLayout'
import { TeamRankingGroup } from '@/components/Ranking/TimeRankingGroup'
import { TeamStatCardsGrid, prepareTeamStatsForCards } from '@/components/TeamStatCardsGrid'
import { StatCategoryButtons } from '@/components/ui/StatCategoryButtons'
import { TeamStats } from '@/types/Stats'

export default function TeamRankingPage() {
    const [players, setPlayers] = useState<Jogador[]>([])
    const [times, setTimes] = useState<Time[]>([])
    const [teamStats, setTeamStats] = useState<TeamStats[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState("passe")

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const [playersData, timesData] = await Promise.all([
                    getJogadores('2025'),
                    getTimes('2025')
                ])

                setPlayers(playersData)
                setTimes(timesData)

                const stats = calculateTeamStats(playersData)
                setTeamStats(stats)
            } catch (error) {
                console.error("Error fetching data:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const calculateTeamStats = (players: Jogador[]): TeamStats[] => {
        const teamStatsMap = new Map<number, TeamStats>()

        const timeIds = [...new Set(players.map(player => player.timeId))];


        timeIds.forEach(id => {
            teamStatsMap.set(id, {
                timeId: id,
                ataque: {
                    passes_completos: 0,
                    passes_tentados: 0,
                    td_passado: 0,
                    interceptacoes_sofridas: 0,
                    sacks_sofridos: 0,
                    corrida: 0,
                    tds_corridos: 0,
                    recepcao: 0,
                    alvo: 0,
                    td_recebido: 0
                },
                defesa: {
                    sack: 0,
                    pressao: 0,
                    flag_retirada: 0,
                    flag_perdida: 0,
                    interceptacao_forcada: 0,
                    passe_desviado: 0,
                    td_defensivo: 0
                }
            });
        });

        // Segundo passo: agregar as estatísticas de cada jogador ao seu time
        players.forEach(player => {
            let teamStats = teamStatsMap.get(player.timeId);

            if (!teamStats) {
                console.warn(`Time não encontrado para jogador ${player.nome} (ID: ${player.id}), timeId: ${player.timeId}`);
                return; // Pula este jogador
            }

            // Adiciona as estatísticas do jogador ao time
            // Passe
            if (player.estatisticas?.ataque) {
                teamStats.ataque.passes_completos += player.estatisticas.ataque.passes_completos || 0;
                teamStats.ataque.passes_tentados += player.estatisticas.ataque.passes_tentados || 0;
                teamStats.ataque.td_passado += player.estatisticas.ataque.td_passado || 0;
                teamStats.ataque.interceptacoes_sofridas += player.estatisticas.ataque.interceptacoes_sofridas || 0;
                teamStats.ataque.sacks_sofridos += player.estatisticas.ataque.sacks_sofridos || 0;
                teamStats.ataque.corrida += player.estatisticas.ataque.corrida || 0;
                teamStats.ataque.tds_corridos += player.estatisticas.ataque.tds_corridos || 0;
                teamStats.ataque.recepcao += player.estatisticas.ataque.recepcao || 0;
                teamStats.ataque.alvo += player.estatisticas.ataque.alvo || 0;
                teamStats.ataque.td_recebido += player.estatisticas.ataque.td_recebido || 0;
            }

            // Defesa
            if (player.estatisticas?.defesa) {
                teamStats.defesa.sack += player.estatisticas.defesa.sack || 0;
                teamStats.defesa.pressao += player.estatisticas.defesa.pressao || 0;
                teamStats.defesa.flag_retirada += player.estatisticas.defesa.flag_retirada || 0;
                teamStats.defesa.flag_perdida += player.estatisticas.defesa.flag_perdida || 0;
                teamStats.defesa.interceptacao_forcada += player.estatisticas.defesa.interceptacao_forcada || 0;
                teamStats.defesa.passe_desviado += player.estatisticas.defesa.passe_desviado || 0;
                teamStats.defesa.td_defensivo += player.estatisticas.defesa.td_defensivo || 0;
            }
        });

        return Array.from(teamStatsMap.values());
    }

    // Get the stats for the current category
    const getStatsByCategory = (category: string) => {
        switch (category) {
            case "ataque":
                return [
                    { key: "passes_tentados", title: "PASSES TENT." },
                    { key: "passes_completos", title: "PASSES COMP." },
                    { key: "td_passado", title: "TOUCHDOWNS" },
                    { key: "interceptacoes_sofridas", title: "INTERCEPTAÇÕES" },
                    { key: "corrida", title: "CORRIDAS" },
                    { key: "tds_corridos", title: "TDs CORRIDAS" },
                    { key: "recepcao", title: "RECEPÇÕES" },
                    { key: "alvo", title: "ALVOS" },
                    { key: "td_recebido", title: "TDs RECEBIDOS" }
                ];
            case "defesa":
                return [
                    { key: "flag_retirada", title: "FLAG RETIRADA" },
                    { key: "flag_perdida", title: "FLAG PERDIDA" },
                    { key: "sack", title: "SACKS" },
                    { key: "pressao", title: "PRESSÃO" },
                    { key: "interceptacao_forcada", title: "INTERCEPTAÇÕES" },
                    { key: "passe_desviado", title: "PASSES DESV." },
                    { key: "td_defensivo", title: "TOUCHDOWNS" }
                ];
            default:
                return [];
        }
    }

    // Get category title
    const getCategoryTitle = (category: string): string => {
        switch (category) {
            case "ataque": return "ATAQUE"
            case "defesa": return "DEFESA"
            default: return ""
        }
    }

    if (loading || !teamStats.length) {
        return <Loading />
    }

    // Get the stats for the current category
    const currentStats = getStatsByCategory(selectedCategory)
    const categoryTitle = getCategoryTitle(selectedCategory)

    // Prepare team stats for the grid view
    const preparedTeamStats = prepareTeamStatsForCards(teamStats, times, currentStats, categoryTitle)

    return (
        <RankingLayout initialFilter="times">
            <div className="pb-12 bg-[#ECECEC] ">
                {/* Botões de categoria para telas grandes (lg+) */}
                <div className="pt-4 px-6 xl:max-w-5xl xl:px-12 max-w-7xl mx-auto xl:ml-20">
                    <StatCategoryButtons
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                    />
                </div>

                {/* Grid view for larger screens */}
                <div className="px-4 lg:px-8 lg:mb-12 xl:px-12 mx-auto max-w-7xl ">
                    <TeamStatCardsGrid
                        stats={preparedTeamStats}
                        category={categoryTitle}
                    />
                </div>

                {/* Carrossel para telas menores (md-) */}
                <div className="lg:hidden">
                    <TeamRankingGroup
                        title="ATAQUE"
                        stats={[
                            { key: "passes_tentados", title: "PASSES TENT." },
                            { key: "passes_completos", title: "PASSES COMP." },
                            { key: "td_passado", title: "TOUCHDOWNS" },
                            { key: "interceptacoes_sofridas", title: "INTERCEPTAÇÕES" },
                            { key: "corrida", title: "CORRIDAS" },
                            { key: "tds_corridos", title: "TDs CORRIDAS" },
                            { key: "recepcao", title: "RECEPÇÕES" },
                            { key: "alvo", title: "ALVOS" },
                            { key: "td_recebido", title: "TDs RECEBIDOS" }
                        ]}
                        teamStats={teamStats}
                    />

                    <TeamRankingGroup
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
                        teamStats={teamStats}
                    />
                </div>
            </div>
        </RankingLayout>
    )
}