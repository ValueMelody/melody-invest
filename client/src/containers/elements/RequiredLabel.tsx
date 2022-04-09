import * as vendorTool from '../../tools/vendor'

const useStyles = vendorTool.jss.createUseStyles(({
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

  // ------------------------------------------------------------ Interface --

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
