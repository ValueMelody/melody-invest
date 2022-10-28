import { useState } from 'react'
import { Button } from 'flowbite-react'
import * as localeTool from 'tools/locale'
import useCommonStyle from 'styles/useCommonStyle'
import classNames from 'classnames'

const useShowMore = () => {
  // ------------------------------------------------------------ state --

  const { commonClasses } = useCommonStyle()
  const [displayedTotal, setDisplayedTotal] = useState(5)

  // ------------------------------------------------------------ handler --

  const handleClickShowMore = () => {
    setDisplayedTotal(displayedTotal + 10)
  }

  // ------------------------------------------------------------ render --

  const renderShowMoreButton = () => (
    <div className={classNames(commonClasses.rowAround, 'mt-6')} data-testid='showMore'>
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
