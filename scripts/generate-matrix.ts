import * as fs from 'fs';
import * as path from 'path';

// Symbols for the matrix
const symbols = ['TS', 'JS', 'React', 'Node', 'Go', 'Rust', '0', '1', '{}', '</>', '&&'];

const main = () => {
    const width = 800;
    const height = 300;
    const columns = 40;
    const colWidth = width / columns;

    // Generate random columns
    let drops = '';
    for (let i = 0; i < columns; i++) {
        const x = i * colWidth;
        const speed = 2 + Math.random() * 5;
        const delay = -Math.random() * 5;
        const opacity = 0.3 + Math.random() * 0.7;
        const fontSize = 12 + Math.random() * 8;

        // Create a stream of characters
        drops += `
        <text x="${x}" y="0" font-family="monospace" font-size="${fontSize}" fill="#0f0" opacity="${opacity}">
            <animate attributeName="y" from="-50" to="${height + 50}" dur="${speed}s" begin="${delay}s" repeatCount="indefinite" />
            ${symbols[Math.floor(Math.random() * symbols.length)]}
        </text>
        <text x="${x}" y="-20" font-family="monospace" font-size="${fontSize}" fill="#0f0" opacity="${opacity}">
            <animate attributeName="y" from="-70" to="${height + 30}" dur="${speed}s" begin="${delay}s" repeatCount="indefinite" />
            ${symbols[Math.floor(Math.random() * symbols.length)]}
        </text>
         <text x="${x}" y="-40" font-family="monospace" font-size="${fontSize}" fill="#0f0" opacity="${opacity}">
            <animate attributeName="y" from="-90" to="${height + 10}" dur="${speed}s" begin="${delay}s" repeatCount="indefinite" />
            ${symbols[Math.floor(Math.random() * symbols.length)]}
        </text>
        `;
    }

    const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="black" />
        ${drops}
        <text x="50%" y="50%" text-anchor="middle" fill="white" font-family="Segoe UI" font-size="40" font-weight="bold" filter="url(#glow)">
            CORE SYSTEMS
        </text>
        <defs>
            <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
    </svg>
    `;

    fs.writeFileSync(path.join(__dirname, '../generated/matrix.svg'), svg);
    console.log('Generated matrix.svg');
};

main();
