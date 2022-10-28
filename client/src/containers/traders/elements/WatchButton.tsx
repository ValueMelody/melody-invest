import { MouseEvent } from 'react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'
import { Button } from 'flowbite-react'
import { createUseStyles } from 'react-jss'
import * as localeTool from 'tools/locale'

const useStyles = createUseStyles(({
  action: {
    marginTop: '0.5rem !important',
    marginRight: '0.5rem !important',
    padding: '0.5rem 1rem !important',
  },
}))

const WatchButton = ({
  isWatched,
  onToggle,
}: {
  isWatched: boolean;
  onToggle: () => void;
}) => {
  const classes = useStyles()

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
      className={classes.action}
      color={isWatched ? 'gray' : undefined}
      onClick={handleToggle}
    >
      <Icon className='w-4 h-4 mr-4' />
      {localeTool.t(isWatched ? 'common.unwatch' : 'common.watch')}
    </Button>
  )
}

export default WatchButton
