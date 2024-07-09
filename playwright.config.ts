import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";
import path from "path";
import dotenv from "dotenv";

const config: PlaywrightTestConfig = {
  testDir: "./tests",
  testMatch: "**/*.test.ts",
  timeout: 60 * 1000,
  expect: {
    timeout: 50 * 1000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["list"],
    ["./customJSONReporter.ts"],
    ["html", { outputFolder: "./test-results/html", open: "never" }],
  ],
  use: {
    launchOptions: {
      args: ["--disable-web-security", "--start-maximized"],
    },
    actionTimeout: 0,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    ...dotenv.config({
      path: path.resolve(__dirname, "envs", `.env.${process.env.ENV}`),
    }).parsed,
  },
  projects: getProjects(),
  outputDir: "./test-results",
};

function getProjects() {
  const browserName = process.env.BROWSER ?? "Desktop Chrome";
  return [
    {
      name: browserName as string,
      ...{ ignoreHTTPSErrors: true },
      ...devices[browserName],
    },
  ];
}

export default config;
