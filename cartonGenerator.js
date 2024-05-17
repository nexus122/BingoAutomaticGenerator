const puppeteer = require("puppeteer");
const fs = require("fs");

import songList from "./songList.json";
// Configuration
const grid = 3; // Tamaño del cartón de bingo
const participantes = 7;

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const generateBingoCard = (songs) => {
  if (songs.length < 16) {
    console.log(
      "Debe haber al menos 16 canciones para generar un cartón de bingo."
    );
    return;
  }

  shuffleArray(songs);

  const bingoCard = [];
  for (let i = 0; i < grid; i++) {
    bingoCard[i] = [];
    for (let j = 0; j < grid; j++) {
      bingoCard[i][j] = songs[i * grid + j];
    }
  }

  return bingoCard;
};

const generateHTML = (bingoCard) => {
  const cellSize = "4.7cm"; // Tamaño deseado para las celdas

  let html = `
      <style>
      @import url('https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap');
        body {
          margin: 0.2em;
          background-color: transparent; /* Fondo transparente */
        }
        .bingo-grid {
          display: grid;
          grid-template-columns: repeat(${grid}, ${cellSize});
          gap: 10px;
          background-color: transparent; /* Fondo transparente */
        }
        .bingo-cell {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1em;
          text-align: center;
          width: ${cellSize};
          height: ${cellSize};
          box-sizing: border-box;
          border: 1px solid black;  /* Eliminar bordes */
          font-family: "Raleway", sans-serif;
          font-size: 22px;
          font-weight: 700;
          background-color: white; /* Fondo blanco */
        }
      </style>
      <div class="bingo-grid">
    `;

  for (let i = 0; i < grid; i++) {
    for (let j = 0; j < grid; j++) {
      html += `<div class="bingo-cell">${bingoCard[i][j]}</div>`;
    }
  }

  html += "</div>";
  return html;
};

const generateImage = async (html, outputPath) => {
  const browser = await await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({
    width: 560, // Ancho en píxeles
    height: 560, // Altura en píxeles
    deviceScaleFactor: 1, // Factor de escala (puede ajustarse según sea necesario)
  });
  await page.setContent(html);

  const screenshot = await page.screenshot({ omitBackground: true }); // Omitir fondo blanco
  fs.writeFileSync(outputPath, screenshot);

  await browser.close();
};

const generateBingoImages = async (cards) => {
  for (let i = 0; i < cards; i++) {
    // Cambia 5 por el número de cartones que deseas generar
    const bingoCard = generateBingoCard(songList);
    const html = generateHTML(bingoCard);
    const outputPath = `./public/bingo_card_${i + 1}.png`;
    await generateImage(html, outputPath);
    console.log(`Imagen ${i + 1} generada en: ${outputPath}`);
  }
};

generateBingoImages(participantes);
