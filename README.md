This package provides a react wrapper over Pelm Link, a javascript plugin that allows your users to securely and seamlessly connect their utility accounts to Pelm.

If you need to integrate Pelm Link in a non-react web application, view these docs.

## Install
```
npm install pelm-link
```

## Link Token


The first step is creating a Link Token. This is an extra security measure that abstracts away information like your `client_id` and `user_id` from the client.

You can obtain a Link Token by making the following request.

```
curl --request POST 'http://api.pelm.com/auth/connect-token' \
--header 'client_id: YOUR_CLIENT_ID' \
--header 'client_secret: YOUR_CLIENT_SECRET' \
--form 'user_id="USER_ID"'
```

More information on the Link Token can be found in the docs [here](https://pelm.readme.io/reference/post_auth-connect-token).




## Config

The next step is creating a Config object to initialize Connect. 

The Config option takes in the following parameters.
- `linkToken`: the Link Token created in the previous step
- `onSuccess`: this is the callback that is called when your User successfully connects their utility account. This callback should take an `authorizationCode: string` parameter, which you'll use to get an [`access_token`](https://pelm.readme.io/reference/post_auth-token-1).
- `onExit`: this is the callback that is called when Link is exited but the user has not successfully connected their utility account. The callback will be called if the user manually exits Link or if an error occurs causing Link to close.
- `environment`: optional parameter to set the environment. Set this to use Link in `sandbox` mode, which allows you to play around with Link without using real data. If this is ommitted, then Link will default to `prod` mode.

Example Config object:
```
config: Config = {
    linkToken: 'LINK_TOKEN',
    onSuccess: (authorizationCode: string) => {...},
    onExit: () => {},
    environment?: 'prod'
}
```

## Using Link

### Hook Implementation

Implementation using [React Hooks](https://reactjs.org/docs/hooks-intro.html).

<!-- TODO: change this code -->

```
import { useConnect, Config } from 'pelm-connect';

const Connect = (props: Props) => {
    const config: Config = {
        linkToken: 'LINK_TOKEN',
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
        linkToken: 'LINK_TOKEN',
        onSuccess: (authorizationCode: string) => {...},
        onExit: () => {...}
    };

    return <ConnectButton config={config} />
}

export default Connect
```
