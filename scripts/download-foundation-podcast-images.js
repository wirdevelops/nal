const fs = require('fs');
const path = require('path');
const https = require('https');
const { promisify } = require('util');

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

// Image URLs from Unsplash for each section
const images = {
  foundation: {
    'initiative-education.jpg': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200', // Tech education
    'initiative-studios.jpg': 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',    // Recording studio
    'initiative-fund.jpg': 'https://images.unsplash.com/photo-1559526324-593bc073d938?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200'           // Innovation/funding
  },
  podcasts: {
    'podcast-art.jpg': 'https://images.unsplash.com/photo-1607434472257-d9f8e57a643d?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',          // Digital art
    'podcast-tech.jpg': 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',         // Tech solutions
    'podcast-music.jpg': 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',        // Music studio
    'podcast-feature.jpg': 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',      // Featured podcast image
    'host-1.jpg': 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=400',                // Host 1
    'host-2.jpg': 'https://images.unsplash.com/photo-1539701938214-0d9736e1c16b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=400',                // Host 2
    'host-3.jpg': 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=400'                 // Host 3
  }
};

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filepath);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded: ${filepath}`);
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => reject(err));
      });
    }).on('error', reject);
  });
}

async function ensureDirectoryExists(dirPath) {
  try {
    await mkdir(dirPath, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

async function downloadAllImages() {
  const baseDir = path.join(process.cwd(), 'public', 'images', 'home');
  
  // Ensure the base directory exists
  await ensureDirectoryExists(baseDir);

  // Download all images
  for (const [section, sectionImages] of Object.entries(images)) {
    console.log(`\nDownloading ${section} images...`);
    
    for (const [filename, url] of Object.entries(sectionImages)) {
      const filepath = path.join(baseDir, filename);
      try {
        await downloadImage(url, filepath);
      } catch (err) {
        console.error(`Error downloading ${filename}:`, err.message);
      }
    }
  }
}

// Run the download
downloadAllImages().catch(console.error);
