import classNames from 'classnames'
import { useMemo } from 'react'
import { StarIcon, ChartPieIcon, CircleStackIcon, BookmarkIcon, PuzzlePieceIcon } from '@heroicons/react/24/solid'

type Icon = 'star' | 'history' | 'pie' | 'bookmark' | 'boxes'

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
    <h3 className={classNames(className, 'flex items-center')}>
      <IconElement className='mr-2 w-6 h-6' />
      {title}
    </h3>
  )
}

export default PageTitle
