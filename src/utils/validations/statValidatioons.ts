import { Jogador } from "@/types/jogador";
import { CategoryKey, CATEGORY_THRESHOLDS } from "../categoryThresholds";
import { calculateStat } from "../calculations/statCalculations";
import { StatKey } from "@/components/Ranking/RankingGroup";

export const checkCategoryMinimum = (category: CategoryKey, stats: any): boolean => {
    const thresholds = CATEGORY_THRESHOLDS[category];
    if (!thresholds) return true;

    switch (category) {
        case 'passe':
            return stats && (stats.passes_tentados > 0 || stats.passes_completos > 0 || stats.tds_passe > 0);
        case 'corrida':
            return stats && (stats.corridas > 0 || stats.jds_corridas > 0 || stats.tds_corridos > 0);
        case 'recepcao':
            return stats && (stats.recepcoes > 0 || stats.alvos > 0 || stats.tds_recepcao > 0);
        case 'defesa':
            return stats && (
                stats.tck > 0 || stats.tip > 0 || stats.int > 0 || stats.sacks > 0 ||
                stats.flag_retirada > 0 || stats.flag_perdida > 0 || stats.pressao > 0 ||
                stats.tds_defesa > 0
            );
        default:
            return true;
    }
}

export const meetsMinimumRequirements = (player: Jogador, category: string): boolean => {
    if (!player.estatisticas) return false;

    try {
        switch (category) {
            case 'DEFESA':
                const defStats = player.estatisticas.defesa;
                if (!defStats) return false;
                return Object.values(defStats).some(val =>
                    typeof val === 'number' && val > 0);

            case 'PASSE':
                const passeStats = player.estatisticas.passe;
                if (!passeStats) return false;
                return Object.values(passeStats).some(val =>
                    typeof val === 'number' && val > 0);

            case 'CORRIDA':
                const corridaStats = player.estatisticas.corrida;
                if (!corridaStats) return false;
                return Object.values(corridaStats).some(val =>
                    typeof val === 'number' && val > 0);

            case 'RECEPÇÃO':
                const recepcaoStats = player.estatisticas.recepcao;
                if (!recepcaoStats) return false;
                return Object.values(recepcaoStats).some(val =>
                    typeof val === 'number' && val > 0);

            // Para compatibilidade com a estrutura antiga
            case 'ATAQUE':
                return meetsMinimumRequirements(player, 'PASSE');

            default:
                return true;
        }
    } catch (error) {
        console.error(`Error checking minimum requirements for ${category}:`, error)
        return false
    }
}

export const shouldIncludePlayer = (player: Jogador, key: StatKey, category: string): boolean => {
    try {
        if (!meetsMinimumRequirements(player, category)) {
            return false
        }

        const value = calculateStat(player, key)
        if (value === null) return false
        return Number(value) > 0
    } catch (error) {
        console.error(`Error checking statistic ${key}:`, error)
        return false
    }
}