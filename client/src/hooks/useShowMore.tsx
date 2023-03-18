import * as localeTool from 'tools/locale'
import { Button } from 'flowbite-react'
import { useState } from 'react'

interface ShowMoreProps {
  default: number;
  more: number;
}

const useShowMore = (props?: ShowMoreProps) => {
  const [displayedTotal, setDisplayedTotal] = useState(props?.default || 5)

  const handleClickShowMore = () => {
    const more = props?.more || 10
    setDisplayedTotal(displayedTotal + more)
  }

  const renderShowMoreButton = () => (
    <div className='flex justify-center'>
      <Button
        data-testid='showMore'
        onClick={handleClickShowMore}
      >
        {localeTool.t('common.showMoreHistory')}
      </Button>
    </div>
  )

  return {
    displayedTotal,
    renderShowMoreButton,
  }
}

export default useShowMore
