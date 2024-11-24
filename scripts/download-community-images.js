const https = require('https');
const fs = require('fs');
const path = require('path');

async function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`Failed to download: ${res.statusCode}`));
                return;
            }

            const writeStream = fs.createWriteStream(filepath);
            res.pipe(writeStream);

            writeStream.on('finish', () => {
                writeStream.close();
                resolve();
            });

            writeStream.on('error', reject);
        }).on('error', reject);
    });
}

async function downloadAllImages() {
    const images = {
        'community-hero.jpg': 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389',
        'digital-art.jpg': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
        'tech.jpg': 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6',
        'music.jpg': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
        'fashion.jpg': 'https://images.unsplash.com/photo-1509319117193-57bab727e09d',
        'content.jpg': 'https://images.unsplash.com/photo-1598550476439-6847785fcea6',
        'visual.jpg': 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4',
        'event-art.jpg': 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3',
        'event-tech.jpg': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
        'event-music.jpg': 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae',
        'event-content.jpg': 'https://images.unsplash.com/photo-1551818255-e6e10975bc17',
        'highlight-art.jpg': 'https://images.unsplash.com/photo-1515405295579-ba7b45403062',
        'highlight-tech.jpg': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
        'highlight-music.jpg': 'https://images.unsplash.com/photo-1511379938547-c1f69419868d',
        'guidelines.jpg': 'https://images.unsplash.com/photo-1513530534585-c7b1394c6d51',
        'avatar-1.jpg': 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce',
        'avatar-2.jpg': 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f',
        'avatar-3.jpg': 'https://images.unsplash.com/photo-1589156280159-27698a70f29e',
    };

    const dirPath = path.join(__dirname, '..', 'public', 'images', 'community');
    
    // Ensure directory exists
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    for (const [filename, url] of Object.entries(images)) {
        const filepath = path.join(dirPath, filename);
        console.log(`Downloading ${filename}...`);
        try {
            await downloadImage(url, filepath);
            console.log(`Successfully downloaded ${filename}`);
        } catch (error) {
            console.error(`Error downloading ${filename}:`, error);
        }
    }
}

downloadAllImages().then(() => {
    console.log('All community images downloaded successfully!');
}).catch(console.error);
