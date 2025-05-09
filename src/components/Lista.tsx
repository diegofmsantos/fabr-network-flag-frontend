"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useTimes } from '@/hooks/queries'
import { Loading } from "./ui/Loading"
import { useSearchParams, useRouter } from "next/navigation"

export const Lista = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [lastClicked, setLastClicked] = useState<string | null>(null)
    const [selectedTemporada, setSelectedTemporada] = useState(searchParams?.get('temporada') || '2024')
    const { data: times, isLoading, error } = useTimes(selectedTemporada)

    const itemVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
    }

    useEffect(() => {
        const stored = localStorage.getItem('lastClickedTeam')
        if (stored) {
            setLastClicked(stored)
        }
    }, [])

    // Efeito para monitorar mudanças na URL
    useEffect(() => {
        const tempParam = searchParams?.get('temporada')
        if (tempParam) {
            console.log(`Parâmetro de temporada detectado: ${tempParam}`)
            setSelectedTemporada(tempParam)
        } else {
            console.log('Nenhum parâmetro de temporada, usando padrão: 2024')
            setSelectedTemporada('2024')
        }
    }, [searchParams])

    const handleClick = (teamName: string) => {
        localStorage.setItem('lastClickedTeam', teamName)
        setLastClicked(teamName)
    }

    const handleTemporadaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const novaTemporada = e.target.value
        console.log(`Alterando temporada para: ${novaTemporada}`)

        // Atualizar estado local
        setSelectedTemporada(novaTemporada)

        // Manipular a URL manualmente
        if (novaTemporada === '2024') {
            console.log('Removendo parâmetro de temporada da URL (2024 é padrão)')
            router.replace('/', { scroll: false })
        } else {
            console.log(`Adicionando temporada=${novaTemporada} à URL`)
            router.replace(`/?temporada=${novaTemporada}`, { scroll: false })
        }
    }

    if (isLoading) return <div className="text-center text-gray-500 pt-56 lg:pt-32"><Loading /></div>
    if (error) return <div className="text-center text-gray-500 pt-56 lg:pt-32">Erro ao carregar times.</div>
    if (!times || times.length === 0) return <div className="text-center text-gray-500 pt-56 lg:pt-32">Nenhum time encontrado para a temporada {selectedTemporada}.</div>

    return (
        <div className="flex flex-col w-full">
            {/* Seção de filtro por temporada - usando select nativo */}
            <div className="fixed top-[210px] left-0 right-0 z-30 bg-[#ECECEC] py-4 md:top-[158px] lg:ml-9 xl:ml-72 xl:top-24">
                <div className="max-w-[800px] mx-auto">
                    <div className="flex flex-col items-center px-4 w-full xl:ml-8 2xl:ml-0">
                        <label className="text-xs font-medium mb-1 text-gray-700">TEMPORADA</label>
                        <select
                            value={selectedTemporada}
                            onChange={handleTemporadaChange}
                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-md 
                                       focus:ring-blue-500 focus:border-blue-500 block py-2 w-full text-center 
                                       lg:max-w-[800px] 2xl:max-w-[800px]"
                        >
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Grid de times */}
            <motion.div
                className="max-w-[800px] grid grid-cols-3 gap-4 px-3 pt-[320px] pb-20 container bg-[#ECECEC] relative 
                min-[400px]:grid-cols-4 md:grid-cols-5 md:pt-[260px] md:gap-5 lg:ml-32 xl:pt-[210px] xl:ml-64 2xl:ml-96"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                key={`grid-temporada-${selectedTemporada}`}
            >
                {times
                    .sort((a, b) => (a.sigla ?? "").localeCompare(b.sigla ?? ""))
                    .map((item) => (
                        <motion.div
                            key={`${item.id}-${selectedTemporada}`}
                            variants={itemVariants}
                            className="relative border border-gray-300 rounded-lg overflow-hidden group"
                        >
                            <Link
                                href={{
                                    pathname: `/${item.nome || ''}`,
                                    query: { temporada: selectedTemporada }
                                }}
                                className="relative z-20 block"
                                onClick={(e) => {
                                    // Prevenimos o comportamento padrão
                                    e.preventDefault()

                                    // Salvamos o último clique normalmente
                                    if (item.nome) handleClick(item.nome)

                                    // Navegamos manualmente com a URL completa incluindo a temporada
                                    const url = `/${item.nome}?temporada=${selectedTemporada}`
                                    window.location.href = url
                                }}
                            >
                                <div
                                    className={`absolute inset-0 transition-opacity ${lastClicked === item.nome
                                        ? 'opacity-50'
                                        : 'opacity-0 group-hover:opacity-50'
                                        }`}
                                    style={{ backgroundColor: item.cor ?? "#000" }}
                                ></div>
                                <div className="relative text-center font-extrabold italic z-10 min-[320px]:text-[28px] min-[400px]:text-[31px] md:text-[40px] xl:text-[45px]">
                                    <div className="tracking-[-3px]">{item.sigla ?? "N/A"}</div>
                                    <div className="flex flex-col -mt-4 justify-center items-center gap-2 min-h-28 p-2 min-[400px]:-mt-5">
                                        <Image
                                            src={`/assets/times/capacetes/${item.capacete}`}
                                            alt="Capacete"
                                            width={90}
                                            height={90}
                                            quality={100}
                                            priority
                                            className="w-24 h-14 rotate-12 md:h-16 md:mt-2"
                                            style={{ imageRendering: 'crisp-edges', WebkitFontSmoothing: 'antialiased', objectFit: 'contain' }}
                                        />

                                        <Image
                                            src={`/assets/times/logos/${item.logo}`}
                                            alt="Logo"
                                            width={35}
                                            height={35}
                                            quality={100}
                                            priority
                                            className="md:w-14"
                                            style={{ imageRendering: 'crisp-edges', WebkitFontSmoothing: 'antialiased' }}
                                        />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
            </motion.div>
        </div>
    )
}