import * as localeTool from 'tools/locale'
import { Button } from 'flowbite-react'
import { useState } from 'react'

const useShowMore = () => {
  // ------------------------------------------------------------ state --

  const [displayedTotal, setDisplayedTotal] = useState(5)

  // ------------------------------------------------------------ handler --

  const handleClickShowMore = () => {
    setDisplayedTotal(displayedTotal + 10)
  }

  // ------------------------------------------------------------ render --

  const renderShowMoreButton = () => (
    <div
      className='flex justify-center'
      data-testid='showMore'
    >
      <Button onClick={handleClickShowMore}>
        {localeTool.t('common.showMoreHistory')}
      </Button>
    </div>
  )

  // ------------------------------------------------------------ export --

  return {
    displayedTotal,
    renderShowMoreButton,
  }
}

export default useShowMore
