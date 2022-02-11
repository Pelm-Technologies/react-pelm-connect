export type Config = {
  connectToken: string;
  onSuccess: (authorizationCode: string) => void;
  onExit: () => void;
  environment?: string;
}