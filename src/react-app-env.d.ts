/// <reference types="react-scripts" />

// Subpath-export type shim for @mirageshield/mirage.
// CRA 5 ships TS 4.9 with `moduleResolution: "node"`, which doesn't read the
// package's `exports` field for subpath type resolution. Webpack resolves the
// runtime JS fine; we just need to tell TS the module exists and re-export its
// types from the bundled .d.ts so consumers get full typings.
declare module '@mirageshield/mirage/react' {
  export * from '@mirageshield/mirage/dist/react';
}
