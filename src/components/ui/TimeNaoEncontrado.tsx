// src/components/ui/TimeNaoEncontrado.tsx
import Image from "next/image"
import Link from "next/link"

interface TimeNaoEncontradoProps {
  timeNome: string
  temporadaAtual: string
  temporadaDisponivel: string
}

export const TimeNaoEncontrado = ({ 
  timeNome, 
  temporadaAtual, 
  temporadaDisponivel 
}: TimeNaoEncontradoProps) => {
  return (
    <div className="flex flex-col items-center justify-center pt-[50px] bg-[#ECECEC] min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto text-center">
        <Image 
          src="/assets/image.png" 
          alt="Aviso" 
          width={80} 
          height={80} 
          className="mx-auto mb-4"
        />
        
        <h2 className="text-xl font-bold mb-4 bg-yellow-300 inline-block px-3 py-1 rounded-xl">
          TIME NÃO DISPONÍVEL
        </h2>
        
        <p className="text-gray-700 mb-4">
          O time <span className="font-bold">{timeNome}</span> não está disponível 
          na temporada <span className="font-bold">{temporadaAtual}</span>.
        </p>
        
        <p className="text-gray-700 mb-6">
          Este time só está disponível na temporada <span className="font-bold">{temporadaDisponivel}</span>.
        </p>
        
        <Link
          href={`/${timeNome}?temporada=${temporadaDisponivel}`}
          className="bg-green-500 text-white px-6 py-2 rounded-full inline-block hover:bg-green-600 transition-colors"
        >
          Ver na temporada {temporadaDisponivel}
        </Link>
      </div>
    </div>
  )
}