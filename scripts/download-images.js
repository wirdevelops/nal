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
        blog: {
            'digital-art.jpg': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
            'afrobeats.jpg': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
            'tech-innovation.jpg': 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6',
        },
        creators: {
            'aisha.jpg': 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce',
            'kwame.jpg': 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f',
            'zara.jpg': 'https://images.unsplash.com/photo-1589156280159-27698a70f29e',
        },
        testimonials: {
            'emmanuel.jpg': 'https://images.unsplash.com/photo-1539701938214-0d9736e1c16b',
            'grace.jpg': 'https://images.unsplash.com/photo-1523824921871-d6f1a15151f1',
            'malik.jpg': 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6',
        },
        hero: {
            'hero-bg.jpg': 'https://images.unsplash.com/photo-1516962080544-eac695c93791',
        }
    };

    for (const [category, categoryImages] of Object.entries(images)) {
        const dirPath = path.join(__dirname, '..', 'public', 'images', category);
        
        // Ensure directory exists
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        for (const [filename, url] of Object.entries(categoryImages)) {
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
}

downloadAllImages().then(() => {
    console.log('All images downloaded successfully!');
}).catch(console.error);
