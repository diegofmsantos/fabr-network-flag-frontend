import React, { useState, useRef, useEffect } from 'react'
import { Share, Facebook, Twitter, Instagram, Link, MessageCircle } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface ShareButtonProps {
    title: string | undefined
    description?: string
    className?: string
    variant?: 'team' | 'player' | 'news'
    buttonStyle?: 'fixed' | 'absolute'
}

const ShareButton: React.FC<ShareButtonProps> = ({
    title,
    description,
    className = '',
    variant = 'team',
    buttonStyle = 'absolute'
}) => {
    const pathname = usePathname();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fabrnetwork.com.br';
    const fullUrl = `${baseUrl}${pathname}`

    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const getFormattedDescription = () => {
        switch (variant) {
            case 'team':
                return `Confira as estatísticas do ${title} no FABR Network.`
            case 'player':
                return `Confira o perfil e as estatísticas de ${title} no FABR Network.`
            case 'news':
                return description || 'Confira esta notícia no FABR Network.'
            default:
                return description
        }
    };

    const shareToWhatsApp = () => {
        const text = encodeURIComponent(`${title}\n\n${getFormattedDescription()}\n\n${fullUrl}`)
        window.open(`https://wa.me/?text=${text}`, '_blank')
        setIsOpen(false)
    };

    const shareToFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`, '_blank')
        setIsOpen(false)
    };

    const shareToTwitter = () => {
        const text = encodeURIComponent(`${title}\n${getFormattedDescription()}`)
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(fullUrl)}`, '_blank')
        setIsOpen(false)
    };

    const shareToInstagram = () => {
        const text = `${title}\n\n${getFormattedDescription()}\n\n${fullUrl}`
        navigator.clipboard.writeText(text)
        alert('Link copiado! Você pode compartilhar nos stories do Instagram.')
        setIsOpen(false)
    };

    const copyToClipboard = async () => {
        try {
            const shareText = `${title}\n\n${getFormattedDescription()}\n\n${fullUrl}`
            await navigator.clipboard.writeText(shareText)
            alert('Conteúdo copiado para a área de transferência!')
        } catch (error) {
            console.error('Erro ao copiar:', error)
        }
        setIsOpen(false)
    }

    return (
        <div className="relative z-[9999]" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`inline-flex items-center ${buttonStyle === 'fixed'
                    ? 'fixed top-[90px]'
                    : 'absolute top-3'
                    } right-3 rounded-lg text-white ${className}`}
            >
                <Share className="w-6 h-6" />
            </button>

            {isOpen && (
                <div className={`${buttonStyle === 'fixed'
                    ? 'fixed right-3 top-[130px]'
                    : 'absolute right-0 mt-2'
                    } w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5`}>
                    <div className="p-4">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="text-xl font-bold text-center">{title}</div>
                        </div>
                    </div>
                    <div className="border-t border-gray-100">
                        <div className="py-1">
                            <button
                                onClick={shareToWhatsApp}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <MessageCircle className="w-5 h-5 mr-3 text-green-500" />
                                WhatsApp
                            </button>

                            <button
                                onClick={shareToFacebook}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <Facebook className="w-5 h-5 mr-3 text-blue-600" />
                                Facebook
                            </button>

                            <button
                                onClick={shareToTwitter}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <Twitter className="w-5 h-5 mr-3 text-blue-400" />
                                Twitter
                            </button>

                            <button
                                onClick={shareToInstagram}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <Instagram className="w-5 h-5 mr-3 text-pink-600" />
                                Instagram
                            </button>

                            <button
                                onClick={copyToClipboard}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <Link className="w-5 h-5 mr-3 text-gray-500" />
                                Copiar link
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ShareButton