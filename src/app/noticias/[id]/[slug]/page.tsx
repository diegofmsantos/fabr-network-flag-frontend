"use client"

import { Loading } from '@/components/ui/Loading'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { Noticia } from '@/types/noticia'
import { useNoticiaDetalhes } from '@/hooks/queries'

function shuffleAndFilterNews(allNews: Noticia[], currentNewsId: number, limit: number = 6) {
  return allNews
    .filter(news => news.id !== currentNewsId)
    .sort(() => Math.random() - 0.5)
    .slice(0, limit)
}

export default function NoticiaDetalhes() {
  const params = useParams()
  const noticiaId = Number(params.id)

  const {
    noticia,
    noticias,
    isLoading
  } = useNoticiaDetalhes(noticiaId)

  const SLIDER_SETTINGS = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 1,
        },
      },
    ],
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#ECECEC] flex justify-center items-center">
        <Loading />
      </div>
    )
  }

  if (!noticia) {
    return (
      <div className="min-h-screen bg-[#ECECEC] flex justify-center items-center">
        <p>Notícia não encontrada</p>
      </div>
    )
  }


  return (
    <div className="bg-[#ECECEC] min-h-screen pb-16 pt-[83px] max-w-[800px] mx-auto xl:mr-44 2xl:mr-96">
      <Link
        href={`/noticias`}
        className='fixed top-8 left-5 rounded-full text-xs text-[#63E300] p-2 w-8 h-8 flex justify-center items-center bg-gray-400/40 z-50 xl:left-96 '
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </Link>
      <div className="max-w-4xl mx-auto p-4 mr-1 bg-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">{noticia.titulo}</h1>
          <h2 className="text-[18px] text-gray-400 mb-6">{noticia.subtitulo}</h2>

          {/* Container da imagem com legenda */}
          <div className="relative w-full max-w-4xl mx-auto mb-8">
            <div className="relative w-full">
              <Image
                src={noticia.imagem}
                alt={noticia.titulo}
                width={1200}
                height={800}
                className="w-full rounded-lg"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVigAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx0fHRsdHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/2wBDAR0XFyAeIB4dHiAeHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              />
            </div>
            {noticia.legenda && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-3 text-sm">
                {noticia.legenda}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between items-start gap-2 mb-8">
            <div className='flex items-center gap-3'>
              <div className="relative w-10 h-10">
                <Image
                  src={noticia.autorImage}
                  alt={noticia.autor}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <span className="text-xs text-gray-500">Por {noticia.autor}</span>
            </div>
            <div className='flex gap-2 italic'>
              <span className="text-xs text-gray-500">
                Postado: {new Date(noticia.createdAt).toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZone: 'America/Sao_Paulo'
                })}
              </span>
              <span className="text-xs text-gray-500">
                Atualizado: {new Date(noticia.updatedAt).toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZone: 'America/Sao_Paulo'
                })}
              </span>
            </div>
          </div>
          <div
            className="prose max-w-none flex flex-col gap-1 [&_a]:text-[#0066cc] [&_a]:underline hover:[&_a]:no-underline [&>p]:mb-2 [&>p]:leading-relaxed [&>strong]:font-bold [&>em]:italic"
            dangerouslySetInnerHTML={{
              __html: noticia.texto
                .replace(/<p>&nbsp;<\/p>/g, '')
                .split('\n')
                .filter(line => line.trim())
                .map(line => `<p>${line}</p>`)
                .join('')
                .replace(/&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-fA-F]{1,6});/gi, match => {
                  const entities: { [key: string]: string } = {
                    '&aacute;': 'á',
                    '&eacute;': 'é',
                    '&iacute;': 'í',
                    '&oacute;': 'ó',
                    '&uacute;': 'ú',
                    '&ccedil;': 'ç',
                    '&atilde;': 'ã',
                    '&otilde;': 'õ',
                    '&acirc;': 'â',
                    '&ecirc;': 'ê',
                    '&ocirc;': 'ô',
                    '&nbsp;': ' ',
                  };
                  return entities[match] || match;
                })
            }}
          />

          {/* Seção de Mais Notícias */}
          <div className="border-t">

            <h3 className="text-2xl font-bold my-6 border-b-4 border-b-[#63E300]">Mais notícias</h3>

            <div className="mb-6 pl-4 pr-4 overflow-x-hidden overflow-y-hidden">
              <Slider {...SLIDER_SETTINGS}>
                {shuffleAndFilterNews(noticias, noticia.id).map((newsItem) => (
                  <div key={newsItem.id} className="px-2">
                    <Link href={`/noticias/${newsItem.id}`}>
                      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="relative h-48 w-full">
                          <Image
                            src={newsItem.imagem}
                            alt={newsItem.titulo}
                            fill
                            className="object-cover rounded-t-lg"
                            loading="lazy"
                          />
                        </div>

                        <div className="p-4">
                          <h4 className="font-bold text-lg mb-2 line-clamp-2">
                            {newsItem.titulo}
                          </h4>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {newsItem.subtitulo}
                          </p>

                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="relative w-8 h-8">
                                <Image
                                  src={newsItem.autorImage}
                                  alt={newsItem.autor}
                                  fill
                                  className="rounded-full object-cover"
                                />
                              </div>
                              <span className="text-[10px] text-gray-500">
                                {newsItem.autor}
                              </span>
                            </div>
                            <span className="text-xs text-gray-400">
                              {new Date(newsItem.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </Slider>
            </div>

            {/* Botão Ver Todas as Notícias */}
            <div className="mt-8 text-center">
              <Link
                href="/noticias"
                className="inline-block px-6 py-3 bg-[#63E300] text-black rounded-lg hover:bg-[#50B800] transition-colors"
              >
                Ver todas as notícias
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}