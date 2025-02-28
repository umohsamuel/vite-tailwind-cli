import { execa } from "execa";

export async function onCancel(appName: string) {
  process.chdir("..");
  try {
    await execa("rm", ["-rf", "test-app"], {
      stdio: "inherit",
      shell: true,
    });
    console.log(`Successfully cleaned up...`);
  } catch (err) {
    console.error(`Error occured while cleaning up: ${err}`);
  }
}
