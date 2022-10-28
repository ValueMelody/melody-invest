import classNames from 'classnames'
import { Badge } from 'flowbite-react'
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid'
import { createUseStyles } from 'react-jss'
import * as parseTool from 'tools/parse'
import * as localeTool from 'tools/locale'
import useCommonStyle from 'styles/useCommonStyle'

const useStyles = createUseStyles(({
  container: {
    marginRight: '2rem !important',
  },
  label: {
    marginLeft: '0.5rem !important',
  },
  icon: {
    marginLeft: '0.5rem !important',
  },
}))

const ValueDiffer = ({
  title,
  currentValue,
  compareValue,
}: {
  title: string,
  currentValue: number;
  compareValue: number;
}) => {
  // ------------------------------------------------------------ State --

  const classes = useStyles()
  const { commonClasses } = useCommonStyle()

  const differ = (currentValue - compareValue) / compareValue
  const isPositive = differ > 0

  // ------------------------------------------------------------ UI --

  if (!differ) return null

  return (
    <div
      data-testid='valueDiffer'
      className={classNames(
        commonClasses.rowStart,
        classes.container,
      )}
    >
      {title && <h5>{title}:</h5>}
      <Badge
        color={isPositive ? 'success' : 'failure'}
        className={classes.label}
        icon={isPositive ? ArrowTrendingUpIcon : ArrowTrendingDownIcon}
        title={localeTool.t(isPositive ? 'profile.value.increased' : 'profile.value.decreased')}
      >
        {parseTool.floatToPercent(differ)}
      </Badge>
    </div>
  )
}

export default ValueDiffer
