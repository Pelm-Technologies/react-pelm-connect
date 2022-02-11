import * as React from "react";

import { useState, useEffect } from 'react';
import useScript from 'react-script-hook';

import { Config } from './types/index'

type PelmConnect = {
    create: (config: Config) => Promise<PelmFactory>;
}

interface PelmFactory {
    validateToken: (token: string) => Promise<boolean>;
    open: () => Promise<{}>;
}

declare global {
    interface Window {
        PelmConnect: PelmConnect;
    }
}

export const useConnect = (config: Config) => {

    const [error, setError] = useState<Error | undefined | null>()

    const [loading, scriptError] = useScript({ src: 'http://api.pelm.com/connect/pelm-connect.js', checkForExisting: true });
    // const [loading, scriptError] = useScript({ src: 'https://pelm-staging.herokuapp.com/connect/pelm-connect.js', checkForExisting: true });
    // const [loading, scriptError] = useScript({ src: 'http://127.0.0.1:5000/connect/pelm-connect.js', checkForExisting: true });
    

    // internal state
    const [pelmFactory, setPelmFactory] = React.useState<PelmFactory | null>(null);

    useEffect(() => {
        if (loading) {
            return;
        }

        if (scriptError || !window.PelmConnect) {
            // eslint-disable-next-line no-console
            console.error('Error loading Pelm', scriptError);
            return;
        }

        async function createFactory() {
            try {
                const next = await window.PelmConnect.create(config)
                setPelmFactory(next)
            } catch (e) {
                setError(e)
            }
        }

        createFactory()

    }, [loading, scriptError]);


    return {
        error,
        ready: pelmFactory != null && !loading,
        exit: () => {},
        open: pelmFactory ? pelmFactory.open : () => {},
    };
}