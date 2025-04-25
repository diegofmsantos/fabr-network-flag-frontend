import { useEffect, useState } from 'react'
import { useScroll, useTransform } from 'framer-motion'

type Props = {
  playerName: string
}

const PlayerNameHeader = ({ playerName }: Props) => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [0, 1])
  const [showPlayerName, setShowPlayerName] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (scrollY.get() > 200) {
        setShowPlayerName(true)
      } else {
        setShowPlayerName(false)
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrollY])

  return (
    <div
      className="fixed top-20 w-full z-50 text-white text-center font-extrabold italic tracking-[-1px] text-lg py-2 transition-all duration-300 xl:ml-14 xl:top-1"
      style={{ opacity: showPlayerName ? 1 : 0, pointerEvents: showPlayerName ? 'auto' : 'none' }}
    >
      {playerName?.toLocaleUpperCase()}
    </div>
  )
}

export default PlayerNameHeader