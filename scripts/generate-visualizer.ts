import * as fs from 'fs';
import * as path from 'path';

const main = () => {
    const width = 800;
    const height = 100;
    const barCount = 40;
    const barWidth = width / barCount;

    let bars = '';
    for (let i = 0; i < barCount; i++) {
        const x = i * barWidth;
        const h = 20 + Math.random() * 60;
        const delay = Math.random() * 2;

        bars += `
            <rect x="${x}" y="${50 - h / 2}" width="${barWidth - 4}" height="${h}" fill="#ff0055" rx="2">
                <animate attributeName="height" values="${h};10;${h}" dur="0.8s" begin="${delay}s" repeatCount="indefinite" />
                <animate attributeName="y" values="${50 - h / 2};45;${50 - h / 2}" dur="0.8s" begin="${delay}s" repeatCount="indefinite" />
                <animate attributeName="fill" values="#ff0055;#3178c6;#ff0055" dur="1.6s" begin="${delay}s" repeatCount="indefinite" />
            </rect>
        `;
    }

    const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
         <rect width="100%" height="100%" fill="#0d1117" opacity="0" />
         ${bars}
         <text x="50%" y="95" text-anchor="middle" fill="#3178c6" font-family="monospace" font-size="10">AUDIO_VISUALIZER::ACTIVE // NOW PLAYING: Lofi Beats to Code To</text>
    </svg>
    `;

    fs.writeFileSync(path.join(__dirname, '../generated/visualizer.svg'), svg);
    console.log('Generated visualizer.svg');
};

main();
