import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [64, 192, 512];
const iconDir = join(__dirname, '../public/icons');

// Criar diretório de ícones se não existir
if (!existsSync(iconDir)) {
  mkdirSync(iconDir, { recursive: true });
}

// Criar um ícone base verde com texto branco
const baseIcon = Buffer.from(`
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#2e7d32"/>
  <text x="256" y="220" font-family="Arial" font-size="60" fill="white" text-anchor="middle">Harvest</text>
  <text x="256" y="300" font-family="Arial" font-size="60" fill="white" text-anchor="middle">Calc Pro</text>
</svg>
`);

// Gerar ícones em diferentes tamanhos
async function generateIcons() {
  for (const size of sizes) {
    await sharp(baseIcon)
      .resize(size, size)
      .toFile(join(iconDir, `pwa-${size}x${size}.png`));
    
    console.log(`Generated ${size}x${size} icon`);
  }

  // Gerar favicon
  await sharp(baseIcon)
    .resize(196, 196)
    .toFile(join(iconDir, '../favicon-196.png'));
  
  console.log('Generated favicon');

  // Copiar o maior ícone como screenshot
  await sharp(baseIcon)
    .resize(512, 512)
    .toFile(join(iconDir, '../screenshot.png'));
  
  console.log('Generated screenshot');
}

generateIcons().catch(console.error); 