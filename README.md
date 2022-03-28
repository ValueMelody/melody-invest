Convention
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