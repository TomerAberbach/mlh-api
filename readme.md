# MLH API

[![NPM version](https://img.shields.io/npm/v/mlh-api.svg)](https://www.npmjs.com/package/mlh-api)

> A wrapper for the Major League Hacking (MLH) API.

## Install

Install with [npm](https://www.npmjs.com):

```sh
$ npm i mlh-api --save
```

## Usage

Configuring the module:
```js
const mlh = require('./index')

mlh.configure({
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  redirectUri: 'YOUR_REDIRECT_URI'
})
```

### Authorization Code Flow

Redirect your user to this url:
```js
const url = mlh.authorizationCodeUrl(['your', 'scopes', 'here'])
```

Get the authorization code from the MLH callback to obtain an access token:
```js
mlh.accessTokenFromAuthorizationCode(code).then(() => {
  // Module is now configured with the access token
  // Get user object
  return mlh.user()
}).then(user => {
  // Do stuff with user object
})
```

### Implicit Authorization Flow

Redirect your user to this url:
```js
const url = mlh.implicitAuthorizationUrl(['your', 'scopes', 'here'])
```

Set the access token from the MLH callback:
```js
mlh.configure({ accessToken: token })

// Make user requests
mlh.users(1, 100).then(users => {
  // Do stuff with users
})
```

Please visit the module [documentation](https://tomeraberba.ch/mlh-api) and the [MLH API documentation](https://my.mlh.io/docs) for more information

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/TomerAberbach/mlh-api/issues/new).

## Author

**Tomer Aberbach**

* [Github](https://github.com/TomerAberbach)
* [NPM](https://www.npmjs.com/~tomeraberbach)
* [LinkedIn](https://www.linkedin.com/in/tomer-a)
* [Website](https://tomeraberba.ch)

## License

[MIT](https://github.com/TomerAberbach/mlh-api/blob/main/license) © [Tomer Aberbach](https://github.com/TomerAberbach)
