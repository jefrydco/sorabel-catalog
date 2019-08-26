# Sorabel Catalog

Recreating sorabel catalog page

## Introduction
This project can be accessed through this link [http://sorabel-catalogs.web.app](http://sorabel-catalogs.web.app), you can log in into the admin by accessing the `/login` page. The authentication system is handled by firebase, you only need to click the login button and Firebase will guide through the authentication process.

After the sign in process completes, you'll be redirected into admin page located in `/admin`. You can manage product and category there.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

First, We should have [node](https://nodejs.org/en/), and make sure it's version 8.10 or above.

```bash
$ node -v
8.1x

# install dependencies
$ yarn # Or npm install
```

Recommended to use `yarn` to management npm dependency.

### Development

To run this project in development environment, execute this command

```bash
$ yarn start
```

Usually, the development server will run on port 8000. You can check it directly by visiting http://localhost:5000

## Running the tests

Execute this command:

```bash
$ yarn test
```

## Deployment

### Build

To build for production environment run this command

```bash
$ yarn build
```

it will generate `dist` directory inside the root of this project. The content of that directory is

```bash
$ tree ./dist
./dist
├── index.html
├── umi.css
└── umi.js
```

### Local Verification

To verify the build result, we can `serve` it locally before publishing.

```bash
$ yarn global add serve
$ serve ./dist

Serving!

- Local:            http://localhost:5000
- On Your Network:  http://{Your IP}:5000

Copied local address to clipboard!
```

Then visit http://localhost:5000

### Deploy

#### Now

After verified, we can deploy it to anywhere. Here an example of deployment using [now](https://now.sh/)

```bash
$ yarn global add now
$ now ./dist
```

#### Firebase Hosting
If you are prefer using [Firebase Hosting](https://firebase.google.com/docs/hosting), make sure the `firebase.json` contains hosting configuration like this:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

After that you can run this command to deploy

```bash
$ firebase deploy --only hosting
```

## Built With

* [UmiJS](https://umijs.org/) - Pluggable enterprise-level react application framework
* [Ant Design](https://ant.design/) - The world&#39;s second most popular React UI framework
* [DVA](https://dvajs.com/) - React and redux based, lightweight and elm-style framework.

## Authors

* **Jefry Dewangga** - [@jefrydco](https://twitter.com/jefrydco)

## License

This project is licensed under the MIT License - see the [LICENSE.md](./license.md) file for details
