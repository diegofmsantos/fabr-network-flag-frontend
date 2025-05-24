import { StatConfig, StatResult } from "../types/statTypes";

export const formatStatValue = (statResult: StatResult, stat: StatConfig): string => {
    if (statResult.value === null) return 'N/A'

    if (stat.isCalculated) {
        if (stat.key.includes('percentual')) {
            return `${Math.round(statResult.value)}%`
        }
        if (stat.key.includes('media')) {
            return statResult.value.toFixed(1)
        }
        return statResult.value.toFixed(1)
    }

    return Math.round(statResult.value).toString()
};