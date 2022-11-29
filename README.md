# Quick Start
```
sudo npm install -g pm2
cp ./client/.env.example ./client/.env
cp ./server/.env.example ./server/.env
npm install
npm start
```

# Project Structure:
```
scripts -> scripts for maintain project
  mocks -> mocks for vendor libraries for testing purpose

interfaces -> interfaces for DB models, API requests and responses

constants -> constants shared by both client and server

client -> React.js hosted Frontend site for general customers
  adapters -> wrappers for outer resources
  containers -> React components
    blocks -> larger reusable components depend on state
    elements -> smaller reusable components do not depend on state
  enums -> constants used for client only
  locales -> translation files for client only
  hooks -> functions to handle specific task by hooks
  stores -> state management by redux
    shared -> single purpose function to handle store data
  actions -> api requests
  tools -> pure helper functions
  index.css -> basic shared styles

server -> Express.js hosted Backend APIs for general requests
  adapters -> wrappers for outer resources
  enums -> constants used for server only
  locales -> translation files for server only
  middlewares -> middlewares for auth and access
  models -> database access functions
  routers -> routers for API endpoints
  services -> business logic handlers
    shared -> single purpose business logic functions
  tasks -> cli routings
  templates -> email templates
  tools -> pure helper functions
```