import React from 'react'

type Props = {
    label: string
    borderColor: string | undefined
    isSelected: boolean
    onClick: () => void
}

export const ButtonSetor = ({ label, borderColor, isSelected, onClick }: Props) => {
    return (
        <div
            className={`px-1 font-extrabold italic text-xl leading-[30px] tracking-[-2px] cursor-pointer min-[375px]:text-2xl min-[425px]:text-3xl xl:text-4xl transition-all duration-500
                ${isSelected ? 'border-b-4 scale-110' : 'border-b-4 border-transparent scale-100 opacity-65'}`}
            style={{
                borderBottomColor: isSelected ? borderColor : 'transparent',
                transformOrigin: 'bottom'
            }}
            onClick={onClick}
        >
            {label}
        </div>
    )
}
