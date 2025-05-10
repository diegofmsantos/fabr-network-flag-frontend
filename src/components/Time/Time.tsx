"use client"

import { Time } from "@/types/time"
import Image from "next/image"
import Link from "next/link"

type Props = {
    currentTeam: Time
}

export const CurrentTime = ({ currentTeam }: Props) => {

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
                        <div className="text-sm">CIDADE</div>
                        <div className="flex items-center gap-3">
                            <div className="text-lg font-extrabold italic">
                                {currentTeam.cidade?.toUpperCase() ?? 'Cidade não disponível'}
                            </div>
                            <div className="w-6 h-4">
                                <Image src={bandeiraspath} alt="bandeira do estado" width={40} height={20} quality={100} className="w-auto h-auto" />
                            </div>
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
                        <div className="text-sm">HEAD COACH</div>
                        <div className="text-lg font-extrabold italic">
                            {currentTeam.head_coach?.toUpperCase() ?? 'Não disponível'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}