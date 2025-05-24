import { StatConfig } from '../types/statTypes';

export const getStatMapping = (statParam: string | null): StatConfig => {
    if (!statParam) {
        return {
            key: 'not_found',
            title: 'Estatística não encontrada',
            category: 'passe'
        }
    }

    const urlParam = statParam.toLowerCase();

    const mapping = statMappings[urlParam]
    if (mapping) return mapping

    return {
        key: 'not_found',
        title: 'Estatística não encontrada',
        category: 'passe'
    }
}

export const statMappings: { [key: string]: StatConfig } = {
    'passe-tentados': {
        key: 'passes_tentados',
        title: 'Passes Tentados',
        category: 'passe'
    },
    'passe-completos': {
        key: 'passes_completos',
        title: 'Passes Completos',
        category: 'passe'
    },
    'passe-incompletos': {
        key: 'passes_incompletos',
        title: 'Passes Incompletos',
        category: 'passe'
    },
    'passe-jardas': {
        key: 'jds_passe',
        title: 'Jardas de Passe',
        category: 'passe'
    },
    'passe-percentual': {
        key: 'passes_percentual',
        title: 'Passes Completos (%)',
        category: 'passe',
        isCalculated: true
    },
    'passe-td': {
        key: 'tds_passe',
        title: 'Touchdowns (Passe)',
        category: 'passe'
    },
    'passe-xp1': {
        key: 'passe_xp1',
        title: 'Extra Point 1 (Passe)',
        category: 'passe'
    },
    'passe-xp2': {
        key: 'passe_xp2',
        title: 'Extra Point 2 (Passe)',
        category: 'passe'
    },
    'passe-int': {
        key: 'int_sofridas',
        title: 'Interceptações Sofridas',
        category: 'passe'
    },
    'passe-sacks': {
        key: 'sacks_sofridos',
        title: 'Sacks Sofridos',
        category: 'passe'
    },
    'passe-pressao': {
        key: 'pressao_pct',
        title: 'Pressão (%)',
        category: 'passe'
    },

    'corrida-total': {
        key: 'corridas',
        title: 'Corridas',
        category: 'corrida'
    },
    'corrida-jardas': {
        key: 'jds_corridas',
        title: 'Jardas de Corrida',
        category: 'corrida'
    },
    'corrida-td': {
        key: 'tds_corridos',
        title: 'Touchdowns (Corrida)',
        category: 'corrida'
    },
    'corrida-xp1': {
        key: 'corrida_xp1',
        title: 'Extra Point 1 (Corrida)',
        category: 'corrida'
    },
    'corrida-xp2': {
        key: 'corrida_xp2',
        title: 'Extra Point 2 (Corrida)',
        category: 'corrida'
    },
    'corrida-media': {
        key: 'jds_corridas_media',
        title: 'Média de Jardas por Corrida',
        category: 'corrida',
        isCalculated: true
    },

    'recepcao-total': {
        key: 'recepcoes',
        title: 'Recepções',
        category: 'recepcao'
    },
    'recepcao-alvo': {
        key: 'alvos',
        title: 'Alvos',
        category: 'recepcao'
    },
    'recepcao-drops': {
        key: 'drops',
        title: 'Drops',
        category: 'recepcao'
    },
    'recepcao-jardas': {
        key: 'jds_recepcao',
        title: 'Jardas de Recepção',
        category: 'recepcao'
    },
    'recepcao-yac': {
        key: 'jds_yac',
        title: 'Jardas Após Recepção',
        category: 'recepcao'
    },
    'recepcao-td': {
        key: 'tds_recepcao',
        title: 'Touchdowns (Recepção)',
        category: 'recepcao'
    },
    'recepcao-xp1': {
        key: 'recepcao_xp1',
        title: 'Extra Point 1 (Recepção)',
        category: 'recepcao'
    },
    'recepcao-xp2': {
        key: 'recepcao_xp2',
        title: 'Extra Point 2 (Recepção)',
        category: 'recepcao'
    },
    'recepcao-media': {
        key: 'jds_recepcao_media',
        title: 'Média de Jardas por Recepção',
        category: 'recepcao',
        isCalculated: true
    },

    'defesa-tck': {
        key: 'tck',
        title: 'Tackles',
        category: 'defesa'
    },
    'defesa-tfl': {
        key: 'tfl',
        title: 'Tackles For Loss',
        category: 'defesa'
    },
    'defesa-flag-retirada': {
        key: 'flag_retirada',
        title: 'Flag Retirada',
        category: 'defesa'
    },
    'defesa-flag-perdida': {
        key: 'flag_perdida',
        title: 'Flag Perdida',
        category: 'defesa'
    },
    'defesa-sack': {
        key: 'sacks',
        title: 'Sacks',
        category: 'defesa'
    },
    'defesa-pressao': {
        key: 'pressao',
        title: 'Pressão',
        category: 'defesa'
    },
    'defesa-desvio': {
        key: 'tip',
        title: 'Passes Desviados',
        category: 'defesa'
    },
    'defesa-interceptacao': {
        key: 'int',
        title: 'Interceptações',
        category: 'defesa'
    },
    'defesa-td': {
        key: 'tds_defesa',
        title: 'Touchdowns',
        category: 'defesa'
    },
    'defesa-xp2': {
        key: 'defesa_xp2',
        title: 'Extra Point 2',
        category: 'defesa'
    },
    'defesa-sft': {
        key: 'sft',
        title: 'Safeties',
        category: 'defesa'
    },
    'defesa-sft1': {
        key: 'sft_1',
        title: 'Safety 1',
        category: 'defesa'
    },
    'defesa-blk': {
        key: 'blk',
        title: 'Bloqueios',
        category: 'defesa'
    },
    'defesa-jardas': {
        key: 'jds_defesa',
        title: 'Jardas',
        category: 'defesa'
    }
}