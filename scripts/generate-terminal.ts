import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const USERNAME = 'Arka-ui';

const fetchJson = (url: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const options = { headers: { 'User-Agent': 'Node.js Script' } };
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => { try { resolve(JSON.parse(data)); } catch (e) { resolve([]); } });
        }).on('error', reject);
    });
};

const main = async () => {
    console.log('Fetching events...');
    const events = await fetchJson(`https://api.github.com/users/${USERNAME}/events/public`);

    // Rainbow Colors
    const colors = ['#ff00ff', '#00ffff', '#ffff00'];

    const logs = events.slice(0, 6).map((e: any, i: number) => {
        const time = new Date(e.created_at).toLocaleTimeString('en-US', { hour12: false });
        let action = 'UNKNOWN';
        let detail = '';
        switch (e.type) {
            case 'PushEvent': action = 'PUSH'; detail = `Commit: ${e.payload.commits?.[0]?.message.substring(0, 25) || '...'}`; break;
            case 'WatchEvent': action = 'STAR'; detail = `Repo: ${e.repo.name.split('/')[1]}`; break;
            case 'CreateEvent': action = 'NEW '; detail = `Repo: ${e.repo.name.split('/')[1]}`; break;
            case 'PullRequestEvent': action = 'PR  '; detail = `${e.payload.action} #${e.payload.number}`; break;
            default: action = 'SYST'; detail = e.type;
        }
        // Cycle colors
        const color = colors[i % colors.length];
        return `<tspan fill="${color}" font-weight="bold">[${action}]</tspan> <tspan fill="#cccccc">${detail}</tspan> <tspan fill="#666" font-size="10">${time}</tspan>`;
    });

    const width = 800;
    const height = 250; // Shorter, cleaner

    const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <style>
            .term-text { font-family: 'Consolas', 'Courier New', monospace; font-size: 13px; }
        </style>
        
        <!-- Totally Transparent BG -->
        
        <!-- Decoration: Simple top/bottom lines -->
        <line x1="10" y1="10" x2="${width - 10}" y2="10" stroke="#333" stroke-width="1" />
        <line x1="10" y1="${height - 10}" x2="${width - 10}" y2="${height - 10}" stroke="#333" stroke-width="1" />

        <!-- Logs -->
        <g transform="translate(20, 40)">
            <text y="0" class="term-text" fill="#00ffff">System.Monitor(Active); // Monitoring User Activity</text>
            
            ${logs.map((log: string, i: number) =>
        `<text y="${30 + (i * 25)}" class="term-text">${log}</text>`
    ).join('')}
            
            <text y="${30 + (logs.length * 25) + 10}" class="term-text" fill="#ff00ff">
                >> _
            </text>
        </g>
    </svg>
    `;

    fs.writeFileSync(path.join(__dirname, '../generated/terminal.svg'), svg);
    console.log('Generated terminal.svg (Pure Data)');
};

main();
