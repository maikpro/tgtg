# Too Good to Go Favorites Watcher

## Description

watches your favorite tgtg posts to notify you when an item is available.

-   start with `npm start`
-   nodemon with `npm start:watch`

### add .env in source folder with this structure:

```
BASE_URL = https://apptoogoodtogo.com/api
AUTH_EMAIL = /auth/v3/authByEmail
REQUEST_POLLING_ID_URL = /auth/v3/authByRequestPollingId
REFRESH_URL = /auth/v3/token/refresh
ITEMS_URL = /item/v8/

# Crawling time in SECONDS!
CRAWLING_INTERVAL = 30

# Token Filename
TOKEN_FILENAME = tgtg_token.json

# Cookie Filename
COOKIE_FILENAME = tgtg_cookie.txt

# Bot settings
# How to get a Bot Token? -> https://core.telegram.org/bots#how-do-i-create-a-bot
TELEGRAM_BOT_TOKEN = <YOUR_BOT_TOKEN>

# How to get a Chat ID? -> https://stackoverflow.com/a/38388851
# https://api.telegram.org/bot<TOKEN>/getUpdates
CHAT_ID=<YOUR_CHAT_ID>

# TooGoodToGo Account E-Mail
YOUR_EMAIL = <email>
```

### Dev ToDo's:

-   [x] tgtg watcher should run in scheduled time
-   [x] refresh token after an interval
-   [x] add Telegram Bot
-   [x] save token in file
-   [x] send message on quantity-change
-   [ ] add commands to telegram bot
