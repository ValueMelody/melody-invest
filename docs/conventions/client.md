## Only use libraries from vendorTool

```
// Good
import * as vendorTool from '../tools/vendor'
const useStyles = vendorTool.jss.createUseStyles(({}))

// Bad
import { createUseStyles } from 'react-jss'
const useStyles = createUseStyles(({}))
```
