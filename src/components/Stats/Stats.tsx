import React from 'react'

type Props = {
    label1?: string
    label2?: string | number
    label3?: string
    label4?: string | number
    noBorder?: boolean
}

export const Stats = ({ label1, label2, label3, label4, noBorder = false }: Props) => {
    return (
        <div className={`flex justify-start gap-24 ${!noBorder ? 'border-b border-[#D9D9D9]' : ''}`}>
            <div className='flex-1 justify-start'>
                <div className="text-xs xl:text-lg">{label1}</div>
                <div className="text-[34px] font-extrabold italic mb-1">{label2}</div>
            </div>
            <div className='flex-1 justify-start'>
                <div className="text-xs xl:text-lg">{label3}</div>
                <div className="text-[34px] font-extrabold italic mb-1">{label4}</div>
            </div>
        </div>
    )
}
