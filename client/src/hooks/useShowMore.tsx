import * as localeTool from 'tools/locale'
import { Button } from 'flowbite-react'
import { useState } from 'react'

const useShowMore = () => {
  const [displayedTotal, setDisplayedTotal] = useState(5)

  const handleClickShowMore = () => {
    setDisplayedTotal(displayedTotal + 10)
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
