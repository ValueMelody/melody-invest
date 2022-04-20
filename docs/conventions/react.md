## Only add minimal required variables to useEffect, useMemo and useCallback

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

## Avoid function chain

```
// Good
const handleClick = (e, id) => {}
<Button onClick={(e) => handleClick(e, id)} />

// Bad
const handleClick = (e) => (id) => {}
<Button onClick={handleClick(id)} />
```

## block component vs element component
If a component import any state hooks, then it's a block, otherwise, it is an element