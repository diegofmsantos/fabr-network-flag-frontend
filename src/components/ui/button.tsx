"use client"

import { ReactNode } from "react"

type Props = {
    label: string
    isSelected?: boolean
    onClick?: () => void
    children?: ReactNode
}

export const Button = ({ label, isSelected, onClick, children }: Props) => {
    return (
        <button
            onClick={onClick}
            className={`w-full h-full flex flex-col justify-center items-center text-xs font-bold 
                ${isSelected ? 'bg-[#96E301] text-gray-600' : 'bg-white text-black'}`}
        >
            {children}
            {label}
        </button>
    )
}
