export const PageSkeleton = () => {
    return (
        <div className="min-h-screen flex flex-col items-center">
            {/* Cabeçalho */}
            <div className="flex flex-col justify-center items-center gap-8 w-full h-96 bg-gray-300 animate-pulse rounded-b-lg">
                <div className="w-52 h-60 rounded-md bg-gray-400 animate-pulse"></div>

                {/* Botões TIME e JOGADORES */}
                <div className="flex justify-center gap-8">
                    <div className="w-32 h-8 bg-gray-400 rounded-md animate-pulse"></div>
                    <div className="w-32 h-8 bg-gray-400 rounded-md animate-pulse"></div>
                </div>
            </div>

            {/* Seção principal */}
            <div className="mt-8 w-full max-w-[1200px] px-4">
                {/* Cards principais (BIO ou STAFF, por exemplo) */}
                <div className="flex flex-col gap-3">
                    <div className="w-16 h-8 bg-gray-300 rounded-md animate-pulse"></div>
                    <div className="w-full h-72 bg-gray-300 rounded-md animate-pulse"></div>
                </div>
            </div>
        </div>
    )
}
