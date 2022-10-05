# Pelm Connect
This package provides a react wrapper over Connect, a javascript plugin that allows your users to securely and seamlessly connect their utility accounts.

## Install
```
npm install react-pelm-connect
```

## Connect Token


The first step is creating a Connect Token. This is an extra security measure that abstracts away information like your `Pelm-Client-Id` and `Pelm-Secret` from the client.

You can obtain a Connect Token by making the following request.

```
curl --request POST 'https://api.pelm.com/auth/connect-token' \
--header 'Pelm-Client-Id: YOUR_PELM_CLIENT_ID' \
--header 'Pelm-Secret: YOUR_PELM_SECRET' \
--form 'user_id="USER_ID"'
--form 'utility_id="UTILITY_ID"'
```

Include the optional `utility_id` parameter if you want your User to skip the Utility Selection Screen. You can find a list of `utility_id`s [here](https://docs.pelm.com/reference/utilities).

More information on the Connect Token can be found in the docs [here](https://pelm.readme.io/reference/post_auth-connect-token).




## Config

The next step is creating a Config object to initialize Connect. 

The Config option takes in the following parameters.
- `connectToken`: the Connect Token created in the previous step
- `onSuccess`: this is the callback that is called when your User successfully connects their utility account. This callback should take an - `authorizationCode: string` parameter, which you'll use to get an [`access_token`](https://pelm.readme.io/reference/post_auth-token-1).
- `onExit`: this is the callback that is called when Connect is exited but the user has not successfully connected their utility account. The callback will be called if the user manually exits Connect or if an error occurs causing Connect to close. This callback accepts `status: string` and `metadata: any` arguments.
  - The `status` argument indicates what caused Connect to exit. This is safe for programmatic use and can take one of the following values:
    - `user_initiated_exit`: the user closed Connect by clicking the "x" button or clicking outside the modal.
    - `unavailable_utility_credentials_submitted`: the user submitted credentials for a utility that Pelm does not yet support.
  - The `metadata` argument provides additional context. In the case of `unavailable_utility_credentials_submitted`, `metadata` will provide information on which utility the user submitted credentials for as an object like `{utility_id: '8', utility_name: 'Cherokee Electric Cooperative'}`



Example Config object:
```
config: Config = {
    connectToken: 'CONNECT_TOKEN',
    onSuccess: (authorizationCode: string) => {...},
    onExit: (status: string, metadata: any) => {}
}
```

## Using Connect

### Hook Implementation

Implementation using [React Hooks](https://reactjs.org/docs/hooks-intro.html).

<!-- TODO: change this code -->

```
import { useConnect, Config } from 'react-pelm-connect';

const Connect = (props: Props) => {
    const config: Config = {
        connectToken: 'CONNECT_TOKEN',
        onSuccess: (authorizationCode: string) => {...},
        onExit: () => {...}
    };

    const { open, ready, error } = useConnect(config);

    return <button
        type="button"
        className="button"
        onClick={() => open()}
        disabled={!ready}
    >
        Connect your utility
    </button>
}

export default Connect
```

### Styled Button

We also provide a styled button you can use.

```
import { ConnectButton, Config } from 'react-pelm-connect';

const Connect = (props: Props) => {
    const config: Config = {
        connectToken: 'CONNECT_TOKEN',
        onSuccess: (authorizationCode: string) => {...},
        onExit: () => {...}
    };

    return <ConnectButton config={config} />
}

export default Connect
```

### Directly loading javascript script

If you want to implement Connect into a non-React web application, follow this implementation.
```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Pelm Connect Javascript Demo</title>
    <script src='https://cdn.pelm.com/initialize.js'></script>
    <script>
      (async () => {
        const generateConnectToken = async function() {
          // This should be a call to your server, which then makes a request to Pelm.
          // We're making a request directly to Pelm here for your convenience.
          const options = {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Pelm-Client-Id': 'YOUR_CLIENT_ID',
              'Pelm-Secret': 'YOUR_SECRET',
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
              user_id: 'YOUR_SUBMITTED_USER_ID',
            })
          };
          return await fetch('https://api.pelm.com/auth/connect-token', options)
            .then(response => response.json())
            .then(response => {return response['connect_token']})
            .catch(err => console.error(err));
        }
        
        const connectToken = await generateConnectToken();
        const onSuccess = (authorizationCode) => {
          // Send authorizationCode to your server and exchange for access_token
          console.log(`onSuccess called with authorizationCode: ${authorizationCode}`);
        };
        const onExit = (status, metadata) => {
          console.log(`onExit called with status ${status} and metadata ${metadata}`);
        };
        const config = {
            connectToken,
            onSuccess,
            onExit,
        }
        const handler = window.PelmConnect.create(config)

        const connectUtilityButton = document.getElementById("connect-utility-button");
        connectUtilityButton.disabled = false;
        connectUtilityButton.addEventListener("click", (event) => {
          handler.open();
        });
      })()
    </script>
  </head>
  <body>
    <h1>Pelm Connect Javascript Demo</h1>
    <button id='connect-utility-button' disabled>Connect utility</button>
  </body>
</html>
```
