import { execa } from "execa";

export async function onCancel(appName: string) {
  if (appName === ".") {
    return;
  }

  try {
    await execa("rm", ["-rf", appName], {
      stdio: "inherit",
      shell: true,
    });
    console.log(`Successfully cleaned up...`);
  } catch (err) {
    console.error(`Error occured while cleaning up: ${err}`);
  }
}
