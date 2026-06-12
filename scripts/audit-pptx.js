const fs = require("fs");
const path = require("path");
const JSZip = require("jszip");

function stripXml(xml) {
  return xml
    .replace(/<a:t>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

async function auditPptx(pptxPath, outPath) {
  const data = fs.readFileSync(pptxPath);
  const zip = await JSZip.loadAsync(data);
  const slideNames = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => {
      const ai = Number(a.match(/slide(\d+)\.xml/)[1]);
      const bi = Number(b.match(/slide(\d+)\.xml/)[1]);
      return ai - bi;
    });

  const mediaNames = Object.keys(zip.files).filter((name) => /^ppt\/media\//.test(name) && !zip.files[name].dir);
  const slides = [];

  for (const name of slideNames) {
    const xml = await zip.files[name].async("string");
    const text = stripXml(xml);
    const shapeCount = (xml.match(/<p:sp\b/g) || []).length;
    const pictureCount = (xml.match(/<p:pic\b/g) || []).length;
    const graphicFrameCount = (xml.match(/<p:graphicFrame\b/g) || []).length;
    const relName = name.replace("ppt/slides/", "ppt/slides/_rels/") + ".rels";
    let relMediaCount = 0;
    if (zip.files[relName]) {
      const relXml = await zip.files[relName].async("string");
      relMediaCount = (relXml.match(/Target="\.\.\/media\//g) || []).length;
    }
    const isLikelyBlank =
      text.length < 8 && shapeCount <= 1 && pictureCount === 0 && graphicFrameCount === 0 && relMediaCount === 0;
    slides.push({
      slide: Number(name.match(/slide(\d+)\.xml/)[1]),
      text_chars: text.length,
      text_preview: text.slice(0, 120),
      shape_count: shapeCount,
      picture_count: pictureCount,
      graphic_frame_count: graphicFrameCount,
      rel_media_count: relMediaCount,
      is_likely_blank: isLikelyBlank,
    });
  }

  const blankSlides = slides.filter((slide) => slide.is_likely_blank);
  const result = {
    source_pptx: path.resolve(pptxPath),
    slide_count: slideNames.length,
    media_count: mediaNames.length,
    blank_slide_count: blankSlides.length,
    blank_slides: blankSlides.map((slide) => slide.slide),
    pass: slideNames.length > 0 && blankSlides.length === 0,
    slides,
  };
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
  return result;
}

async function main() {
  const pptxPath = process.argv[2];
  const outPath = process.argv[3] || "pptx-audit.json";
  if (!pptxPath) {
    console.error("Usage: node scripts/audit-pptx.js <deck.pptx> [audit.json]");
    process.exit(1);
  }
  const result = await auditPptx(pptxPath, outPath);
  console.log(JSON.stringify(result, null, 2));
  if (!result.pass) process.exit(2);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
