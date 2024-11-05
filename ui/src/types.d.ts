type React = import("react");

// global.d.ts
export {};

declare global {
  interface Window {
    ship?: string;
  }
}
