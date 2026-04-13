import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const outputDir = path.resolve(projectRoot, "../site");
const indexPath = path.join(outputDir, "index.html");

const variants = ["school", "institution"];

async function main() {
  const indexHtml = await fs.readFile(indexPath, "utf8");

  await Promise.all(
    variants.map(async (variant) => {
      const html = indexHtml.replace(
        "<head>",
        `<head>\n    <script>window.__DECK_AUDIENCE__ = "${variant}";</script>`
      );

      await fs.writeFile(path.join(outputDir, `${variant}.html`), html, "utf8");
    })
  );

  console.log(`Generated HTML variants: ${variants.join(", ")}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
