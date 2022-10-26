Organize router files based on this template
/client/src/containers
```
import { useEffect } from 'react'
const Template = () => {
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

  // ------------------------------------------------------------ UI --

  if (!show) return null

  return (
    <div />
  )
}

export default Template
```
