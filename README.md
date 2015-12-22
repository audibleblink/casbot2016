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

Either clone this directory and run it with `npm start` or if you have Docker installed:

```sh
docker run -d -P --name casbot \
  -e XBOX_API=$XBOX_API \
  -e SLACK_TOKEN=$SLACK_TOKEN \
  -e GOOGLE_CX=$GOOGLE_CX \
  -e GOOGLE_TOKEN=$GOOGLE_TOKEN \
  audibleblink/casbot2016:develop
```

Run `docker ps` to see the exposed port number.

## Deployment
 The bot currently lives on a Digital Ocean droplet and is deployed with Docker using a similar command to the one above.
 
