#!/usr/bin/env node

import { Command } from "commander";
import { confirm, input } from "@inquirer/prompts";
import { execa } from "execa";
import { readFile, writeFile } from "node:fs/promises";
import { onCancel } from "./utils/onExit.js";
import { cssConfig, viteConfig } from "./lib/tailwind.js";
import { detectRunningPackageManager } from "./utils/detectPkgMgr.js";

let appName = "vite-tailwind-app";

process.on("SIGINT", async () => {
  console.log("\nProcess cancelled! Exiting gracefully...");
  await onCancel(appName);
  process.exit(130);
});

export function cli() {
  const program = new Command();

  program.action(async () => {
    const pm = detectRunningPackageManager();

    if (pm === "unknown") {
      console.log(
        "Please run the cli using a supported package manager: npm, yarn, pnpm or bun"
      );
    }

    try {
      appName = await input({
        message: "What do you want to name your app?",
        default: "vite-tailwind-app",
      });
    } catch (error) {
      console.log("Prompt was interrupted. Exiting...");
      await onCancel(appName);
      process.exit(1);
    }

    if (pm === "npm") {
      console.log("Creating a new vite app with npm...");
      await execa(pm, ["create", "vite@latest", appName], {
        stdio: "inherit",
        shell: true,
      });
    } else {
      console.log(`Creating a new vite app with ${pm}...`);
      await execa(pm, ["create", "vite", appName], {
        stdio: "inherit",
        shell: true,
      });
    }

    try {
      process.chdir("appName");
    } catch (error) {
      console.log(`Failed to change directory to root: ${error}`);
    }

    let useTailwind = false;

    try {
      useTailwind = await confirm({
        message: "Would your like to install tailwind?",
      });
    } catch (error) {
      console.log("Prompt was interrupted. Exiting...");
      await onCancel(appName);
      process.exit(1);
    }

    if (useTailwind) {
      console.log("Installing tailwind...");
      await execa(pm, ["install", "tailwindcss", "@tailwindcss/vite"], {
        stdio: "inherit",
      });

      try {
        process.chdir(`${appName}`);
      } catch (error) {
        console.log(`Failed to change directory to root: ${error}`);
      }

      await writeFile("vite.config.ts", viteConfig, {
        encoding: "utf-8",
      });

      // this is to ensure tailwind autocompelete works in vscode
      await execa("touch", ["tailwind.config.ts"], {
        stdio: "inherit",
        shell: true,
      });

      try {
        process.chdir(`${appName}/src`);
      } catch (error) {
        console.log(`Failed to change directory to src: ${error}`);
      }

      const oldCss = await readFile("index.css", "utf8");
      const updatedCss = cssConfig + "\n\n" + oldCss;
      await writeFile("index.css", updatedCss, {
        encoding: "utf-8",
      });
    }

    await execa(pm, ["install"], {
      stdio: "inherit",
    });
  });

  program.parse();
}

cli();
