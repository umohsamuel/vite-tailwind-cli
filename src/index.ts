import { Command } from "commander";
import { confirm } from "@inquirer/prompts";
import { execa } from "execa";
import fs, { mkdir } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";

const viteConfig = `import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
});`;

const cssConfig = `@import "tailwindcss";`;

function directoryExists(dirPath: string): boolean {
  return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
}

function detectRunningPackageManager() {
  const userAgent = process.env.npm_config_user_agent || "";
  if (userAgent.includes("pnpm")) {
    return "pnpm";
  } else if (userAgent.includes("yarn")) {
    return "yarn";
  } else if (userAgent.includes("npm")) {
    return "npm";
  } else if (userAgent.includes("bun")) {
    return "bun";
  }
  return "unknown";
}

export function cli() {
  const program = new Command();

  program
    .name("test-cli-app")
    .description("Yeah, trying out ts")
    .version("0.0.1");

  program.action(async () => {
    const pm = detectRunningPackageManager();

    if (pm === "unknown") {
      console.log(
        "Please run the cli using a supported package manager: npm, yarn, pnpm or bun"
      );
    }

    if (directoryExists("test-app")) {
      // console.log("Directory already exists, please delete it and try again");
      console.log("Directory already exists");

      // process.exit(1);
    } else {
      mkdir("test-app", (err) => {
        console.log(`Failed to create directory for app: ${err}`);
      });
    }

    try {
      process.chdir("test-app");
    } catch (error) {
      console.log(`Failed to change directory to test-app: ${error}`);
    }

    console.log("current directory: ", process.cwd());

    if (pm === "npm") {
      console.log("Creating a new vite app with npm...");

      await execa(`${pm}`, ["create vite@latest ."], {
        stdio: "inherit",
        shell: true,
      });
    } else {
      console.log(`Creating a new vite app with ${pm}...`);
      await execa(`${pm}`, ["create vite ."], {
        stdio: "inherit",
        shell: true,
      });
    }

    await execa(`${pm}`, ["install"], {
      stdio: "inherit",
    });

    const useTailwind = await confirm({
      message: "Would your like to install tailwind?",
    });

    if (useTailwind) {
      console.log("Installing tailwind...");
      await execa(`${pm}`, ["install", "tailwindcss", "@tailwindcss/vite"], {
        stdio: "inherit",
      });

      await writeFile("vite.config.ts", viteConfig, {
        encoding: "utf-8",
      });

      const oldCss = await readFile("/src/index.css", "utf8");
      const updatedCss = cssConfig + "\n\n" + oldCss;
      await writeFile("/src/index.css", updatedCss, {
        encoding: "utf-8",
      });

      // this is to ensure tailwind autocompelete works in vscode
      await execa("touch", ["tailwind.config.ts"]);
    }
  });

  program.parse();
}

cli();
