#!/usr/bin/env node

import { Command } from "commander";
import { confirm, input } from "@inquirer/prompts";
import { execa } from "execa";
import { detectRunningPackageManager } from "./utils/detectPkgMgr.js";
import { tryCatch } from "./utils/tryCatch.js";
import { OnInterruptPrompt } from "./utils/onInterruptPrompt.js";
import { createViteProject, installTailwind } from "./utils/setup.js";

let appName = "vite-tailwind-app";

export function cli() {
  const program = new Command();

  program
    .argument(
      "[dir]",
      "Directory to create the app in (or '.' for current dir)",
      "."
    )
    .action(async (dir) => {
      const pm = detectRunningPackageManager();

      if (pm === "unknown") {
        console.log(
          "Please run the cli using a supported package manager: npm, yarn, pnpm or bun"
        );
        process.exit(1);
      }

      let appName = dir;

      if (appName === ".") {
        console.log("Scaffolding a new Vite app in the current directory...");
      } else {
        console.log(`Scaffolding a new Vite app in '${appName}'...`);
      }

      if (appName === ".") {
        const useCurrent = await tryCatch(
          confirm({
            message: "Use the current directory?",
            default: true,
          }),
          {
            onError: async (error) => {
              OnInterruptPrompt(appName);
            },
          }
        ).then((res) => res.data);

        if (!useCurrent) {
          appName = await tryCatch(
            input({
              message: "What do you want to name your app?",
              default: "vite-tailwind-app",
            }),
            {
              onError: async (error) => {
                OnInterruptPrompt(appName);
              },
            }
          ).then((res) => res.data);
        }
      } else {
        // They already provided a name on the cli, ill skip ig
      }

      await tryCatch(createViteProject(pm, appName), {
        onError: (error) => {
          console.error("Failed to create Vite app:", error);
          process.exit(1);
        },
      });

      if (appName !== ".") {
        await tryCatch(process.chdir(appName), {
          onError: (error) => {
            console.log(`Failed to change directory to ${appName}: ${error}`);
          },
        });
      }

      let useTailwind = false;

      useTailwind = !!(await tryCatch(
        confirm({
          message: "Would your like to install tailwind?",
        }),
        {
          onError: async (error) => {
            OnInterruptPrompt(appName);
          },
        }
      ).then((result) => result.data));

      if (useTailwind) {
        console.log("Installing tailwind...");

        await tryCatch(installTailwind(pm), {
          onError: async (error) => {
            console.error("Failed to install Tailwind:", error);
            process.exit(1);
          },
        });
      }

      await tryCatch(execa(pm, ["install"], { stdio: "inherit" }), {
        onError: async (error) => {
          console.log("Failed to install dependencies:", error);
        },
      });
    });

  program.parse();
}
