# Pelm Connect
This package provides a react wrapper over Connect, a javascript plugin that allows your users to securely and seamlessly connect their utility accounts.

## Install
```
npm install react-pelm-connect
```

## Connect Token


The first step is creating a Connect Token. This is an extra security measure that abstracts away information like your `client_id` and `user_id` from the client.

You can obtain a Connect Token by making the following request.

```
curl --request POST 'https://api.pelm.com/auth/connect-token' \
--header 'client_id: YOUR_CLIENT_ID' \
--header 'client_secret: YOUR_CLIENT_SECRET' \
--form 'user_id="USER_ID"'
--form 'utility_id="UTILITY_ID"'
```

Include the optional `utility_id` parameter if you want your User to skip the Utility Selection Screen. You can find a list of `utility_id`s [here](https://docs.pelm.com/reference/utilities).

More information on the Connect Token can be found in the docs [here](https://pelm.readme.io/reference/post_auth-connect-token).




## Config

The next step is creating a Config object to initialize Connect. 

The Config option takes in the following parameters.
- `connectToken`: the Connect Token created in the previous step
- `onSuccess`: this is the callback that is called when your User successfully connects their utility account. This callback should take an `authorizationCode: string` parameter, which you'll use to get an [`access_token`](https://pelm.readme.io/reference/post_auth-token-1).
- `onExit`: this is the callback that is called when Connect is exited but the user has not successfully connected their utility account. The callback will be called if the user manually exits Connect or if an error occurs causing Connect to close.

Example Config object:
```
config: Config = {
    connectToken: 'CONNECT_TOKEN',
    onSuccess: (authorizationCode: string) => {...},
    onExit: () => {}
}
```

## Using Connect

### Hook Implementation

Implementation using [React Hooks](https://reactjs.org/docs/hooks-intro.html).

<!-- TODO: change this code -->

```
import { useConnect, Config } from 'pelm-connect';

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
import { ConnectButton, Config } from 'pelm-connect';

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
    <title>My test page</title>
  </head>
  <body>
    <h1>Pelm Connect javascript example</h1>
    <button onClick="launchPelm()">Connect utility</button>
    <script src="http://api.pelm.com/connect/pelm-connect.js"></script>
    <script>
        const launchPelm = async function() {
            const connectToken = "YOUR_CONNECT_TOKEN";
            const onSuccess = (authorizationCode) => {
                // exchange authorization code for access_token
            };
            const onExit = () => {};

            const config = {
                connectToken,
                onSuccess,
                onExit
            }

            const pelm = await window.PelmConnect.create(config);
            pelm.open()
        }
    </script>
    </body>
</html>
```
