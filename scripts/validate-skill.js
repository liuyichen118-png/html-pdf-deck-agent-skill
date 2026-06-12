const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const skillPath = path.join(root, "SKILL.md");
const skillNamePattern = /^[a-z0-9-]+$/;

function fail(message) {
  console.error(`Skill validation failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(skillPath)) {
  fail("SKILL.md is missing");
}

const text = fs.readFileSync(skillPath, "utf8");
const match = text.match(/^---\n([\s\S]*?)\n---\n/);
if (!match) {
  fail("SKILL.md must start with YAML frontmatter");
}

const fields = {};
for (const line of match[1].split("\n")) {
  const fieldMatch = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
  if (fieldMatch) {
    fields[fieldMatch[1]] = fieldMatch[2].trim().replace(/^["']|["']$/g, "");
  }
}

if (!fields.name) fail("frontmatter field `name` is required");
if (!skillNamePattern.test(fields.name)) {
  fail("frontmatter field `name` must use lowercase letters, digits, and hyphens only");
}
if (!fields.description || fields.description.length < 40) {
  fail("frontmatter field `description` must be descriptive");
}
if (text.slice(match[0].length).trim().length < 200) {
  fail("SKILL.md body is too short to guide an agent");
}

console.log(`Skill is valid: ${fields.name}`);
