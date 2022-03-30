import { MouseEvent } from 'react'
import { Button, Icon } from 'semantic-ui-react'
import { createUseStyles } from 'react-jss'
import * as localeTool from '../../../../tools/locale'

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

  const handleToggle = (e: MouseEvent) => {
    e.stopPropagation()
    onToggle()
  }

  return (
    <Button className={classes.action} onClick={handleToggle}>
      <Icon name='eye' />
      {localeTool.t(isWatched ? 'common.unwatch' : 'common.watch')}
    </Button>
  )
}

export default WatchButton
