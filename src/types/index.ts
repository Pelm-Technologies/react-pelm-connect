export type Config = {
  connectToken: string;
  onSuccess: (authorizationCode: string) => void;
  onExit: (status: string, metadata: {}) => void;
  environment?: string; // ignore - for internal use
}

export type InitializeProps = Config & {
  onReady?: () => void;
}

export type PelmConnect = {
  initialize: (initializeProps: InitializeProps) => void;
  open: (config?: Config) => void;
  exit: () => void;
}

declare global {
  interface Window {
      PelmConnect: PelmConnect;
  }
}