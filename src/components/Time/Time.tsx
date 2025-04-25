"use client"

import { Time } from "@/types/time"
import { differenceInYears, format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Image from "next/image"
import Link from "next/link"

type Props = {
    currentTeam: Time
}

export const CurrentTime = ({ currentTeam }: Props) => {
    const [day, month, year] = (currentTeam.fundacao ?? '').split('/').map(Number)
    const fundacaoDate = new Date(year ?? 0, (month ?? 1) - 1, day ?? 1)

    const idade = currentTeam.fundacao ? differenceInYears(new Date(), fundacaoDate) : null
    const fundacaoFormatada = currentTeam.fundacao
        ? format(fundacaoDate, "dd/MM/yyyy", { locale: ptBR })
        : "Data não disponível"

    const bandeiraspath = `/assets/bandeiras/${currentTeam.bandeira_estado}`;

    return (
        <div className="p-4 mb-6 flex flex-col gap-8 lg:p-0 lg:mt-20 xl:max-w-[650px] xl:min-w-[650px] xl:m-auto xl:p-0 2xl:w-[800px] 2xl:min-w-[800px] 2xl:ml-20">
            <div>
                <div
                    className="border py-2 px-3 font-extrabold text-white text-xs w-16 flex justify-center items-center rounded-md mb-3"
                    style={{ backgroundColor: currentTeam.cor ?? '#000' }}
                >
                    BIO
                </div>
                <div className="bg-white flex flex-col gap-4 p-4 rounded-lg ">
                    <div className="border-b border-[#D9D9D9]">
                        <div className="text-sm">FUNDAÇÃO</div>
                        <div className="text-lg font-extrabold italic mb-1 flex items-center gap-1">
                            {fundacaoFormatada}
                            {idade !== null && (
                                <div className="text-sm mt-1">({idade} anos)</div>
                            )}
                        </div>
                    </div>
                    <div className="border-b border-[#D9D9D9]">
                        <div className="text-sm">CIDADE</div>
                        <div className="flex items-center gap-3">
                            <div className="text-lg font-extrabold italic">
                                {currentTeam.cidade?.toUpperCase() ?? 'Cidade não disponível'}
                            </div>
                            <div className="w-6 h-4">
                                <Image src={bandeiraspath} alt="bandeira do estado" width={40} height={20} quality={100} className="w-auto h-auto"/>
                            </div>
                        </div>
                    </div>
                    <div className="border-b border-[#D9D9D9]">
                        <div className="text-sm">ESTÁDIO</div>
                        <div className="text-lg font-extrabold italic">
                            {currentTeam.estadio?.toUpperCase() ?? 'Estádio não disponível'}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm">INSTAGRAM</div>
                        <div className="text-lg font-extrabold italic underline text-blue-800">
                            {currentTeam.instagram ? (
                                <Link href={currentTeam.instagram} target="_blank">
                                    {currentTeam.instagram2?.toUpperCase() ?? 'Instagram'}
                                </Link>
                            ) : (
                                'Instagram não disponível'
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div
                    className="border py-2 px-3 font-extrabold text-white text-xs w-16 flex justify-center items-center rounded-md mb-3"
                    style={{ backgroundColor: currentTeam.cor ?? '#000' }}
                >
                    STAFF
                </div>
                <div className="bg-white flex flex-col gap-4 p-4 rounded-lg">
                    <div className="border-b border-[#D9D9D9]">
                        <div className="text-sm">PRESIDENTE</div>
                        <div className="text-lg font-extrabold italic mb-1">
                            {currentTeam.presidente?.toUpperCase() ?? 'Não disponível'}
                        </div>
                    </div>
                    <div className="border-b border-[#D9D9D9]">
                        <div className="text-sm">HEAD COACH</div>
                        <div className="text-lg font-extrabold italic underline text-blue-800">
                            {currentTeam.instagram_coach ? (
                                <Link href={currentTeam.instagram_coach} target="_blank">
                                    {currentTeam.head_coach?.toUpperCase() ?? 'Não disponível'}
                                </Link>
                            ) : (
                                'Instagram não disponível'
                            )}
                        </div>
                    </div>
                    <div className="border-b border-[#D9D9D9]">
                        <div className="text-sm">COORDENADOR OFENSIVO</div>
                        <div className="text-lg font-extrabold italic mb-1">
                            {currentTeam.coord_ofen?.toUpperCase() ?? 'Não disponível'}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm">COORDENADOR DEFENSIVO</div>
                        <div className="text-lg font-extrabold italic">
                            {currentTeam.coord_defen?.toUpperCase() ?? 'Não disponível'}
                        </div>
                    </div>
                </div>
            </div>
            <div className="xl:mb-16">
                <div
                    className="border py-2 px-3 font-extrabold text-white text-xs w-16 flex justify-center items-center rounded-md mb-3"
                    style={{ backgroundColor: currentTeam.cor ?? '#000' }}
                >
                    TÍTULOS
                </div>
                {currentTeam.titulos && currentTeam.titulos.length > 0 ? (
                    <div className="bg-white flex flex-col gap-4 p-4 rounded-lg">
                        <div className="border-b border-[#D9D9D9]">
                            <div className="text-sm">NACIONAIS</div>
                            <div className="text-lg font-extrabold italic mb-1">
                                {currentTeam.titulos[0].nacionais && currentTeam.titulos[0].nacionais.includes('(')
                                    ? (
                                        <>
                                            {currentTeam.titulos[0].nacionais.split(" (")[0]}{' '}
                                            <span className="text-sm">
                                                ({currentTeam.titulos[0].nacionais.split(" (")[1]?.replace(')', '')})
                                            </span>
                                        </>
                                    ) : currentTeam.titulos[0].nacionais ?? 'N/A'
                                }
                            </div>
                        </div>
                        <div className="border-b border-[#D9D9D9]">
                            <div className="text-sm">CONFERÊNCIAS</div>
                            <div className="text-lg font-extrabold italic mb-1">
                                {currentTeam.titulos[0].conferencias && currentTeam.titulos[0].conferencias.includes('(')
                                    ? (
                                        <>
                                            {currentTeam.titulos[0].conferencias.split(" (")[0]}{' '}
                                            <span className="text-sm">
                                                ({currentTeam.titulos[0].conferencias.split(" (")[1]?.replace(')', '')})
                                            </span>
                                        </>
                                    ) : currentTeam.titulos[0].conferencias ?? 'N/A'
                                }
                            </div>
                        </div>
                        <div>
                            <div className="text-sm">ESTADUAIS</div>
                            <div className="text-lg font-extrabold italic">
                                {currentTeam.titulos[0].estaduais && currentTeam.titulos[0].estaduais.includes('(')
                                    ? (
                                        <>
                                            {currentTeam.titulos[0].estaduais.split(" (")[0]}{' '}
                                            <span className="text-sm">
                                                ({currentTeam.titulos[0].estaduais.split(" (")[1]?.replace(')', '')})
                                            </span>
                                        </>
                                    ) : currentTeam.titulos[0].estaduais ?? 'N/A'
                                }
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-lg italic">Nenhum título disponível</div>
                )}

            </div>
        </div>
    )
}
