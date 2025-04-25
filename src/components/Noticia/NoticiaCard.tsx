
import Link from 'next/link'
import Image from 'next/image'
import { Noticia } from '@/types/noticia'

interface NoticiaCardProps {
  noticia: Noticia
}

export const NoticiaCard = ({ noticia }: NoticiaCardProps) => {
  const data = new Date(noticia.createdAt).toLocaleDateString('pt-BR')

  return (
    <Link href={`/noticias/${noticia.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48 w-full">
          <Image
            src={noticia.imagem}
            alt={noticia.titulo}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-2">{noticia.titulo}</h2>
          <p className="text-gray-600 mb-4">{noticia.subtitulo}</p>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>{noticia.autor}</span>
            <span>{data}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}