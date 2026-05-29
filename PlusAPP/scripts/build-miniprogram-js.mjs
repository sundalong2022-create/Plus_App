import { watch as watchFs } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

const projectRoot = "/Users/sdragon/PlusAPP";
const sourceRoot = path.join(projectRoot, "miniprogram");
const isWatchMode = process.argv.includes("--watch");

const compilerOptions = {
  target: ts.ScriptTarget.ES2017,
  module: ts.ModuleKind.CommonJS
};

const walk = async (dirPath) => {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        return walk(fullPath);
      }

      return [fullPath];
    })
  );

  return files.flat();
};

const buildFile = async (filePath) => {
  const source = await fs.readFile(filePath, "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions, fileName: filePath });
  const outputPath = filePath.replace(/\.ts$/, ".js");
  await fs.writeFile(outputPath, outputText, "utf8");
  return outputPath;
};

const buildAll = async () => {
  const allFiles = await walk(sourceRoot);
  const tsFiles = allFiles.filter((filePath) => filePath.endsWith(".ts") && !filePath.endsWith(".d.ts"));
  const outputs = [];

  for (const filePath of tsFiles) {
    outputs.push(await buildFile(filePath));
  }

  console.log(`Built ${outputs.length} miniprogram JS files.`);
  outputs.forEach((filePath) => {
    console.log(path.relative(projectRoot, filePath));
  });
};

const removeGeneratedJs = async (filePath) => {
  const outputPath = filePath.replace(/\.ts$/, ".js");

  try {
    await fs.unlink(outputPath);
    console.log(`Removed ${path.relative(projectRoot, outputPath)}`);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return;
    }

    throw error;
  }
};

const main = async () => {
  await buildAll();

  if (!isWatchMode) {
    return;
  }

  console.log("Watching miniprogram TypeScript files...");

  let buildTimer = null;
  let building = false;
  let pendingBuild = false;

  const queueBuild = () => {
    if (buildTimer) {
      clearTimeout(buildTimer);
    }

    buildTimer = setTimeout(async () => {
      if (building) {
        pendingBuild = true;
        return;
      }

      building = true;

      try {
        await buildAll();
      } catch (error) {
        console.error(error);
      } finally {
        building = false;

        if (pendingBuild) {
          pendingBuild = false;
          queueBuild();
        }
      }
    }, 120);
  };

  watchFs(
    sourceRoot,
    { recursive: true },
    async (_eventType, filename) => {
      if (!filename || !filename.endsWith(".ts") || filename.endsWith(".d.ts")) {
        return;
      }

      const changedPath = path.join(sourceRoot, filename);

      try {
        await fs.access(changedPath);
        console.log(`Change detected: ${path.relative(projectRoot, changedPath)}`);
        queueBuild();
      } catch {
        await removeGeneratedJs(changedPath);
      }
    }
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
