import { MouseEvent } from 'react'
import { Button, Icon } from 'semantic-ui-react'
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

  // ------------------------------------------------------------ UI --

  return (
    <Button
      data-testid='watchButton'
      className={classes.action}
      color={isWatched ? 'grey' : 'blue'}
      onClick={handleToggle}
    >
      <Icon name={isWatched ? 'eye slash' : 'eye'} />
      {localeTool.t(isWatched ? 'common.unwatch' : 'common.watch')}
    </Button>
  )
}

export default WatchButton
