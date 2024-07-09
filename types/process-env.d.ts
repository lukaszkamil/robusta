import { devices } from "@playwright/test";
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      APPLICATION_URL: string;
      ALREADY_EXISTS_PASSOWRD: string;
    }
  }
}

// convert into a module by adding an empty export
export {};
