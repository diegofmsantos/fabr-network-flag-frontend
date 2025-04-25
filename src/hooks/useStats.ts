import { useState, useEffect } from 'react'
import { Jogador } from '@/types/jogador'
import { Time } from '@/types/time'
import { getJogadores, getTimes } from '@/api/api'

export const useStats = () => {
  const [players, setPlayers] = useState<Jogador[]>([])
  const [times, setTimes] = useState<Time[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playersData, timesData] = await Promise.all([
          getJogadores(),
          getTimes()
        ])
        setPlayers(playersData)
        setTimes(timesData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return { players, times, loading }
}