# Prerequisite
```
# setup redis
sudo apt install redis-server

# setup postgres
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update
sudo apt install postgresql-15

# setup node
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
```

# Quick Start
```
cp ./client/.env.example ./client/.env
cp ./server/.env.example ./server/.env
npm install
npm run basic
npm run dev
```

# Project Structure:
```
scripts ->
  mocks -> files used by unit test
  devOps -> files used by devOps

interfaces -> shared interfaces for the whole project
constants -> shared constants for the whole project

client -> frontend site for general users
  index.tsx -> React root
  index.css -> basic global styles
  locales -> translation files used by client only
  containers -> React components
    blocks -> larger reusable components depend on state
    elements -> smaller reusable components do not depend on state
  enums -> constants used by client only
  tools -> pure functions used by client only
  adapters -> wrappers for outer resources
  hooks -> general hooks to handle specific tasks
  actions -> Redux actions and async actions
  selectors -> Redux selectors
  stores -> Redux stores
    shared -> single purpose data parsing functions

server -> backend APIs for the whole project
  index.ts -> Express root
  cli.ts -> NPM command root
  cron.ts -> Node Cron root
  adapters -> wrappers for outer resources
  tools -> pure functions used by server only
  enums -> constants used by server only
  locales -> translation files by server only
  middlewares -> Express middlewares
  models -> database representative functions
  routers -> Express routers
  logics -> specific business logic functions
  services ->  api or cli request handlers
    shared -> single purpose data parsing functions
  tasks -> cli command handlers
  templates -> email templates
  migrations -> Knex migrations
```

# Manual Schedules
Weekly: npm run generateWeeklyData  
Daily: npm run generateDailyData  

# Manual Data Collect
Monthly Inflation data  
Monthly Consumer Sentiment data  
