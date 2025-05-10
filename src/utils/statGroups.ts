import { StatGroup } from '@/types/Stats'

export const statGroups: StatGroup[] = [
    {
        title: 'ATAQUE',
        groupLabel: 'ATAQUE',
        stats: [
            { title: 'Passes Tentados', urlParam: 'passe-tentados' },
            { title: 'Passes Completos', urlParam: 'passe-completos' },
            { title: 'Passes(%)', urlParam: 'passe-percentual' },
            { title: 'Touchdowns (Passe)', urlParam: 'passe-td' },
            { title: 'Interceptações Sofridas', urlParam: 'passe-int' },
            { title: 'Sacks Sofridos', urlParam: 'passe-sacks' },
            { title: 'Corridas', urlParam: 'corrida-total' },
            { title: 'Touchdowns (Corrida)', urlParam: 'corrida-td' },
            { title: 'Recepções', urlParam: 'recepcao-total' },
            { title: 'Alvos', urlParam: 'recepcao-alvo' },
            { title: 'Touchdowns (Recepção)', urlParam: 'recepcao-td' }
        ]
    },
    {
        title: 'DEFESA',
        groupLabel: 'DEFESA',
        stats: [
            { title: 'Flag Retirada', urlParam: 'defesa-flag-retirada' },
            { title: 'Flag Perdida', urlParam: 'defesa-flag-perdida' },
            { title: 'Sacks', urlParam: 'defesa-sack' },
            { title: 'Pressão', urlParam: 'defesa-pressao' },
            { title: 'Interceptações', urlParam: 'defesa-interceptacao' },
            { title: 'Passes Desviados', urlParam: 'defesa-desvio' },
            { title: 'Touchdowns', urlParam: 'defesa-td' }
        ]
    }
]

export const teamStatGroups: StatGroup[] = [
    {
        title: 'ATAQUE',
        groupLabel: 'ATAQUE',
        stats: [
            { title: 'Passes Tentados', urlParam: 'passe-tentados' },
            { title: 'Passes Completos', urlParam: 'passe-completos' },
            { title: 'Passes(%)', urlParam: 'passe-percentual' },
            { title: 'Touchdowns (Passe)', urlParam: 'passe-td' },
            { title: 'Interceptações Sofridas', urlParam: 'passe-int' },
            { title: 'Sacks Sofridos', urlParam: 'passe-sacks' },
            { title: 'Corridas', urlParam: 'corrida-total' },
            { title: 'Touchdowns (Corrida)', urlParam: 'corrida-td' },
            { title: 'Recepções', urlParam: 'recepcao-total' },
            { title: 'Alvos', urlParam: 'recepcao-alvo' },
            { title: 'Touchdowns (Recepção)', urlParam: 'recepcao-td' }
        ]
    },
    {
        title: 'DEFESA',
        groupLabel: 'DEFESA',
        stats: [
            { title: 'Flag Retirada', urlParam: 'defesa-flag-retirada' },
            { title: 'Flag Perdida', urlParam: 'defesa-flag-perdida' },
            { title: 'Sacks', urlParam: 'defesa-sack' },
            { title: 'Pressão', urlParam: 'defesa-pressao' },
            { title: 'Interceptações', urlParam: 'defesa-interceptacao' },
            { title: 'Passes Desviados', urlParam: 'defesa-desvio' },
            { title: 'Touchdowns', urlParam: 'defesa-td' }
        ]
    }
]