const fs = require("fs-extra");
const QRCode = require("qr-image");
const Jimp = require("jimp");

const NUM_OF_QRS = 10000; // Change this to the desired number of QR codes
const OUTPUT_FOLDER = "qr_codes";
const WEBSITE_URL = "https://www.albertoqrtest.com/QR_";
const PRINT_STATS_INTERVAL = NUM_OF_QRS / 10;

const generateQRCode = async (qrId) => {
  return new Promise((resolve, reject) => {
    const qrUrl = `${WEBSITE_URL}${qrId}`;
    const qrImage = QRCode.image(qrUrl, { type: "png", size: 10 });

    const qrImagePath = `${OUTPUT_FOLDER}/QR_${qrId}.png`;

    qrImage.pipe(fs.createWriteStream(qrImagePath));
    qrImage.on("end", () => {
      resolve(qrImagePath);
    });
    qrImage.on("error", (error) => {
      reject(error);
    });
  });
};

const calculateStats = () => {
  const files = fs.readdirSync(OUTPUT_FOLDER);
  const totalSize = files.reduce(
    (acc, file) => acc + fs.statSync(`${OUTPUT_FOLDER}/${file}`).size,
    0
  );
  const averageSize = totalSize / files.length;

  console.log("------ Stats ------");
  console.log(`Total number of QR codes: ${NUM_OF_QRS}`);
  console.log(`Total folder size: ${totalSize} bytes`);
  console.log(`Average QR code size: ${averageSize} bytes`);
};

const generateQRs = async () => {
  try {
    console.log("Generating QR codes...");
    await fs.remove(OUTPUT_FOLDER); // Remove the folder if it exists
    await fs.ensureDir(OUTPUT_FOLDER); // Recreate the folder

    const start_time = Date.now();

    for (let qrId = 1; qrId <= NUM_OF_QRS; qrId++) {
      await generateQRCode(qrId);
      if (qrId % PRINT_STATS_INTERVAL === 0 || qrId === NUM_OF_QRS) {
        const elapsed_time = ((Date.now() - start_time) / 1000).toFixed(2);
        console.log(
          `Generated ${qrId} QR codes. Elapsed time: ${elapsed_time} seconds.`
        );
        calculateStats();
      }
    }

    console.log("QR code generation completed.");
  } catch (error) {
    console.error("Error generating QR codes:", error);
  }
};

generateQRs();
