# Environment
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

# Prerequisite
- Create a postgres database "melody-invest"
- Get a Tiingo API KEY

# Quick Start
```
cp ./client/.env.example ./client/.env # Replace env vars if needed
cp ./server/.env.example ./server/.env # Replace env vars if needed, including redis, database, mailer configs
npm install
npm run shared
cd server
npm run migrate
cd ../
npm run dev # open http://127.0.0.1:3099 in browser
```

# Data Preparation
## Initial Preparation
Save your Tiingo key on "Profile" page
Create tickers on "Manage Tickers" Page
```
cd server
npm run build
```

## Daily Preparation
```
# Sync prices of your tickers
npm run syncTickerPrices yyyy-MM-DD

# Calculate price movements based on ticker prices
npm run calcPriceMovements

# Prepare daily ticker data for final calculation
npm run calcDailyTickers
```

## Weekly Preparation
```
# Sync financial statements of your tickers
npm run syncTickerFinancials yyyy-MM

# Calculate financial movements based on financial data
npm run calcFinancialMovements

# Update indicator tables with most up to date data
# Calculate economy indicator movemeents based on economy data
npm run calcIndicatorMovements

# Prepare daily indicator data for final calculation
npm run calcDailyIndicators
```

## Indicator Data References
Yearly Inflation: https://www.usinflationcalculator.com/inflation/current-inflation-rates/  
Yearly GDP: https://en.wikipedia.org/wiki/Economy_of_the_United_States  
Quarterly Seasonal GDP: https://fred.stlouisfed.org/series/NA000254Q  
Monthly Funds Rate: https://fred.stlouisfed.org/series/FEDFUNDS  
Monthly 30 Years Treasury Yield: https://fred.stlouisfed.org/series/DGS30  
Monthly 10 Years Treasury Yield: https://fred.stlouisfed.org/series/DGS10  
Monthly CPI: https://www.usinflationcalculator.com/inflation/consumer-price-index-and-annual-percent-changes-from-1913-to-2008/  
Monthly Consumer Sentiment: http://www.sca.isr.umich.edu/  
Monthly Unemployment Rate: https://data.bls.gov/timeseries/LNS14000000  
Monthly Nonfarm Payroll: https://fred.stlouisfed.org/series/PAYNSA  
