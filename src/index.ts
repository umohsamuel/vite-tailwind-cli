#!/usr/bin/env node

import { cli } from "./cli.js";

// process.on("SIGINT", async () => {
//   console.log("\nProcess cancelled! Exiting gracefully...");
//   await onCancel(appName);
//   // process.exit(130);
// });

cli();
