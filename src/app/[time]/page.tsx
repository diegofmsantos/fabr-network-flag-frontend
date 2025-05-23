"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleDown } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import { ButtonTime } from "@/components/ui/buttonTime"
import { Jogador } from "@/components/Jogador/Jogador"
import { CurrentTime } from "@/components/Time/Time"
import { motion, useScroll, useTransform } from "framer-motion"
import { Loading } from "@/components/ui/Loading"
import TeamNameHeader from "@/components/Time/TeamHeader"
import ShareButton from "@/components/ui/buttonShare"
import { createSlug } from "@/utils/formatUrl"
import { useTeam } from "@/hooks/queries"
import { TimeNaoEncontrado } from "@/components/ui/TimeNaoEncontrado"

export default function Page() {
    const params = useParams()
    const router = useRouter()
    const searchParams = useSearchParams()
    const temporada = searchParams.get('temporada') || '2025'

    useEffect(() => {
        const currentPath = params.time?.toString() || ''
        if (currentPath.includes('%20')) {
            const decodedPath = decodeURIComponent(currentPath)
            const correctSlug = createSlug(decodedPath)

            // Preservar todos os parâmetros da URL atual
            const params = new URLSearchParams(searchParams.toString())
            const queryString = params.toString() ? `?${params.toString()}` : ''

            // Agora substitui mantendo os parâmetros originais
            router.replace(`/${correctSlug}${queryString}`)
        }
    }, [params.time, router, searchParams])

    const timeName = Array.isArray(params.time) ? params.time[0] : params.time
    const decodedTimeName = timeName ? decodeURIComponent(timeName).replace(/-/g, ' ') : ''

    const {
        data: currentTeam,
        isLoading: loadingTeam,
        error
    } = useTeam(decodedTimeName, temporada)

    const [loadingJogadores, setLoadingJogadores] = useState(false)
    const [selectedButton, setSelectedButton] = useState(searchParams.get("show") || "bio")

    const { scrollY } = useScroll()
    const opacity = useTransform(scrollY, [0, 200], [1, 0])
    const height = useTransform(scrollY, [0, 200], [330, 50])

    // Atualiza o título da página
    useEffect(() => {
        if (currentTeam?.nome) {
            document.title = currentTeam.nome
        } else if (error) {
            document.title = "Erro ao carregar time"
        } else if (!loadingTeam) {
            document.title = "Time não encontrado"
        }
    }, [currentTeam, loadingTeam, error])

    const handleShowBio = () => {
        // Criar nova URLSearchParams com os parâmetros existentes
        const params = new URLSearchParams(searchParams.toString());

        // Modificar apenas os parâmetros que precisamos alterar
        params.set('show', 'bio');

        // Remover o parâmetro setor caso exista
        params.delete('setor');

        // Isso manterá o parâmetro 'temporada' se ele já existir
        router.replace(`?${params.toString()}`);

        setSelectedButton("bio")
    }

    const handleShowJogadores = async () => {
        setSelectedButton("jogadores")
        setLoadingJogadores(true)

        // Preservar todos os parâmetros da URL
        const params = new URLSearchParams(searchParams.toString());
        params.set('show', 'jogadores');
        
        router.replace(`?${params.toString()}`, { scroll: false });
        setLoadingJogadores(false)
    }

    if (loadingTeam) return <Loading />
    if (error) return (
        <TimeNaoEncontrado
            timeNome={decodedTimeName}
            temporadaAtual={temporada}
            temporadaDisponivel={temporada === '2025' ? '2024' : '2025'}
        />
    )
    if (!currentTeam) return (
        <TimeNaoEncontrado
            timeNome={decodedTimeName}
            temporadaAtual={temporada}
            temporadaDisponivel={temporada === '2025' ? '2024' : '2025'}
        />
    )

    return (
        <div className="pt-[79px] xl:pt-0 pb-14 bg-[#ECECEC] xl:ml-24 2xl:ml-40">
            <TeamNameHeader teamName={currentTeam?.nome} />
            <motion.div className="fixed z-50 w-full" style={{ height }}>
                <ShareButton
                    title={currentTeam.nome}
                    variant="team"
                    buttonStyle="absolute"
                    className="lg:right-32 xl:right-[420px] 2xl:right-[570px]"
                />
                <motion.div
                    className="max-w-[800px] p-4 mx-auto w-full h-full flex flex-col justify-center items-center rounded-b-xl xl:w-[650px] 2xl:w-[800px] "
                    style={{ backgroundColor: currentTeam.cor || "#000" }}
                >
                    <Link
                        href={{
                            pathname: "/",
                            query: { temporada: temporada }
                        }}
                        className="absolute top-2 left-3 bg-black/20 rounded-xl text-xs text-white py-1 px-2 lg:left-32 xl:left-[420px] 2xl:left-[570px]"
                    >
                        {currentTeam.sigla || "N/A"}
                        <FontAwesomeIcon icon={faAngleDown} className="ml-1" />
                    </Link>
                    <TeamNameHeader teamName={currentTeam?.nome} />
                    <motion.div className="flex flex-col justify-center items-center md:mb-4" style={{ opacity, pointerEvents: 'none' }}>
                        <div className="text-[45px] mt-2 text-white text-center px-6 font-extrabold italic leading-[35px] tracking-[-3px] md:text-5xl md:mt-4">
                            {currentTeam.nome?.toLocaleUpperCase() || "Time Indefinido"}
                        </div>

                        <div className="w-40 h-40 -mt-6">
                            <Image
                                src={`/assets/times/logos/${currentTeam.logo || "default-logo.png"}`}
                                alt="logo do time"
                                width={190}
                                height={190}
                                quality={100}
                                style={{ width: '190px', height: '190px', objectFit: 'contain' }}
                                priority
                            />
                        </div>
                    </motion.div>

                    <motion.div className="flex justify-between gap-8 mt-4 md:mt-8" style={{ opacity }}>
                        <ButtonTime label="TIME" onClick={handleShowBio} isSelected={selectedButton === "bio"} />
                        <ButtonTime label="JOGADORES" onClick={handleShowJogadores} isSelected={selectedButton === "jogadores"} />
                    </motion.div>
                </motion.div>
            </motion.div>

            {selectedButton === "jogadores" && (
                <motion.div
                    className="flex flex-col mx-auto pt-[350px] xl:mb-8 2xl:pt-[350px] 2xl:pl-[125px]"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Observe que os botões de setor não estão sendo exibidos, mas a lógica ainda está presente */}
                    <div className="xl:border min-h-screen lg:ml-24 xl:w-[650px] xl:m-auto 2xl:w-[800px] 2xl:pl-5 2xl:mt-4">
                        <Jogador currentTeam={currentTeam}  />
                    </div>
                </motion.div>
            )}

            {selectedButton === "bio" && (
                <motion.div
                    className="flex flex-col max-w-[800px] mx-auto w-full pt-[350px] lg:pt-[350px] xl:w-[650px] xl:pl-12 xl:pt-[420px] 2xl:pt-[360px] 2xl:w-[800px] 2xl:pl-0"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                >
                    <CurrentTime currentTeam={currentTeam} />
                </motion.div>
            )}
        </div>
    )
}