const fs = require('fs');
const path = require('path');

const inputFile = 'index.html';
const outputFile = 'index-bundled.html';
const assetsDir = 'assets';

let html = fs.readFileSync(inputFile, 'utf8');

// Find all unique asset references (both 'assets/...' and url('assets/...'))
const patterns = [
    /'assets\/([^']+)'/g,
    /url\('assets\/([^']+)'\)/g
];

const replacements = new Map();

for (const assetPattern of patterns) {
    let match;
    while ((match = assetPattern.exec(html)) !== null) {
        const fullMatch = match[0];
        const fileName = match[1];

        if (replacements.has(fullMatch)) continue;

        const assetPath = path.join(assetsDir, fileName);
        if (fs.existsSync(assetPath) && fs.lstatSync(assetPath).isFile()) {
            const ext = path.extname(fileName).toLowerCase();
            let mimeType = 'image/png';
            if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
            else if (ext === '.gif') mimeType = 'image/gif';
            else if (ext === '.webp') mimeType = 'image/webp';
            else if (ext === '.wav') mimeType = 'audio/wav';
            else if (ext === '.mp3') mimeType = 'audio/mpeg';
            else if (ext === '.ogg') mimeType = 'audio/ogg';
            else if (ext === '.woff2') mimeType = 'font/woff2';
            else if (ext === '.woff') mimeType = 'font/woff';
            else if (ext === '.ttf') mimeType = 'font/ttf';

            const base64 = fs.readFileSync(assetPath).toString('base64');
            const dataUrl = `data:${mimeType};base64,${base64}`;

            // Preserve the original format (quoted or url())
            if (fullMatch.startsWith('url(')) {
                replacements.set(fullMatch, `url('${dataUrl}')`);
            } else {
                replacements.set(fullMatch, `'${dataUrl}'`);
            }
            console.log(`Bundled: ${fileName} (${mimeType})`);
        } else {
            console.log(`Not found: ${assetPath}`);
        }
    }
}

// Apply all replacements
for (const [original, replacement] of replacements) {
    html = html.split(original).join(replacement);
}

fs.writeFileSync(outputFile, html);

const stats = fs.statSync(outputFile);
console.log(`\nBundle created: ${outputFile}`);
console.log(`Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
