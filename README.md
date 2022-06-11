# Quick Start
```
cp ./client/.env.example ./client/.env
cp ./server/.env.example ./server/.env
npm install
npm start
```

# Project Structure:
```
docs -> docs about conventions, syntaxs, and file templates
  
interfaces -> interfaces for DB models, API requests and responses
  
constants -> constants shared by both client and server
  
client -> React.js hosted Frontend site for general customers
  adapters -> wrappers for outer resources
  containers -> React components
    hooks -> shared styles, guards, UI elements
    blocks -> larger reusable components depend on state
    elements -> smaller reusable components do not depend on state
  enums -> constants used for client only
  locales -> translation files for client only
  states -> state management
  requests -> api requests  
    shared -> single purpose state sync functions
  tools -> pure helper functions
  index.css -> basic shared styles
  
server -> Express.js hosted Backend APIs for general requests
  adapters -> wrappers for outer resources
  enums -> constants used for server only
  locales -> translation files for server only
  middlewares -> express middleware functions
  models -> database access functions
  routers -> express routers
  services -> business logic handlers
    shared -> single purpose business logic functions
  tasks -> cli routings
  templates -> email templates
  tools -> pure helper functions
```