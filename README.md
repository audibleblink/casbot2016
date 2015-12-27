# casbot2016

A Slackbot using the Botkit npm package. Created for the Reddit Casual team. 


## Usage
From Slack

```
!live oh hai loganz
// returns xbox live gamertag status

!urban word
// returns a definition from urban dictionary

!img|!gif word
// returns an image based on your search term

!ping
// returns "Pong!" and bot uptime; mainly for testing

!seen username
// returns the last time a person was seen on Slack and their last message
```

## Development

This bot needs a few environment variables to run correctly. Check out the `env` file for a template and descriptions.

Either clone this directory and run it with `npm start` or if you have Docker installed, ensure you have a populated `.env` file and run:

```sh
docker-compose build casbot-dev
docker-compose up casbot-dev #ensures both casbot and mongodb containers are started

# subsequent starts (that is, if the mongodb container is still running) are probably better to start with:
docker-compose run --rm casbot-dev
# This ensure the container is deleted after it's stopped
```

One only has to build once since `casbot-dev` builds the development Dockerfile, which mounts this directory to the container so changes on one's local machine are reflected in the container.



Run `docker ps` to see the exposed port number.

## Deployment
 The bot currently lives on a Digital Ocean droplet and is deployed with Docker using a similar command to the one above.
 
 On the droplet, ensure the `.env` is present and populated, then from within the cloned repo:
 
 ```sh
 docker-compose up casbot-prod
 ```
 
