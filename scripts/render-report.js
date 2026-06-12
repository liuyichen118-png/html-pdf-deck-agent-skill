const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const sharp = require("sharp");
const { PDFDocument } = require("pdf-lib");

const DEFAULT_VIEWPORT = { width: 1280, height: 720 };
const DEFAULT_SELECTORS = [
  ".slide",
  ".content",
  ".card",
  ".metric",
  ".flow-step",
  ".matrix .cell",
  ".check",
  ".dash-card",
  ".time-card",
  ".process .pitem",
  ".quote-band",
  ".lead",
  "h1.title",
  ".scope-row div",
  ".arch-body",
  ".status",
];

const TEXT_SELECTORS = [
  "h1",
  "h2",
  "h3",
  "h4",
  "p",
  "li",
  "td",
  "th",
  ".title",
  ".lead",
  ".card",
  ".metric",
  ".flow-step",
  ".check",
  ".scope-row",
  ".quote-band",
  ".matrix .cell",
  ".dash-card",
  ".time-card",
  ".process .pitem",
];

function usage() {
  console.error("Usage: npm run render -- <report.html> <output-dir>");
  process.exit(1);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function findBrowserExecutable() {
  if (process.env.PRESENTATION_PIPELINE_BROWSER) {
    return process.env.PRESENTATION_PIPELINE_BROWSER;
  }

  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
  ];

  return candidates.find((candidate) => fs.existsSync(candidate));
}

async function collectOverflowIssues(page) {
  return page.evaluate((selectors) => {
    const nodes = selectors.flatMap((sel) =>
      Array.from(document.querySelectorAll(sel)).map((el) => ({ sel, el }))
    );
    const result = [];

    for (const { sel, el } of nodes) {
      const r = el.getBoundingClientRect();
      const slide = el.closest(".slide");
      const sr = slide ? slide.getBoundingClientRect() : null;
      const overflowX = el.scrollWidth > el.clientWidth + 1;
      const overflowY = el.scrollHeight > el.clientHeight + 1;
      const outsideSlide =
        sr &&
        (r.left < sr.left - 1 ||
          r.right > sr.right + 1 ||
          r.top < sr.top - 1 ||
          r.bottom > sr.bottom + 1);

      if (overflowX || overflowY || outsideSlide) {
        result.push({
          selector: sel,
          text: (el.innerText || "").replace(/\s+/g, " ").slice(0, 160),
          overflowX,
          overflowY,
          outsideSlide,
          scroll: { width: el.scrollWidth, height: el.scrollHeight },
          client: { width: el.clientWidth, height: el.clientHeight },
          rect: {
            left: Math.round(r.left),
            top: Math.round(r.top),
            width: Math.round(r.width),
            height: Math.round(r.height),
          },
        });
      }
    }

    return result;
  }, DEFAULT_SELECTORS);
}

