import * as vendorTool from '../../tools/vendor'
import * as localeTool from '../../tools/locale'

const useShowMore = () => {
  // ------------------------------------------------------------ state --

  const [displayedTotal, setDisplayedTotal] = vendorTool.react.useState(5)

  // ------------------------------------------------------------ handler --

  const handleClickShowMore = () => {
    setDisplayedTotal(displayedTotal + 10)
  }

  // ------------------------------------------------------------ render --

  const renderShowMoreButton = () => (
    <div className='row-around'>
      <vendorTool.ui.Button onClick={handleClickShowMore}>
        {localeTool.t('common.showMoreHistory')}
      </vendorTool.ui.Button>
    </div>
  )

  // ------------------------------------------------------------ export --

  return {
    displayedTotal,
    renderShowMoreButton,
  }
}

export default useShowMore
