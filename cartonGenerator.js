const puppeteer = require('puppeteer');
const fs = require('fs');

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

const generateBingoCard = (songs) => {
    if (songs.length < 16) {
        console.log('Debe haber al menos 16 canciones para generar un cartón de bingo.');
        return;
    }

    shuffleArray(songs);

    const bingoCard = [];
    for (let i = 0; i < 4; i++) {
        bingoCard[i] = [];
        for (let j = 0; j < 4; j++) {
            bingoCard[i][j] = songs[i * 4 + j];
        }
    }

    return bingoCard;
};

const generateHTML = (bingoCard) => {
    const cellSize = '3.5cm'; // Tamaño deseado para las celdas

    let html = `
      <style>
        body {
          margin: 0;
          background-color: transparent; /* Fondo transparente */
        }
        .bingo-grid {
          display: grid;
          grid-template-columns: repeat(4, ${cellSize});
          gap: 10px;
          background-color: transparent; /* Fondo transparente */
        }
        .bingo-cell {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          text-align: center;
          width: ${cellSize};
          height: ${cellSize};
          box-sizing: border-box;
          border: none;  /* Eliminar bordes */
          font-family: 'Arial', sans-serif; /* Cambiar la fuente a Arial */
        }
      </style>
      <div class="bingo-grid">
    `;

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            html += `<div class="bingo-cell">${bingoCard[i][j]}</div>`;
        }
    }

    html += '</div>';
    return html;
};


const generateImage = async (html, outputPath) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);

    const screenshot = await page.screenshot({ omitBackground: true }); // Omitir fondo blanco
    fs.writeFileSync(outputPath, screenshot);

    await browser.close();
};

const songList = [
    'MIROTIC - TVXQ!',
    'Get Out - JVJ',
    'Keep Your Head Down - TVXQ!',
    'Sorry, Sorry - SUPER JUNIOR',
    'Black Suit - SUPER JUNIOR',
    'FOREVER 1 - Girls\' Generation',
    'Gee - Girls\' Generation',
    'The Boys - Girls\' Generation',
    'Lucifer - SHINee',
    'Everybody - SHINee',
    'HARD - SHINee',
    'Fantastic Baby - BIGBANG',
    'BANG BANG BANG - BIGBANG',
    'Somebody to love - BIGBANG',
    'I Am The Best - 2NET',
    'Clap Your Hands - 2NET',
    'Hate - 4Minute',
    'Jumping - KARA',
    'STEP - KARA',
    'WHEN I MOVE - KARA',
    'Lovey-Dovey - T-ARA',
    'Sugar Free - T-ARA',
    'Expect - Girl\'s Day',
    'Something - Girl\'s Day',
    'I\'ll be yours - Girl\'s Day',
    'Best of me - BTS',
    'Mikrokosmos - BTS',
    'Spring day - BTS',
    'Dècalcomanie - MAMAMOO',
    'Gleam - MAMAMOO',
    'HIP - MAMAMOO',
    'LIGHTSABER - EXO',
    'Power - EXO',
    'CALL ME BABY - EXO',
    'FANCY - TWICE',
    'Dance The Night Away - TWICE',
    'Knock Knock - TWICE',
    'Pretty Savage - BLACKPINK',
    'See U Later - BLACKPINK',
    'As If It\'s Your Last - BLACKPINK',
    'God of Music - SEVENTEEN',
    'HOT - SEVENTEEN',
    'VERY NICE - SEVENTEEN',
    'MAGO - GFRIEND',
    'FINGERTIP - GFRIEND',
    'NAVILLERA - GFRIEND',
    'Power Up - Red Velvet',
    'Peek-A-Boo - Red Velvet',
    'Red Flavor - Red Velvet',
    'GAMBLER - MONSTA X',
    'HERO - MONSTA X',
    'Cherry Bomb - NCT-127',
    '2 Baddies - NCT-127',
    'Queencard - (G)I-DLE',
    'HANN (Alone) - (G)I-DLE',
    'SO BAD - STAYC',
    'RUN2U - STAYC',
    'LA DI DA - EVERGLOW',
    'Pirate - EVERGLOW',
    'Drama - aespa',
    'Black Mamba - aespa',
    'In the morning - ITZY',
    'WANNABE - ITZY',
    'I AM - IVE',
    'After LIKE - IVE',
    'Blue Hour - TXT',
    'Anti-Romantic - TXT',
    'Utopia - ATEEZ',
    'Say My Name - ATEEZ',
    'Sweet Venom - ENHYPEN',
    'Go Big or Go Home - ENHYPEN',
    'Cookie - NewJeans',
    'Attention - NewJeans',
    'FEARLESS - LE SSERAFIM',
    'ANTIFRAGILE - LE SSERAFIM',
    'No Air - THE BOYZ',
    'The Stealer - THE BOYZ',
    'HELLO - TREASURE',
    'JIKJIN - TREASURE',
    'DARARI - TREASURE',
    'Baggy Jeans - NCT U',
    'Shhh - KISS OF LIFE',
    'Bad News - KISS OF LIFE',
    'Supa Luv - TEEN TOP',
    'Rocking - TEEN TOP',
    'LUNA - ONEUS',
    'Valkyrie - ONEUS',
    'RUMOR - KARD',
    'ICKY - KARD',
    'Gashina - SUNMI',
    'pporappippam - SUNMI'
];

const generateBingoImages = async () => {
    for (let i = 0; i < 100; i++) {  // Cambia 5 por el número de cartones que deseas generar
        const bingoCard = generateBingoCard(songList);
        const html = generateHTML(bingoCard);
        const outputPath = `bingo_card_${i + 1}.png`;
        await generateImage(html, outputPath);
        console.log(`Imagen ${i + 1} generada en: ${outputPath}`);
    }
};

function calculateDuplicateProbability(numSongs, numCards, gridSize) {
    const numCombinations = Math.pow(numSongs, gridSize * gridSize);
    let probabilityNoDuplicate = 1;
  
    for (let i = 1; i <= numCards; i++) {
      probabilityNoDuplicate *= (numCombinations - i + 1) / numCombinations;
    }
  
    const probabilityDuplicate = 1 - probabilityNoDuplicate;
    return probabilityDuplicate;
  }
  
  const numSongs = 92;
  const numCards = 100;
  const gridSize = 4;
  
  const probability = calculateDuplicateProbability(numSongs, numCards, gridSize);
  console.log(`La probabilidad estimada de duplicidad es aproximadamente ${probability * 100}%.`);
  
calculateDuplicateProbability(92,100,4);
//generateBingoImages();
