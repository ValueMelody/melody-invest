import * as localeTool from 'tools/locale'
import * as parseTool from 'tools/parse'
import { ArrowTrendingDownIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/solid'
import { Badge } from 'flowbite-react'
import classNames from 'classnames'

const ValueDiffer = ({
  title,
  className,
  currentValue,
  compareValue,
  'data-testid': testId = 'valueDiffer',
}: {
  title: string;
  currentValue: number;
  compareValue: number;
  className?: string;
  ['data-testid']?: string;
}) => {
  const differ = (currentValue - compareValue) / compareValue
  const isPositive = differ > 0

  if (!differ) return null

  return (
    <section
      data-testid={testId}
      className={classNames('flex items-center', className)}
    >
      {title && <h5 className='mr-2'>{title}:</h5>}
      <Badge
        color={isPositive ? 'success' : 'failure'}
        icon={isPositive ? ArrowTrendingUpIcon : ArrowTrendingDownIcon}
        title={localeTool.t(isPositive ? 'profile.valueIncreased' : 'profile.valueDecreased')}
      >
        {parseTool.floatToPercent(differ)}
      </Badge>
    </section>
  )
}

export default ValueDiffer
