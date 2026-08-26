// Comprime todas las fotos de /public para que el sitio cargue más rápido.
// NO toca la carpeta "quienes-somos" (a propósito, según lo pedido).
//
// Cómo correrlo:
//   1) npm install sharp --save-dev
//   2) node scripts/comprimir-imagenes.js
//
// Qué hace: si una foto mide más de 1600px de ancho, la achica a 1600px.
// Luego la guarda como JPG con calidad 78% (se ve prácticamente igual,
// pero pesa muchísimo menos). Sobrescribe el archivo original en el mismo lugar.

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const PUBLIC_DIR = path.join(__dirname, "..", "public");
const CARPETAS_EXCLUIDAS = [];
const MAX_ANCHO = 1600;
const CALIDAD_JPG = 78;

let totalAntes = 0;
let totalDespues = 0;
let contador = 0;

function esImagen(nombreArchivo) {
  const ext = path.extname(nombreArchivo).toLowerCase();
  return ext === ".jpg" || ext === ".jpeg" || ext === ".png";
}

async function comprimirArchivo(rutaCompleta) {
  const pesoAntes = fs.statSync(rutaCompleta).size;
  const ext = path.extname(rutaCompleta).toLowerCase();
  const rutaTemp = rutaCompleta + ".tmp";

  let intentos = 0;
  let ultimoError = null;

  while (intentos < 3) {
    try {
      let bufferFinal;
      if (ext === ".png") {
        bufferFinal = await sharp(rutaCompleta)
          .resize({ width: MAX_ANCHO, withoutEnlargement: true })
          .png({ quality: CALIDAD_JPG, compressionLevel: 9 })
          .toBuffer();
      } else {
        bufferFinal = await sharp(rutaCompleta)
          .resize({ width: MAX_ANCHO, withoutEnlargement: true })
          .jpeg({ quality: CALIDAD_JPG, mozjpeg: true })
          .toBuffer();
      }

      // Escribimos primero en un archivo aparte y luego lo renombramos:
      // en Windows esto evita casi todos los bloqueos por archivos "en uso".
      fs.writeFileSync(rutaTemp, bufferFinal);
      fs.renameSync(rutaTemp, rutaCompleta);

      const pesoDespues = fs.statSync(rutaCompleta).size;
      totalAntes += pesoAntes;
      totalDespues += pesoDespues;
      contador++;

      const ahorro = (((pesoAntes - pesoDespues) / pesoAntes) * 100).toFixed(0);
      console.log(
        `✓ ${path.relative(PUBLIC_DIR, rutaCompleta)}  ${(pesoAntes / 1024).toFixed(0)}KB → ${(pesoDespues / 1024).toFixed(0)}KB (-${ahorro}%)`
      );
      return;
    } catch (err) {
      ultimoError = err;
      intentos++;
      await new Promise((r) => setTimeout(r, 600));
    }
  }

  console.error(`✗ Error con ${path.basename(rutaCompleta)} tras 3 intentos: ${ultimoError.message}`);
}

async function recorrerCarpeta(carpeta) {
  const items = fs.readdirSync(carpeta, { withFileTypes: true });
  for (const item of items) {
    const rutaCompleta = path.join(carpeta, item.name);

    if (item.isDirectory()) {
      if (CARPETAS_EXCLUIDAS.includes(item.name)) {
        console.log(`⏭  Saltando carpeta protegida: ${item.name}`);
        continue;
      }
      await recorrerCarpeta(rutaCompleta);
    } else if (esImagen(item.name)) {
      try {
        await comprimirArchivo(rutaCompleta);
      } catch (err) {
        console.error(`✗ Error con ${item.name}:`, err.message);
      }
    }
  }
}

(async () => {
  console.log("Comprimiendo imágenes en /public (sin tocar quienes-somos)...\n");
  await recorrerCarpeta(PUBLIC_DIR);
  console.log(`\n--- Listo ---`);
  console.log(`Imágenes procesadas: ${contador}`);
  console.log(`Peso antes: ${(totalAntes / 1024 / 1024).toFixed(1)} MB`);
  console.log(`Peso después: ${(totalDespues / 1024 / 1024).toFixed(1)} MB`);
  console.log(`Ahorro total: ${(((totalAntes - totalDespues) / totalAntes) * 100).toFixed(0)}%`);
})();