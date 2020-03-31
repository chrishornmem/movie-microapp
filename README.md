# Movie Microapp
Example movie micro-app using ONEm Framework.

## Pre-requisites

1. Verify you have Node and NPM installed (Node version greater than 9.0.0 is recommended)

2. Sign up for a free api key at https://www.themoviedb.org/account/signup

3. Sign up for a free ONEm developer account at https://developer-portal.onem.zone/

Optional:

4. To run locally, install ngrok from https://ngrok.com/

## Installation

```
$ npm install
```

### Configuration

1. Create a ```.env``` file in the project root path:

```
PORT=3000
READ_ACCESS_TOKEN=<themoviedb API Read Access Token (v4 auth)>
TOKEN_SECRET=<any random string>
```

2. If you're running locally, then use [ngrok](https://www.ngrok.com) to give you a publicly accessible url to your Micro-app at ```localhost:3000```

```
$ ngrok http 3000
```

Make a note of the link, eg ```https://6f1ca7d4.ngrok.io```

3. In the ONEm Developer Portal, select "Create App" and set:

*  *callback path* to your app ```<basepath>/api```, eg: ```https://6f1ca7d4.ngrok.io/api```
*  *token secret* to the value of TOKEN_SECRET from ```.env```

4. In the ONEm Developer Portal, select your new app and then select ```Web channel```.  Copy/paste the code into the ```body``` section of the ```/public/index.html``` of your Micro-app

### Running

```
$ node index
```

In your browser, visit ```localhost:3000``` (or where ever your app is configured to listen)

The ONEm Micro-app should be visible in bottom right-hand corner.  Click the icon to open.

More details at https://developer-docs.onem.zone


