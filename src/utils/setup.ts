import { execa } from "execa";
import { readFile, writeFile } from "node:fs/promises";
import { tryCatch } from "./tryCatch.js";
import { cssConfig, viteConfig } from "../lib/tailwind.js";

export async function createViteProject(pm: string, appDir: string) {
  if (pm === "npm") {
    await execa(pm, ["create", "vite@latest", appDir], {
      stdio: "inherit",
      shell: true,
    });
  } else {
    await execa(pm, ["create", "vite", appDir], {
      stdio: "inherit",
      shell: true,
    });
  }
}

export async function installTailwind(pm: string) {
  await tryCatch(
    execa(pm, ["install", "tailwindcss", "@tailwindcss/vite"], {
      stdio: "inherit",
    }),
    {
      onError: (error) => {
        console.log("Failed to install Tailwind:", error);
      },
    }
  );

  await tryCatch(writeFile("vite.config.ts", viteConfig, "utf-8"), {
    onError: (error) => {
      console.log("Failed to write vite.config.ts:", error);
    },
  });

  // this is to ensure tailwind autocompelete works in vscode
  await tryCatch(
    execa("touch", ["tailwind.config.ts"], {
      stdio: "inherit",
      shell: true,
    }),
    {
      onError: (error) => {
        console.log("Failed to create tailwind.config.ts:", error);
      },
    }
  );

  await tryCatch(
    (async () => {
      process.chdir("src");
      const oldCss = await readFile("index.css", "utf8");
      const updatedCss = cssConfig + "\n\n" + oldCss;
      await writeFile("index.css", updatedCss, "utf-8");
    })(),
    {
      onError: (error) => {
        console.log("Failed to update index.css:", error);
      },
      onFinally: () => {
        process.chdir("..");
      },
    }
  );
}
