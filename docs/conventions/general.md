## prefer null over undefined
```
// Good
const find = (value: number | null): number | null => {
  return nums.find((num) => num === value) || null
}

// Bad
const find = (value?: number) number | undefined => {
  return nums.find((num) => num === value)
}
```

## use console.info for console.log that need to stay in the code base

```
// Good
console.info(`Checking something`)

// Bad
console.log(`Checking something`)
```

## direct export while declare function/variable (Exclude internel shared modules and React components)

```
// Good
export const doingSomthing = () => {}

// Bad
const doingSomthing = () => {}
exports {
  doingSomething
}
```

## use default export for internal shared modules and React components

```
// Good
const ReactComponent = () => { return <div /> }
export default ReactComponent
const sharedServiceFunction = () => {}
export default sharedServiceFunction

// Bad
export const ReactComponent = () => { return <div /> }
export const sharedServiceFunction = () => {}
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

## always load proces.env variables into enum first

```
// Good
const commonEnum = {
  port: process.env.PORT!
}
const port = commonEnum.port

// Bad
const port = process.env.PORT!
```

## use Pascal case for constant, and object.freeze for constant in object

```
// Good
const BaseKey = Object.freeze({
  TickerPrices: 'tickerPrices',
})

// Bad
enum BASE_KEY {
  TICKER_PRICES = 'tickerPrices',
}
```

## Wrap test cases inside describe

```
// Good
describe('#functionName', () => {
  test('could do somthing', () => {
    expect(functionName()).toBeTruthy()
  }
})

// Bad
test('could do somthing', () => {
  expect(functionName()).toBeTruthy()
}
```

## Import from base when import from parent folders

```
// good
import parseTool from 'tools/parse'

// bad
import parseTool from '../../../tools/parse'
```