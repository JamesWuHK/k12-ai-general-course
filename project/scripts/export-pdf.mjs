import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const outputDir = path.resolve(projectRoot, "../site");
const previewPort = 4178;
const validAudiences = new Set(["generic", "school", "institution"]);
const requestedAudience =
  process.argv.find((argument) => argument.startsWith("--audience="))?.split("=")[1] ||
  "generic";
const audience = validAudiences.has(requestedAudience) ? requestedAudience : "generic";
const pdfFileName =
  audience === "generic"
    ? "ai-course-intro-deck.pdf"
    : `ai-course-intro-deck-${audience}.pdf`;
const pdfPath = path.join(outputDir, pdfFileName);
const audienceQuery = audience === "generic" ? "" : `&audience=${audience}`;
const deckUrl = `http://127.0.0.1:${previewPort}/?print-pdf&pdfSeparateFragments=false&pdfMaxPagesPerSlide=1${audienceQuery}`;

async function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      continue;
    }
  }

  return null;
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function waitForServer(url, timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;

  return new Promise((resolve, reject) => {
    const attempt = () => {
      const request = http.get(url, (response) => {
        response.resume();
        if (response.statusCode && response.statusCode < 500) {
          resolve();
          return;
        }

        if (Date.now() >= deadline) {
          reject(new Error(`Preview server did not become ready: ${url}`));
          return;
        }

        setTimeout(attempt, 300);
      });

      request.on("error", () => {
        if (Date.now() >= deadline) {
          reject(new Error(`Preview server did not become ready: ${url}`));
          return;
        }

        setTimeout(attempt, 300);
      });
    };

    attempt();
  });
}

async function ensureChromeExists(chromePath) {
  if (!chromePath) {
    throw new Error(
      "No supported browser found. Set CHROME_PATH or install Google Chrome."
    );
  }
}

async function removeExistingPdf() {
  await fs.mkdir(outputDir, { recursive: true });
  await fs.rm(pdfPath, { force: true });
}

function spawnPreviewServer() {
  const child = spawn(
    "npx",
    ["vite", "preview", "--host", "127.0.0.1", "--port", String(previewPort), "--strictPort"],
    {
      cwd: projectRoot,
      stdio: ["ignore", "pipe", "pipe"]
    }
  );

  let stderr = "";
  let stdout = "";

  child.stdout.on("data", (chunk) => {
    stdout += chunk.toString();
  });

  child.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
  });

  return { child, getLogs: () => ({ stdout, stderr }) };
}

async function runChromeExport(chromePath) {
  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: true
  });

  try {
    const page = await browser.newPage({
      viewport: { width: 1600, height: 900 },
      deviceScaleFactor: 1
    });

    await page.emulateMedia({ media: "print" });
    await page.goto(deckUrl, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => document.querySelectorAll(".pdf-page").length > 0, null, {
      timeout: 15000
    });
    await page.waitForTimeout(500);

    const pageCount = await page.locator(".pdf-page").count();
    if (pageCount < 2) {
      throw new Error(`Unexpected PDF page count before export: ${pageCount}`);
    }

    await page.pdf({
      path: pdfPath,
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "0",
        right: "0",
        bottom: "0",
        left: "0"
      }
    });
  } finally {
    await browser.close();
  }
}

async function main() {
  const chromePath = await findChrome();
  await ensureChromeExists(chromePath);
  await removeExistingPdf();

  const { child: previewServer, getLogs } = spawnPreviewServer();

  try {
    previewServer.on("error", (error) => {
      throw error;
    });

    await waitForServer(`http://127.0.0.1:${previewPort}/`);
    await delay(1200);
    await runChromeExport(chromePath);
    await fs.access(pdfPath);

    console.log(`PDF exported to ${pdfPath}`);
  } catch (error) {
    const { stdout, stderr } = getLogs();
    throw new Error(
      `${error.message}\n\nPreview stdout:\n${stdout || "(empty)"}\n\nPreview stderr:\n${stderr || "(empty)"}`
    );
  } finally {
    previewServer.kill("SIGTERM");
    await delay(300);
    if (!previewServer.killed) {
      previewServer.kill("SIGKILL");
    }
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
