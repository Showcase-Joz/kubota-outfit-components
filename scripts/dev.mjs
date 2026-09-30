import { spawn } from "node:child_process";
import { once } from "node:events";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const app = fileURLToPath(new URL("../tools/resizing-tool/", import.meta.url));
const require = createRequire(new URL("../package.json", import.meta.url));
const appRequire = createRequire(new URL("../tools/resizing-tool/package.json", import.meta.url));
const compiler = require.resolve("typescript/bin/tsc");
const webpack = appRequire.resolve("webpack-cli/bin/cli.js");
const args = process.argv.slice(2).filter((arg) => arg !== "--");
const preview = args.includes("--preview");
const standalone = args.includes("--standalone");
const forwarded = args.filter((arg) => arg !== "--preview" && arg !== "--standalone");
if (!forwarded.some((arg) => arg === "--port" || arg.startsWith("--port="))) {
  forwarded.push("--port", preview ? "8088" : "8081");
}
const children = new Set();
let stopping = false;

function stop(code) {
  if (stopping) return;
  stopping = true;
  process.exitCode = code;
  for (const child of children) child.kill("SIGTERM");
  const timer = setTimeout(() => {
    for (const child of children) child.kill("SIGKILL");
  }, 3000);
  timer.unref();
}
process.on("SIGINT", () => stop(0));
process.on("SIGTERM", () => stop(0));

function launch(script, params, cwd, watch = false) {
  const child = spawn(process.execPath, [script, ...params], { cwd, stdio: "inherit" });
  children.add(child);
  child.on("error", (error) => { console.error(error); stop(1); });
  child.on("exit", (code) => {
    children.delete(child);
    if (watch && !stopping) stop(code || 1);
  });
  return child;
}

try {
  // Finish an initial build before webpack resolves the workspace package.
  const [code] = await once(launch(compiler, [], root), "exit");
  if (code !== 0) stop(code || 1);
  if (!stopping) {
    launch(compiler, ["--watch", "--preserveWatchOutput"], root, true);
    const mode = preview ? ["--env", "preview"] : standalone ? ["--env", "standalone"] : [];
    launch(webpack, ["serve", ...mode, ...forwarded], app, true);
  }
} catch (error) {
  console.error(error);
  stop(1);
}
