import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

interface Stargazer {
  login: string;
  avatar_url: string;
}

function fetchJSON(url: string, headers: Record<string, string>): Promise<Stargazer[]> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      headers: { 'User-Agent': 'arka-ui-bot', ...headers },
    };
    https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          return;
        }
        resolve(JSON.parse(data));
      });
    }).on('error', reject);
  });
}

async function getStargazers(): Promise<Stargazer[]> {
  const token = process.env.GITHUB_TOKEN || '';
  const repo = process.env.GITHUB_REPOSITORY || 'Arka-ui/Arka-ui';
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const allStargazers: Stargazer[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const url = `https://api.github.com/repos/${repo}/stargazers?per_page=${perPage}&page=${page}`;
    const batch = await fetchJSON(url, headers);
    allStargazers.push(...batch);
    if (batch.length < perPage) break;
    page++;
  }

  return allStargazers;
}

function generateSVG(stargazers: Stargazer[]): string {
  const avatarSize = 48;
  const padding = 8;
  const cols = 10;
  const rows = Math.max(1, Math.ceil(stargazers.length / cols));
  const width = cols * (avatarSize + padding) + padding;
  const height = rows * (avatarSize + padding) + padding;

  let images = '';
  stargazers.forEach((user, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = padding + col * (avatarSize + padding);
    const y = padding + row * (avatarSize + padding);
    images += `  <image href="${user.avatar_url}&s=${avatarSize}" x="${x}" y="${y}" width="${avatarSize}" height="${avatarSize}" clip-path="inset(0% round 50%)" />\n`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <title>Allies (Stargazers)</title>
${images}</svg>
`;
}

async function main() {
  const stargazers = await getStargazers();
  console.log(`Found ${stargazers.length} stargazer(s).`);

  const outDir = path.join(__dirname, '..', 'generated');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const svg = generateSVG(stargazers);
  const outPath = path.join(outDir, 'allies.svg');
  fs.writeFileSync(outPath, svg);
  console.log(`Generated ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
