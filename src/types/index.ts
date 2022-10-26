export type Config = {
  connectToken: string;
  onSuccess: (authorizationCode: string) => void;
  onExit: (status: string, metadata: {}) => void;
  onReady?: () => void;
  environment?: string; // ignore - for internal use
}