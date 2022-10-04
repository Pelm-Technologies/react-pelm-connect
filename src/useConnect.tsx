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
    exit: () => Promise<{}>;
}

declare global {
    interface Window {
        PelmConnect: PelmConnect;
    }
}

export const useConnect = (config: Config) => {
    // For internal use
    let initializeScriptUrl: string;
    switch(config.environment) {
        case 'staging': {
            initializeScriptUrl = 'https://cdn-staging.pelm.com/initialize.js'
            break;
        }
        case 'development': {
            initializeScriptUrl = 'http://localhost:8080/initialize.js'
            break;
        }
        default: {
            initializeScriptUrl = 'https://cdn.pelm.com/initialize.js'
            break;
        }
    }

    const [error, setError] = useState<Error | undefined | null>()
    const [loading, scriptError] = useScript({ src: initializeScriptUrl, checkForExisting: true });

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

    }, [config, loading, scriptError]);

    return {
        error,
        ready: pelmFactory != null && !loading,
        exit: pelmFactory ? () => pelmFactory.exit() : () => {},
        open: pelmFactory ? () => pelmFactory.open() : () => {},
    };
}