Conventions
--
1. Only add minimal required variables to useEffect, useMemo and useCallback  
use eslint-disable-next-line react-hooks/exhaustive-deps to disable eslint warning message
```
// Good
useEffect(() => {
  getSomethingByUserType(userType)
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [userType])

// Bad
useEffect(() => {
  getSomethingByUserType(userType)
}, [userType, getSomethingByUserType])
```

2. Avoid function chain
```
// Good
const handleClick = (e, id) => {}
<Button onClick={(e) => handleClick(e, id)} />

// Bad
const handleClick = (e) => (id) => {}
<Button onClick={handleClick(id)} />
```

3. Always add export directly to function declaration (This doesn't apply to React related files)
```
// Good
export const doingSomthing = () => {}

// Bad
const doingSomthing = () => {}
exports {
  doingSomething
}
```

4. Always use import * as filenameTypeName (This doesn't apply to React related files)
```
// Good
import * as userEnum from '../enums/user'

// Bad
import { userTypes } from '../enums/user'
```