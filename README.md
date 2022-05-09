![](https://img.shields.io/badge/Foundry-v9-informational)
![Latest Release Download Count](https://img.shields.io/github/downloads/DarKDinDoN/foundryvtt-miro-connector/latest/module.zip)

# Foundry VTT Miro Connector

A module to embed miro boards within FVTT.

Features:

- Embed a Miro board within Foundry VTT, so you don't have to switch between tabs
- Capable of sending actors, items image & name + journal content & image (PDF also) to the board through Miro's API

Restrictions:

- To display the Miro board within Foundry VTT, one must be logged-in on Miro as well. Meaning, you can't use the native eletron app
- To activate the upload features, you need a running server with a domain name and follow some steps explained below
- Miro can't handle webp files, so don't try to send webp though the API
- When sending journal notes texts to Miro, you need to manually resize the shape to see the full text

## How-to

### 1. Simple board display

1. Just copy paste the board's ID to the settings: `https://miro.com/app/ID-IS-HERE/`
2. Activate the option in the settings
3. A new scene will be create upon reload. You can freely rename it
4. Activate or just view this scene to view the Miro board

### 2. API (doesn't need the board to be displayed within FVTT)

1. Copy paste the board's ID to the settings: `https://miro.com/app/ID-IS-HERE/`
2. Register to the new API V2 by creating a dev team (you won't need to invite poeple to this team): https://developers.miro.com/docs/create-a-developer-team-in-miro
3. Create a new App: https://miro.com/app/settings/user-profile/apps?featuresOn=PLATFORMV2_BETA_TESTER
   1. Name it
   2. Do not check the expiration checkbox
   3. Chose "SDK V2"
   4. Give it permissions: read & write (board)
   5. Click "Install app and get OAuth token" and chose your dev team (not your own account)
   6. Copy the access token printed on the screen
4. Create a CORS proxy server (this is required for the browser to talk with the Miro's API)
   1. A simple proxy server for that is: https://github.com/Rob--W/cors-anywhere
   2. You can find a slightly modified version of this same package in the `cors-proxy` folder of this repository
   3. Unzip it somewhere on your server
   4. You'll need a (sub)domain name and a SSL certificate
   5. if you use PM2, you can start the server with the following command: `HOST="DOMAIN-NAME" PORT=PORT KEY="PATH-TO-SSL-PRIVATE-KEY (privkey)" CERT="PATH-TO-SSL-CERTIFICATE (fullchain)" WHITELIST="https://DOMAIN-NAME1,https://DOMAIN-NAME2,https://DOMAIN-NAME3" pm2 start /path/to/cors-anywhere/server.js --name "cors-anywhere"`
   6. A couple of things to note here: you **need** a domain with a SSL certificate for your proxy server. And you can (not mandatory) list some domains that are allowed (WHITELIST) to use this service (typically, your FVTT instance)
5. Paste the Miro's access token & the cors proxy url in the settings
6. Activate the setting if you want your players to use this feature as well (they do not require to access your dev team)
7. Right-click an actor, an item or a journal note in the right sidebar, then click on "Send to Miro"
8. Enjoy :)
