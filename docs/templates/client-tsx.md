Organize router files based on this template
/client/src/containers
```
import * as vendorTool from '../tools/vendor

const Template = () => {
  const classes = vendorTool.react.useStyles()

  // ------------------------------------------------------------ State --

  const [localState, setLocalState] = useState(null)
  const {getVisibility, fetchSomething } = useTemplateState()
  const show = getVisibility()

  // ------------------------------------------------------------ Effect --

  vendorTool.react.useEffect(() => {
    fetchSomething()
  }, [])

  // ------------------------------------------------------------ Handler --

  const handleClick = () => {}

  // ------------------------------------------------------------ Interface --

  if (!show) return null

  return (
    <div />
  )
}

export default Template
```
