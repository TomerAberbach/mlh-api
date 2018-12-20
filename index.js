const url = require('url')
const request = require('request-promise-native')

const options = {
  clientId: undefined,
  clientSecret: undefined,
  redirectUri: undefined,
  accessToken: undefined
}

/**
 * Configures this module with MLH API information. All parameters should be
 * passed in an object, and all parameters are optional. Only parameters
 * provided will be set. The valid parameters are clientId, clientSecret,
 * redirectUri, and accessToken.
 *
 * Please visit the MLH API documentation for more information:
 * https://my.mlh.io/docs
 */
module.exports.configure = ({ clientId, clientSecret, redirectUri, accessToken } = {}) => {
  options.clientId = clientId || options.clientId
  options.clientSecret = clientSecret || options.clientSecret
  options.redirectUri = redirectUri || options.redirectUri
  options.accessToken = accessToken || options.accessToken
}

const authorizationUrl = (type, scopes) => url.format({
  protocol: 'https',
  hostname: 'my.mlh.io',
  pathname: '/oauth/authorize',
  query: {
    'client_id': options.clientId,
    'redirect_uri': options.redirectUri,
    'scope': scopes.join('+'),
    'response_type': type
  }
})

/**
 * Constructs and returns an authorization code flow url to redirect a user
 * to with the given scopes. clientId and redirectUri must have been set
 * using the configure method for the url to be valid.
 *
 * Please visit the MLH API documentation for more information:
 * https://my.mlh.io/docs
 *
 * @param {Array<string>} scopes - Array of scopes to include in the url.
 * @returns {string}
 */
module.exports.authorizationCodeUrl = scopes => authorizationUrl('code', scopes)

/**
 * Acquires an access token using the provided authorization code and returns
 * a promise which is resolved once the access token has been set. The access
 * token is not returned in the promise because it is used automatically in
 * other methods.
 *
 * Please visit the MLH API documentation for more information:
 * https://my.mlh.io/docs
 *
 * @param {string} code - Authorization code obtained from an MLH callback.
 * @returns {Promise<undefined>}
 */
module.exports.accessTokenFromAuthorizationCode = code =>
  request({
    method: 'POST',
    url: 'https://my.mlh.io/oauth/token',
    qs: {
      'client_id': options.clientId,
      'client_secret': options.clientSecret,
      'code': code,
      'redirect_uri': options.redirectUri,
      'grant_type': 'authorization_code'
    },
    json: true
  }).then(res => {
    options.accessToken = res['access_token']
  })

/**
 * Constructs and returns an implicit authorization flow url to redirect a user
 * to with the given scopes. clientId and redirectUri must have been set
 * using the configure method for the url to be valid.
 *
 * Please visit the MLH API documentation for more information:
 * https://my.mlh.io/docs
 *
 * @param {Array<string>} scopes - Array of scopes to include in the url.
 * @returns {string}
 */
module.exports.implicitAuthorizationUrl = scopes =>
  authorizationUrl('token', scopes)

/**
 * Returns a promise containing a user object using the currently set access
 * token. The access token could have been set using the configure method or the
 * accessTokenFromAuthorizationCode method.
 *
 * Please visit the MLH API documentation for more information:
 * https://my.mlh.io/docs
 *
 * @returns {Promise<object>}
 */
module.exports.user = () =>
  request({
    method: 'GET',
    url: 'https://my.mlh.io/api/v2/user.json',
    qs: {
      'access_token': options.accessToken
    },
    json: true
  })

/**
 * Returns a promise containing a users paging object. clientId and clientSecret
 * must have been set using the configure method for the url to be valid.
 *
 * Please visit the MLH API documentation for more information:
 * https://my.mlh.io/docs
 *
 * @param {int} [page] - The page to get (default: 1).
 * @param {int} [perPage] - The number of users per page (default: 250).
 */
module.exports.users = (page = 1, perPage = 250) =>
  request({
    method: 'GET',
    url: 'https://my.mlh.io/api/v2/users.json',
    qs: {
      'client_id': options.clientId,
      'secret': options.clientSecret,
      'page': page,
      'per_page': perPage
    },
    json: true
  })