"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleDown } from "@fortawesome/free-solid-svg-icons"
import { ButtonTime } from "@/components/ui/buttonTime"
import { ButtonSetor } from "@/components/ui/buttonSetor"
import { Jogador } from "@/components/Jogador/Jogador"
import { CurrentTime } from "@/components/Time/Time"
import { motion, useScroll, useTransform } from "framer-motion"
import { Loading } from "@/components/ui/Loading"
import { SelectFilter } from "@/components/SelectFilter"
import TeamNameHeader from "@/components/Time/TeamHeader"
import ShareButton from "@/components/ui/buttonShare"
import { createSlug } from "@/utils/formatUrl"
import Link from "next/link"
import { useTeam } from "@/hooks/queries"

type Setor = "ATAQUE" | "DEFESA" | "SPECIAL"

export default function Page() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const temporada = searchParams.get('temporada') || '2024'

  useEffect(() => {
    const currentPath = params.time?.toString() || ''
    if (currentPath.includes('%20')) {
      const decodedPath = decodeURIComponent(currentPath)
      const correctSlug = createSlug(decodedPath)
      router.replace(`/${correctSlug}`)
    }
  }, [params.time, router])

  const timeName = Array.isArray(params.time) ? params.time[0] : params.time
  const decodedTimeName = timeName ? decodeURIComponent(timeName).replace(/-/g, ' ') : ''

  const {
    data: currentTeam,
    isLoading: loadingTeam,
    error
  } = useTeam(decodedTimeName, temporada)

  const [loadingJogadores, setLoadingJogadores] = useState(false)
  const [selectedButton, setSelectedButton] = useState(searchParams.get("show") || "bio")
  const [selectedSetor, setSelectedSetor] = useState<Setor>(
    (searchParams.get("setor") as Setor) || "ATAQUE"
  )

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
    params.set('setor', encodeURIComponent(selectedSetor));

    router.replace(`?${params.toString()}`, { scroll: false });
    setLoadingJogadores(false)
  }

  const handleSetorChange = (setor: Setor) => {
    setSelectedSetor(setor)

    // Preservar todos os parâmetros da URL
    const params = new URLSearchParams(searchParams.toString());
    params.set('show', 'jogadores');
    params.set('setor', encodeURIComponent(setor));

    router.replace(`?${params.toString()}`, { scroll: false });
  }

  if (loadingTeam) return <Loading />
  if (error) return <div>Erro ao carregar o time</div>
  if (!currentTeam) return <Loading />

  const capacetePath = `/assets/times/capacetes/${currentTeam.capacete || "default-capacete.png"}`
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
            href="/"
            className="absolute top-2 left-3 rounded-xl text-xs text-white py-1 px-2 lg:left-32 xl:left-[420px] 2xl:left-[570px]"
          >
            {currentTeam.sigla || "N/A"}
            <FontAwesomeIcon icon={faAngleDown} className="ml-1" />
          </Link>
          <TeamNameHeader teamName={currentTeam?.nome} />
          <motion.div className="flex flex-col justify-center items-center md:mb-4" style={{ opacity, pointerEvents: 'none' }}>
            <div className="text-[45px] mt-2 text-white text-center px-6 font-extrabold italic leading-[35px] tracking-[-3px] md:text-5xl md:mt-4">
              {currentTeam.nome?.toLocaleUpperCase() || "Time Indefinido"}
            </div>

            {currentTeam.capacete && (
              <div className="w-40 h-40 rotate-[15deg] -mt-6">
                <Image
                  src={capacetePath}
                  alt="capacete do time"
                  width={160}
                  height={160}
                  quality={100}
                  style={{ width: '160px', height: '160px', objectFit: 'contain' }}
                  priority
                />
              </div>
            )}
          </motion.div>

          <motion.div className="flex justify-between gap-8 mt-4 md:mt-8" style={{ opacity }}>
            <ButtonTime label="BIO" onClick={handleShowBio} isSelected={selectedButton === "bio"} />
            <ButtonTime label="JOGADORES" onClick={handleShowJogadores} isSelected={selectedButton === "jogadores"} />
          </motion.div>
        </motion.div>
        <div className="my-4 2xl:my-8">
          <SelectFilter
            label="TEMPORADA"
            value={temporada}
            onChange={(novaTemporada) => {
              // Atualizar a URL com a nova temporada
              router.replace(`/${params.time}?show=${selectedButton}&setor=${selectedSetor}&temporada=${novaTemporada}`);
            }}
            options={[
              { label: '2024', value: '2024' },
              { label: '2025', value: '2025' }
            ]}
          />
        </div>
      </motion.div>


      {selectedButton === "jogadores" && (
        <motion.div
          className="flex flex-col mx-auto pt-[400px] xl:mb-8 2xl:pt-[430px] 2xl:pl-[125px]"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
        >
          <div className="sticky w-full top-[55px] lg:top-10 z-40 bg-[#ECECEC] xl:w-[650px] xl:m-auto 2xl:w-[840px] 2xl:pl-10">
            <section className="w-full max-w-[800px] flex items-center justify-between gap-5 py-5 px-4 md:px-6 lg:m-auto xl:ml-14 2xl:ml-0">
              <ButtonSetor label="ATAQUE" borderColor={currentTeam.cor || "#000"} isSelected={selectedSetor === "ATAQUE"} onClick={() => handleSetorChange("ATAQUE")} />
              <ButtonSetor label="DEFESA" borderColor={currentTeam.cor || "#000"} isSelected={selectedSetor === "DEFESA"} onClick={() => handleSetorChange("DEFESA")} />
              <ButtonSetor label="SPECIAL" borderColor={currentTeam.cor || "#000"} isSelected={selectedSetor === "SPECIAL"} onClick={() => handleSetorChange("SPECIAL")} />
            </section>
          </div>
          <div className="xl:border min-h-screen lg:ml-24 xl:w-[650px] xl:m-auto 2xl:w-[800px] 2xl:pl-5">
            <Jogador currentTeam={currentTeam} selectedSetor={selectedSetor} />
          </div>
        </motion.div>
      )}

      {selectedButton === "bio" && (
        <motion.div
          className="flex flex-col max-w-[800px] mx-auto w-full pt-[410px] lg:pt-[350px] xl:w-[650px] xl:pl-12 xl:pt-[420px] 2xl:pt-[450px] 2xl:w-[800px] 2xl:pl-0"
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