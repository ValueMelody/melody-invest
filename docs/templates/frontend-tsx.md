Organize router files based on this template
/client/src/containers
```
import { useState, useEffect } from 'react'

const Template = () => {
  const classes = useStyles()

  // ------------------------------------------------------------ State --

  const [localState, setLocalState] = useState(null)
  const {getVisibility, fetchSomething } = useTemplateState()
  const show = getVisibility()

  // ------------------------------------------------------------ Effect --
  useEffect(() => {
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