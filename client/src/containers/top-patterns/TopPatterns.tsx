import { useEffect } from 'react'
import usePattern from '../../states/usePattern'

const TopPatterns = () => {
  const { topPatterns, fetchTopPatterns } = usePattern()
  console.log(topPatterns)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchTopPatterns() }, [])

  return (
    <div>
      top
    </div>
  )
}

export default TopPatterns
