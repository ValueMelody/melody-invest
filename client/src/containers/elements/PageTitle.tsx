import {
  BookmarkIcon, ChartPieIcon, CircleStackIcon,
  PresentationChartLineIcon, PuzzlePieceIcon, StarIcon,
} from '@heroicons/react/24/solid'
import classNames from 'classnames'
import { useMemo } from 'react'

type Icon = 'star' | 'history' | 'pie' | 'bookmark' | 'boxes' | 'performance'

const PageTitle = ({
  className,
  title,
  icon = 'star',
}: {
  className?: string;
  title: string;
  icon?: Icon;
}) => {
  const IconElement = useMemo(() => {
    switch (icon) {
      case 'performance':
        return PresentationChartLineIcon
      case 'boxes':
        return PuzzlePieceIcon
      case 'bookmark':
        return BookmarkIcon
      case 'history':
        return CircleStackIcon
      case 'pie':
        return ChartPieIcon
      case 'star':
      default:
        return StarIcon
    }
  }, [icon])

  return (
    <h2 className={classNames(className, 'flex items-center font-semibold text-xl')}>
      <IconElement className='mr-2 w-6 h-6' />
      {title}
    </h2>
  )
}

export default PageTitle
