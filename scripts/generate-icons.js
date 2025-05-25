import sharp from 'sharp';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [
  16, 32, 48, 64, 72, 96, 120, 128, 144, 152, 180, 192, 384, 512
];

async function generateIcons() {
  const inputFile = join(__dirname, '../public/logo.svg');
  const outputDir = join(__dirname, '../public/icons');

  try {
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    // Generate icons for each size
    for (const size of sizes) {
      await sharp(inputFile)
        .resize(size, size)
        .png()
        .toFile(join(outputDir, `icon-${size}x${size}.png`));
      
      console.log(`Generated ${size}x${size} icon`);
    }

    // Generate favicon.ico (16x16 and 32x32)
    await sharp(inputFile)
      .resize(32, 32)
      .toFile(join(__dirname, '../public/favicon.ico'));
    
    console.log('Generated favicon.ico');
    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons(); 