// Manual type definition for process.env since vite/client types might be missing in this environment.
// This ensures TypeScript recognizes process.env.API_KEY usage in the application.
declare const process: {
  env: {
    API_KEY: string;
    [key: string]: string | undefined;
  }
};
