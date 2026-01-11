import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const USERNAME = 'Arka-ui';

// Helper to fetch data
const fetchJson = (url: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'User-Agent': 'Node.js Script',
            }
        };
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve([]);
                }
            });
        }).on('error', reject);
    });
};

const main = async () => {
    console.log('Fetching events...');
    const events = await fetchJson(`https://api.github.com/users/${USERNAME}/events/public`);

    // Process last 5 events
    const logs = events.slice(0, 5).map((e: any) => {
        const time = new Date(e.created_at).toLocaleTimeString('en-US', { hour12: false });
        let action = 'UNKNOWN_OP';
        let detail = '';

        switch (e.type) {
            case 'PushEvent':
                action = 'PUSH_COMMIT';
                detail = `>> ${e.payload.commits?.[0]?.message || 'updates'}`;
                break;
            case 'WatchEvent':
                action = 'STAR_REPO';
                detail = `Target: ${e.repo.name}`;
                break;
            case 'CreateEvent':
                action = 'INIT_REPO';
                detail = `Created ${e.repo.name}`;
                break;
            default:
                action = 'SYSTEM_EVENT';
                detail = e.type;
        }
        return `[${time}] ${action.padEnd(12)} : ${detail.substring(0, 30)}`;
    });

    const width = 800;
    const height = 400;
    const colors = { bg: '#0d1117', text: '#33ff00', dim: '#1a5c00', border: '#33ff00' };

    const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <style>
            .term-text { font-family: 'Courier New', monospace; font-size: 14px; fill: ${colors.text}; }
            .dim { fill: ${colors.dim}; }
            .blink { animation: blink 1s infinite; }
            @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
            .cursor { font-weight: bold; fill: ${colors.text}; }
        </style>
        <rect width="100%" height="100%" fill="${colors.bg}" rx="10" stroke="${colors.border}" stroke-width="2"/>
        
        <!-- Window Controls -->
        <circle cx="20" cy="20" r="6" fill="#ff5f56"/>
        <circle cx="40" cy="20" r="6" fill="#ffbd2e"/>
        <circle cx="60" cy="20" r="6" fill="#27c93f"/>
        
        <!-- Header -->
        <text x="50%" y="25" text-anchor="middle" class="term-text dim">user@ARKA-MAIN: ~/github_logs</text>
        <line x1="0" y1="40" x2="${width}" y2="40" stroke="${colors.dim}" stroke-width="1"/>

        <!-- Logs -->
        <g transform="translate(20, 70)">
            <text y="0" class="term-text">Initializing Arka OS v2.0...</text>
            <text y="20" class="term-text">Loading module 'TypeScript'................ [OK]</text>
            <text y="40" class="term-text">Connecting to GitHub API................... [OK]</text>
            <text y="70" class="term-text dim">--- RECENT ACTIVITY LOG ---</text>
            ${logs.map((log: string, i: number) =>
        `<text y="${100 + (i * 25)}" class="term-text">${log}</text>`
    ).join('')}
            
            <text y="${100 + (logs.length * 25) + 30}" class="term-text">
                user@arka:~$ <tspan class="blink">_</tspan>
            </text>
        </g>
    </svg>
    `;

    fs.writeFileSync(path.join(__dirname, '../generated/terminal.svg'), svg);
    console.log('Generated terminal.svg');
};

main();
