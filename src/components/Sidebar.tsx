"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
    className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
    const pathname = usePathname();
    const [activeItem, setActiveItem] = useState('');

    useEffect(() => {
        // Verifica a rota atual e define o item ativo
        if (pathname?.includes('/ranking')) {
            setActiveItem('ranking');
        }
        else if (pathname?.includes('/comparar-times')) {
            setActiveItem('comparar');
        } else {
            setActiveItem('equipes');
        }
    }, [pathname]);

    return (
        <aside className={`hidden xl:flex flex-col w-80 bg-[#18187c] fixed left-32 top-28 bottom-28 rounded-lg z-40 xl:w-72 xl:left-16 2xl:w-96 2xl:left-32 ${className}`}>
            {/* Logo */}
            <div className="flex justify-center items-center pt-20 pb-8">
                <Link href="/">
                    <Image
                        src="/assets/flag-brasileiro.png"
                        alt="FABR Network"
                        width={200}
                        height={100}
                        priority
                        quality={100}
                        className="w-auto h-auto"
                    />
                </Link>
            </div>

            {/* Navegação */}
            <nav className="flex flex-col mt-8 px-6 gap-6">
                <Link
                    href="/"
                    className={`text-xl uppercase font-extrabold italic tracking-[-1px] py-3 px-6 rounded-lg flex items-center 
                     duration-500 hover:scale-110 transition-transform ${activeItem === 'equipes' ? 'bg-white text-[#18187c]' : 'text-white'}`}
                >
                    Equipes
                </Link>

                <Link
                    href="/ranking"
                    className={`text-xl uppercase font-extrabold italic tracking-[-1px] py-3 px-6 rounded-lg flex items-center 
                         duration-500 hover:scale-110 transition-transform ${activeItem === 'ranking' ? 'bg-white text-[#18187c]' : 'text-white'}`}
                >
                    Rankings
                </Link>
                <Link
                    href="/comparar-times"
                    className={`text-xl uppercase font-extrabold italic tracking-[-1px] py-3 px-6 rounded-lg flex items-center 
                    duration-500 hover:scale-110 transition-transform ${activeItem === 'comparar' ? 'bg-white text-[#18187c]' : 'text-white'}`}
                >
                    Comparar Times
                </Link>

            </nav>

            {/* Footer com direitos autorais e/ou social media (opcional) */}
            <div className="mt-auto p-4 text-gray-400 text-xs text-center">
                <p>© 2025 FABR Network</p>
                <p>Todos os direitos reservados</p>
            </div>
        </aside>
    );
};

export default Sidebar;