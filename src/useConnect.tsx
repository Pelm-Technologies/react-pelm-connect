import * as React from "react";

import { useCallback, useState, useEffect } from 'react';
import useScript from 'react-script-hook';

import { Config } from './types/index'

const isConnectTokenDefined = (config: Config) => {
    return config.connectToken !== undefined;
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

    const [loading, error] = useScript({ src: initializeScriptUrl });
    const [isReadyToOpen, setIsReadyToOpen] = useState(false);

    const isServer = typeof window === 'undefined';
    const isReadyForInitialization =
        !isServer &&
        !!window.PelmConnect &&
        !loading &&
        !error &&
        isConnectTokenDefined(config);
    
    useEffect(() => {
        if (isReadyForInitialization && window.PelmConnect) {
            window.PelmConnect.initialize({
                ...config,
                onReady: () => setIsReadyToOpen(true),
            });
        }
    }, [isReadyForInitialization, config]);

    const open = useCallback(() => {
        if (window.PelmConnect) {
          window.PelmConnect.open(config);
        }
    }, [config]);

    const exit = useCallback(() => {
        if (window.PelmConnect) {
          window.PelmConnect.exit();
        }
    }, [config]);

    return {
        error,
        ready: isReadyToOpen,
        open,
        exit
    };
}