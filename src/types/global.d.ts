declare global {
  declare module globalThis {
      var __IS_INCREMENTAL_UPD_ENABLED: boolean;
  }
}

  export {}; // To mark this file as a module