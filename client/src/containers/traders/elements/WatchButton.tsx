import * as localeTool from 'tools/locale'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'
import { Button } from 'flowbite-react'
import { MouseEvent } from 'react'

const WatchButton = ({
  isWatched,
  onToggle,
}: {
  isWatched: boolean;
  onToggle: () => void;
}) => {
  const handleToggle = (e: MouseEvent) => {
    e.stopPropagation()
    onToggle()
  }

  const Icon = isWatched ? EyeSlashIcon : EyeIcon

  return (
    <Button
      data-testid='watchButton'
      size='xs'
      color={isWatched ? 'gray' : undefined}
      onClick={handleToggle}
    >
      <Icon className='icon-size mr-2' />
      {localeTool.t(isWatched ? 'watchButton.unwatch' : 'watchButton.watch')}
    </Button>
  )
}

export default WatchButton
