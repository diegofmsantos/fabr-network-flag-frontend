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
                    getJogadores(),
                    getTimes()
                ])

                setPlayers(playersData)
                setTimes(timesData)

                // Calculate aggregated stats by team
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

    // Function to calculate aggregated stats by team
    const calculateTeamStats = (players: Jogador[]): TeamStats[] => {
        const teamStatsMap = new Map<number, TeamStats>()

        // Primeiro passo: inicializar todos os times
        const timeIds = [...new Set(players.map(player => player.timeId))];

        // Inicializar todos os times com valores zerados
        timeIds.forEach(id => {
            teamStatsMap.set(id, {
                timeId: id,
                passe: {
                    jardas_de_passe: 0,
                    passes_completos: 0,
                    passes_tentados: 0,
                    td_passados: 0,
                    interceptacoes_sofridas: 0,
                    sacks_sofridos: 0,
                    fumble_de_passador: 0,
                },
                corrida: {
                    jardas_corridas: 0,
                    corridas: 0,
                    tds_corridos: 0,
                    fumble_de_corredor: 0,
                },
                recepcao: {
                    jardas_recebidas: 0,
                    recepcoes: 0,
                    tds_recebidos: 0,
                    alvo: 0,
                },
                retorno: {
                    jardas_retornadas: 0,
                    retornos: 0,
                    td_retornados: 0,
                },
                defesa: {
                    tackles_totais: 0,
                    tackles_for_loss: 0,
                    sacks_forcado: 0,
                    fumble_forcado: 0,
                    interceptacao_forcada: 0,
                    passe_desviado: 0,
                    safety: 0,
                    td_defensivo: 0,
                },
                kicker: {
                    xp_bons: 0,
                    tentativas_de_xp: 0,
                    fg_bons: 0,
                    tentativas_de_fg: 0,
                    fg_mais_longo: 0,
                },
                punter: {
                    punts: 0,
                    jardas_de_punt: 0,
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
            if (player.estatisticas.passe) {
                teamStats.passe.passes_completos += player.estatisticas.passe.passes_completos || 0;
                teamStats.passe.passes_tentados += player.estatisticas.passe.passes_tentados || 0;
                teamStats.passe.jardas_de_passe += player.estatisticas.passe.jardas_de_passe || 0;
                teamStats.passe.td_passados += player.estatisticas.passe.td_passados || 0;
                teamStats.passe.interceptacoes_sofridas += player.estatisticas.passe.interceptacoes_sofridas || 0;
                teamStats.passe.sacks_sofridos += player.estatisticas.passe.sacks_sofridos || 0;
                teamStats.passe.fumble_de_passador += player.estatisticas.passe.fumble_de_passador || 0;
            }

            // Corrida
            if (player.estatisticas.corrida) {
                teamStats.corrida.corridas += player.estatisticas.corrida.corridas || 0;
                teamStats.corrida.jardas_corridas += player.estatisticas.corrida.jardas_corridas || 0;
                teamStats.corrida.tds_corridos += player.estatisticas.corrida.tds_corridos || 0;
                teamStats.corrida.fumble_de_corredor += player.estatisticas.corrida.fumble_de_corredor || 0;
            }

            // Recepção
            if (player.estatisticas.recepcao) {
                teamStats.recepcao.recepcoes += player.estatisticas.recepcao.recepcoes || 0;
                teamStats.recepcao.alvo += player.estatisticas.recepcao.alvo || 0;
                teamStats.recepcao.jardas_recebidas += player.estatisticas.recepcao.jardas_recebidas || 0;
                teamStats.recepcao.tds_recebidos += player.estatisticas.recepcao.tds_recebidos || 0;
            }

            // Retorno
            if (player.estatisticas.retorno) {
                teamStats.retorno.retornos += player.estatisticas.retorno.retornos || 0;
                teamStats.retorno.jardas_retornadas += player.estatisticas.retorno.jardas_retornadas || 0;
                teamStats.retorno.td_retornados += player.estatisticas.retorno.td_retornados || 0;
            }

            // Defesa
            if (player.estatisticas.defesa) {
                teamStats.defesa.tackles_totais += player.estatisticas.defesa.tackles_totais || 0;
                teamStats.defesa.tackles_for_loss += player.estatisticas.defesa.tackles_for_loss || 0;
                teamStats.defesa.sacks_forcado += player.estatisticas.defesa.sacks_forcado || 0;
                teamStats.defesa.fumble_forcado += player.estatisticas.defesa.fumble_forcado || 0;
                teamStats.defesa.interceptacao_forcada += player.estatisticas.defesa.interceptacao_forcada || 0;
                teamStats.defesa.passe_desviado += player.estatisticas.defesa.passe_desviado || 0;
                teamStats.defesa.safety += player.estatisticas.defesa.safety || 0;
                teamStats.defesa.td_defensivo += player.estatisticas.defesa.td_defensivo || 0;
            }

            // Kicker
            if (player.estatisticas.kicker) {
                teamStats.kicker.xp_bons += player.estatisticas.kicker.xp_bons || 0;
                teamStats.kicker.tentativas_de_xp += player.estatisticas.kicker.tentativas_de_xp || 0;
                teamStats.kicker.fg_bons += player.estatisticas.kicker.fg_bons || 0;
                teamStats.kicker.tentativas_de_fg += player.estatisticas.kicker.tentativas_de_fg || 0;

                // Para o field goal mais longo, pegamos o maior valor
                if (player.estatisticas.kicker.fg_mais_longo > teamStats.kicker.fg_mais_longo) {
                    teamStats.kicker.fg_mais_longo = player.estatisticas.kicker.fg_mais_longo;
                }
            }

            // Punter
            if (player.estatisticas.punter) {
                teamStats.punter.punts += player.estatisticas.punter.punts || 0;
                teamStats.punter.jardas_de_punt += player.estatisticas.punter.jardas_de_punt || 0;
            }
        });

        return Array.from(teamStatsMap.values());
    }

    // Get the stats for the current category
    const getStatsByCategory = (category: string) => {
        switch (category) {
            case "passe":
                return [
                    { key: "jardas_de_passe", title: "JARDAS" },
                    { key: "passes_tentados", title: "PASSES TENT." },
                    { key: "td_passados", title: "TOUCHDOWNS" },
                    { key: "jardas_media", title: "JARDAS(AVG)" },
                    { key: "passes_completos", title: "PASSES COMP." },
                    { key: "interceptacoes_sofridas", title: "INTERCEPTAÇÕES" },
                    { key: "sacks_sofridos", title: "SACKS" },
                    { key: "fumble_de_passador", title: "FUMBLES" }
                ];
            case "corrida":
                return [
                    { key: "jardas_corridas", title: "JARDAS" },
                    { key: "corridas", title: "CORRIDAS" },
                    { key: "tds_corridos", title: "TOUCHDOWNS" },
                    { key: "jardas_corridas_media", title: "JARDAS(AVG)" },
                    { key: "fumble_de_corredor", title: "FUMBLES" }
                ];
            case "recepcao":
                return [
                    { key: "jardas_recebidas", title: "JARDAS" },
                    { key: "recepcoes", title: "RECEPÇÕES" },
                    { key: "tds_recebidos", title: "TOUCHDOWNS" },
                    { key: "jardas_recebidas_media", title: "JARDAS(AVG)" },
                ];
            case "retorno":
                return [
                    { key: "jardas_retornadas", title: "JARDAS" },
                    { key: "retornos", title: "RETORNOS" },
                    { key: "td_retornados", title: "TOUCHDOWNS" },
                    { key: "jardas_retornadas_media", title: "JARDAS(AVG)" },
                ];
            case "defesa":
                return [
                    { key: "interceptacao_forcada", title: "INTERCEPTAÇÕES" },
                    { key: "sacks_forcado", title: "SACKS" },
                    { key: "fumble_forcado", title: "FUMBLES FORÇ." },
                    { key: "td_defensivo", title: "TOUCHDOWNS" },
                    { key: "passe_desviado", title: "PASSES DESV." },
                    { key: "tackles_for_loss", title: "TACKLES(LOSS)" },
                    { key: "tackles_totais", title: "TACKLES TOTAIS" },
                    { key: "safety", title: "SAFETIES" }
                ];
            case "chute":
                return [
                    { key: "field_goals", title: "FG(%)" },
                    { key: "fg_bons", title: "FG BOM" },
                    { key: "fg_mais_longo", title: "MAIS LONGO" },
                    { key: "tentativas_de_fg", title: "FG TENTADOS" },
                    { key: "extra_points", title: "XP(%)" },
                    { key: "xp_bons", title: "XP BOM" },
                    { key: "tentativas_de_xp", title: "XP TENTADOS" }
                ];
            case "punt":
                return [
                    { key: "jardas_de_punt", title: "JARDAS" },
                    { key: "punts", title: "PUNTS" },
                    { key: "jardas_punt_media", title: "JARDAS(AVG)" }
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
            case "retorno": return "RETORNO"
            case "defesa": return "DEFESA"
            case "chute": return "CHUTE"
            case "punt": return "PUNT"
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
                        title="PASSE"
                        stats={[
                            { key: "jardas_de_passe", title: "JARDAS" },
                            { key: "passes_tentados", title: "PASSES TENT." },
                            { key: "td_passados", title: "TOUCHDOWNS" },
                            { key: "jardas_media", title: "JARDAS(AVG)" },
                            { key: "interceptacoes_sofridas", title: "INTERCEPTAÇÕES" },
                            { key: "sacks_sofridos", title: "SACKS" },
                            { key: "fumble_de_passador", title: "FUMBLES" }
                        ]}
                        teamStats={teamStats}
                    />

                    <TeamRankingGroup
                        title="CORRIDA"
                        stats={[
                            { key: "jardas_corridas", title: "JARDAS" },
                            { key: "corridas", title: "CORRIDAS" },
                            { key: "tds_corridos", title: "TOUCHDOWNS" },
                            { key: "jardas_corridas_media", title: "JARDAS(AVG)" },
                            { key: "fumble_de_corredor", title: "FUMBLES" }
                        ]}
                        teamStats={teamStats}
                    />

                    <TeamRankingGroup
                        title="RECEPÇÃO"
                        stats={[
                            { key: "jardas_recebidas", title: "JARDAS" },
                            { key: "recepcoes", title: "RECEPÇÕES" },
                            { key: "tds_recebidos", title: "TOUCHDOWNS" },
                            { key: "jardas_recebidas_media", title: "JARDAS(AVG)" },
                        ]}
                        teamStats={teamStats}
                    />

                    <TeamRankingGroup
                        title="RETORNO"
                        stats={[
                            { key: "jardas_retornadas", title: "JARDAS" },
                            { key: "retornos", title: "RETORNOS" },
                            { key: "td_retornados", title: "TOUCHDOWNS" },
                            { key: "jardas_retornadas_media", title: "JARDAS(AVG)" },
                        ]}
                        teamStats={teamStats}
                    />

                    <TeamRankingGroup
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
                        teamStats={teamStats}
                    />

                    <TeamRankingGroup
                        title="CHUTE"
                        stats={[
                            { key: "field_goals", title: "FG(%)" },
                            { key: "fg_bons", title: "FG BOM" },
                            { key: "fg_mais_longo", title: "MAIS LONGO" },
                            { key: "tentativas_de_fg", title: "FG TENTADOS" },
                            { key: "extra_points", title: "XP(%)" },
                            { key: "xp_bons", title: "XP BOM" },
                            { key: "tentativas_de_xp", title: "XP TENTADOS" }
                        ]}
                        teamStats={teamStats}
                    />

                    <TeamRankingGroup
                        title="PUNT"
                        stats={[
                            { key: "jardas_de_punt", title: "JARDAS" },
                            { key: "punts", title: "PUNTS" },
                            { key: "jardas_punt_media", title: "JARDAS(AVG)" }
                        ]}
                        teamStats={teamStats}
                    />
                </div>
            </div>
        </RankingLayout>
    )
}