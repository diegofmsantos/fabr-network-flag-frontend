"use client"

import { useParams, useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons"
import { Stats } from "@/components/Stats/Stats"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { useEffect, useState } from "react"
import { JogadorSkeleton } from "@/components/ui/JogadorSkeleton"
import { Loading } from "@/components/ui/Loading"
import PlayerNameHeader from "@/components/Jogador/PlayerNameHeader"
import { SemJogador } from "@/components/SemJogador"
import { getPlayerSlug, getTeamSlug } from "@/utils/formatUrl"
import ShareButton from "@/components/ui/buttonShare"
import { usePlayerDetails, useJogadores } from '@/hooks/queries'
import { useQueryClient } from "@tanstack/react-query"
import { Time } from "@/types/time"
import { Jogador } from "@/types/jogador"

export default function Page() {
    // Hooks de navegação e parâmetros
    const params = useParams()
    const router = useRouter()
    const searchParams = useSearchParams()
    const temporada = searchParams.get('temporada') || '2025'
    const [selectedTemporada, setSelectedTemporada] = useState(temporada);
    const queryClient = useQueryClient();

    // Sincroniza o estado local com a URL quando ela muda
    useEffect(() => {
        if (temporada && temporada !== selectedTemporada) {
            console.log(`Atualizando temporada no estado: ${temporada}`);
            setSelectedTemporada(temporada);
        }
    }, [temporada, selectedTemporada]);

    // Hooks de scroll e transformação
    const { scrollY } = useScroll()
    const opacity = useTransform(scrollY, [0, 200], [1, 0])
    const height = useTransform(scrollY, [0, 200], [340, 50])

    // Fetch de dados
    const { data: jogadores } = useJogadores(selectedTemporada)
    const {
        data: jogadorData,
        isLoading: loading,
        error
    } = usePlayerDetails(
        params.time?.toString(),
        params.jogador?.toString(),
        selectedTemporada
    );

    // Log para debug
    useEffect(() => {
        console.log('Dados do jogador:', jogadorData);
        console.log('Temporada atual:', selectedTemporada);
    }, [jogadorData, selectedTemporada]);

    // Efeito para redirecionamento por ID
    useEffect(() => {
        if (!isNaN(Number(params.jogador)) && jogadores) {
            const jogador = jogadores.find(j => j.id === Number(params.jogador))
            if (jogador) {
                const time = decodeURIComponent(params.time as string)
                const jogadorSlug = getPlayerSlug(jogador.nome)
                router.replace(`/${time}/${jogadorSlug}`)
            }
        }
    }, [params.jogador, params.time, router, jogadores])

    // Efeito para título da página
    useEffect(() => {
        if (jogadorData) {
            document.title = `${jogadorData.jogador.nome} - ${jogadorData.time.nome}`
        }
    }, [jogadorData])

    // Efeito para redirecionamento quando o jogador mudou de time
    useEffect(() => {
        if (jogadorData && jogadorData.jogadorMudouDeTime) {
            // Jogador encontrado, mas em um time diferente - redirecionar para o time correto
            const timeCorretoSlug = getTeamSlug(jogadorData.time.nome);
            const jogadorSlugCorreto = getPlayerSlug(jogadorData.jogador.nome);

            // Redirecionar mantendo o parâmetro de temporada
            const targetUrl = `/${timeCorretoSlug}/${jogadorSlugCorreto}?temporada=${selectedTemporada}`;
            console.log(`Redirecionando para o time correto: ${targetUrl}`);
            router.replace(targetUrl);
        }
    }, [jogadorData, router, selectedTemporada]);

    const getCamisaPath = (jogador: Jogador, currentTeam: Time): string => {
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

    const getLogoPath = (time: Time | undefined): string => {
        if (!time || !time.logo) {
            return '/assets/times/logos/default-logo.png';
        }
        return `/assets/times/logos/${time.logo}`;
    };

    // Tratamento de carregamento e erros
    if (loading) return <Loading />
    if (error) return <div><JogadorSkeleton /><p>Jogador não encontrado ou ocorreu um erro.</p></div>
    if (!jogadorData) return <Loading />
    if (jogadorData.jogador.nome === '') return <div><SemJogador /></div>

    // Desestruturação de dados
    const { jogador: currentJogador, time: currentTime } = jogadorData

    // Funções de utilidade para formatação segura
    const formatNumber = (value: number) => {
        if (typeof value === 'number') {
            return value.toLocaleString('pt-BR');
        }
        return '0';
    };

    // Função para calcular percentuais e médias com segurança
    const calculatePct = (numerator: number = 0, denominator: number = 0): string => {
        if (denominator === 0) return '0%';
        return `${Math.round((numerator / denominator) * 100)}%`;
    }

    const calculateAvg = (total: number = 0, attempts: number = 0): string => {
        if (attempts === 0) return '0';
        return (total / attempts).toFixed(1).replace('.', ',');
    }

    // Caminhos para assets
    const logoPath = getLogoPath(currentTime);

    // Objetos seguros para estatísticas com nova estrutura
    const passe = currentJogador.estatisticas?.passe || {};
    const passeSafe = {
        passes_completos: passe.passes_completos || 0,
        passes_tentados: passe.passes_tentados || 0,
        passes_incompletos: passe.passes_incompletos || 0,
        jds_passe: passe.jds_passe || 0,
        tds_passe: passe.tds_passe || 0,
        passe_xp1: passe.passe_xp1 || 0,
        passe_xp2: passe.passe_xp2 || 0,
        int_sofridas: passe.int_sofridas || 0,
        sacks_sofridos: passe.sacks_sofridos || 0,
        pressao_pct: passe.pressao_pct || 0
    };

    const corrida = currentJogador.estatisticas?.corrida || {};
    const corridaSafe = {
        corridas: corrida.corridas || 0,
        jds_corridas: corrida.jds_corridas || 0,
        tds_corridos: corrida.tds_corridos || 0,
        corrida_xp1: corrida.corrida_xp1 || 0,
        corrida_xp2: corrida.corrida_xp2 || 0
    };

    const recepcao = currentJogador.estatisticas?.recepcao || {};
    const recepcaoSafe = {
        recepcoes: recepcao.recepcoes || 0,
        alvos: recepcao.alvos || 0,
        drops: recepcao.drops || 0,
        jds_recepcao: recepcao.jds_recepcao || 0,
        jds_yac: recepcao.jds_yac || 0,
        tds_recepcao: recepcao.tds_recepcao || 0,
        recepcao_xp1: recepcao.recepcao_xp1 || 0,
        recepcao_xp2: recepcao.recepcao_xp2 || 0
    };

    const defesa = currentJogador.estatisticas?.defesa || {};
    const defesaSafe = {
        tck: defesa.tck || 0,
        tfl: defesa.tfl || 0,
        pressao_pct: defesa.pressao_pct || "0",
        sacks: defesa.sacks || 0,
        tip: defesa.tip || 0,
        int: defesa.int || 0,
        tds_defesa: defesa.tds_defesa || 0,
        defesa_xp2: defesa.defesa_xp2 || 0,
        sft: defesa.sft || 0,
        sft_1: defesa.sft_1 || 0,
        blk: defesa.blk || 0,
        jds_defesa: defesa.jds_defesa || 0
    };

    // Verificar se há estatísticas para exibir
    const temEstatisticasPasse = Object.values(passeSafe).some(val =>
        typeof val === 'number' ? val > 0 : false
    );
    const temEstatisticasCorrida = Object.values(corridaSafe).some(val => val > 0);
    const temEstatisticasRecepcao = Object.values(recepcaoSafe).some(val => val > 0);
    const temEstatisticasDefesa = Object.values(defesaSafe).some(val =>
        typeof val === 'number' ? val > 0 : val !== "0");

    return (
        <AnimatePresence>
            <motion.div
                className="relative min-h-screen pb-16 bg-[#ECECEC] 2xl:ml-32"
                key={currentJogador.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                <button
                    onClick={() => router.back()}
                    className="fixed top-[85px] left-3 rounded-full text-xs text-white p-2 w-8 h-8 flex justify-center items-center
                     bg-black/20 z-[100] lg:left-32 xl:left-[510px] xl:top-3 2xl:left-[720px]"
                >
                    <FontAwesomeIcon icon={faAngleLeft} />
                </button>
                <PlayerNameHeader playerName={currentJogador.nome || ''} />
                <motion.div className='fixed w-full z-20 xl:ml-24 2xl:ml-5' style={{ height }} >
                    <motion.div className='mt-20 px-1 w-full h-full flex flex-col justify-center items-center rounded-b-xl min-[375px]:px-3 md:h-full max-w-[800px] 
                    mx-auto xl:mt-0 xl:w-[650px] 2xl:w-[800px]'
                        style={{ backgroundColor: currentTime?.cor }} >
                        <ShareButton
                            title={currentJogador.nome || ''}
                            variant="player"
                            buttonStyle="fixed"
                            className="lg:right-32 xl:right-[310px] 2xl:right-[430px] xl:top-3"
                        />
                        <motion.div style={{ opacity }} className="w-full max-w-[1200px]">
                            <div className='text-white text-center font-bold text-xs uppercase mb-4'>{currentTime?.nome || ''}</div>
                            <div className='max-w-[800px] flex justify-between px-4 items-center gap-1 min-[375px]:gap-3 md:w-screen md:justify-around 
                            md:items-center md:px-20 xl:max-w-[650px] xl:pr-10'>
                                <div className='flex-2 flex-col justify-center items-center xl:flex-2'>
                                    <div className='text-[28px] text-white font-extrabold italic leading-[35px] tracking-[-2px] min-[375px]:text-[27px] 
                                    min-[425px]:text-[30px] md:text-[40px] lg:text-5xl xl:text-4xl'>
                                        {(currentJogador.nome || '').toLocaleUpperCase()}
                                    </div>
                                    <div className="text-[28px] text-gray-400 font-extrabold italic leading-[35px] tracking-[-2px] min-[375px]:text-[27px] 
                                    min-[425px]:text-[30px] md:text-[40px] lg:text-5xl xl:text-4xl"># {currentJogador.numero}</div>
                                    <div className='-mt-5'>
                                        <Image
                                            src={logoPath}
                                            alt='logo'
                                            width={100}
                                            height={100}
                                            quality={100}
                                            priority
                                            onError={(e) => {
                                                console.warn(`Erro ao carregar logo: ${logoPath}`);
                                                (e.target as HTMLImageElement).src = '/assets/times/logos/default-logo.png';
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className='flex-2 justify-center items-center xl:flex-1'>
                                    <Image
                                        src={getCamisaPath(currentJogador, currentTime)}
                                        alt={`${currentTime?.nome || ''} camisa`}
                                        width={200}
                                        height={250}
                                        quality={100}
                                        className="w-28 h-60 ml-auto xl:w-[100px] xl:h-[260px]"
                                        priority
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>

                <motion.div
                    className='p-4 flex flex-col gap-8 pt-[440px] md:pt-[450px] z-10 relative xl:pt-[370px] xl:ml-44'
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                >


                    {/* Estatísticas de Passe */}
                    {temEstatisticasPasse && (
                        <div className='lg:max-w-[800px] lg:min-w-[800px] lg:m-auto xl:min-w-[650px] 2xl:min-w-[800px]'>
                            <div className="border py-2 px-3 font-extrabold text-white text-xs w-36 flex justify-center items-center rounded-md mb-3"
                                style={{ backgroundColor: currentTime?.cor }}>PASSANDO</div>
                            <div className="bg-white flex flex-col justify-start gap-4 p-4 rounded-lg lg:p-6">
                                <Stats
                                    label1='COMPLETOS/TENTADOS'
                                    label2={`${passeSafe.passes_completos}/${passeSafe.passes_tentados}`}
                                    label3='INCOMPLETOS'
                                    label4={passeSafe.passes_incompletos}
                                />
                                <Stats
                                    label1='COMPLETOS(%)'
                                    label2={calculatePct(passeSafe.passes_completos, passeSafe.passes_tentados)}
                                    label3='JARDAS'
                                    label4={passeSafe.jds_passe}
                                />
                                <Stats
                                    label1='JARDAS (AVG)'
                                    label2={calculateAvg(passeSafe.jds_passe, passeSafe.passes_tentados)}
                                    label3='TOUCHDOWNS'
                                    label4={passeSafe.tds_passe}
                                />
                                <Stats
                                    label1='CONVERSÃO(1-PT)'
                                    label2={passeSafe.passe_xp1}
                                    label3='CONVERSÃO(2-PT)'
                                    label4={passeSafe.passe_xp2}
                                />
                                <Stats
                                    label1='INTERCEPTAÇÕES'
                                    label2={passeSafe.int_sofridas}
                                    label3='SACKS'
                                    label4={passeSafe.sacks_sofridos}
                                />
                                <Stats
                                    label1='PRESSÕES(%)'
                                    label2={passeSafe.pressao_pct}
                                    label3='PONTOS'
                                    label4={(passeSafe.tds_passe * 6 + passeSafe.passe_xp1 + passeSafe.passe_xp1)}
                                    noBorder
                                />
                            </div>
                        </div>
                    )}

                    {/* Estatísticas de Corrida */}
                    {temEstatisticasCorrida && (
                        <div className='lg:max-w-[800px] lg:min-w-[800px] lg:m-auto xl:min-w-[650px] 2xl:min-w-[800px]'>
                            <div className="border py-2 px-3 font-extrabold text-white text-xs w-36 flex justify-center items-center rounded-md mb-3"
                                style={{ backgroundColor: currentTime?.cor }}>CORRENDO</div>
                            <div className="bg-white flex flex-col gap-4 p-4 rounded-lg">
                                <Stats
                                    label1='CORRIDAS'
                                    label2={corridaSafe.corridas}
                                    label3='JARDAS'
                                    label4={corridaSafe.jds_corridas}
                                />
                                <Stats
                                    label1='JARDAS (AVG)'
                                    label2={calculateAvg(corridaSafe.jds_corridas, corridaSafe.corridas)}
                                    label3='TOUCHDOWNS'
                                    label4={corridaSafe.tds_corridos}
                                />
                                <Stats
                                    label1='CONVERSÃO(1-PT)'
                                    label2={corridaSafe.corrida_xp1}
                                    label3='CONVERSÃO(2-PT)'
                                    label4={corridaSafe.corrida_xp2}
                                />
                                <Stats
                                    label1='PONTOS'
                                    label2={(corridaSafe.tds_corridos * 6 + corridaSafe.corrida_xp1 + corridaSafe.corrida_xp1)}
                                    noBorder
                                />
                            </div>
                        </div>
                    )}

                    {/* Estatísticas de Recepção */}
                    {temEstatisticasRecepcao && (
                        <div className='lg:max-w-[800px] lg:min-w-[800px] lg:m-auto xl:min-w-[650px] 2xl:min-w-[800px]'>
                            <div className="border py-2 px-3 font-extrabold text-white text-xs w-36 flex justify-center items-center rounded-md mb-3"
                                style={{ backgroundColor: currentTime?.cor }}>RECEBENDO</div>
                            <div className="bg-white flex flex-col gap-4 p-4 rounded-lg">
                                <Stats
                                    label1='RECEPÇÕES/ALVOS'
                                    label2={`${recepcaoSafe.recepcoes}/${recepcaoSafe.alvos}`}
                                    label3='DROPS'
                                    label4={recepcaoSafe.drops}
                                />
                                <Stats
                                    label1='RECEPÇÕES(%)'
                                    label2={calculatePct(recepcaoSafe.recepcoes, recepcaoSafe.alvos)}
                                    label3='JARDAS TOTAIS'
                                    label4={recepcaoSafe.jds_recepcao}
                                />
                                <Stats
                                    label1='JARDAS (AVG)'
                                    label2={calculateAvg(recepcaoSafe.jds_recepcao, recepcaoSafe.alvos)}
                                    label3='JARDAS (YAC)'
                                    label4={recepcaoSafe.jds_yac}
                                />
                                <Stats
                                    label1='TOUCHDOWNS'
                                    label2={recepcaoSafe.tds_recepcao}
                                    label3='CONVERSÃO(1-PT)'
                                    label4={recepcaoSafe.recepcao_xp1}
                                />
                                <Stats
                                    label1='CONVERSÃO(2-PT)'
                                    label2={recepcaoSafe.recepcao_xp2}
                                    label3='PONTOS'
                                    label4={(recepcaoSafe.tds_recepcao * 6 + recepcaoSafe.recepcao_xp1 + recepcaoSafe.recepcao_xp1)}
                                    noBorder
                                />
                            </div>
                        </div>
                    )}

                    {/* Estatísticas de Defesa */}
                    {temEstatisticasDefesa && (
                        <div className='lg:max-w-[800px] lg:min-w-[800px] lg:m-auto xl:min-w-[650px] 2xl:min-w-[800px]'>
                            <div className="border py-2 px-3 font-extrabold text-white text-xs w-36 flex justify-center items-center rounded-md mb-3"
                                style={{ backgroundColor: currentTime?.cor }}>DEFENDENDO</div>
                            <div className="bg-white flex flex-col gap-4 p-4 rounded-lg">
                                <Stats
                                    label1='TACKLES'
                                    label2={defesaSafe.tck}
                                    label3='TACKLES FOR LOSS'
                                    label4={defesaSafe.tfl}
                                />
                                <Stats
                                    label1='SACKS'
                                    label2={defesaSafe.sacks}
                                    label3='BLOQUEIOS'
                                    label4={defesaSafe.blk}
                                />
                                <Stats
                                    label1='PASSES DESVIADOS'
                                    label2={defesaSafe.tip}
                                    label3='INTERCEPTAÇÕES'
                                    label4={defesaSafe.int}
                                />
                                <Stats
                                    label1='TOUCHDOWNS'
                                    label2={defesaSafe.tds_defesa}
                                    label3='JARDAS'
                                    label4={defesaSafe.jds_defesa}
                                />
                                <Stats
                                    label1='SAFETY(1-PT)'
                                    label2={defesaSafe.sft_1}
                                    label3='SAFETY(2-PT)'
                                    label4={defesaSafe.sft}
                                />
                                <Stats
                                    label1='RETORNO(2-PT)'
                                    label2={defesaSafe.defesa_xp2}
                                    label3='PRESSÃO(%)'
                                    label4={defesaSafe.pressao_pct}
                                    noBorder
                                />
                            </div>
                        </div>
                    )}

                    {/* Mensagem se não tiver estatísticas */}
                    {!temEstatisticasPasse && !temEstatisticasCorrida && !temEstatisticasRecepcao && !temEstatisticasDefesa && (
                        <div className='lg:max-w-[800px] lg:min-w-[800px] lg:m-auto xl:min-w-[650px] 2xl:min-w-[800px]'>
                            <div className="bg-white flex flex-col justify-center items-center p-8 rounded-lg">
                                <p className="text-lg font-semibold">Este jogador ainda não possui estatísticas registradas.</p>
                            </div>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}