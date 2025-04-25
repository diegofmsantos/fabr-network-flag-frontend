import { useEffect, useState } from 'react'
import { useScroll, useTransform } from 'framer-motion'

type Props = {
  teamName: string | undefined
}

const TeamNameHeader = ({ teamName }: Props) => {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 200], [0, 1])
  const [showTeamName, setShowTeamName] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (scrollY.get() > 200) {
        setShowTeamName(true)
      } else {
        setShowTeamName(false)
      }
    };

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrollY])

  return (
    <div
      className="absolute top-2 font-extrabold italic tracking-[-1px] text-lg  text-white py-1 px-2 text-center transition-all duration-300"
      style={{ opacity: showTeamName ? 1 : 0, pointerEvents: showTeamName ? 'auto' : 'none' }}
    >
      {teamName?.toLocaleUpperCase()}
    </div>
  )
}

export default TeamNameHeader