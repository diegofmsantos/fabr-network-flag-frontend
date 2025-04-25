"use client"

import { useParams, useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import { Stats } from "@/components/Stats/Stats"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { useEffect, useState } from "react"
import { JogadorSkeleton } from "@/components/ui/JogadorSkeleton"
import { Loading } from "@/components/ui/Loading"
import { SelectFilter } from "@/components/SelectFilter"
import PlayerNameHeader from "@/components/Jogador/PlayerNameHeader"
import { SemJogador } from "@/components/SemJogador"
import { getPlayerSlug, getTeamSlug } from "@/utils/formatUrl"
import ShareButton from "@/components/ui/buttonShare"
import { usePlayerDetails, useJogadores } from '@/hooks/queries'
import { useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/hooks/queryKeys"
import { Time } from "@/types/time"
import { Jogador } from "@/types/jogador"

export default function Page() {
    // Hooks de navegação e parâmetros
    const params = useParams()
    const router = useRouter()
    const searchParams = useSearchParams()
    const temporada = searchParams.get('temporada') || '2024'
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
            return '/assets/times/camisas/camisa-default.png';
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

    const calcularExperiencia = (anoInicio: number) => {
        if (!anoInicio) return 0;
        const anoAtual = new Date().getFullYear();
        return anoAtual - anoInicio;
    };

    const experienciaAnos = calcularExperiencia(currentJogador.experiencia);

    // Caminhos para assets
    const logoPath = getLogoPath(currentTime);

    // Objetos seguros para estatísticas
    const passe = currentJogador.estatisticas?.passe || {};
    const passeSafe = {
        passes_completos: passe.passes_completos || 0,
        passes_tentados: passe.passes_tentados || 0,
        jardas_de_passe: passe.jardas_de_passe || 0,
        td_passados: passe.td_passados || 0,
        interceptacoes_sofridas: passe.interceptacoes_sofridas || 0,
        sacks_sofridos: passe.sacks_sofridos || 0,
        fumble_de_passador: passe.fumble_de_passador || 0
    };

    const corrida = currentJogador.estatisticas?.corrida || {};
    const corridaSafe = {
        corridas: corrida.corridas || 0,
        jardas_corridas: corrida.jardas_corridas || 0,
        tds_corridos: corrida.tds_corridos || 0,
        fumble_de_corredor: corrida.fumble_de_corredor || 0
    };

    const recepcao = currentJogador.estatisticas?.recepcao || {};
    const recepcaoSafe = {
        recepcoes: recepcao.recepcoes || 0,
        alvo: recepcao.alvo || 0,
        jardas_recebidas: recepcao.jardas_recebidas || 0,
        tds_recebidos: recepcao.tds_recebidos || 0
    };

    const retorno = currentJogador.estatisticas?.retorno || {};
    const retornoSafe = {
        retornos: retorno.retornos || 0,
        jardas_retornadas: retorno.jardas_retornadas || 0,
        td_retornados: retorno.td_retornados || 0
    };

    const defesa = currentJogador.estatisticas?.defesa || {};
    const defesaSafe = {
        tackles_totais: defesa.tackles_totais || 0,
        tackles_for_loss: defesa.tackles_for_loss || 0,
        sacks_forcado: defesa.sacks_forcado || 0,
        fumble_forcado: defesa.fumble_forcado || 0,
        interceptacao_forcada: defesa.interceptacao_forcada || 0,
        passe_desviado: defesa.passe_desviado || 0,
        safety: defesa.safety || 0,
        td_defensivo: defesa.td_defensivo || 0
    };

    const kicker = currentJogador.estatisticas?.kicker || {};
    const kickerSafe = {
        xp_bons: kicker.xp_bons || 0,
        tentativas_de_xp: kicker.tentativas_de_xp || 0,
        fg_bons: kicker.fg_bons || 0,
        tentativas_de_fg: kicker.tentativas_de_fg || 0,
        fg_mais_longo: kicker.fg_mais_longo || 0
    };

    const punter = currentJogador.estatisticas?.punter || {};
    const punterSafe = {
        punts: punter.punts || 0,
        jardas_de_punt: punter.jardas_de_punt || 0
    };

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
                            <div className='max-w-[800px] flex justify-center items-end gap-1 min-[375px]:gap-3 md:w-screen md:justify-around 
                            md:items-center md:px-20 xl:max-w-[650px] xl:pl-8 xl:pr-20'>
                                <div className='flex-1 flex-col items-start xl:flex-2'>
                                    <div className='text-[28px] text-white font-extrabold italic leading-[35px] tracking-[-2px] min-[375px]:text-[27px] 
                                    min-[425px]:text-[30px] md:text-[40px] lg:text-5xl xl:text-4xl'>
                                        {(currentJogador.nome || '').toLocaleUpperCase()}
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <div className='text-[34px] text-[#D9D9D9] text-center px-2 font-extrabold italic tracking-[-3px] md:text-4xl'>
                                            {currentJogador.posicao || ''}
                                        </div>
                                        <div className="w-8">
                                            {currentJogador.nacionalidade && (
                                                <Image
                                                    src={`/assets/bandeiras/${currentJogador.nacionalidade}`}
                                                    alt='logo-bandeira'
                                                    width={40}
                                                    height={40}
                                                    quality={100}
                                                    className="w-auto h-auto"
                                                    onError={(e) => {
                                                        console.warn(`Erro ao carregar bandeira: ${currentJogador.nacionalidade}`);
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
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
                                        className="w-48 h-60 ml-auto"
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
                    <div className="w-full bg-[#ECECEC] flex flex-col justify-center items-center">
                        <div className="w-full flex justify-center">
                            <SelectFilter
                                label="TEMPORADA"
                                value={selectedTemporada}
                                onChange={(novaTemporada) => {
                                    // Force a limpeza do cache e refetch
                                    queryClient.invalidateQueries({ queryKey: queryKeys.jogadores(selectedTemporada) });
                                    queryClient.invalidateQueries({ queryKey: queryKeys.times(selectedTemporada) });

                                    console.log(`Alterando temporada para: ${novaTemporada}`);
                                    setSelectedTemporada(novaTemporada);

                                    // Constrói a URL com base no slug do time e jogador atual
                                    const timeSlug = getTeamSlug(currentTime.nome || '');
                                    const jogadorSlug = getPlayerSlug(currentJogador.nome || '');

                                    router.replace(`/${timeSlug}/${jogadorSlug}?temporada=${novaTemporada}`);
                                }}
                                options={[
                                    { label: '2024', value: '2024' },
                                    { label: '2025', value: '2025' }
                                ]}
                            />
                        </div>
                    </div>
                    <div className='-mt-4 lg:max-w-[800px] lg:min-w-[800px] lg:m-auto xl:min-w-[650px] 2xl:min-w-[800px]'>
                        <div className="border py-2 px-3 font-extrabold text-white text-xs w-16 flex justify-center items-center rounded-md mb-3"
                            style={{ backgroundColor: currentTime?.cor }}>BIO</div>
                        <div className="bg-white flex flex-col justify-center gap-4 p-4 rounded-lg">
                            <div className="border-b border-bg-[#D9D9D9] flex justify-between">
                                <div className='flex flex-col justify-center items-center'>
                                    <div className="text-sm md:text-lg">IDADE</div>
                                    <div className="text-[34px] font-extrabold italic mb-1">{currentJogador.idade || 0}</div>
                                </div>
                                <div className='flex flex-col justify-center items-center'>
                                    <div className="text-sm md:text-lg">PESO</div>
                                    <div className="text-[34px] font-extrabold italic mb-1">{currentJogador.peso || 0}</div>
                                </div>
                                <div className='flex flex-col justify-center items-center'>
                                    <div className="text-sm md:text-lg">ALTURA</div>
                                    <div className="text-[34px] font-extrabold italic mb-1">
                                        {(currentJogador.altura || 0).toFixed(2).replace('.', ',')}
                                    </div>
                                </div>
                            </div>
                            <div className="border-b border-bg-[#D9D9D9] flex justify-start">
                                <div className='flex-1 justify-start'>
                                    <div className="text-sm md:text-lg">CIDADE NATAL</div>
                                    <div className="text-xl font-extrabold italic mb-1">
                                        {(currentJogador?.cidade || '').toLocaleUpperCase()}
                                    </div>
                                </div>
                            </div>
                            <div className='border-b border-bg-[#D9D9D9] flex-1 justify-start'>
                                <div className="text-sm md:text-lg">TIME FORMADOR</div>
                                <div className='flex items-center'>
                                    <div className="text-xl font-extrabold italic">
                                        {(currentJogador.timeFormador || '').toLocaleUpperCase()}
                                    </div>
                                </div>
                            </div>
                            <div className='border-b border-bg-[#D9D9D9] flex justify-start'>
                                <div className='flex-1 justify-start'>
                                    <div className="text-sm md:text-lg">EXPERIÊNCIA</div>
                                    <div className="text-xl font-extrabold italic md:text-lg">{experienciaAnos} ANO{experienciaAnos > 1 ? 'S' : ''}</div>
                                </div>
                            </div>
                            <div className='flex justify-start'>
                                <div className='flex-1 justify-start'>
                                    <div className="text-sm md:text-lg">INSTAGRAM</div>
                                    <div className="text-lg font-extrabold italic underline text-blue-800">
                                        <Link href={currentJogador.instagram || '#'} target='blank'>
                                            {(currentJogador.instagram2 || '').toLocaleUpperCase()}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {currentJogador.estatisticas?.passe &&
                        (
                            passeSafe.passes_completos > 0 ||
                            passeSafe.jardas_de_passe > 0 ||
                            passeSafe.td_passados > 0 ||
                            passeSafe.interceptacoes_sofridas > 0 ||
                            passeSafe.sacks_sofridos > 0 ||
                            passeSafe.fumble_de_passador > 0
                        ) && (
                            <div className='lg:max-w-[800px] lg:min-w-[800px] lg:m-auto xl:min-w-[650px] 2xl:min-w-[800px]'>
                                <div className="border py-2 px-3 font-extrabold text-white text-xs w-36 flex justify-center items-center rounded-md mb-3"
                                    style={{ backgroundColor: currentTime?.cor }}>STATS (PASSE)
                                </div>
                                <div className="bg-white flex flex-col justify-start gap-4 p-4 rounded-lg lg:p-6">
                                    <Stats
                                        label1='PASSES(COMP/TENT)'
                                        label2={`${passeSafe.passes_completos}/${passeSafe.passes_tentados}`}
                                        label3='PASSES(%)'
                                        label4={passeSafe.passes_tentados > 0
                                            ? ((passeSafe.passes_completos / passeSafe.passes_tentados) * 100)
                                                .toFixed(0).replace('.', ',') + '%'
                                            : '0%'}
                                    />
                                    <Stats
                                        label1='JARDAS (TOTAIS)'
                                        label2={formatNumber(passeSafe.jardas_de_passe)}
                                        label3='JARDAS (AVG)'
                                        label4={passeSafe.passes_tentados > 0
                                            ? (passeSafe.jardas_de_passe / passeSafe.passes_tentados)
                                                .toFixed(1).replace('.', ',')
                                            : '0,0'}
                                    />
                                    <Stats
                                        label1='TOUCHDOWNS'
                                        label2={passeSafe.td_passados}
                                        label3='INTERCEPTAÇÕES'
                                        label4={passeSafe.interceptacoes_sofridas}
                                    />
                                    <Stats
                                        label1='SACKS'
                                        label2={passeSafe.sacks_sofridos}
                                        label3='FUMBLES'
                                        label4={passeSafe.fumble_de_passador}
                                        noBorder
                                    />
                                </div>
                            </div>
                        )
                    }

                    {currentJogador.estatisticas?.corrida &&
                        (
                            corridaSafe.corridas > 0 ||
                            corridaSafe.jardas_corridas > 0 ||
                            corridaSafe.tds_corridos > 0 ||
                            corridaSafe.fumble_de_corredor > 0
                        ) && (
                            <div className='lg:max-w-[800px] lg:min-w-[800px] lg:m-auto xl:min-w-[650px] 2xl:min-w-[800px]'>
                                <div
                                    className="border py-2 px-3 font-extrabold text-white text-xs w-36 flex justify-center items-center rounded-md mb-3"
                                    style={{ backgroundColor: currentTime?.cor }}
                                >
                                    STATS (CORRIDA)
                                </div>
                                <div className="bg-white flex flex-col gap-4 p-4 rounded-lg">
                                    <Stats
                                        label1='CORRIDAS'
                                        label2={`${corridaSafe.corridas}`}
                                        label3='JARDAS (TOTAIS)'
                                        label4={`${corridaSafe.jardas_corridas}`}
                                    />
                                    <Stats
                                        label1='JARDAS (AVG)'
                                        label2={corridaSafe.corridas > 0
                                            ? (corridaSafe.jardas_corridas / corridaSafe.corridas)
                                                .toFixed(1).replace('.', ',')
                                            : '0,0'}
                                        label3='TOUCHDOWNS'
                                        label4={corridaSafe.tds_corridos}
                                    />
                                    <Stats
                                        label1='FUMBLES'
                                        label2={corridaSafe.fumble_de_corredor}
                                        noBorder
                                    />
                                </div>
                            </div>
                        )
                    }

                    {currentJogador.estatisticas?.recepcao &&
                        (
                            recepcaoSafe.jardas_recebidas > 0 ||
                            recepcaoSafe.recepcoes > 0 ||
                            recepcaoSafe.alvo > 0
                        ) && (
                            <div className='lg:max-w-[800px] lg:min-w-[800px] lg:m-auto xl:min-w-[650px] 2xl:min-w-[800px]'>
                                <div className="border py-2 px-3 font-extrabold text-white text-xs w-36 flex justify-center items-center rounded-md mb-3"
                                    style={{ backgroundColor: currentTime?.cor }}>STATS (RECEPÇÃO)
                                </div>
                                <div className="bg-white flex flex-col gap-4 p-4 rounded-lg">
                                    <Stats
                                        label1='RECEPÇÕES'
                                        label2={`${recepcaoSafe.recepcoes}/${recepcaoSafe.alvo}`}
                                        label3='JARDAS (TOTAIS)'
                                        label4={`${recepcaoSafe.jardas_recebidas}`}
                                    />
                                    <Stats
                                        label1='JARDAS (AVG)'
                                        label2={recepcaoSafe.alvo > 0
                                            ? (recepcaoSafe.jardas_recebidas / recepcaoSafe.alvo)
                                                .toFixed(1).replace('.', ',')
                                            : '0,0'}
                                        label3='TOUCHDOWNS'
                                        label4={recepcaoSafe.tds_recebidos}
                                        noBorder
                                    />
                                </div>
                            </div>
                        )}

                    {currentJogador.estatisticas?.retorno &&
                        (
                            retornoSafe.retornos > 0 ||
                            retornoSafe.jardas_retornadas > 0 ||
                            retornoSafe.td_retornados > 0
                        ) && (
                            <div className='lg:max-w-[800px] lg:min-w-[800px] lg:m-auto xl:min-w-[650px] 2xl:min-w-[800px]'>
                                <div className="border py-2 px-3 font-extrabold text-white text-xs w-36 flex justify-center items-center rounded-md mb-3"
                                    style={{ backgroundColor: currentTime?.cor }}>STATS (RETORNO)
                                </div>
                                <div className="bg-white flex flex-col gap-4 p-4 rounded-lg">
                                    <Stats
                                        label1='RETORNOS'
                                        label2={retornoSafe.retornos}
                                        label3='JARDAS (TOTAIS)'
                                        label4={retornoSafe.jardas_retornadas}
                                    />
                                    <Stats
                                        label1='JARDAS (AVG)'
                                        label2={retornoSafe.retornos > 0
                                            ? (retornoSafe.jardas_retornadas / retornoSafe.retornos)
                                                .toFixed(1).replace('.', ',')
                                            : '0,0'}
                                        label3='TOUCHDOWNS'
                                        label4={retornoSafe.td_retornados}
                                        noBorder
                                    />
                                </div>
                            </div>
                        )}

                    {currentJogador.estatisticas?.defesa &&
                        (
                            defesaSafe.tackles_totais > 0 ||
                            defesaSafe.tackles_for_loss > 0 ||
                            defesaSafe.sacks_forcado > 0 ||
                            defesaSafe.fumble_forcado > 0 ||
                            defesaSafe.interceptacao_forcada > 0 ||
                            defesaSafe.passe_desviado > 0 ||
                            defesaSafe.safety > 0 ||
                            defesaSafe.td_defensivo > 0
                        ) &&
                        (
                            <div className='lg:max-w-[800px] lg:min-w-[800px] lg:m-auto xl:min-w-[650px] 2xl:min-w-[800px]'>
                                <div className="border py-2 px-3 font-extrabold text-white text-xs w-36 flex justify-center items-center rounded-md mb-3"
                                    style={{ backgroundColor: currentTime?.cor }}>STATS (DEFESA)</div>
                                <div className="bg-white flex flex-col gap-4 p-4 rounded-lg">
                                    <Stats
                                        label1='TACKELS (TOTAIS)'
                                        label2={defesaSafe.tackles_totais}
                                        label3='TACKLES (FOR LOSS)'
                                        label4={defesaSafe.tackles_for_loss}
                                    />
                                    <Stats
                                        label1='SACKS'
                                        label2={defesaSafe.sacks_forcado}
                                        label3='FUMBLES FORÇADOS'
                                        label4={defesaSafe.fumble_forcado}
                                    />
                                    <Stats
                                        label1='INTERCEPTAÇÕES'
                                        label2={defesaSafe.interceptacao_forcada}
                                        label3='PASSES DESVIADOS'
                                        label4={defesaSafe.passe_desviado}
                                    />
                                    <Stats
                                        label1='SAFETY'
                                        label2={defesaSafe.safety}
                                        label3='TOUCHDOWNS'
                                        label4={defesaSafe.td_defensivo}
                                        noBorder
                                    />
                                </div>
                            </div>
                        )}

                    {currentJogador.estatisticas?.kicker &&
                        (
                            kickerSafe.xp_bons > 0 ||
                            kickerSafe.tentativas_de_xp > 0 ||
                            kickerSafe.fg_bons > 0 ||
                            kickerSafe.tentativas_de_fg > 0 ||
                            kickerSafe.fg_mais_longo > 0
                        ) && (
                            <div className='lg:max-w-[800px] lg:min-w-[800px] lg:m-auto xl:min-w-[650px] 2xl:min-w-[800px]'>
                                <div className="border py-2 px-3 font-extrabold text-white text-xs w-36 flex justify-center items-center rounded-md mb-3"
                                    style={{ backgroundColor: currentTime?.cor }}>STATS (KICKER)
                                </div>
                                <div className="bg-white flex flex-col gap-4 p-4 rounded-lg">
                                    <Stats
                                        label1='EXTRA-POINTS'
                                        label2={`${kickerSafe.xp_bons}/${kickerSafe.tentativas_de_xp}`}
                                        label3='EXTRA-POINTS (%)'
                                        label4={kickerSafe.tentativas_de_xp > 0
                                            ? ((kickerSafe.xp_bons / kickerSafe.tentativas_de_xp) * 100)
                                                .toFixed(0).replace('.', ',') + '%'
                                            : '0%'}
                                    />
                                    <Stats
                                        label1='FIELD GOALS'
                                        label2={`${kickerSafe.fg_bons}/${kickerSafe.tentativas_de_fg}`}
                                        label3='FIELD GOALS (%)'
                                        label4={kickerSafe.tentativas_de_fg > 0
                                            ? ((kickerSafe.fg_bons / kickerSafe.tentativas_de_fg) * 100)
                                                .toFixed(0).replace('.', ',') + '%'
                                            : '0%'}
                                    />
                                    <Stats
                                        label1='MAIS LONGO'
                                        label2={kickerSafe.fg_mais_longo || "-"}
                                    />
                                </div>
                            </div>
                        )}

                    {currentJogador.estatisticas?.punter &&
                        (
                            punterSafe.punts > 0 ||
                            punterSafe.jardas_de_punt > 0
                        ) && (
                            <div className='lg:max-w-[800px] lg:min-w-[800px] lg:m-auto xl:min-w-[650px] 2xl:min-w-[800px]'>
                                <div className="border py-2 px-3 font-extrabold text-white text-xs w-36 flex justify-center items-center rounded-md mb-3"
                                    style={{ backgroundColor: currentTime?.cor }}>STATS (PUNTER)</div>
                                <div className="bg-white flex flex-col gap-4 p-4 rounded-lg">
                                    <Stats
                                        label1='PUNTS'
                                        label2={punterSafe.punts}
                                        label3='JARDAS (TOTAIS)'
                                        label4={punterSafe.jardas_de_punt}
                                    />
                                    <Stats
                                        label1='JARDAS (AVG)'
                                        label2={punterSafe.punts > 0
                                            ? (punterSafe.jardas_de_punt / punterSafe.punts).toFixed(1).replace('.', ',')
                                            : '0,0'}
                                        noBorder
                                    />
                                </div>
                            </div>
                        )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}