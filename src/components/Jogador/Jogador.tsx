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
                        className="flex h-24 justify-between items-center p-2 rounded-md border text-sm bg-white min-[425px]:p-4
                            md:text-base md:justify-center md:h-28 xl:text-lg lg:max-w-[800px] transition duration-300"
                        style={{
                            transition: "background-color 0.3s",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = `${currentTeam.cor}50`)
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#FFF")
                        }
                    >
                        <div className="min-w-20 md:flex-1 md:flex md:justify-center">
                            <Image
                                src={camisaPath}
                                width={100}
                                height={100}
                                alt="Camisa"
                                quality={100}
                                className="w-16 h-20 md:w-20 md:h-24"
                            />
                        </div>
                        <div className="flex flex-col gap-3 md:flex-1">
                            <div className="flex items-center gap-2">
                                <div className="text-sm min-[375px]:text-[17px] min-[425px]:text-[20px] font-extrabold italic md:text-xl">{jogador.nome}</div>
                            </div>
                            <div className="flex justify-between gap-2 min-[400px]:gap-6 md:justify-start">
                                <div className="flex flex-col items-center">
                                    <div className="text-[10px] min-[375px]:text-xs">NUMERO</div>
                                    <div className="text-xs min-[400px]:text-base font-bold">{jogador.numero || '-'}</div>
                                </div>
                                {/* Removemos altura, peso, idade já que estes campos foram removidos no schema */}
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    )
}