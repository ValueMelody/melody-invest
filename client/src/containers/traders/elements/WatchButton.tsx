import { MouseEvent } from 'react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'
import { Button } from 'flowbite-react'
import * as localeTool from 'tools/locale'

const WatchButton = ({
  isWatched,
  onToggle,
}: {
  isWatched: boolean;
  onToggle: () => void;
}) => {
  // ------------------------------------------------------------ Handler --

  const handleToggle = (e: MouseEvent) => {
    e.stopPropagation()
    onToggle()
  }

  const Icon = isWatched ? EyeSlashIcon : EyeIcon

  // ------------------------------------------------------------ UI --

  return (
    <Button
      data-testid='watchButton'
      size='xs'
      color={isWatched ? 'gray' : undefined}
      onClick={handleToggle}
    >
      <Icon className='icon-size mr-2' />
      {localeTool.t(isWatched ? 'common.unwatch' : 'common.watch')}
    </Button>
  )
}

export default WatchButton
