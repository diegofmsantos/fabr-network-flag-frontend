import { Jogador } from "@/types/jogador"
import { Time } from "@/types/time"

export const createSlug = (text: string): string => {
    if (!text) return ''

    const charMap = {
        'á': 'a', 'à': 'a', 'ã': 'a', 'â': 'a', 'ä': 'a',
        'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
        'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i',
        'ó': 'o', 'ò': 'o', 'õ': 'o', 'ô': 'o', 'ö': 'o',
        'ú': 'u', 'ù': 'u', 'û': 'u', 'ü': 'u',
        'ý': 'y', 'ÿ': 'y',
        'ñ': 'n',
        'ç': 'c',
        'Á': 'A', 'À': 'A', 'Ã': 'A', 'Â': 'A', 'Ä': 'A',
        'É': 'E', 'È': 'E', 'Ê': 'E', 'Ë': 'E',
        'Í': 'I', 'Ì': 'I', 'Î': 'I', 'Ï': 'I',
        'Ó': 'O', 'Ò': 'O', 'Õ': 'O', 'Ô': 'O', 'Ö': 'O',
        'Ú': 'U', 'Ù': 'U', 'Û': 'U', 'Ü': 'U',
        'Ý': 'Y',
        'Ñ': 'N',
        'Ç': 'C',
    }

    // Remove acentos e caracteres especiais
    const normalized = text
        .split('')
        .map(char => charMap[char as keyof typeof charMap] || char)
        .join('')
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

    // Divide a string em palavras
    return normalized
        .split('-')
        .map(word => {
            // Se a palavra tem 2 letras e é toda em maiúsculo (como FA, HP)
            if (word.length === 2 && word.toUpperCase() === word) {
                return word.toUpperCase()
            }
            // Caso contrário, capitaliza apenas a primeira letra
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        })
        .join('-')
}

export const getTeamSlug = (teamName: string | undefined): string => {
    if (!teamName) return ''
    return createSlug(teamName)
}

export const getPlayerSlug = (playerName: string | undefined): string => {
    if (!playerName) return ''
    return createSlug(playerName)
}

export const getOriginalName = (teams: Time[], slug: string): string | null => {
    if (!slug) return null
    // Normaliza o slug recebido para garantir consistência na comparação
    const normalizedSlug = createSlug(slug)
    const team = teams.find(team => getTeamSlug(team.nome) === normalizedSlug)
    return team?.nome || null
}

export const findPlayerBySlug = (
    jogadores: Jogador[],
    playerSlug: string,
    timeSlug: string,
    times: Time[]
): Jogador | null => {
    if (!playerSlug || !timeSlug) return null;

    const normalizedPlayerSlug = createSlug(playerSlug);
    const normalizedTeamSlug = createSlug(timeSlug);

    // Primeiro, tenta encontrar o jogador exatamente como antes
    // (mesmo nome de jogador e mesmo time)
    const jogadorNoTimeAtual = jogadores.find(jogador => {
        // Verifica se o nome do jogador corresponde
        const playerMatches = getPlayerSlug(jogador.nome) === normalizedPlayerSlug;

        // Pega o time do jogador e verifica se corresponde
        const playerTeam = times.find(t => t.id === jogador.timeId);
        const teamMatches = playerTeam && getTeamSlug(playerTeam.nome) === normalizedTeamSlug;

        // Retorna verdadeiro apenas se tanto o jogador quanto o time corresponderem
        return playerMatches && teamMatches;
    });

    if (jogadorNoTimeAtual) {
        return jogadorNoTimeAtual;
    }

    // Se não encontrou o jogador no time atual, procura apenas pelo slug do jogador
    // (isso encontrará o jogador mesmo que ele tenha mudado de time)
    return jogadores.find(jogador => 
        getPlayerSlug(jogador.nome) === normalizedPlayerSlug
    ) || null;
}