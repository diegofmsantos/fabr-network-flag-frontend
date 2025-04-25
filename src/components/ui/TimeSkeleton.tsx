export const TimeSkeleton = () => {
    return (
        <div className="grid grid-cols-4 gap-4 p-3">
            {Array.from({ length: 30 }, (_, index) => ( 
                <div
                    key={index} 
                    className="w-[90px] h-32 rounded-md bg-gray-300 animate-pulse"
                ></div>
            ))}
        </div>
    )
}
