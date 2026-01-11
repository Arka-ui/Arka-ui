import * as fs from 'fs';
import * as path from 'path';

// Utility to write file
const writeSvg = (filename: string, content: string) => {
    const dir = path.join(__dirname, '../generated');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(path.join(dir, filename), content);
    console.log(`Generated ${filename}`);
};

// Colors & Theme
const colors = {
    bg: '#0d1117',
    primary: '#3178c6', // TS Blue
    accent: '#ff0055', // Cyberpunk Pink
    text: '#e6edf3',
    dim: '#6e7681',
    success: '#238636'
};

// 1. Header Generator
const generateHeader = () => {
    const width = 800;
    const height = 300;

    // Abstract grid background
    let grid = '';
    for (let i = 0; i < width; i += 40) {
        grid += `<line x1="${i}" y1="0" x2="${i}" y2="${height}" stroke="${colors.dim}" stroke-width="0.5" opacity="0.1" />`;
    }
    for (let i = 0; i < height; i += 40) {
        grid += `<line x1="0" y1="${i}" x2="${width}" y2="${i}" stroke="${colors.dim}" stroke-width="0.5" opacity="0.1" />`;
    }

    const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <style>
            .title { font-family: 'Segoe UI', sans-serif; font-weight: 900; font-size: 80px; fill: ${colors.text}; }
            .subtitle { font-family: 'Consolas', monospace; font-size: 24px; fill: ${colors.primary}; }
            .glow { filter: drop-shadow(0 0 10px ${colors.primary}); }
            .cyber-box { fill: none; stroke: ${colors.primary}; stroke-width: 2; }
            .blink { animation: blink 2s infinite; }
            @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        </style>
        <rect width="100%" height="100%" fill="${colors.bg}" />
        ${grid}
        
        <!-- Center Box -->
        <path d="M50,50 L750,50 L750,250 L50,250 Z" class="cyber-box" />
        <path d="M40,40 L60,40 M740,40 L760,40 M760,260 L740,260 M60,260 L40,260" stroke="${colors.accent}" stroke-width="4" />

        <text x="50%" y="140" text-anchor="middle" class="title glow">ARKA</text>
        <text x="50%" y="190" text-anchor="middle" class="subtitle">&lt; Code_Architect /&gt;</text>
        
        <!-- Dynamic TS Badge -->
        <g transform="translate(680, 190)">
             <rect width="50" height="50" rx="5" fill="${colors.primary}" />
             <text x="25" y="35" text-anchor="middle" fill="white" font-family="Segoe UI" font-weight="bold" font-size="30">TS</text>
        </g>
    </svg>
    `;
    writeSvg('header.svg', svg);
};

// 2. Portfolio Card
const generatePortfolio = () => {
    const width = 400;
    const height = 200;

    const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <style>
            .link-text { font-family: 'Segoe UI', sans-serif; fill: ${colors.text}; font-size: 20px; font-weight: bold; }
            .url { fill: ${colors.dim}; font-size: 14px; font-family: monospace; }
        </style>
        <rect width="100%" height="100%" fill="${colors.bg}" rx="10" stroke="${colors.dim}" stroke-width="1"/>
        
        <circle cx="50" cy="50" r="30" fill="${colors.accent}" opacity="0.2" />
        <circle cx="50" cy="50" r="15" fill="${colors.accent}" />
        
        <text x="100" y="55" class="link-text">PORTFOLIO</text>
        <text x="100" y="80" class="url">arka-ui.github.io/portfolio</text>
        
        <a href="https://arka-ui.github.io/portfolio/">
            <rect x="0" y="0" width="${width}" height="${height}" fill="transparent" />
        </a>
    </svg>
    `;
    writeSvg('portfolio.svg', svg);
};

// 3. Friend Card
const generateFriend = () => {
    const width = 400;
    const height = 100;
    const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${colors.bg}" stroke="${colors.success}" stroke-width="1" rx="5"/>
        <text x="20" y="55" fill="${colors.success}" font-family="monospace" font-size="16">sh ./ally_connect.sh --target=btmpierre</text>
    </svg>
    `;
    writeSvg('friend.svg', svg);
};

// Main execution
const main = () => {
    console.log('Generating assets...');
    generateHeader();
    generatePortfolio();
    generateFriend();
    console.log('Done.');
};

main();
