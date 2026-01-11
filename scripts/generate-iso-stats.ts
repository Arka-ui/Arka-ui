import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const USERNAME = 'Arka-ui';

const fetchJson = (url: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const options = { headers: { 'User-Agent': 'Node.js Script' } };
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => { try { resolve(JSON.parse(data)); } catch { resolve({}); } });
        }).on('error', reject);
    });
};

const main = async () => {
    // 1. Fetch Data (Mocking some for robustness if API fails, but trying real fetch)
    console.log('Fetching Stats...');
    const user = await fetchJson(`https://api.github.com/users/${USERNAME}`);
    const repos = await fetchJson(`https://api.github.com/users/${USERNAME}/repos?per_page=100`);

    const stars = repos.reduce((acc: number, r: any) => acc + (r.stargazers_count || 0), 0);
    const followers = user.followers || 0;
    const public_repos = user.public_repos || 0;

    // Isometric Logic
    const width = 800;
    const height = 400;
    const blockWidth = 60;
    const blockHeight = 40; // Base height

    // Colors (Night Rainbow: Magenta, Cyan, Yellow)
    const colors = [
        { top: '#ff00ff', side: '#b300b3', front: '#800080' }, // Magenta
        { top: '#00ffff', side: '#00b3b3', front: '#008080' }, // Cyan
        { top: '#ffff00', side: '#b3b300', front: '#808000' }  // Yellow
    ];

    const stats = [
        { label: 'STARS', value: stars, color: colors[0] },
        { label: 'FOLLOWERS', value: followers, color: colors[1] },
        { label: 'REPOS', value: public_repos, color: colors[2] }
    ];

    // Helper to draw a cube
    const drawCube = (x: number, y: number, h: number, color: any) => {
        const isoH = h * 2; // Scale height for visual impact
        return `
            <g transform="translate(${x}, ${y})">
                <!-- Side (Left) -->
                <path d="M0,0 L0,${isoH} L-${blockWidth / 2},${isoH + blockWidth / 4} L-${blockWidth / 2},${blockWidth / 4} Z" fill="${color.front}" />
                <!-- Front (Right) -->
                <path d="M0,0 L0,${isoH} L${blockWidth / 2},${isoH + blockWidth / 4} L${blockWidth / 2},${blockWidth / 4} Z" fill="${color.side}" />
                <!-- Top -->
                <path d="M0,0 L${blockWidth / 2},-${blockWidth / 4} L0,-${blockWidth / 2} L-${blockWidth / 2},-${blockWidth / 4} Z" fill="${color.top}" />
            </g>
        `;
    };

    let svgContent = '';
    const centerX = width / 2;
    const startY = height - 100;

    stats.forEach((stat, i) => {
        // Position blocks in a row (isometric spacing)
        // x offset needs to account for isometric skew
        const offsetX = (i - 1) * (blockWidth * 1.5);
        const offsetY = (i - 1) * (blockWidth * 0.5);

        const x = centerX + offsetX;
        const y = startY + offsetY;

        // Logarithmic scale for height so 0 isn't invisible and 1000 isn't huge
        const h = Math.max(20, Math.log(stat.value + 1) * 20);

        svgContent += drawCube(x, y - h, h, stat.color);

        // Label
        svgContent += `
            <text x="${x}" y="${y + 30}" text-anchor="middle" fill="#ffffff" font-family="monospace" font-weight="bold" font-size="14">${stat.label}</text>
             <text x="${x}" y="${y + 50}" text-anchor="middle" fill="${stat.color.top}" font-family="monospace" font-size="12">${stat.value}</text>
        `;
    });

    const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
             <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <!-- Transparent BG -->
        <rect width="100%" height="100%" fill="none" />
        
        <g filter="url(#glow)">
            ${svgContent}
        </g>
        
        <text x="50%" y="30" text-anchor="middle" fill="#ffffff" opacity="0.5" font-family="monospace" font-size="10">ISOMETRIC_DATA_VISUALIZATION_V1</text>
    </svg>
    `;

    fs.writeFileSync(path.join(__dirname, '../generated/iso-stats.svg'), svg);
    console.log('Generated iso-stats.svg');
};

main();
