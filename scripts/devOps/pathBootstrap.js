const tsConfigPaths = require('tsconfig-paths')

const baseUrl = './dist/server'

tsConfigPaths.register({
  baseUrl,
  paths: {},
})
