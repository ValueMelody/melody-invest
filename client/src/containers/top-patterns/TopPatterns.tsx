import { useEffect } from 'react'
import usePattern from '../../states/usePattern'

const TopPatterns = () => {
  const { fetchTopPatterns } = usePattern()

  useEffect(() => { fetchTopPatterns() }, [])

  return (
    <div>
      top
    </div>
  )
}

export default TopPatterns
