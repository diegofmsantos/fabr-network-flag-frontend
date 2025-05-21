"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu } from "lucide-react"
import { Sobre } from "./Sobre"

interface TabProps {
  className?: string;
}

export const Tab: React.FC<TabProps> = ({ className = '' }) => {
  const pathname = usePathname()
  
  // Lógica simplificada para determinar a rota ativa
  const isRootRoute = pathname === '/' || 
                      (pathname.startsWith('/') && 
                       !pathname.startsWith('/ranking') && 
                       !pathname.startsWith('/comparar-times'))
                       
  const isRankingRoute = pathname.startsWith('/ranking')
  const isCompararRoute = pathname.startsWith('/comparar-times')
  
  const [isAboutOpen, setIsAboutOpen] = useState(false)

  return (
    <>
      <div className={`fixed bottom-0 w-full bg-[#18187c] shadow-md border-t flex justify-around items-center py-2 z-50 ${className} xl:hidden`}>
        {/* Botão Times */}
        <Link href="/">
          <div className={`flex flex-col items-center ${isRootRoute ? "text-[#FFE500]" : "text-gray-400"}`}>
            <Image
              src={isRootRoute ? "/assets/escudo-amarelo.png" : "/assets/escudo-branco.png"}
              alt="escudo"
              width={25}
              height={25}
            />
            <span className="text-sm">Times</span>
          </div>
        </Link>

        {/* Botão Ranking */}
        <Link href="/ranking">
          <div className={`flex flex-col items-center ${isRankingRoute ? "text-[#FFE500]" : "text-gray-400"}`}>
            <Image
              src={isRankingRoute ? "/assets/ranking-amarelo.png" : "/assets/ranking-branco.png"}
              alt="ranking"
              width={25}
              height={25}
            />
            <span className="text-sm">Ranking</span>
          </div>
        </Link>

        {/* Botão Comparar */}
        <Link href="/comparar-times">
          <div className={`flex flex-col items-center ${isCompararRoute ? "text-[#FFE500]" : "text-gray-400"}`}>
            <Image
              src={isCompararRoute ? "/assets/comparar-amarelo.png" : "/assets/comparar-branco.png"}
              alt="comparar"
              width={25}
              height={25}
            />
            <span className="text-sm">Comparar</span>
          </div>
        </Link>

        {/* Botão Menu */}
        <button
          onClick={() => setIsAboutOpen(true)}
          className="flex flex-col items-center text-gray-400 hover:text-[#FFE500] transition-colors"
        >
          <Menu size={30} />
        </button>
      </div>

      <Sobre isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </>
  )
}