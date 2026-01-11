import * as fs from 'fs';
import * as path from 'path';

// Helper for polar coordinates
const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
};

const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
};

const styles = `
    .hud-text { font-family: 'Segoe UI', sans-serif; fill: #00ffff; font-weight: bold; }
    .hud-label { font-family: 'Segoe UI', sans-serif; fill: #00ffff; font-size: 10px; opacity: 0.7; }
    .ring { fill: none; stroke: #00ffff; stroke-width: 2; }
    .ring-dim { fill: none; stroke: #004444; stroke-width: 2; }
    .spin { animation: spin 10s linear infinite; transform-origin: center; }
    .spin-rev { animation: spin 15s linear infinite reverse; transform-origin: center; }
    .pulse { animation: pulse 2s infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
`;

const main = () => {
    const width = 800;
    const height = 300;
    const cx = 400;
    const cy = 150;

    // Core Reactor
    const core = `
        <circle cx="${cx}" cy="${cy}" r="40" fill="none" stroke="#00ffff" stroke-width="4" filter="url(#glow)" />
        <circle cx="${cx}" cy="${cy}" r="30" fill="#00ffff" opacity="0.2" class="pulse" />
        <text x="${cx}" y="${cy + 5}" text-anchor="middle" class="hud-text" font-size="20">CORE</text>
    `;

    // Rings
    const rings = `
        <g class="spin" style="transform-origin: ${cx}px ${cy}px">
             <path d="${describeArc(cx, cy, 60, 0, 90)}" class="ring" />
             <path d="${describeArc(cx, cy, 60, 180, 270)}" class="ring" />
        </g>
        <g class="spin-rev" style="transform-origin: ${cx}px ${cy}px">
             <path d="${describeArc(cx, cy, 70, 45, 135)}" class="ring-dim" />
             <path d="${describeArc(cx, cy, 70, 225, 315)}" class="ring-dim" />
        </g>
    `;

    // Stats Modules
    const stats = `
        <!-- Left Module: Memory -->
        <g transform="translate(${cx - 150}, ${cy})">
            <line x1="0" y1="0" x2="-40" y2="0" stroke="#00ffff" stroke-width="1" />
            <rect x="-140" y="-30" width="100" height="60" fill="#001111" stroke="#00ffff" rx="5" />
            <text x="-90" y="-10" text-anchor="middle" class="hud-label">MEMORY</text>
            <text x="-90" y="15" text-anchor="middle" class="hud-text" font-size="16">64 TB</text>
        </g>

        <!-- Right Module: Network -->
        <g transform="translate(${cx + 150}, ${cy})">
            <line x1="0" y1="0" x2="40" y2="0" stroke="#00ffff" stroke-width="1" />
            <rect x="40" y="-30" width="100" height="60" fill="#001111" stroke="#00ffff" rx="5" />
            <text x="90" y="-10" text-anchor="middle" class="hud-label">UPLINK</text>
            <text x="90" y="15" text-anchor="middle" class="hud-text" font-size="16">10 Gbps</text>
        </g>
    `;

    const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                     <feMergeNode in="coloredBlur"/>
                     <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <style>${styles}</style>
        <rect width="100%" height="100%" fill="#050505" />
        ${core}
        ${rings}
        ${stats}
        
        <!-- Decoration -->
        <text x="10" y="290" class="hud-label">SYSTEM_INTEGRITY: NORMAL</text>
        <text x="790" y="290" text-anchor="end" class="hud-label">V3.0.1 ALPHA</text>
    </svg>
    `;

    fs.writeFileSync(path.join(__dirname, '../generated/hud.svg'), svg);
    console.log('Generated hud.svg');
};

main();
