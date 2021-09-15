# Bot Discord de l'IUT Nancy-Charlemagne
À noter que le bot a été créé spécialement pour le serveur Discord de l'IUT Nancy-Charlemagne, notamment concernant `enum/IDs.ts`.
## Pré-requis
- NodeJS `>16.0.0`

## Installation
- Télécharger le dépot git
- Executer la commande `npm install`
- [Setup de `BOT_TOKEN` minimum](#setup-env)
- Démarrer avec `npm start`

## Setup (`.env`)
```env
# Bot Principal (index.ts)
MAIN_BOT_TOKEN=

# Bot Twitter (twitter.ts)
TWITTER_BOT_TOKEN
CONSUMER_KEY=
CONSUMER_SECRET=
ACCESS_TOKEN=
ACCESS_TOKEN_SECRET=

# Bot Bêta
```
- `*_BOT_TOKEN` est le token du compte **BOT Discord**
- `CONSUMER_KEY` `CONSUMER_SECRET` `ACCESS_TOKEN` `ACCESS_TOKEN_SECRET` sont les variables d'authentification pour **Twitter**
