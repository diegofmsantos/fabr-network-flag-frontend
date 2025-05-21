"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useTimes } from '@/hooks/queries'
import { Loading } from "./ui/Loading"
import { useSearchParams, useRouter } from "next/navigation"
import { Time } from "@/types/time"

interface ListaProps {
  temporadaDefault?: string;
}

// Define region types with their colors
interface Regiao {
  id: string;
  name: string;
  icon: string; // Path to region icon
  color: string;
}

// All regions with their data
const regioes: Regiao[] = [
  { id: 'sul', name: 'Sul', icon: '/assets/sul.png', color: '#0088FF' },
  { id: 'sudeste', name: 'Sudeste', icon: '/assets/sudeste.png', color: '#FF0000' },
  { id: 'nordeste', name: 'Nordeste', icon: '/assets/nordeste.png', color: '#FFA500' },
  { id: 'norte', name: 'Norte', icon: '/assets/norte.png', color: '#00AA00' },
  { id: 'centro-oeste', name: 'Centro-Oeste', icon: '/assets/centro-oeste.png', color: '#FFDD00' },
];

export const Lista = ({ temporadaDefault = '2025' }: ListaProps) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [lastClicked, setLastClicked] = useState<string | null>(null)
    const [selectedTemporada, setSelectedTemporada] = useState(searchParams?.get('temporada') || temporadaDefault)
    const [expandedRegion, setExpandedRegion] = useState<string | null>(null)
    const { data: times, isLoading, error } = useTimes(selectedTemporada)

    // Animation variants for teams
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    }

    // Animation variants for regions
    const regionVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    }
    
    // Animation variants for team grid
    const gridVariants = {
        hidden: { opacity: 0, height: 0, marginTop: 0 },
        visible: { 
            opacity: 1, 
            height: 'auto', 
            marginTop: 16,
            transition: { 
                duration: 0.3,
                staggerChildren: 0.05
            } 
        },
        exit: { 
            opacity: 0, 
            height: 0,
            marginTop: 0,
            transition: { 
                duration: 0.2,
                when: "afterChildren" 
            }
        }
    }

    useEffect(() => {
        const stored = localStorage.getItem('lastClickedTeam')
        if (stored) {
            setLastClicked(stored)
        }
    }, [])

    // Effect for monitoring URL changes
    useEffect(() => {
        const tempParam = searchParams?.get('temporada')
        const regionParam = searchParams?.get('regiao')
        
        if (tempParam) {
            console.log(`Temporada parameter detected: ${tempParam}`)
            setSelectedTemporada(tempParam)
        } else {
            console.log(`No temporada parameter, using default: ${temporadaDefault}`)
            setSelectedTemporada(temporadaDefault)
        }

        if (regionParam) {
            setExpandedRegion(regionParam)
        }
    }, [searchParams, temporadaDefault])

    const handleClick = (teamName: string) => {
        localStorage.setItem('lastClickedTeam', teamName)
        setLastClicked(teamName)
    }

    const handleTemporadaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const novaTemporada = e.target.value
        console.log(`Changing temporada to: ${novaTemporada}`)

        // Update local state
        setSelectedTemporada(novaTemporada)

        // Create updated URL params
        const params = new URLSearchParams(searchParams?.toString() || '')
        
        if (novaTemporada === temporadaDefault) {
            params.delete('temporada')
        } else {
            params.set('temporada', novaTemporada)
        }

        // Keep region parameter if it exists
        if (expandedRegion) {
            params.set('regiao', expandedRegion)
        }

        // Update URL
        const queryString = params.toString() ? `?${params.toString()}` : ''
        router.replace(`/${queryString}`, { scroll: false })
    }

    // Handler for selecting a region
    const handleRegionSelect = (regionId: string) => {
        if (expandedRegion === regionId) {
            // If clicking the same region, collapse it
            setExpandedRegion(null)
            
            // Update URL - remove region param
            const params = new URLSearchParams(searchParams?.toString() || '')
            params.delete('regiao')
            const queryString = params.toString() ? `?${params.toString()}` : ''
            router.replace(`/${queryString}`, { scroll: false })
        } else {
            // Expand the new region
            setExpandedRegion(regionId)
            
            // Update URL with new region
            const params = new URLSearchParams(searchParams?.toString() || '')
            params.set('regiao', regionId)
            const queryString = params.toString() ? `?${params.toString()}` : ''
            router.replace(`/${queryString}`, { scroll: false })
        }
    }

    // Filter teams by region
    const getTeamsByRegion = (regionId: string): Time[] => {
        if (!times || times.length === 0) return []
        
        return times.filter(team => 
            team.regiao?.toLowerCase() === regionId.toLowerCase()
        ).sort((a, b) => (a.sigla ?? "").localeCompare(b.sigla ?? ""))
    }

    if (isLoading) return <div className="text-center text-gray-500 pt-56 lg:pt-32"><Loading /></div>
    if (error) return <div className="text-center text-gray-500 pt-56 lg:pt-32">Erro ao carregar times.</div>
    if (!times || times.length === 0) return <div className="text-center text-gray-500 pt-56 lg:pt-32">Nenhum time encontrado para a temporada {selectedTemporada}.</div>

    return (
        <div className="flex flex-col w-full">
           
            <div className="pt-[100px] px-4 container mx-auto max-w-[800px] lg:ml-32 xl:ml-64 2xl:ml-96">
                <motion.h2 
                    className="text-[53px] font-extrabold text-[#18187c] italic text-left mb-8 tracking-[-5px] leading-[55px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    SELECIONE A REGIÃO
                </motion.h2>
                
                <motion.div 
                    className="grid gap-4"
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                >
                    {regioes.map((regiao) => {
                        const regionTeams = getTeamsByRegion(regiao.id);
                        const isExpanded = expandedRegion === regiao.id;
                        
                        return (
                            <div key={regiao.id} className="region-container">
                                <motion.div 
                                    variants={regionVariants}
                                    onClick={() => handleRegionSelect(regiao.id)}
                                    className="bg-white rounded-lg p-4 flex items-center gap-4 cursor-pointer
                                                hover:shadow-md transition-all duration-300 border-l-4"
                                    style={{ 
                                        borderLeftColor: regiao.color,
                                        borderLeftWidth: isExpanded ? '8px' : '4px'
                                    }}
                                >
                                    <div className="w-16 h-16 flex-shrink-0">
                                        <Image 
                                            src={regiao.icon} 
                                            alt={regiao.name} 
                                            width={60} 
                                            height={60} 
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                // Fallback if image doesn't exist
                                                const target = e.target as HTMLImageElement;
                                                target.src = "/assets/image.png";
                                            }}
                                        />
                                    </div>
                                    <span className="text-2xl italic font-extrabold tracking-[-1px]">{regiao.name.toUpperCase()}</span>
                                    <div className="ml-auto text-gray-400">
                                        {isExpanded ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        )}
                                    </div>
                                </motion.div>
                                
                                {/* Team Grid for this Region - Only show if expanded */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            className="grid grid-cols-3 gap-4 px-2 py-4 relative border-l-4 ml-2 pl-2
                                                      min-[400px]:grid-cols-4 md:grid-cols-5 md:gap-5"
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            variants={gridVariants}
                                            key={`grid-${regiao.id}-${selectedTemporada}`}
                                            style={{ borderLeftColor: regiao.color }}
                                        >
                                            {regionTeams.length > 0 ? (
                                                regionTeams.map((item) => (
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
                                                                // Prevent default behavior
                                                                e.preventDefault()

                                                                // Save last click normally
                                                                if (item.nome) handleClick(item.nome)

                                                                // Navigate manually with the full URL including season
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
                                                            <div className="relative text-center font-extrabold italic z-10 min-[320px]:text-[22px] min-[400px]:text-[24px] md:text-[40px]">
                                                                <div className="tracking-[-2px]">{item.sigla ?? "N/A"}</div>
                                                                <div className="flex flex-col justify-center items-center gap-2 min-h-28 p-2 min-[400px]:-mt-3">
                                                                    <Image
                                                                        src={`/assets/times/logos/${item.logo}`}
                                                                        alt="Logo"
                                                                        width={80}
                                                                        height={80}
                                                                        quality={100}
                                                                        priority
                                                                        className="w-20 h-20 md:w-24 md:h-24"
                                                                        style={{ imageRendering: 'crisp-edges', WebkitFontSmoothing: 'antialiased', objectFit: 'contain' }}
                                                                        onError={(e) => {
                                                                            const target = e.target as HTMLImageElement;
                                                                            target.src = "/assets/times/logos/default-logo.png";
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </motion.div>
                                                ))
                                            ) : (
                                                <div className="col-span-full text-center py-4">
                                                    <p className="text-lg font-medium text-gray-600">Nenhum time encontrado para esta região na temporada {selectedTemporada}.</p>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    )
}