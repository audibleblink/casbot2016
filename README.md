# casbot2016

A Slackbot using the Botkit npm package. Created for the Reddit Casual team. 


## Usage
From Slack

```
!live oh hai loganz
// returns xbox live gamertag status

!urban word
// returns a definition from urban dictionary

!img word
// return an image based on your search term

!ping
// return "Pong!"; mainly for testing
```

## Development

This bot needs a few environment variables to run correctly. Check out the `env` file for a template and descriptions.

Either clone this directory and run it with `npm start` or if you have Docker installed, ensure you have a populated `.env` file and run:

```sh
docker-compose build casbot-dev
docker-compose up casbot-dev
```

Run `docker ps` to see the exposed port number.

## Deployment
 The bot currently lives on a Digital Ocean droplet and is deployed with Docker using a similar command to the one above.
 
 On the droplet, ensure the `.env` is present and populated, then:
 
 ```sh
 docker-compose build casbot-prod
 docker-compose up casbot-prod
 ```
 