async function collectContentVisibilityIssues(page) {
  return page.evaluate((textSelectors) => {
    const slides = Array.from(document.querySelectorAll(".slide"));
    const issues = [];

    function textColorAlpha(style) {
      const color = style.color || "";
      const rgba = color.match(/rgba?\(([^)]+)\)/i);
      if (!rgba) return 1;
      const parts = rgba[1].split(",").map((part) => part.trim());
      if (parts.length < 4) return 1;
      const alpha = Number.parseFloat(parts[3]);
      return Number.isFinite(alpha) ? alpha : 1;
    }

    function isVisibleTextNode(el, slideRect) {
      const text = (el.innerText || el.textContent || "").replace(/\s+/g, " ").trim();
      if (text.length < 2) return false;

      const style = window.getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden") return false;
      if (Number.parseFloat(style.opacity || "1") < 0.08) return false;
      if (textColorAlpha(style) < 0.08) return false;
      if (Number.parseFloat(style.fontSize || "0") < 7) return false;

      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return false;
      if (rect.bottom < slideRect.top || rect.top > slideRect.bottom) return false;
      if (rect.right < slideRect.left || rect.left > slideRect.right) return false;
      return true;
    }

    slides.forEach((slide, index) => {
      const slideRect = slide.getBoundingClientRect();
      const allText = (slide.innerText || "").replace(/\s+/g, " ").trim();
      const textNodes = textSelectors.flatMap((sel) => Array.from(slide.querySelectorAll(sel)));
      const visibleTextNodes = textNodes.filter((el) => isVisibleTextNode(el, slideRect));
      const visibleText = visibleTextNodes
        .map((el) => (el.innerText || el.textContent || "").replace(/\s+/g, " ").trim())
        .filter(Boolean)
        .join(" ");

      const nonBackgroundBlocks = Array.from(
        slide.querySelectorAll(
          ".card, .metric, .flow-step, .matrix, .check, .scope-row, .quote-band, .dash-card, .time-card, .process, .arch, .arch-body, .status, table, img, svg"
        )
      ).filter((el) => {
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          Number.parseFloat(style.opacity || "1") >= 0.08 &&
          rect.width >= 8 &&
          rect.height >= 8 &&
          rect.bottom >= slideRect.top &&
          rect.top <= slideRect.bottom &&
          rect.right >= slideRect.left &&
          rect.left <= slideRect.right
        );
      });

      const isLikelyCover = index === 0;
      const minVisibleChars = isLikelyCover ? 10 : 35;
      const minVisibleTextNodes = isLikelyCover ? 1 : 2;

      if (visibleText.length < minVisibleChars || visibleTextNodes.length < minVisibleTextNodes) {
        issues.push({
          slide: index + 1,
          type: "low_visible_text",
          text_char_count: allText.length,
          visible_text_char_count: visibleText.length,
          visible_text_node_count: visibleTextNodes.length,
          non_background_block_count: nonBackgroundBlocks.length,
          sample_text: allText.slice(0, 180),
        });
      }

      if (!isLikelyCover && nonBackgroundBlocks.length < 1 && visibleText.length < 80) {
        issues.push({
          slide: index + 1,
          type: "no_visible_content_blocks",
          text_char_count: allText.length,
          visible_text_char_count: visibleText.length,
          visible_text_node_count: visibleTextNodes.length,
          non_background_block_count: nonBackgroundBlocks.length,
          sample_text: allText.slice(0, 180),
        });
      }
    });

    return issues;
  }, TEXT_SELECTORS);
}

async function collectImageContentIssues(imagePaths) {
  const issues = [];
  for (let i = 0; i < imagePaths.length; i += 1) {
    const stats = await sharp(imagePaths[i]).stats();
    const entropy = stats.entropy || 0;
    const stdevAvg =
      stats.channels.reduce((sum, channel) => sum + (channel.stdev || 0), 0) /
      Math.max(stats.channels.length, 1);

    if (entropy < 1.5 || stdevAvg < 6) {
      issues.push({
        slide: i + 1,
        type: "low_image_variation",
        entropy: Number(entropy.toFixed(3)),
        stdev_avg: Number(stdevAvg.toFixed(3)),
        image: imagePaths[i],
      });
    }
  }
  return issues;
}

async function makeMontage(imagePaths, outPath) {
  if (!imagePaths.length) return null;

  const thumbWidth = 320;
  const thumbHeight = 180;
  const labelHeight = 24;
  const gap = 20;
  const columns = Math.min(4, imagePaths.length);
  const rows = Math.ceil(imagePaths.length / columns);
  const width = columns * thumbWidth + (columns + 1) * gap;
  const height = rows * (thumbHeight + labelHeight) + (rows + 1) * gap;

  const composites = [];
  for (let i = 0; i < imagePaths.length; i += 1) {
    const col = i % columns;
    const row = Math.floor(i / columns);
    const left = gap + col * (thumbWidth + gap);
    const top = gap + row * (thumbHeight + labelHeight + gap);
    const resized = await sharp(imagePaths[i])
      .resize(thumbWidth, thumbHeight, { fit: "contain", background: "#f4f7f8" })
      .png()
      .toBuffer();
    const label = Buffer.from(
      `<svg width="${thumbWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg"><text x="0" y="17" font-family="Arial" font-size="14" fill="#4b5563">page-${String(
        i + 1
      ).padStart(2, "0")}</text></svg>`
    );
    composites.push({ input: resized, left, top });
    composites.push({ input: label, left, top: top + thumbHeight + 4 });
  }

  await sharp({
    create: {
      width,
      height,
      channels: 3,
      background: "#ffffff",
    },
  })
    .composite(composites)
    .png()
    .toFile(outPath);
  return outPath;
}

