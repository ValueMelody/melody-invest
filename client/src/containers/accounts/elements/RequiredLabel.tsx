import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles(({
  title: {
    fontWeight: 'bold',
  },
  required: {
    color: 'red',
  },
}))

const RequiredLabel = ({
  title,
}: {
  title: string;
}) => {
  const classes = useStyles()

  return (
    <h5 className={classes.title}>
      {title}&nbsp;
      <span className={classes.required}>*</span>
    </h5>
  )
}

export default RequiredLabel
