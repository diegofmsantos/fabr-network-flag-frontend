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

    // Função atualizada para calcular estatísticas de time usando a nova estrutura
    const calculateTeamStats = (players: Jogador[]): TeamStats[] => {
        const teamStatsMap = new Map<number, TeamStats>()

        const timeIds = [...new Set(players.map(player => player.timeId))];

        // Inicializar estatísticas para cada time
        timeIds.forEach(id => {
            if (!id) return; // Ignorar ids indefinidos

            teamStatsMap.set(id, {
                timeId: id,
                passe: {
                    passes_completos: 0,
                    passes_tentados: 0,
                    passes_incompletos: 0,
                    jds_passe: 0,
                    td_passe: 0,
                    passe_xp1: 0,
                    passe_xp2: 0,
                    int_sofridas: 0,
                    sacks_sofridos: 0,
                    pressao_pct: "0"
                },
                corrida: {
                    corridas: 0,
                    jds_corridas: 0,
                    tds_corridos: 0,
                    corrida_xp1: 0,
                    corrida_xp2: 0
                },
                recepcao: {
                    recepcoes: 0,
                    alvos: 0,
                    drops: 0,
                    jds_recepcao: 0,
                    jds_yac: 0,
                    tds_recepcao: 0,
                    recepcao_xp1: 0,
                    recepcao_xp2: 0
                },
                defesa: {
                    tck: 0,
                    tfl: 0,
                    pressao_pct: "0",
                    sacks: 0,
                    tip: 0,
                    int: 0,
                    tds_defesa: 0,
                    defesa_xp2: 0,
                    sft: 0,
                    sft_1: 0,
                    blk: 0,
                    jds_defesa: 0
                }
            });
        });

        // Agregar estatísticas de cada jogador ao seu time
        players.forEach(player => {
            if (!player.timeId) return; // Ignorar jogadores sem time
            
            let teamStats = teamStatsMap.get(player.timeId);
            if (!teamStats) return; // Pular se o time não foi inicializado

            // Adicionar estatísticas de passe
            if (player.estatisticas?.passe) {
                const passe = player.estatisticas.passe;
                teamStats.passe.passes_completos += passe.passes_completos || 0;
                teamStats.passe.passes_tentados += passe.passes_tentados || 0;
                teamStats.passe.passes_incompletos += passe.passes_incompletos || 0;
                teamStats.passe.jds_passe += passe.jds_passe || 0;
                teamStats.passe.td_passe += passe.tds_passe || 0;
                teamStats.passe.passe_xp1 += passe.passe_xp1 || 0;
                teamStats.passe.passe_xp2 += passe.passe_xp2 || 0;
                teamStats.passe.int_sofridas += passe.int_sofridas || 0;
                teamStats.passe.sacks_sofridos += passe.sacks_sofridos || 0;
                // Não somamos pressao_pct, apenas usamos o último valor (se necessário)
            }

            // Adicionar estatísticas de corrida
            if (player.estatisticas?.corrida) {
                const corrida = player.estatisticas.corrida;
                teamStats.corrida.corridas += corrida.corridas || 0;
                teamStats.corrida.jds_corridas += corrida.jds_corridas || 0;
                teamStats.corrida.tds_corridos += corrida.tds_corridos || 0;
                teamStats.corrida.corrida_xp1 += corrida.corrida_xp1 || 0;
                teamStats.corrida.corrida_xp2 += corrida.corrida_xp2 || 0;
            }

            // Adicionar estatísticas de recepção
            if (player.estatisticas?.recepcao) {
                const recepcao = player.estatisticas.recepcao;
                teamStats.recepcao.recepcoes += recepcao.recepcoes || 0;
                teamStats.recepcao.alvos += recepcao.alvos || 0;
                teamStats.recepcao.drops += recepcao.drops || 0;
                teamStats.recepcao.jds_recepcao += recepcao.jds_recepcao || 0;
                teamStats.recepcao.jds_yac += recepcao.jds_yac || 0;
                teamStats.recepcao.tds_recepcao += recepcao.tds_recepcao || 0;
                teamStats.recepcao.recepcao_xp1 += recepcao.recepcao_xp1 || 0;
                teamStats.recepcao.recepcao_xp2 += recepcao.recepcao_xp2 || 0;
            }

            // Adicionar estatísticas de defesa
            if (player.estatisticas?.defesa) {
                const defesa = player.estatisticas.defesa;
                teamStats.defesa.tck += defesa.tck || 0;
                teamStats.defesa.tfl += defesa.tfl || 0;
                teamStats.defesa.sacks += defesa.sacks || 0;
                teamStats.defesa.tip += defesa.tip || 0;
                teamStats.defesa.int += defesa.int || 0;
                teamStats.defesa.tds_defesa += defesa.tds_defesa || 0;
                teamStats.defesa.defesa_xp2 += defesa.defesa_xp2 || 0;
                teamStats.defesa.sft += defesa.sft || 0;
                teamStats.defesa.sft_1 += defesa.sft_1 || 0;
                teamStats.defesa.blk += defesa.blk || 0;
                teamStats.defesa.jds_defesa += defesa.jds_defesa || 0;
                // Não somamos pressao_pct, apenas usamos o último valor (se necessário)
            }
        });

        return Array.from(teamStatsMap.values());
    }

    // Get the stats for the current category
    const getStatsByCategory = (category: string) => {
        switch (category) {
            case "passe":
                return [
                    { key: "passes_tentados", title: "PASSES TENT." },
                    { key: "passes_completos", title: "PASSES COMP." },
                    { key: "passes_incompletos", title: "PASSES INCOMPL." },
                    { key: "jds_passe", title: "JARDAS" },
                    { key: "td_passe", title: "TOUCHDOWNS" },
                    { key: "passe_xp1", title: "EXTRA POINT (1)" },
                    { key: "passe_xp2", title: "EXTRA POINT (2)" },
                    { key: "int_sofridas", title: "INTERCEPTAÇÕES" },
                    { key: "sacks_sofridos", title: "SACKS SOFRIDOS" }
                ];
            case "corrida":
                return [
                    { key: "corridas", title: "CORRIDAS" },
                    { key: "jds_corridas", title: "JARDAS" },
                    { key: "tds_corridos", title: "TOUCHDOWNS" },
                    { key: "corrida_xp1", title: "EXTRA POINT (1)" },
                    { key: "corrida_xp2", title: "EXTRA POINT (2)" }
                ];
            case "recepcao":
                return [
                    { key: "recepcoes", title: "RECEPÇÕES" },
                    { key: "alvos", title: "ALVOS" },
                    { key: "drops", title: "DROPS" },
                    { key: "jds_recepcao", title: "JARDAS" },
                    { key: "jds_yac", title: "JARDAS APÓS RECEPÇÃO" },
                    { key: "tds_recepcao", title: "TOUCHDOWNS" },
                    { key: "recepcao_xp1", title: "EXTRA POINT (1)" },
                    { key: "recepcao_xp2", title: "EXTRA POINT (2)" }
                ];
            case "defesa":
                return [
                    { key: "tck", title: "TACKLES" },
                    { key: "tfl", title: "TACKLES FOR LOSS" },
                    { key: "sacks", title: "SACKS" },
                    { key: "tip", title: "PASSES DESVIADOS" },
                    { key: "int", title: "INTERCEPTAÇÕES" },
                    { key: "tds_defesa", title: "TOUCHDOWNS" },
                    { key: "defesa_xp2", title: "EXTRA POINT (2)" },
                    { key: "sft", title: "SAFETIES" },
                    { key: "sft_1", title: "SAFETY (1)" },
                    { key: "blk", title: "BLOQUEIOS" },
                    { key: "jds_defesa", title: "JARDAS" }
                ];
            default:
                return [];
        }
    }

    // Get category title
    const getCategoryTitle = (category: string): string => {
        switch (category) {
            case "passe": return "PASSE"
            case "corrida": return "CORRIDA"
            case "recepcao": return "RECEPÇÃO"
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
                <div className="px-6 xl:max-w-5xl xl:px-12 max-w-7xl mx-auto xl:ml-20">
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
                        title="PASSE"
                        stats={[
                            { key: "passes_tentados", title: "PASSES TENT." },
                            { key: "passes_completos", title: "PASSES COMP." },
                            { key: "passes_incompletos", title: "PASSES INCOMPL." },
                            { key: "jds_passe", title: "JARDAS" },
                            { key: "td_passe", title: "TOUCHDOWNS" },
                            { key: "passe_xp1", title: "EXTRA POINT (1)" },
                            { key: "passe_xp2", title: "EXTRA POINT (2)" },
                            { key: "int_sofridas", title: "INTERCEPTAÇÕES" },
                            { key: "sacks_sofridos", title: "SACKS SOFRIDOS" }
                        ]}
                        teamStats={teamStats}
                    />

                    <TeamRankingGroup
                        title="CORRIDA"
                        stats={[
                            { key: "corridas", title: "CORRIDAS" },
                            { key: "jds_corridas", title: "JARDAS" },
                            { key: "tds_corridos", title: "TOUCHDOWNS" },
                            { key: "corrida_xp1", title: "EXTRA POINT (1)" },
                            { key: "corrida_xp2", title: "EXTRA POINT (2)" }
                        ]}
                        teamStats={teamStats}
                    />
                    
                    <TeamRankingGroup
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
                        teamStats={teamStats}
                    />

                    <TeamRankingGroup
                        title="DEFESA"
                        stats={[
                            { key: "tck", title: "TACKLES" },
                            { key: "tfl", title: "TACKLES FOR LOSS" },
                            { key: "sacks", title: "SACKS" },
                            { key: "tip", title: "PASSES DESVIADOS" },
                            { key: "int", title: "INTERCEPTAÇÕES" },
                            { key: "tds_defesa", title: "TOUCHDOWNS" },
                            { key: "defesa_xp2", title: "EXTRA POINT (2)" },
                            { key: "sft", title: "SAFETIES" },
                            { key: "sft_1", title: "SAFETY (1)" },
                            { key: "blk", title: "BLOQUEIOS" },
                            { key: "jds_defesa", title: "JARDAS" }
                        ]}
                        teamStats={teamStats}
                    />
                </div>
            </div>
        </RankingLayout>
    )
}