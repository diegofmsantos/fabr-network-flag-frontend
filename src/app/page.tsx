// Versão atualizada da página inicial (app/page.tsx)
import { Lista } from "@/components/Lista"
import { Metadata } from "next"
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/hooks/queryKeys'

export const metadata: Metadata = {
  title: "Flag Football Brasil",
}

export default async function Page() {
  const queryClient = new QueryClient()

  // Pré-carrega os dados no servidor com temporada 2025
  await queryClient.prefetchQuery({
    queryKey: queryKeys.times('2025'),
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/times?temporada=2025`)
      if (!response.ok) {
        throw new Error('Erro ao buscar times')
      }
      return response.json()
    }
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="text-[#1414E] z-20 bg-[#ECECEC] lg:mr-40 xl:w-2/3 xl:mx-auto">
        <h1 className="fixed inline-block w-full p-2 z-40 text-[53px] bg-[#ECECEC] text-black px-2 font-extrabold italic leading-[55px] pt-24 tracking-[-5px] 
        lg:ml-32 xl:ml-64 xl:pt-10 2xl:ml-96">
          ESCOLHA SEU TIME
        </h1>
        <Lista temporadaDefault="2025" />
      </div>
    </HydrationBoundary>
  )
}