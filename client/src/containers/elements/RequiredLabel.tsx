import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles(({
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
    <h5>
      <b>
        {title}&nbsp;
        <span className={classes.required}>*</span>
      </b>
    </h5>
  )
}

export default RequiredLabel
