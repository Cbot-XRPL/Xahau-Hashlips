const fs = require("fs");
const path = require("path");
const { PinataSDK } = require("pinata-web3");
const { getFilesFromPath } = require("files-from-path");
const { File } = require("buffer");  // Import File from buffer module
require("dotenv").config();

// Initialize Pinata
const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.GATEWAY_URL
});

async function upload() {
  try {
    // Ensure correct directory path
    const dirPath = path.join(__dirname, "../build/json");

    // Get files from path
    const files = await getFilesFromPath(dirPath);

    // Convert file streams to File objects
    const fileArray = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(dirPath, path.basename(file.name)); // Ensure correct path
        const buffer = await fs.promises.readFile(filePath);
        const fileObj = new File([buffer], path.basename(file.name), { type: "application/json" }); // Convert buffer to File
        return fileObj;
      })
    );

    console.log("Uploading files:", fileArray);

    // Upload to Pinata
    const upload = await pinata.upload.fileArray(fileArray);
    console.log("Upload successful:", upload);
    
  } catch (error) {
    console.error("Upload failed:", error);
  }
}

upload();
