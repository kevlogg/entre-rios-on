const fs = require('fs');
const path = require('path');
const https = require('https');

const dir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const images = [
  // 1. Hero & Banners
  { name: 'hero-parana.jpg', url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1400' },
  { name: 'hero-artesania.jpg', url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=1400' },

  // 2. Ciudades Emblemáticas
  { name: 'city-parana.jpg', url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800' },
  { name: 'city-concordia.jpg', url: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=800' },
  { name: 'city-gualeguaychu.jpg', url: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=800' },
  { name: 'city-colon.jpg', url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=800' },
  { name: 'city-concepcion.jpg', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800' },
  { name: 'city-federacion.jpg', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800' },
  { name: 'city-villaelisa.jpg', url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=800' },
  { name: 'city-chajari.jpg', url: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800' },

  // 3. Bento Rows Opción A
  { name: 'bento-1.jpg', url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=800' }, // Comercio Digital
  { name: 'bento-2.jpg', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800' }, // Comunidad
  { name: 'bento-3.jpg', url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800' }, // Sorteos / Premio
  { name: 'bento-4.jpg', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800' }, // Industria
  { name: 'bento-5.jpg', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800' }, // Turismo / Kayak
  { name: 'bento-6.jpg', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800' }, // Clasificados Auto
  { name: 'bento-7.jpg', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800' }, // Publicá tu Negocio

  // 4. Ofertas Destacadas Grid
  { name: 'offer-1.jpg', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800' }, // Zapatillas
  { name: 'offer-2.jpg', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800' }, // Cafetera Espresso
  { name: 'offer-3.jpg', url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=800' }, // Juego Comedor
  { name: 'offer-4.jpg', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800' }, // Smartphone
  { name: 'offer-5.jpg', url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800' }, // Silla Nórdica
  { name: 'offer-6.jpg', url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800' }, // Vino Malbec

  // 5. Productos Regionales Específicos (portal.ts)
  { name: 'prod-mate.jpg', url: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&q=80&w=800' }, // Mate y Bombilla
  { name: 'prod-dorado.jpg', url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800' }, // Pescado Asado Parrilla
  { name: 'prod-vino-tannat.jpg', url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=800' }, // Estuche Vinos
  { name: 'prod-dulces.jpg', url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800' }, // Frascos Dulces y Miel
  { name: 'prod-lancha.jpg', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800' }, // Paseo en Lancha
  { name: 'prod-cuchillo.jpg', url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800' }, // Cuchillo Criollo Artesanal

  // 6. Comercios & Avatares
  { name: 'commerce-alfareria.jpg', url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=800' }, // Taller Alfarería
  { name: 'commerce-costanera.jpg', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800' }, // Restaurante Costanera
  { name: 'commerce-bodega.jpg', url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=800' }, // Viñedos Bodega
  { name: 'commerce-citrus.jpg', url: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=800' }, // Cosecha Citrus
  { name: 'avatar-author.jpg', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400' }, // Periodista Redactor
];

function downloadUrl(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadUrl(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP status ${res.statusCode} for ${url}`));
      }
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve());
      });
      file.on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log('Iniciando descarga y verificación semántica de imágenes...');
  for (const item of images) {
    const filePath = path.join(dir, item.name);
    try {
      await downloadUrl(item.url, filePath);
      const size = fs.statSync(filePath).size;
      if (size < 5000) {
        console.error(`❌ ERROR: Archivo ${item.name} descargó sólo ${size} bytes!`);
      } else {
        console.log(`✓ VERIFICADA [${(size / 1024).toFixed(1)} KB]: ${item.name}`);
      }
    } catch (err) {
      console.error(`❌ ERROR descargando ${item.name}:`, err.message);
    }
  }
  console.log('\n--- RESUMEN FINAL DE VERIFICACIÓN DE IMÁGENES ---');
  const files = fs.readdirSync(dir);
  files.forEach(f => {
    const size = fs.statSync(path.join(dir, f)).size;
    console.log(`- ${f.padEnd(24)} -> ${(size / 1024).toFixed(1)} KB`);
  });
}

run();
