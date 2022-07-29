export type Config = {
  connectToken: string;
  onSuccess: (authorizationCode: string) => void;
  onExit: (status: string, metadata: {}) => void;
  environment?: string;
}