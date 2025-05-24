import { CategoryKey } from "../categoryThresholds"

export interface StatConfig {
    key: string
    title: string
    category: CategoryKey
    isCalculated?: boolean
}

export interface StatResult {
    value: number | null
    tier: number
}