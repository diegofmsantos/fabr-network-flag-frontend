export const JogadorSkeleton = () => {
    return (
        <div className="w-full flex flex-col p-4 z-40 bg-white">
            <div
                className="flex h-24 justify-between items-center p-5 rounded-md border text-sm gap-6
                                md:text-base xl:text-lg xl:max-w-[1200px] xl:min-w-[1100px] xl:m-auto transition duration-300">
                <div className="flex-1 bg-gray-300 w-36 h-20 rounded-md">
                    <div className="w-auto h-auto"></div>
                </div>
                <div className="flex flex-col gap-5">
                    <div className="flex justify-start items-center gap-2">
                        <div className="bg-gray-300 rounded-md h-6 min-w-48 animate-pulse"></div>
                        <div className="bg-gray-300 rounded-md h-6 w-16 animate-pulse"></div>
                    </div>
                    <div className="flex justify-between gap-6">
                        <div className="flex flex-col items-center gap-2">
                            <div className="bg-gray-300 rounded-md h-3 w-10 animate-pulse"></div>
                            <div className="bg-gray-300 rounded-md h-3 w-6 animate-pulse"></div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="bg-gray-300 rounded-md h-3 w-12 animate-pulse"></div>
                            <div className="bg-gray-300 rounded-md h-3 w-6 animate-pulse"></div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="bg-gray-300 rounded-md h-3 w-10 animate-pulse"></div>
                            <div className="bg-gray-300 rounded-md h-3 w-6 animate-pulse"></div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="bg-gray-300 rounded-md h-3 w-16 animate-pulse"></div>
                            <div className="bg-gray-300 rounded-md h-3 w-12 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}