import { onCancel } from "./onExit";

export async function OnInterruptPrompt(appName: string) {
  console.log("Prompt was interrupted. Exiting...");
  await onCancel(appName);
  // process.exit(1);
}