async function makeImagePdf(imagePaths, outPath, viewport) {
  if (!imagePaths.length) return null;

  const pdfDoc = await PDFDocument.create();
  for (const imagePath of imagePaths) {
    const pngBytes = fs.readFileSync(imagePath);
    const png = await pdfDoc.embedPng(pngBytes);
    const page = pdfDoc.addPage([viewport.width, viewport.height]);
    page.drawImage(png, {
      x: 0,
      y: 0,
      width: viewport.width,
      height: viewport.height,
    });
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outPath, pdfBytes);
  return outPath;
}

async function main() {
  const htmlArg = process.argv[2];
  const outArg = process.argv[3];
  if (!htmlArg || !outArg) usage();

  const htmlPath = path.resolve(htmlArg);
  const outDir = path.resolve(outArg);
  if (!fs.existsSync(htmlPath)) {
    throw new Error(`HTML file not found: ${htmlPath}`);
  }

  ensureDir(outDir);
  const previewDir = path.join(outDir, "preview");
  ensureDir(previewDir);

  const executablePath = findBrowserExecutable();
  const launchOptions = { headless: true };
  if (executablePath) launchOptions.executablePath = executablePath;

  const browser = await chromium.launch(launchOptions);
  const page = await browser.newPage({
    viewport: DEFAULT_VIEWPORT,
    deviceScaleFactor: 2,
  });

  await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "screen" });

  const slideCount = await page.$$eval(".slide", (slides) => slides.length).catch(() => 0);
  const issues = await collectOverflowIssues(page);
  const contentVisibilityIssues = await collectContentVisibilityIssues(page);
  const pdfPath = path.join(outDir, `${path.basename(htmlPath, path.extname(htmlPath))}.pdf`);
  await page.pdf({
    path: pdfPath,
    width: `${DEFAULT_VIEWPORT.width}px`,
    height: `${DEFAULT_VIEWPORT.height}px`,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  const imagePaths = [];
  if (slideCount > 0) {
    const slides = await page.$$(".slide");
    for (let i = 0; i < slides.length; i += 1) {
      const imagePath = path.join(previewDir, `page-${String(i + 1).padStart(2, "0")}.png`);
      await slides[i].screenshot({ path: imagePath });
      imagePaths.push(imagePath);
    }
  } else {
    const imagePath = path.join(previewDir, "page-01.png");
    await page.screenshot({ path: imagePath, fullPage: true });
    imagePaths.push(imagePath);
  }

  const montagePath = path.join(outDir, "montage.png");
  await makeMontage(imagePaths, montagePath);
  const imageContentIssues = await collectImageContentIssues(imagePaths);
  const imagePdfPath = path.join(
    outDir,
    `${path.basename(htmlPath, path.extname(htmlPath))}-image.pdf`
  );
  await makeImagePdf(imagePaths, imagePdfPath, DEFAULT_VIEWPORT);

  const qa = {
    source_html: htmlPath,
    output_pdf: pdfPath,
    output_image_pdf: imagePdfPath,
    montage: montagePath,
    slides: slideCount || 1,
    viewport: DEFAULT_VIEWPORT,
    browser_executable: executablePath || "playwright-managed",
    overflow_issue_count: issues.length,
    content_visibility_issue_count: contentVisibilityIssues.length,
    image_content_issue_count: imageContentIssues.length,
    issues,
    content_visibility_issues: contentVisibilityIssues,
    image_content_issues: imageContentIssues,
  };

  const qaPath = path.join(outDir, "qa.json");
  fs.writeFileSync(qaPath, JSON.stringify(qa, null, 2));
  await browser.close();

  console.log(
    JSON.stringify(
      {
        pdfPath,
        imagePdfPath,
        qaPath,
        montagePath,
        overflow_issues: issues.length,
        content_visibility_issues: contentVisibilityIssues.length,
        image_content_issues: imageContentIssues.length,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
