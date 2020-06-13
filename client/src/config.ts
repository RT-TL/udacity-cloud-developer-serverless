// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '4j9yzxse0f'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-2.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-ktkrf397.eu.auth0.com',            // Auth0 domain
  clientId: 'yyCLn0RnfzmTlKA3ZTYhQVzfETGbjzC8',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
