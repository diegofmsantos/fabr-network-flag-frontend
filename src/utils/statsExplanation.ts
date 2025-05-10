export const statsExplanations = {
    ATAQUE: {
        title: "As métricas de ATAQUE usadas pelo FABR Network",
        description: "levam em consideração a soma de todos os PASSES TENTADOS/NÚMERO DE JOGADORES que tiveram passes na temporada.",
        tiers: [
            "Tier 1: >= 40.9 (100% da média)",
            "Tier 2: >= 30.6 e < 40.9 (75% da média)",
            "Tier 3: < 30.6 (50% ou menos da média)"
        ],
        totalPlayers: "1.882 passes tentados/46 jogadores = 40.9"
    },
    DEFESA: {
        title: "As métricas de DEFESA usadas pelo FABR Network",
        description: "levam em consideração a soma de todas as JOGADAS DEFENSIVAS/NÚMERO DE JOGADORES que tiveram jogadas defensivas na temporada.",
        tiers: [
            "Tier 1: >= 4.8 (100% da média)",
            "Tier 2: >= 3.6 e < 4.8 (75% da média)",
            "Tier 3: < 3.6 (50% ou menos da média)"
        ],
        totalPlayers: "1.910 jogadas defensivas/401 jogadores = 4.8"
    }
}