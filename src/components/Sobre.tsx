"use client"

import React from 'react'
import Link from 'next/link'
import { Share, MessageSquare, Mail, Instagram, Github, Coffee, ArrowLeft } from 'lucide-react'

interface SobreProps {
    isOpen: boolean
    onClose: () => void
}

export const Sobre = ({ isOpen, onClose }: SobreProps) => {
    return (
        <div
            className={`fixed inset-0 z-50 transform transition-all duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
        >
            {/* Backdrop com blur quando menu está aberto */}
            <div
                className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                onClick={onClose}
            />

            {/* Conteúdo do menu que desliza */}
            <div
                className={`absolute right-0 top-0 h-full w-full max-w-md bg-[#272731] shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="h-20 flex items-center justify-between px-4 border-b border-gray-700">
                    <button
                        onClick={onClose}
                        className="text-white hover:text-[#63E300] transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-white text-xl font-bold">Sobre o App</h1>
                    <div className="w-6" />
                </div>

                <div className="px-4 py-6 text-white overflow-y-auto h-[calc(100%-5rem)]">
                    <div className="flex flex-col mb-4 border-b border-gray-700">
                        <div className="flex justify-between items-center">
                            <span>Desenvolvedor</span>
                            <span className="text-gray-400">Diego Santos</span>

                        </div>
                        <Link
                            href="https://wa.me/+5581995831001"
                            target="_blank"
                            className="flex items-center justify-between py-3  hover:bg-gray-800 rounded-lg px-2 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <MessageSquare size={20} />
                                <span>WhatsApp</span>
                            </div>
                            <Share size={16} className="text-gray-400" />
                        </Link>
                    </div>
                    <div className="flex justify-between items-center mb-4 py-3 border-b border-gray-700">
                        <span>Versão do App</span>
                        <span className="text-gray-400">1.0.0</span>
                    </div>

                    {/* Desenvolvedor */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-center mb-4">Contato FABR-Network</h2>
                        <Link
                            href="https://wa.me/+5581998725448"
                            target="_blank"
                            className="flex items-center justify-between py-3 hover:bg-gray-800 rounded-lg px-2 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <MessageSquare size={20} />
                                <span>WhatsApp</span>
                            </div>
                            <Share size={16} className="text-gray-400" />
                        </Link>
                        <Link
                            href="https://www.instagram.com/fabrnetwork/"
                            target="_blank"
                            className="flex items-center justify-between py-3 hover:bg-gray-800 rounded-lg px-2 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Instagram size={20} />
                                <span>Instagram</span>
                            </div>
                            <Share size={16} className="text-gray-400" />
                        </Link>
                        <Link
                            href="mailto:fabrnetwork@gmail.com"
                            className="flex items-center justify-between py-3 hover:bg-gray-800 rounded-lg px-2 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Mail size={20} />
                                <span>Email</span>
                            </div>
                            <Share size={16} className="text-gray-400" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

