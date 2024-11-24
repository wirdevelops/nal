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
        'initiative-education.jpg': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
        'initiative-studios.jpg': 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04',
        'initiative-fund.jpg': 'https://images.unsplash.com/photo-1559136555-9303baea8ebd',
        'podcast-feature.jpg': 'https://images.unsplash.com/photo-1589903308904-1010c2294adc',
        'podcast-art.jpg': 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2',
        'podcast-tech.jpg': 'https://images.unsplash.com/photo-1573164713988-8665fc963095',
        'podcast-music.jpg': 'https://images.unsplash.com/photo-1511379938547-c1f69419868d',
        'host-1.jpg': 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce',
        'host-2.jpg': 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f',
        'host-3.jpg': 'https://images.unsplash.com/photo-1589156280159-27698a70f29e',
    };

    const dirPath = path.join(__dirname, '..', 'public', 'images', 'home');
    
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
    console.log('All home additional images downloaded successfully!');
}).catch(console.error);
