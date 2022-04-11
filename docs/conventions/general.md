## use console.info for console.log that need to stay in the code base

```
// Good
console.info(`Checking something`)

// Bad
console.log(`Checking something`)
```

## direct export while declare function/variable

```
// Good
export const doingSomthing = () => {}

// Bad
const doingSomthing = () => {}
exports {
  doingSomething
}
```

## use import * as filenameTypeName

```
// Good
import * as userEnum from '../enums/user'

// Bad
import { userTypes } from '../enums/user'
```

## list import from same folder together

```
// Good
import * as userEnum from '../enums/user'
import * as commonEnum form '../enums/common'
import * as parseTool from '../tools/parse'
import * as localeTool from '../tools/locale'

// Bad
import * as userEnum from '../enums/user'
import * as localeTool from '../tools/locale'
import * as commonEnum form '../enums/common'
import * as parseTool from '../tools/parse'
```
