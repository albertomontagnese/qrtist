const fs = require("fs");
const path = require("path");
const Jimp = require("jimp");
const QrCode = require("qrcode-reader");

const INPUT_FOLDER = "qr_codes";
const OUTPUT_FILE = "qr_verification.csv";
const ERROR_FILE = "qr_errors.csv";
const EXPECTED_URL_PREFIX = "https://www.albertoqrtest.com/QR_";

const header = ["File Name", "URL", "URL Matches Expected"];
const errorHeader = ["File Name", "Error"];

const rows = [];
const errorRows = [];

const calculateStats = (start, end, total) => {
  const percentage = ((end - start) / total) * 100;
  console.log(`Progress: ${percentage.toFixed(2)}%`);
};

const readQRCodeAndGenerateCSV = async () => {
  const qrFiles = fs
    .readdirSync(INPUT_FOLDER)
    .filter((file) => file.endsWith(".png"));
  const totalQRs = qrFiles.length;

  console.log(`Processing ${totalQRs} QR codes...`);

  const start_time = Date.now();

  for (let i = 0; i < qrFiles.length; i++) {
    const filename = qrFiles[i];
    const qrId = filename.replace("QR_", "").replace(".png", "");
    const expectedUrl = `${EXPECTED_URL_PREFIX}${qrId}`;

    const qrImagePath = path.join(INPUT_FOLDER, filename);

    try {
      const qrImage = fs.readFileSync(qrImagePath);
      const qr = new QrCode();
      qr.callback = (err, value) => {
        if (err) throw err;

        if (value) {
          const url = value.result;
          const urlMatchesExpected = url === expectedUrl;
          rows.push([filename, url, urlMatchesExpected]);
        } else {
          errorRows.push([filename, "Failed to decode"]);
        }
      };

      const image = await Jimp.read(qrImage);
      qr.decode(image.bitmap);
    } catch (error) {
      console.error(`Error reading or decoding QR code ${filename}:`, error);
      errorRows.push([filename, error.toString()]);
    }

    if ((i + 1) % Math.ceil(totalQRs * 0.05) === 0 || i === totalQRs - 1) {
      calculateStats(i + 1, totalQRs, totalQRs);
    }
  }

  // Write to CSV file for successful reads
  const csvData = [header, ...rows];
  const csvContent = csvData.map((row) => row.join(",")).join("\n");
  fs.writeFileSync(OUTPUT_FILE, csvContent);

  console.log(`CSV file saved to: ${OUTPUT_FILE}`);

  // Write to CSV file for errors
  const errorCsvData = [errorHeader, ...errorRows];
  const errorCsvContent = errorCsvData.map((row) => row.join(",")).join("\n");
  fs.writeFileSync(ERROR_FILE, errorCsvContent);

  console.log(`Error CSV file saved to: ${ERROR_FILE}`);

  const end_time = Date.now();
  const execution_time = (end_time - start_time) / 1000;

  console.log(
    `Execution time for the full batch: ${execution_time.toFixed(2)} seconds`
  );
};

readQRCodeAndGenerateCSV();
