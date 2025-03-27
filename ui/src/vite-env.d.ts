/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: {
    readonly VITE_SHIP_URL: string;
    readonly NODE_ENV: string;
    [key: string]: string | undefined;
  };
}
