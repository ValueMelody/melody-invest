import * as localeTool from 'tools/locale'
import { Button } from 'flowbite-react'
import { useState } from 'react'

const useShowMore = (props?: {
  default: number;
  more: number;
}) => {
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
        {localeTool.t('showMore.button')}
      </Button>
    </div>
  )

  return {
    displayedTotal,
    renderShowMoreButton,
  }
}

export default useShowMore
