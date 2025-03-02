import { onCancel } from "./onCancel.js";

export async function OnInterruptPrompt(appName: string) {
  console.log("Prompt was interrupted. Exiting...");
  await onCancel(appName);
  // process.exit(1);
}
