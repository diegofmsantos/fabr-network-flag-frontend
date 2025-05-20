import { StatGroup } from '@/types/Stats'

export const statGroups: StatGroup[] = [
    {
        title: 'PASSE',
        groupLabel: 'passe',
        stats: [
            { title: 'Passes Tentados', urlParam: 'passe-tentados' },
            { title: 'Passes Completos', urlParam: 'passe-completos' },
            { title: 'Passes Incompletos', urlParam: 'passe-incompletos' },
            { title: 'Jardas', urlParam: 'passe-jardas' },
            { title: 'Passes(%)', urlParam: 'passe-percentual' },
            { title: 'Touchdowns', urlParam: 'passe-td' },
            { title: 'Extra Point (1)', urlParam: 'passe-xp1' },
            { title: 'Extra Point (2)', urlParam: 'passe-xp2' },
            { title: 'Interceptações Sofridas', urlParam: 'passe-int' },
            { title: 'Sacks Sofridos', urlParam: 'passe-sacks' },
            { title: 'Pressão (%)', urlParam: 'passe-pressao' }
        ]
    },
    {
        title: 'CORRIDA',
        groupLabel: 'corrida',
        stats: [
            { title: 'Corridas', urlParam: 'corrida-total' },
            { title: 'Jardas', urlParam: 'corrida-jardas' },
            { title: 'Touchdowns', urlParam: 'corrida-td' },
            { title: 'Extra Point (1)', urlParam: 'corrida-xp1' },
            { title: 'Extra Point (2)', urlParam: 'corrida-xp2' }
        ]
    },
    {
        title: 'RECEPÇÃO',
        groupLabel: 'recepcao',
        stats: [
            { title: 'Recepções', urlParam: 'recepcao-total' },
            { title: 'Alvos', urlParam: 'recepcao-alvo' },
            { title: 'Drops', urlParam: 'recepcao-drops' },
            { title: 'Jardas', urlParam: 'recepcao-jardas' },
            { title: 'Jardas Após Recepção', urlParam: 'recepcao-yac' },
            { title: 'Touchdowns', urlParam: 'recepcao-td' },
            { title: 'Extra Point (1)', urlParam: 'recepcao-xp1' },
            { title: 'Extra Point (2)', urlParam: 'recepcao-xp2' }
        ]
    },
    {
        title: 'DEFESA',
        groupLabel: 'defesa',
        stats: [
            { title: 'Tackles', urlParam: 'defesa-tck' },
            { title: 'Tackles For Loss', urlParam: 'defesa-tfl' },
            { title: 'Flag Retirada', urlParam: 'defesa-flag-retirada' },
            { title: 'Flag Perdida', urlParam: 'defesa-flag-perdida' },
            { title: 'Sacks', urlParam: 'defesa-sack' },
            { title: 'Pressão (%)', urlParam: 'defesa-pressao' },
            { title: 'Passes Desviados', urlParam: 'defesa-desvio' },
            { title: 'Interceptações', urlParam: 'defesa-interceptacao' },
            { title: 'Touchdowns', urlParam: 'defesa-td' },
            { title: 'Extra Point (2)', urlParam: 'defesa-xp2' },
            { title: 'Safeties', urlParam: 'defesa-sft' },
            { title: 'Safety (1)', urlParam: 'defesa-sft1' },
            { title: 'Bloqueios', urlParam: 'defesa-blk' },
            { title: 'Jardas', urlParam: 'defesa-jardas' }
        ]
    }
]

export const teamStatGroups: StatGroup[] = [
    {
        title: 'PASSE',
        groupLabel: 'passe',
        stats: [
            { title: 'Passes Tentados', urlParam: 'passe-tentados' },
            { title: 'Passes Completos', urlParam: 'passe-completos' },
            { title: 'Passes Incompletos', urlParam: 'passe-incompletos' },
            { title: 'Jardas', urlParam: 'passe-jardas' },
            { title: 'Passes(%)', urlParam: 'passe-percentual' },
            { title: 'Touchdowns', urlParam: 'passe-td' },
            { title: 'Extra Point (1)', urlParam: 'passe-xp1' },
            { title: 'Extra Point (2)', urlParam: 'passe-xp2' },
            { title: 'Interceptações Sofridas', urlParam: 'passe-int' },
            { title: 'Sacks Sofridos', urlParam: 'passe-sacks' },
            { title: 'Pressão (%)', urlParam: 'passe-pressao' }
        ]
    },
    {
        title: 'CORRIDA',
        groupLabel: 'corrida',
        stats: [
            { title: 'Corridas', urlParam: 'corrida-total' },
            { title: 'Jardas', urlParam: 'corrida-jardas' },
            { title: 'Touchdowns', urlParam: 'corrida-td' },
            { title: 'Extra Point (1)', urlParam: 'corrida-xp1' },
            { title: 'Extra Point (2)', urlParam: 'corrida-xp2' }
        ]
    },
    {
        title: 'RECEPÇÃO',
        groupLabel: 'recepcao',
        stats: [
            { title: 'Recepções', urlParam: 'recepcao-total' },
            { title: 'Alvos', urlParam: 'recepcao-alvo' },
            { title: 'Drops', urlParam: 'recepcao-drops' },
            { title: 'Jardas', urlParam: 'recepcao-jardas' },
            { title: 'Jardas Após Recepção', urlParam: 'recepcao-yac' },
            { title: 'Touchdowns', urlParam: 'recepcao-td' },
            { title: 'Extra Point (1)', urlParam: 'recepcao-xp1' },
            { title: 'Extra Point (2)', urlParam: 'recepcao-xp2' }
        ]
    },
    {
        title: 'DEFESA',
        groupLabel: 'defesa',
        stats: [
            { title: 'Tackles', urlParam: 'defesa-tck' },
            { title: 'Tackles For Loss', urlParam: 'defesa-tfl' },
            { title: 'Flag Retirada', urlParam: 'defesa-flag-retirada' },
            { title: 'Flag Perdida', urlParam: 'defesa-flag-perdida' },
            { title: 'Sacks', urlParam: 'defesa-sack' },
            { title: 'Pressão (%)', urlParam: 'defesa-pressao' },
            { title: 'Passes Desviados', urlParam: 'defesa-desvio' },
            { title: 'Interceptações', urlParam: 'defesa-interceptacao' },
            { title: 'Touchdowns', urlParam: 'defesa-td' },
            { title: 'Extra Point (2)', urlParam: 'defesa-xp2' },
            { title: 'Safeties', urlParam: 'defesa-sft' },
            { title: 'Safety (1)', urlParam: 'defesa-sft1' },
            { title: 'Bloqueios', urlParam: 'defesa-blk' },
            { title: 'Jardas', urlParam: 'defesa-jardas' }
        ]
    }
]