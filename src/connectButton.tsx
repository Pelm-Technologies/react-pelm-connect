import * as React from 'react'

import { useConnect } from './useConnect'
import { Config } from './types/index'

type Props = {
    config: Config
    className?: string;
    children?: React.ReactNode;
}

export const ConnectButton = (props: Props) => {
    const { open, ready, error } = useConnect(props.config);

    return (
        <>
            <button
                type="button"
                // className="button"
                onClick={() => open()}
                // disabled={!ready || error}
                disabled={!ready}
            >
                {
                    props.children === undefined
                    ? "Connect your utility"
                    : props.children
                }
            </button>
        </>
        
    )
}