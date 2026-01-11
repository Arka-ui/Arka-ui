import * as fs from 'fs';
import * as path from 'path';

const main = () => {
    const cityPath = path.join(__dirname, '../profile-3d-contrib/profile-night-rainbow.svg');

    if (fs.existsSync(cityPath)) {
        let content = fs.readFileSync(cityPath, 'utf-8');

        // Remove the background rect
        // The action usually puts a rect with fill at the top
        // Regex to find <rect ... fill="..." ... /> that looks like a background
        // Or specific replacement if we know the color

        // Strategy: Replace specific known backgrounds or the first rect if it covers the whole view

        // Simple and aggressive: Remove "fill="#00000f"" which is the night-rainbow bg color, or clean the first rect
        content = content.replace(/<rect[^>]*fill="#00000f"[^>]*><\/rect>/i, ''); // specific color
        content = content.replace(/<rect[^>]*fill="#0d1117"[^>]*\/>/i, ''); // default github dark

        // Ensure standard xml header isn't broken
        fs.writeFileSync(cityPath, content);
        console.log('Processed 3D City: Removed Background');
    } else {
        console.log('3D City file not found, skipping post-process.');
    }
};

main();
