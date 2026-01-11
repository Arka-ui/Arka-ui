import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const USERNAME = 'Arka-ui';
const REPO = 'Arka'; // The profile repo name

// Fetch Stargazers
const fetchStargazers = (url: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        const options = {
            headers: { 'User-Agent': 'Node.js Script' }
        };
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); } catch { resolve([]); }
            });
        }).on('error', reject);
    });
};

const main = async () => {
    console.log('Fetching Allies (Stargazers)...');
    // Using the GitHub API to get stargazers of the profile repo itself
    const stargazers = await fetchStargazers(`https://api.github.com/repos/${USERNAME}/${USERNAME}/stargazers`);

    const width = 800;
    const height = 150; // Dynamic height based on count? Keeping fixed for now

    let avatars = '';
    stargazers.slice(0, 10).forEach((user: any, i: number) => {
        // We use a circle clip path for images
        const x = 50 + (i * 60);
        const y = 75;
        // Note: Fetching external images in SVG often requires them to be base64 encoded for stability in some viewers,
        // but GitHub usually proxies them. However, simpler is to just use the URL.
        // For "impossible" readme, let's just make circles with their initials if we can't easily embed images without heavy dependencies
        // Or better: Just list their names in a cool way.

        avatars += `
        <g transform="translate(${x}, ${y})">
            <circle r="25" fill="#333" stroke="#3178c6" stroke-width="2" />
            <text text-anchor="middle" dy="5" fill="white" font-size="10">${user.login.substring(0, 2).toUpperCase()}</text>
            <text text-anchor="middle" dy="40" fill="#6e7681" font-size="10">${user.login}</text>
        </g>
        `;
    });

    if (stargazers.length === 0) {
        avatars = `<text x="50%" y="75" text-anchor="middle" fill="#6e7681" font-family="monospace">Waiting for reinforcements...</text>`;
    }

    const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#0d1117" rx="10" />
        <text x="20" y="30" fill="#3178c6" font-family="Segoe UI" font-weight="bold">ALLIANCE ROSTER (Stargazers)</text>
        ${avatars}
    </svg>
    `;

    fs.writeFileSync(path.join(__dirname, '../generated/allies.svg'), svg);
    console.log('Generated allies.svg');
};

main();
