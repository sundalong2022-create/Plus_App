import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const rootDir = process.cwd();
const tempDir = path.join(rootDir, "tmp", "tabbar");
const outputDir = path.join(rootDir, "miniprogram", "assets", "tabbar");

mkdirSync(tempDir, { recursive: true });
mkdirSync(outputDir, { recursive: true });

const iconSpecs = [
  {
    name: "home",
    activeColor: "#0D8E69",
    inactiveColor: "#8A93A7",
    draw: (color) => `
      <path d="M18 37.5L40.5 18L63 37.5V61.5C63 64.8 60.3 67.5 57 67.5H46.5V48H34.5V67.5H24C20.7 67.5 18 64.8 18 61.5Z" fill="none" stroke="${color}" stroke-width="5" stroke-linejoin="round"/>
    `
  },
  {
    name: "wrongbook",
    activeColor: "#FF8A00",
    inactiveColor: "#8A93A7",
    draw: (color) => `
      <rect x="20" y="18" width="41" height="49" rx="7" fill="none" stroke="${color}" stroke-width="5"/>
      <path d="M31 31H50" stroke="${color}" stroke-width="5" stroke-linecap="round"/>
      <path d="M31 43H50" stroke="${color}" stroke-width="5" stroke-linecap="round"/>
      <path d="M31 55H43" stroke="${color}" stroke-width="5" stroke-linecap="round"/>
      <path d="M24 18V67" stroke="${color}" stroke-width="5" stroke-linecap="round"/>
    `
  },
  {
    name: "parent",
    activeColor: "#3977D6",
    inactiveColor: "#8A93A7",
    draw: (color) => `
      <circle cx="40.5" cy="28" r="10" fill="none" stroke="${color}" stroke-width="5"/>
      <path d="M24 61.5C24 51.8 31.8 44 41.5 44H39.5C49.2 44 57 51.8 57 61.5" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round"/>
      <path d="M18 61.5H63" stroke="${color}" stroke-width="5" stroke-linecap="round"/>
    `
  }
];

const createSvg = (paths) => `
  <svg xmlns="http://www.w3.org/2000/svg" width="81" height="81" viewBox="0 0 81 81">
    <rect width="81" height="81" rx="24" fill="#FFFFFF" fill-opacity="0"/>
    ${paths}
  </svg>
`;

const buildIcon = (spec, isActive) => {
  const color = isActive ? spec.activeColor : spec.inactiveColor;
  const svgPath = path.join(tempDir, `${spec.name}${isActive ? "_active" : ""}.svg`);
  const pngPath = path.join(outputDir, `${spec.name}${isActive ? "_active" : ""}.png`);

  writeFileSync(svgPath, createSvg(spec.draw(color)));
  execFileSync("sips", ["-s", "format", "png", svgPath, "--out", pngPath], { stdio: "ignore" });
};

iconSpecs.forEach((spec) => {
  buildIcon(spec, false);
  buildIcon(spec, true);
});

console.log("Tab icons generated at", outputDir);
