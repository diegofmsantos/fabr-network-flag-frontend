"use client"

import { Time } from "@/types/time"
import { Jogador as JogadorType } from "@/types/jogador"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { SemJogador } from "../SemJogador"
import { getPlayerSlug, getTeamSlug } from "@/utils/formatUrl"
import { JogadorSkeleton } from "../ui/JogadorSkeleton"
import { useSearchParams } from 'next/navigation'
import { useJogadores } from '@/hooks/queries'

type Props = {
    currentTeam: Time
}

export const Jogador = ({ currentTeam }: Props) => {
    const [jogadoresFiltrados, setJogadoresFiltrados] = useState<JogadorType[]>([])
    const [loading, setLoading] = useState(true)
    const searchParams = useSearchParams()
    const temporada = searchParams.get('temporada') || '2025'

    // Usar o hook useJogadores com a temporada correta
    const { data: jogadores = [], isLoading } = useJogadores(temporada)

    useEffect(() => {
        if (isLoading) {
            setLoading(true);
            return;
        }

        try {
            if (!currentTeam) {
                console.warn("Time não definido corretamente.")
                setLoading(false);
                return;
            }

            console.log(`Filtrando jogadores para time ID: ${currentTeam.id}, temporada: ${temporada}`);
            console.log(`Nome do time atual: ${currentTeam.nome}`);
            console.log(`Total de jogadores disponíveis: ${jogadores.length}`);

            // Para flag football, não filtramos por setor
            // Simplesmente retorna todos os jogadores do time
            const jogadoresDoTime = jogadores.filter((jogador: JogadorType) => {
                return jogador.timeId === currentTeam.id;
            });

            console.log(`Jogadores filtrados para este time: ${jogadoresDoTime.length}`);
            setJogadoresFiltrados(jogadoresDoTime);
        } catch (error) {
            console.error("Erro ao processar jogadores:", error);
        } finally {
            setLoading(false);
        }
    }, [currentTeam, jogadores, isLoading, temporada]);

    // Função adaptada para a estrutura de pastas existente
    const getCamisaPath = (jogador: JogadorType, currentTeam: Time): string => {
        // Se não temos dados suficientes, retorna uma imagem padrão
        if (!currentTeam?.nome || !jogador?.camisa) {
            return '/assets/times/camisas/camisa-teste-flag.png';
        }

        // Normaliza o nome do time para o formato usado nas pastas
        const timeNormalizado = currentTeam.nome.toLowerCase()
            .replace(/\s+/g, '-')
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        // Retorna o caminho correto da camisa
        return `/assets/times/camisas/${timeNormalizado}/${jogador.camisa}`;
    }

    if (loading || isLoading) return <JogadorSkeleton />
    if (jogadoresFiltrados.length === 0) return (<div className="text-center text-lg italic mt-2">Nenhum jogador encontrado.</div>)

    const todosJogadoresSemNome = jogadoresFiltrados.length > 0 &&
        jogadoresFiltrados.every(jogador => !jogador.nome || jogador.nome === "")

    if (todosJogadoresSemNome) return <SemJogador />

    return (
        <div className="max-w-[800px] flex flex-col gap-3 px-4 pb-4 z-50 lg:px-0 lg:ml-4 xl:px-0 
         xl:w-[650px] 2xl:w-[800px] xl:ml-12 2xl:ml-0">
            {jogadoresFiltrados.map((jogador: JogadorType) => {
                // Obter caminho da camisa adaptado à estrutura existente
                const camisaPath = getCamisaPath(jogador, currentTeam);

                return (
                    <Link
                        href={`/${getTeamSlug(currentTeam.nome)}/${getPlayerSlug(jogador.nome)}?temporada=${temporada}`}
                        key={jogador.id}
                        className="flex h-20 min-h-[4rem] w-full justify-between items-center p-0 rounded-md border border-gray-200 
                        text-sm bg-white my-1 relative overflow-visible md:justify-center md:items-center"
                        style={{
                            transition: "background-color 0.3s",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = `${currentTeam.cor}10`)
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#FFF")
                        }
                    >
                        {/* Camisa posicionada na lateral esquerda */}
                        <div className="absolute h-[115%] w-20 left-[25px] top-[-15%] overflow-hidden z-0">
                            <Image
                                src={camisaPath}
                                width={250}
                                height={250}
                                alt="Camisa"
                                quality={100}
                                className="object-cover"
                                style={{
                                    objectPosition: 'left center',
                                    transform: 'scale(1.0)',
                                    transformOrigin: 'left center'
                                }}
                            />
                        </div>

                        {/* Conteúdo do card com margem à esquerda para não sobrepor a camisa */}
                        <div className="flex-1 py-3 px-2 ml-20 flex justify-between items-center w-full">
                            {/* Nome do jogador */}
                            <div className="font-extrabold italic text-[17px] ml-10">{jogador.nome}</div>

                            {/* Seta direita */}
                            <div className="flex items-center justify-center w-8 h-8">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    )
}